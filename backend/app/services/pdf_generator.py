"""
PDF Generator — Section 39 Legal Metrology Act 2009 draft notice.
"""
import os
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors

from app.core.config import settings


def generate_legal_notice_pdf(
    audit_id: str,
    product_url: str,
    violations: list,
    compliance_score: float,
) -> str:
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)
    file_path = os.path.join(settings.REPORTS_DIR, f"legal_notice_{audit_id}.pdf")

    doc = SimpleDocTemplate(file_path, pagesize=A4,
                            rightMargin=20 * mm, leftMargin=20 * mm,
                            topMargin=25 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    story = []

    # Header
    title_style = ParagraphStyle("Title", parent=styles["Heading1"], fontSize=13,
                                 alignment=TA_CENTER, spaceAfter=4)
    sub_style = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=11,
                               alignment=TA_CENTER, spaceAfter=8, fontName="Helvetica-Bold")
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10,
                                leading=15, spaceAfter=4)

    story.append(Paragraph("GOVERNMENT OF INDIA — MINISTRY OF CONSUMER AFFAIRS", title_style))
    story.append(Paragraph("LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011", title_style))
    story.append(Paragraph("DRAFT NOTICE UNDER SECTION 39, LEGAL METROLOGY ACT, 2009", sub_style))
    story.append(Spacer(1, 6 * mm))

    # Reference info
    info_data = [
        ["Reference No.", f"LM/AUDIT/{audit_id[:8].upper()}"],
        ["Date of Issue", datetime.utcnow().strftime("%d-%m-%Y")],
        ["Product Reference", Paragraph(product_url, body_style)],
        ["Compliance Score", f"{compliance_score:.1f} / 100"],
        ["Overall Status", "PASS" if compliance_score >= 70 else "FAIL"],
    ]
    info_table = Table(info_data, colWidths=[50 * mm, 120 * mm])
    info_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0f0f0")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#fafafa")]),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8 * mm))

    # Violations
    story.append(Paragraph("<b>Violations Identified:</b>", body_style))
    story.append(Spacer(1, 3 * mm))

    if not violations:
        story.append(Paragraph("No violations recorded. Product label appears compliant.", body_style))
    else:
        viol_data = [["#", "Rule Type", "Description"]]
        for i, v in enumerate(violations, 1):
            rule = str(v.get("rule_type", "")).replace("_", " ")
            desc = v.get("description", "")
            viol_data.append([str(i), Paragraph(rule, body_style), Paragraph(desc, body_style)])
        viol_table = Table(viol_data, colWidths=[10 * mm, 50 * mm, 110 * mm])
        viol_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#11213d")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fff8f0")]),
        ]))
        story.append(viol_table)

    story.append(Spacer(1, 10 * mm))
    disclaimer_style = ParagraphStyle("Disclaimer", parent=styles["Normal"], fontSize=8,
                                      textColor=colors.grey, leading=11)
    story.append(Paragraph(
        "This is a system-generated draft for internal review purposes only and does not "
        "constitute an officially issued statutory notice under the Legal Metrology Act, 2009. "
        "Issued by: Automated Legal Metrology Compliance Architecture — SIH 2026 PS-034.",
        disclaimer_style
    ))

    doc.build(story)
    return file_path
