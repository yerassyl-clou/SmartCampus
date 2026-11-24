from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def test_historical_projection_arithmetic():
    revenue = 200 * 28
    fixed = 160 * 12
    variable = 30 * 28
    net = revenue - fixed - variable - 800
    assert revenue == 5600
    assert fixed == 1920
    assert variable == 840
    assert net == 2040


def test_forecast_rows_are_projected_not_actual():
    text = (ROOT / "docs/final-exam/finance/FORECAST.csv").read_text()
    assert "projected" in text
    assert "actual" not in text
