"""Build the editable SmartCampus retrospective source into its draft PDF."""

import argparse
import io
from pathlib import Path
import re
import subprocess
from xml.sax.saxutils import escape

from reportlab import rl_config
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


HERE = Path(__file__).resolve().parent
WIDTH, HEIGHT = A4
MARGIN = 48
BODY_WIDTH = WIDTH - 2 * MARGIN
INK = colors.HexColor("#282638")
MUTED = colors.HexColor("#5d566a")
ACCENT = colors.HexColor("#6550bd")
LINE = colors.HexColor("#ddd8ec")
LINK = re.compile(r"\[([^\]]+)\]\((https://[^)\s]+)\)")
FIGURE = re.compile(r"!\[([^\]]+)\]\(([^)]+)\)")
STYLES = {
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=31, leading=35, textColor=INK),
    "heading": ParagraphStyle("heading", fontName="Helvetica-Bold", fontSize=14, leading=17, textColor=INK),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=11.5, leading=17, textColor=INK),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10.5, leading=14, leftIndent=12, textColor=INK),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=10, leading=14, textColor=INK),
    "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=ACCENT),
}


def inline(text):
    pieces = []
    offset = 0
    for match in LINK.finditer(text):
        pieces.append(escape(text[offset:match.start()]))
        label, url = match.groups()
        pieces.append(f'<link href="{escape(url)}" color="#5140a5"><u>{escape(label)}</u></link>')
        offset = match.end()
    pieces.append(escape(text[offset:]))
    return "".join(pieces)


def paragraph(text, style, bullet=None):
    return Paragraph(inline(text), STYLES[style], bulletText=bullet)


def table(lines):
    rows = [[cell.strip() for cell in line.strip("|").split("|")] for line in lines]
    header, separator, *data = rows
    if not all(re.fullmatch(r":?-{3,}:?", cell) for cell in separator):
        raise ValueError("A report table needs a Markdown header separator.")
    if any(len(row) != len(header) for row in data):
        raise ValueError("Report table columns do not match.")
    cells = [[paragraph(cell, "label") for cell in header]]
    cells.extend([[paragraph(cell, "cell") for cell in row] for row in data])
    widths = [BODY_WIDTH * part for part in ([0.23, 0.31, 0.29, 0.17] if len(header) == 4 else [0.24, 0.43, 0.33])]
    if len(widths) != len(header):
        raise ValueError("Use three or four columns in report tables.")
    result = Table(cells, colWidths=widths)
    result.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0ecfa")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8f7fb")]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return result


def figure(source):
    ref, separator, git_path = source.partition(":")
    if not separator:
        return ImageReader(str(HERE / source))
    payload = subprocess.check_output(["git", "show", f"{ref}:{git_path}"], cwd=HERE)
    return ImageReader(io.BytesIO(payload))


def draw_page(pdf, content, page, total):
    pdf.setFillColor(ACCENT)
    pdf.rect(0, HEIGHT - 7, WIDTH, 7, fill=1, stroke=0)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(MARGIN, HEIGHT - 41, "SMARTCAMPUS / SIS 13")
    pdf.setFillColor(MUTED)
    pdf.drawRightString(WIDTH - MARGIN, HEIGHT - 41, "EVIDENCE DRAFT")
    pdf.setStrokeColor(LINE)
    pdf.line(MARGIN, 51, WIDTH - MARGIN, 51)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(MARGIN, 33, "IT Project Management | 24 November 2026")
    pdf.drawRightString(WIDTH - MARGIN, 33, f"{page} / {total}")

    y = HEIGHT - 76

    def place(item, gap):
        nonlocal y
        _, height = item.wrap(BODY_WIDTH, y)
        y -= height
        if y < 68:
            raise ValueError(f"Content overflows page {page}. Edit the source or add a page break.")
        item.drawOn(pdf, MARGIN, y)
        y -= gap

    lines = iter(content.strip().splitlines())
    line = next(lines, None)
    while line is not None:
        if line.startswith("|"):
            rows = []
            while line is not None and line.startswith("|"):
                rows.append(line)
                line = next(lines, None)
            place(table(rows), 14)
            continue
        asset = FIGURE.fullmatch(line)
        if asset:
            image = figure(asset[2])
            width, height = image.getSize()
            max_height = 285 if width / height >= 1.6 else 207
            scale = min(BODY_WIDTH / width, max_height / height)
            width, height = width * scale, height * scale
            y -= height
            if y < 68:
                raise ValueError(f"Figure overflows page {page}: {asset[1]}")
            pdf.drawImage(image, (WIDTH - width) / 2, y, width=width, height=height, mask="auto")
            y -= 10
        elif line.startswith("# "):
            place(paragraph(line[2:], "title"), 17)
        elif line.startswith("## "):
            place(paragraph(line[3:], "heading"), 7)
        elif line.startswith("- "):
            place(paragraph(line[2:], "bullet", bullet="•"), 3)
        elif line.strip():
            place(paragraph(line, "body"), 12)
        line = next(lines, None)
    pdf.showPage()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=HERE / "RETROSPECTIVE_DRAFT.md")
    parser.add_argument("--output", type=Path, default=HERE / "SmartCampus_SIS13_Retrospective_Report.pdf")
    args = parser.parse_args()
    pages = args.source.read_text(encoding="utf-8").strip().split("\n---\n")
    if not 8 <= len(pages) <= 12:
        raise ValueError("The report must be 8-12 pages.")
    rl_config.useA85 = 0
    pdf = canvas.Canvas(str(args.output), pagesize=A4, invariant=1, pageCompression=1)
    pdf.setTitle("SmartCampus Sprint Retrospective | SIS 13 Evidence Draft")
    pdf.setSubject("Retrospective and continuous improvement, 7-20 November 2026")
    for index, page in enumerate(pages, 1):
        draw_page(pdf, page, index, len(pages))
    pdf.save()


if __name__ == "__main__":
    main()
