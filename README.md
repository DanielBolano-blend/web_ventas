# YB Clothes — Sitio web

Sitio estático (HTML + CSS + JavaScript puro) de YB Clothes, tienda de ropa y belleza.

## Ver localmente
Los navegadores no dejan leer `data/productos.json` si abres los archivos con doble clic (`file://`).
Usa un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```
y abre http://localhost:8000 (o usa la extensión *Live Server* de VS Code).

## Personalizar
- **WhatsApp:** cambia `CONFIG.whatsapp` en `js/main.js` (ej. `"573001234567"`) y el texto `[NÚMERO WHATSAPP]` en los HTML.
- **Colores:** variables al inicio de `css/styles.css` (`:root`).
- **Cartel informativo:** `cartel.html` muestra el aviso de reorganización abreviada; el PDF oficial está en `docs/`.

## Productos
Edita `data/productos.json`. Campos: `id`, `nombre`, `categoria` (`ropa` | `belleza`),
`subcategoria`, `genero` (solo ropa: `hombre` | `mujer` | `ninos` | `unisex`), `precio` (número, sin puntos),
`descripcion`, `imagen` (ruta en `img/`), `destacado` (`true` para mostrarlo en el inicio).
