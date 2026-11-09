import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./estilos.css";

function Aplicacion() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarDatos() {
    const [respuestaCategorias, respuestaProductos] = await Promise.all([
      fetch("/categorias"),
      fetch("/productos"),
    ]);
    if (!respuestaCategorias.ok || !respuestaProductos.ok) {
      throw new Error("No se pudieron cargar los datos. Comprueba que FastAPI esté activo.");
    }
    setCategorias(await respuestaCategorias.json());
    setProductos(await respuestaProductos.json());
  }

  useEffect(() => {
    cargarDatos().catch((error) => setMensaje(error.message));
  }, []);

  async function crearCategoria(evento) {
    evento.preventDefault();
    try {
      const parametros = new URLSearchParams({ nombre: nombreCategoria.trim() });
      const respuesta = await fetch(`/categorias?${parametros}`, { method: "POST" });
      if (!respuesta.ok) throw new Error("No se pudo crear la categoría.");
      setNombreCategoria("");
      setMensaje("Categoría creada.");
      await cargarDatos();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  async function crearProducto(evento) {
    evento.preventDefault();
    try {
      const parametros = new URLSearchParams({
        nombre: nombreProducto.trim(),
        categoria_id: categoriaId,
      });
      const respuesta = await fetch(`/productos?${parametros}`, { method: "POST" });
      if (!respuesta.ok) throw new Error("No se pudo crear el producto.");
      setNombreProducto("");
      setMensaje("Producto creado.");
      await cargarDatos();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  return (
    <main className="contenedor">
      <header>
        <p className="etiqueta">FastAPI + React</p>
        <h1>Categorías y productos</h1>
        <p>Una aplicación sencilla para crear y consultar tus datos.</p>
      </header>

      {mensaje && <p className="mensaje" role="status">{mensaje}</p>}

      <section className="columnas">
        <article className="tarjeta">
          <h2>Categorías</h2>
          <form onSubmit={crearCategoria}>
            <label htmlFor="nombre-categoria">Nueva categoría</label>
            <div className="fila">
              <input id="nombre-categoria" value={nombreCategoria}
                onChange={(evento) => setNombreCategoria(evento.target.value)} required />
              <button type="submit">Agregar</button>
            </div>
          </form>
          <ul>{categorias.map((categoria) => (
            <li key={categoria.id}><span>{categoria.nombre}</span><small>#{categoria.id}</small></li>
          ))}</ul>
        </article>

        <article className="tarjeta">
          <h2>Productos</h2>
          <form onSubmit={crearProducto}>
            <label htmlFor="nombre-producto">Nuevo producto</label>
            <input id="nombre-producto" value={nombreProducto}
              onChange={(evento) => setNombreProducto(evento.target.value)} required />
            <label htmlFor="categoria-producto">Categoría</label>
            <div className="fila">
              <select id="categoria-producto" value={categoriaId}
                onChange={(evento) => setCategoriaId(evento.target.value)} required>
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
              <button type="submit">Agregar</button>
            </div>
          </form>
          <ul>{productos.map((producto) => (
            <li key={producto.id}>
              <span>{producto.nombre}<small>{categorias.find((categoria) => categoria.id === producto.categoria_id)?.nombre ?? "Sin categoría"}</small></span>
              <small>#{producto.id}</small>
            </li>
          ))}</ul>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<Aplicacion />);
