"""
PDF Generator — Enhanced Legal Notice with product details, image, location.
"""
import os
from datetime import datetime
from typing import Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable
from reportlab.lib import colors

from app.core.config import settings

GOLD = colors.HexColor("#C8952A")
NAVY = colors.HexColor("#11213d")
LIGHT_BLUE = colors.HexColor("#EFF6FF")


def generate_legal_notice_pdf(
    audit_id: str,
    product_url: str,
    violations: list,
    compliance_score: float,
    product_name: Optional[str] = None,
    brand_name: Optional[str] = None,
    scan_timestamp: Optional[datetime] = None,
    location_address: Optional[str] = None,
    image_path: Optional[str] = None,
    extracted_declarations: Optional[dict] = None,
) -> str:
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)
    file_path = os.path.join(settings.REPORTS_DIR, f"legal_notice_{audit_id}.pdf")

    doc = SimpleDocTemplate(file_path, pagesize=A4,
                            rightMargin=20 * mm, leftMargin=20 * mm,
                            topMargin=25 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle("Title", parent=styles["Heading1"], fontSize=12,
                                 alignment=TA_CENTER, spaceAfter=2, textColor=NAVY, fontName="Helvetica-Bold")
    sub_style = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=10,
                               alignment=TA_CENTER, spaceAfter=6, fontName="Helvetica-Bold", textColor=NAVY)
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=9, leading=13, spaceAfter=3)
    small_style = ParagraphStyle("Small", parent=styles["Normal"], fontSize=8, leading=11, textColor=colors.HexColor("#64748b"))

    # === HEADER ===
    story.append(HRFlowable(width="100%", thickness=3, color=GOLD, spaceAfter=4))
    
    logo_added = False
    try:
        from svglib.svglib import svg2rlg
        logo_path = os.path.join(os.path.dirname(settings.BASE_DIR), "frontend", "public", "gov-india-logo.svg")
        if os.path.exists(logo_path):
            drawing = svg2rlg(logo_path)
            drawing.renderScale = 0.5
            story.append(drawing)
            logo_added = True
    except Exception:
        pass

    if not logo_added:
        story.append(Paragraph("GOVERNMENT OF INDIA", title_style))
        story.append(Paragraph("MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION", title_style))
    
    story.append(Paragraph("DEPARTMENT OF CONSUMER AFFAIRS — LEGAL METROLOGY DIVISION", sub_style))
    story.append(Paragraph("INSPECTION REPORT UNDER LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011", sub_style))
    story.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=8))

    # === REFERENCE INFO ===
    scan_time = (scan_timestamp or datetime.utcnow()).strftime("%d-%m-%Y %H:%M:%S UTC")
    status_text = "COMPLIANT" if compliance_score >= 70 else "NON-COMPLIANT"
    status_color = colors.HexColor("#15803d") if compliance_score >= 70 else colors.HexColor("#dc2626")

    ref_data = [
        [Paragraph("<b>Reference No.</b>", body_style), Paragraph(f"LM/AUDIT/{audit_id[:8].upper()}", body_style)],
        [Paragraph("<b>Scan Date &amp; Time</b>", body_style), Paragraph(scan_time, body_style)],
        [Paragraph("<b>Scan Location</b>", body_style), Paragraph(location_address or "Not recorded", body_style)],
        [Paragraph("<b>Compliance Score</b>", body_style), Paragraph(f"{compliance_score:.1f} / 100", body_style)],
        [Paragraph("<b>Status</b>", body_style), Paragraph(f"<b>{status_text}</b>", ParagraphStyle("S", parent=body_style, textColor=status_color))],
    ]
    ref_table = Table(ref_data, colWidths=[55*mm, 110*mm])
    ref_table.setStyle(TableStyle([
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#cbd5e1")),
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#f8fafc")),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    story.append(ref_table)
    story.append(Spacer(1, 6*mm))

    # === PRODUCT DETAILS + IMAGE SIDE BY SIDE ===
    story.append(Paragraph("<b>PRODUCT DETAILS</b>", sub_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=4))

    prod_rows = [
        ["Product Name", product_name or "—"],
        ["Brand", brand_name or "—"],
        ["Source URL", product_url[:80] + "..." if len(product_url) > 80 else product_url],
    ]
    prod_data = [[Paragraph(f"<b>{r[0]}</b>", body_style), Paragraph(str(r[1]), body_style)] for r in prod_rows]

    img_element = None
    if image_path and os.path.exists(image_path):
        try:
            img_element = Image(image_path, width=45*mm, height=45*mm, kind="proportional")
        except Exception:
            img_element = None

    if img_element:
        prod_table_data = [[Table(prod_data, colWidths=[35*mm, 80*mm]), img_element]]
        prod_outer = Table(prod_table_data, colWidths=[120*mm, 50*mm])
    else:
        prod_outer = Table(prod_data, colWidths=[45*mm, 120*mm])

    prod_outer.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.3, colors.HexColor("#e2e8f0")),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    story.append(prod_outer)
    story.append(Spacer(1, 6*mm))

    # === EXTRACTED DECLARATIONS ===
    if extracted_declarations:
        story.append(Paragraph("<b>EXTRACTED DECLARATIONS</b>", sub_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=4))
        ext_data = []
        for k, v in extracted_declarations.items():
            ext_data.append([Paragraph(f"<b>{k}</b>", body_style), Paragraph(str(v) if v else "Not Found", body_style)])
        
        if ext_data:
            ext_table = Table(ext_data, colWidths=[55*mm, 110*mm])
            ext_table.setStyle(TableStyle([
                ("FONTSIZE", (0,0), (-1,-1), 9),
                ("VALIGN", (0,0), (-1,-1), "TOP"),
                ("GRID", (0,0), (-1,-1), 0.3, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0,0), (-1,-1), 3),
                ("BOTTOMPADDING", (0,0), (-1,-1), 3),
            ]))
            story.append(ext_table)
            story.append(Spacer(1, 6*mm))

    # === VIOLATIONS ===
    story.append(Paragraph("<b>VIOLATIONS IDENTIFIED</b>", sub_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=4))

    if not violations:
        story.append(Paragraph("<b>No violations recorded.</b> Product label appears compliant with the Packaged Commodities Rules, 2011.", body_style))
    else:
        viol_data = [[Paragraph("<b>#</b>", body_style), Paragraph("<b>Rule Type</b>", body_style), Paragraph("<b>Violation Description</b>", body_style)]]
        for i, v in enumerate(violations, 1):
            rule = str(v.get("rule_type", "")).replace("_", " ").title()
            desc = v.get("description", "")
            viol_data.append([str(i), Paragraph(rule, body_style), Paragraph(desc, body_style)])
        viol_table = Table(viol_data, colWidths=[10*mm, 50*mm, 110*mm])
        viol_table.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,0), NAVY),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
            ("FONTSIZE", (0,0), (-1,-1), 9),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#fff8f0")]),
            ("TOPPADDING", (0,0), (-1,-1), 4),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ]))
        story.append(viol_table)

    story.append(Spacer(1, 6*mm))
    
    # === COMPLIANCE CHECKLIST ===
    story.append(Paragraph("<b>COMPLIANCE CHECKLIST & LEGAL REFERENCES</b>", sub_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=4))
    
    checklist_data = [
        [Paragraph("<b>Rule 6: Mandatory Declarations</b>", body_style), Paragraph("MRP, Weight, Manufacturer present", body_style)],
        [Paragraph("<b>Rule 7: Font Size</b>", body_style), Paragraph("Legible size based on package area", body_style)],
        [Paragraph("<b>Rule 18: Overcharging</b>", body_style), Paragraph("Selling price <= MRP", body_style)],
        [Paragraph("<b>Reference</b>", body_style), Paragraph("Legal Metrology (Packaged Commodities) Rules, 2011", body_style)]
    ]
    check_table = Table(checklist_data, colWidths=[60*mm, 110*mm])
    check_table.setStyle(TableStyle([
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.3, colors.HexColor("#cbd5e1")),
        ("TOPPADDING", (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ]))
    story.append(check_table)

    # === CONSUMER HELPLINE SECTION ===
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph("<b>CONSUMER HELPLINE &amp; GRIEVANCE REDRESSAL</b>", sub_style))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceAfter=4))

    helpline_data = []
    # Product consumer care (from extracted data)
    consumer_care = None
    if extracted_declarations:
        consumer_care = extracted_declarations.get("Consumer Care")
    if consumer_care:
        helpline_data.append([Paragraph("<b>Product Consumer Care</b>", body_style), Paragraph(str(consumer_care), body_style)])
    else:
        helpline_data.append([Paragraph("<b>Product Consumer Care</b>", body_style), Paragraph("Not found on label", body_style)])

    # Official helplines
    helpline_data.append([Paragraph("<b>National Consumer Helpline</b>", body_style), Paragraph("1800-11-4000 (Toll Free) / 1915", body_style)])
    helpline_data.append([Paragraph("<b>Consumer Helpline Website</b>", body_style), Paragraph("https://consumerhelpline.gov.in", body_style)])
    helpline_data.append([Paragraph("<b>Consumer Court (e-Daakhil)</b>", body_style), Paragraph("https://edaakhil.nic.in", body_style)])
    helpline_data.append([Paragraph("<b>Legal Metrology Dept</b>", body_style), Paragraph("Department of Consumer Affairs, GoI", body_style)])
    helpline_data.append([Paragraph("<b>INGRAM Portal</b>", body_style), Paragraph("https://consumerhelpline.gov.in/ingram", body_style)])

    helpline_table = Table(helpline_data, colWidths=[60*mm, 110*mm])
    helpline_table.setStyle(TableStyle([
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.3, colors.HexColor("#cbd5e1")),
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#f0f9ff")),
        ("TOPPADDING", (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ]))
    story.append(helpline_table)

    story.append(Spacer(1, 8*mm))
    story.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=4))
    story.append(Paragraph(
        "This is a system-generated inspection report for official review under the Legal Metrology (Packaged Commodities) Rules, 2011. "
        "Generated by: LegalLens AI Compliance System — SIH 2026 PS-034 | Ministry of Consumer Affairs, GoI.",
        small_style
    ))

    doc.build(story)
    return file_path
