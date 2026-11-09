from fastapi.testclient import TestClient

from app.main import app
from app import crud


cliente = TestClient(app)


def test_integration_create_cat_and_product():
    respuesta_categoria = cliente.post("/categorias", params={"nombre": "Jardinería"})
    assert respuesta_categoria.status_code == 200
    categoria = respuesta_categoria.json()

    respuesta_producto = cliente.post(
        "/productos", params={"nombre": "Tijeras", "categoria_id": categoria["id"]}
    )
    assert respuesta_producto.status_code == 200
    producto = respuesta_producto.json()

    assert categoria in cliente.get("/categorias").json()
    assert producto in crud._load_db()["productos"]


def test_integration_listar_productos():
    respuesta = cliente.get("/productos")

    assert respuesta.status_code == 200
    assert respuesta.json() == [
        {"id": 101, "nombre": "Laptop", "categoria_id": 1}
    ]


def test_integration_producto_rechaza_categoria_inexistente():
    respuesta = cliente.post(
        "/productos", params={"nombre": "Tijeras", "categoria_id": 999}
    )

    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "Categoría no encontrada"}
    assert len(crud._load_db()["productos"]) == 1
