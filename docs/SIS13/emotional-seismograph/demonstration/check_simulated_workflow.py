"""Repeat the simulated SIS13 workflow and guard the empty official checkpoint."""

import argparse
import csv
from decimal import Decimal
import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory

from PIL import Image, ImageChops


DEMO = Path(__file__).resolve().parent
RENDERER = DEMO.parent / "render_seismograph.py"
FIXTURE = DEMO / "ratings.simulated.csv"
FIGURE = DEMO / "EMOTIONAL_SEISMOGRAPH.simulated.png"


def run(roster, source, output=None):
    command = [sys.executable, str(RENDERER), "--roster", str(roster), "--csv", str(source)]
    if output:
        command += ["--output", str(output)]
    return subprocess.run(command, capture_output=True, text=True)


def reject(result, error):
    assert result.returncode != 0 and error in result.stderr, result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--roster", required=True, type=Path)
    parser.add_argument("--official-csv", required=True, type=Path, help="Blank PR #36 checkpoint")
    args = parser.parse_args()

    with FIXTURE.open(encoding="utf-8", newline="") as source:
        header, *rows = csv.reader(source)
    event_ids = [f"E-{i:02}" for i in range(1, 12)]
    assert [row[0] for row in rows] == event_ids
    means = list(map(Decimal, ["3.5", "2.5", "4.5", "4.25", "-3", "3.5", "1", "0.5", "2.75", "-2.75", "2.75"]))
    assert [Decimal(row[-1]) for row in rows] == means
    assert [Decimal(sum(map(int, row[1:5]))) / 4 for row in rows] == means
    print("PASS: 11 ordered events and all 11 exact means")

    with TemporaryDirectory() as directory:
        output = Path(directory) / FIGURE.name
        result = run(args.roster, FIXTURE, output)
        result.check_returncode()
        status, summary = result.stdout.split("\n", 1)
        assert status == "11 ordered events, 4/4 complete simulated vectors."
        stats = json.loads(summary, parse_float=Decimal)
        assert stats["maximum_team_mean"] == {"value": Decimal("4.5"), "events": ["E-03"]}
        assert stats["minimum_team_mean"] == {"value": Decimal("-3"), "events": ["E-05"]}
        assert stats["adjacent_mean_changes"] == {
            f"{a} → {b}": y - x for a, b, x, y in zip(event_ids, event_ids[1:], means, means[1:])
        }
        assert stats["spreads_at_least_4"] == {"E-05": 4, "E-07": 6, "E-08": 5, "E-11": 4}
        print("PASS: extrema, all 10 adjacent changes and both inclusive threshold boundaries")

        with Image.open(output) as actual, Image.open(FIGURE) as committed:
            assert actual.format == committed.format == "PNG"
            assert actual.size == committed.size == (2160, 1215)
            assert ImageChops.difference(actual.convert("RGB"), committed.convert("RGB")).getbbox() is None
        print("PASS: five-series render and pixel-identical 2160 × 1215 PNG")

        final_path = Path(directory) / "EMOTIONAL_SEISMOGRAPH.png"
        reject(run(args.roster, FIXTURE, final_path), "separate .simulated.png")
        official = run(args.roster, args.official_csv)
        official.check_returncode()
        assert official.stdout.strip() == "11 ordered events, 0/4 complete member vectors."
        reject(run(args.roster, args.official_csv, final_path), "Four complete approved vectors")
        assert not final_path.exists()
        print("PASS: official CSV accepts blanks and neither input writes an official figure")

        invalid = Path(directory) / "invalid.simulated.csv"
        for changed_rows, error in (
            ([rows[1], rows[0], *rows[2:]], "frozen roster exactly and in order"),
            ([[rows[0][0], "6", *rows[0][2:]], *rows[1:]], "integer from"),
            ([[*rows[0][:-1], "3.4"], *rows[1:]], "mean should be 3.5"),
            ([[rows[0][0], "", *rows[0][2:]], *rows[1:]], "leave the mean empty"),
        ):
            with invalid.open("w", encoding="utf-8", newline="") as target:
                csv.writer(target).writerows([header, *changed_rows])
            reject(run(args.roster, invalid), error)
        print("PASS: invalid roster order, out-of-range rating, wrong mean and partial-row mean rejected")


if __name__ == "__main__":
    main()
