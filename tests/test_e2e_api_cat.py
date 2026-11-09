from fastapi.testclient import TestClient

from app.main import app


cliente = TestClient(app)


def test_e2e_full_category_lifecycle():
    categorias_iniciales = cliente.get("/categorias").json()
    respuesta = cliente.post("/categorias", params={"nombre": "Jardinería"})

    assert respuesta.status_code == 200
    categorias_finales = cliente.get("/categorias").json()
    assert len(categorias_finales) == len(categorias_iniciales) + 1
    assert respuesta.json() in categorias_finales


def test_e2e_crear_y_consultar_producto():
    categoria = cliente.post("/categorias", params={"nombre": "Oficina"}).json()
    respuesta = cliente.post(
        "/productos", params={"nombre": "Cuaderno", "categoria_id": categoria["id"]}
    )

    assert respuesta.status_code == 200
    assert respuesta.json() in cliente.get("/productos").json()
    assert categoria in cliente.get("/categorias").json()


def test_e2e_corregir_categoria_de_producto():
    respuesta_invalida = cliente.post(
        "/productos", params={"nombre": "Maceta", "categoria_id": 999}
    )
    assert respuesta_invalida.status_code == 404

    categoria = cliente.post("/categorias", params={"nombre": "Jardín"}).json()
    respuesta_valida = cliente.post(
        "/productos", params={"nombre": "Maceta", "categoria_id": categoria["id"]}
    )

    assert respuesta_valida.status_code == 200
    productos = cliente.get("/productos").json()
    assert [producto["nombre"] for producto in productos] == ["Laptop", "Maceta"]
