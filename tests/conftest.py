import json
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

from app import crud


@pytest.fixture(autouse=True)
def base_aislada(monkeypatch):
    datos = {
        "categorias": [{"id": 1, "nombre": "Electrónica"}],
        "productos": [{"id": 101, "nombre": "Laptop", "categoria_id": 1}],
    }
    with TemporaryDirectory(dir=Path(__file__).parent) as carpeta:
        archivo = Path(carpeta) / "db.json"
        archivo.write_text(json.dumps(datos, ensure_ascii=False), encoding="utf-8")
        monkeypatch.setattr(crud, "DB_FILE", archivo)
        yield archivo
