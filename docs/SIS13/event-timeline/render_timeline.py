"""Render the defense timeline and Markdown from the frozen SIS13-01 register."""

import argparse
from datetime import date
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROSTER_SHA = "d903dfbb3317fff7fdce856b6643fffc33a1071f"
REGISTER_URL = (
    "https://github.com/yerassyl-clou/SmartCampus/blob/"
    f"{ROSTER_SHA}/docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md"
)
EFFECT_CAPTIONS = {
    "E-01": "16 cases established a repeatable QA baseline.",
    "E-02": "CR-001-A bounded the academic feedback scope.",
    "E-03": "Deadline, retrieval and feedback changes landed on main.",
    "E-04": "Merged-revision QA recorded 126 / 70 / 9 test passes.",
    "E-05": "The connector limit delayed board updates.",
    "E-06": "Reviewer records confirmed all 20 tasks in Done.",
    "E-07": "165 planned minutes moved from the PM to two owners.",
    "E-08": "The team gained a common time-logging procedure.",
    "E-09": "Local resource baselines and evidence gaps were recorded.",
    "E-10": "Account quotas, usage and spend remained unknown.",
    "E-11": "Pytest gained a guard for non-loopback Python sockets.",
}
CATEGORY_COLORS = {
    "Achievement": "#236752",
    "Decision": "#6550bd",
    "Milestone": "#2b5891",
    "Delay": "#933d52",
    "Challenge": "#855015",
}
INK = "#282638"
MUTED = "#595466"
ACCENT = "#6550bd"


def load_events(register):
    events = [
        [cell.strip() for cell in line.split("|")[1:-1]]
        for line in register.read_text(encoding="utf-8").splitlines()
        if line.startswith("| E-")
    ]
    if tuple(event[0] for event in events) != tuple(EFFECT_CAPTIONS):
        raise ValueError("The register IDs must match the frozen v1.0 roster in order.")
    if [event[2] for event in events] != sorted(event[2] for event in events):
        raise ValueError("The register must be in Almaty chronological order.")
    return events


def draw_wrapped(draw, text, font, color, box, line_height):
    x, y, width, height = box
    lines = [""]
    for word in text.split():
        candidate = f"{lines[-1]} {word}".strip()
        if lines[-1] and draw.textlength(candidate, font=font) > width:
            lines.append(word)
        else:
            lines[-1] = candidate
    for index, line in enumerate(lines):
        top = y + index * line_height
        bounds = draw.textbbox((x, top), line, font=font, anchor="lt")
        if bounds[2] > x + width or bounds[3] > y + height:
            raise ValueError(f"Caption exceeds its layout: {text}")
        draw.text((x, top), line, fill=color, font=font, anchor="lt")


def render_image(events, regular_path, bold_path, output):
    image = Image.new("RGB", (3200, 1800), "#f6f7fb")
    draw = ImageDraw.Draw(image)
    title = ImageFont.truetype(str(bold_path), 108)
    display = ImageFont.truetype(str(bold_path), 39)
    label = ImageFont.truetype(str(bold_path), 34)
    body = ImageFont.truetype(str(regular_path), 38)
    note = ImageFont.truetype(str(regular_path), 31)

    draw.text((118, 89), "SMARTCAMPUS  /  SIS 13", font=label, fill=ACCENT, anchor="lt")
    draw.text((112, 149), "Sprint event timeline", font=title, fill=INK, anchor="lt")
    draw.text((118, 274), "7–20 November 2026   ·   Asia/Almaty (UTC+05:00)", font=body, fill=MUTED, anchor="lt")
    draw.line((116, 354, 3084, 354), fill="#ddd8ec", width=4)

    for column, start in enumerate(range(0, len(events), 4)):
        x = 116 + column * 1003
        for row, event in enumerate(events[start:start + 4]):
            event_id, _, almaty, heading, category, *_ = event
            y = 400 + row * 292
            event_date = date.fromisoformat(almaty[:10])
            local_date = event_date.strftime("%d %b")
            color = CATEGORY_COLORS[category]
            draw.rounded_rectangle((x, y, x + 962, y + 268), radius=26, fill="white", outline="#e2deec", width=3)
            draw.rounded_rectangle((x + 24, y + 28, x + 36, y + 240), radius=6, fill=color)
            draw.text((x + 65, y + 42), f"{event_id}  /  {local_date.upper()}  /  {category}", font=label, fill=color, anchor="lt")
            draw_wrapped(draw, heading, display, INK, (x + 65, y + 100, 865, 49), 49)
            draw_wrapped(draw, EFFECT_CAPTIONS[event_id], body, MUTED, (x + 65, y + 166, 865, 81), 41)

    draw.line((116, 1584, 3084, 1584), fill="#ddd8ec", width=4)
    draw.text((116, 1630), "Read each column top to bottom, then move right.", font=note, fill=MUTED, anchor="lt")
    draw.text((116, 1680), "Frozen roster v1.0 · Match E-IDs to evidence in the companion timeline.", font=note, fill=MUTED, anchor="lt")
    image.save(output, dpi=(300, 300), optimize=True)


def render_markdown(events, output):
    lines = [
        "# SmartCampus sprint event timeline",
        "",
        "This timeline covers 7–20 November 2026 in Asia/Almaty (UTC+05:00). "
        "Read down each column and move right. The E-IDs and neutral labels match "
        "the roster supplied to SIS13-05 for independent scoring.",
        "",
        f"[Frozen SIS13-01 roster v1.0]({REGISTER_URL}) · "
        "[SIS13-02 Visual Event Timeline](https://app.clickup.com/t/z8q7hbx7vw)",
        "",
        "![Chronological SmartCampus timeline of eleven events](EVENT_TIMELINE.png)",
        "",
        "| Event | Almaty timestamp | Neutral label | Category | Observed effect | Sources | Grade | Limitation |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for event_id, _, almaty, heading, category, _, effect, sources, grade, limitation in events:
        lines.append(f"| {event_id} | {almaty} | {heading} | {category} | {effect} | {sources} | {grade} | {limitation} |")
    lines += [
        "",
        "The register retains original timestamp zones and gives the meaning of each evidence grade. "
        "The Groq audit and guard PRs merged after local midnight on 18 November. "
        "The 23–24 November improvement cycle is outside this figure.",
        "",
        "## Reproduce the figure and table",
        "",
        "Use Python 3.11 or newer, Pillow 12.2.0 and Arial regular and bold fonts. "
        "Run from this branch with the frozen register commit available locally.",
        "",
        "```sh",
        f"git show {ROSTER_SHA}:docs/SIS13/event-timeline/EVENT_EVIDENCE_REGISTER.md > /tmp/sis13-roster-v1.md",
        'python docs/SIS13/event-timeline/render_timeline.py /tmp/sis13-roster-v1.md \\',
        '  --font "/System/Library/Fonts/Supplemental/Arial.ttf" \\',
        '  --bold-font "/System/Library/Fonts/Supplemental/Arial Bold.ttf"',
        "```",
        "",
        "The renderer checks event order and text bounds. The image is 3,200 × 1,800 pixels at 300 DPI.",
        "",
    ]
    output.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("register", type=Path)
    parser.add_argument("--font", required=True, type=Path)
    parser.add_argument("--bold-font", required=True, type=Path)
    args = parser.parse_args()
    output = Path(__file__).resolve().parent
    events = load_events(args.register)
    render_image(events, args.font, args.bold_font, output / "EVENT_TIMELINE.png")
    render_markdown(events, output / "EVENT_TIMELINE.md")


if __name__ == "__main__":
    main()
