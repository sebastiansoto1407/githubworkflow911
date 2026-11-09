# Pruebas 26

Aplicación sencilla de categorías y productos. **FastAPI** es el backend en Python y **React con Vite** es el frontend.

## Iniciar

Desde la raíz del proyecto, abre dos terminales:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8005
```

```powershell
cd frontend
npm ci
npm run dev
```

Abre la dirección que muestre Vite (normalmente `http://localhost:5173`). La documentación de la API está en `http://localhost:8005/docs`.

## Pruebas

```powershell
python -m pytest -q
cd frontend
npm ci
npm run build
```

Hay **3 pruebas unitarias, 3 de integración y 3 E2E de la API**. Cada prueba usa su propia copia temporal de `db.json`, así que los datos del proyecto no cambian al probar. GitHub Actions ejecuta estas pruebas y compila React al hacer `push` o abrir un pull request hacia `dev`.
