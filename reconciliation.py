import json
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from app.api.auth import get_current_user
from app.services.reconciliation_engine import (
    parse_gstr2b, parse_tally_excel, reconcile, generate_excel_report
)

router = APIRouter()

@router.post("/run")
async def run_reconciliation(
    gstr2b_file: UploadFile = File(...),
    tally_file:  UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload GSTR-2B JSON + Tally Excel → get reconciliation summary + rows.
    """
    gstr2b_bytes = await gstr2b_file.read()
    tally_bytes  = await tally_file.read()

    try:
        portal_df = parse_gstr2b(gstr2b_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"GSTR-2B parse error: {str(e)}")

    try:
        tally_df = parse_tally_excel(tally_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Tally parse error: {str(e)}")

    result = reconcile(portal_df, tally_df)
    return result


@router.post("/download")
async def download_report(
    gstr2b_file: UploadFile = File(...),
    tally_file:  UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload GSTR-2B JSON + Tally Excel → download colour-coded Excel report.
    """
    gstr2b_bytes = await gstr2b_file.read()
    tally_bytes  = await tally_file.read()

    try:
        portal_df = parse_gstr2b(gstr2b_bytes)
        tally_df  = parse_tally_excel(tally_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    result       = reconcile(portal_df, tally_df)
    excel_bytes  = generate_excel_report(result)

    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=clarivio_reconciliation.xlsx"},
    )
