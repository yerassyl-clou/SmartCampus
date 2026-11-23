"""Validate consented SIS13 ratings and render the five-series figure."""

import argparse
import csv
from decimal import Decimal
import json
from pathlib import Path
import re


FIELDS = ["event_id", "member_1", "member_2", "member_3", "member_4", "team_average"]


def read_ratings(roster_path, csv_path):
    event_ids = re.findall(r"^\|\s*(E-\d{2})\s*\|", roster_path.read_text(encoding="utf-8"), re.M)
    if not 8 <= len(event_ids) <= 15 or len(set(event_ids)) != len(event_ids):
        raise ValueError("The frozen register must contain 8–15 unique event IDs.")
    with csv_path.open(encoding="utf-8", newline="") as source:
        reader = csv.reader(source)
        if next(reader, None) != FIELDS:
            raise ValueError(f"Expected CSV header: {','.join(FIELDS)}")
        rows = list(reader)
    if any(len(row) != len(FIELDS) for row in rows) or [row[0] for row in rows] != event_ids:
        raise ValueError("CSV rows must match the frozen roster exactly and in order.")

    ratings, means = [], []
    for event, *values, reported_average in rows:
        if any(value and not re.fullmatch(r"[+-]?[0-5]", value) for value in values):
            raise ValueError(f"{event}: every supplied rating must be an integer from −5 to +5.")
        scores = [int(value) if value else None for value in values]
        expected_average = None if None in scores else Decimal(sum(scores)) / 4
        if expected_average is None:
            if reported_average:
                raise ValueError(f"{event}: leave the mean empty for an incomplete row.")
        elif not re.fullmatch(r"[+-]?\d+(?:\.\d{1,2})?", reported_average) or Decimal(reported_average) != expected_average:
            raise ValueError(f"{event}: mean should be {expected_average}.")
        ratings.append(scores)
        means.append(expected_average)
    return event_ids, ratings, means


def summarize(event_ids, ratings, means):
    low, high = min(means), max(means)
    changes = {f"{previous} → {current}": float(after - before)
               for previous, current, before, after in zip(event_ids, event_ids[1:], means, means[1:])}
    return {
        "maximum_team_mean": {"value": float(high), "events": [event for event, mean in zip(event_ids, means) if mean == high]},
        "minimum_team_mean": {"value": float(low), "events": [event for event, mean in zip(event_ids, means) if mean == low]},
        "adjacent_mean_changes": changes,
        "spreads_at_least_4": {event: max(scores) - min(scores) for event, scores in zip(event_ids, ratings)
                              if max(scores) - min(scores) >= 4},
    }


def render(event_ids, ratings, means, output):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from PIL import Image

    palette = ["#185D86", "#AB491C", "#694599", "#14755A", "#202A36"]
    styles = [("-", "o"), ("--", "s"), ("-.", "^"), (":", "D"), ("-", "P")]
    labels = ["Member 1", "Member 2", "Member 3", "Member 4", "Team mean"]
    series = [*zip(*ratings), means]
    figure, axes = plt.subplots(figsize=(12, 6.75), layout="constrained")
    for index, (values, label, color, (line, marker)) in enumerate(zip(series, labels, palette, styles)):
        axes.plot(event_ids, values, color=color, linestyle=line, marker=marker,
                  linewidth=3 if index == 4 else 1.6, markersize=6, label=label)
    axes.set(title="SmartCampus Emotional Seismograph", xlabel="Retrospective events in chronological order",
             ylabel="Emotional experience score", ylim=(-5, 5), yticks=range(-5, 6))
    axes.margins(x=0.04)
    axes.grid(axis="y", color="#DFE3E8")
    axes.axhline(0, color="#666F7A", linewidth=0.8, zorder=1)
    axes.spines[["right", "top"]].set_visible(False)
    axes.legend(ncols=5, loc="upper center", bbox_to_anchor=(0.5, -0.18), frameon=False)
    if axes.get_legend_handles_labels()[1] != labels:
        raise ValueError("The figure must contain four member series and one team mean.")
    figure.savefig(output, dpi=180, facecolor="white")
    plt.close(figure)
    with Image.open(output) as image:
        if image.format != "PNG" or image.size != (2160, 1215):
            raise ValueError("Expected a readable 2160 × 1215 PNG.")
        image.load()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--roster", type=Path, required=True, help="Pinned SIS13-01 event register")
    parser.add_argument("--csv", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    try:
        event_ids, ratings, means = read_ratings(args.roster, args.csv)
        completed = sum(all(row[column] is not None for row in ratings) for column in range(4))
        print(f"{len(event_ids)} ordered events, {completed}/4 complete member vectors.")
        if completed < 4:
            if args.output:
                raise ValueError("Four complete approved vectors are required before rendering.")
            return
        print(json.dumps(summarize(event_ids, ratings, means), indent=2, ensure_ascii=False))
        if args.output:
            render(event_ids, ratings, means, args.output)
    except ValueError as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
