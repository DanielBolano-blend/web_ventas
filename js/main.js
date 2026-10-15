/* =========================================================
   [NOMBRE DE LA TIENDA] — JavaScript principal (sin frameworks)
   - Menú hamburguesa
   - Carga de productos desde data/productos.json
   - Filtros de catálogo
   - Enlaces de WhatsApp con mensaje prellenado
   ========================================================= */

/* ---------- Configuración (edita solo esta parte) ---------- */
const CONFIG = {
  // Número en formato internacional, solo dígitos: 57 + número celular.
  // Ejemplo: "573001234567". Mientras sea un marcador, WhatsApp abrirá
  // el selector de contactos con el mensaje ya escrito.
  whatsapp: "[NÚMERO WHATSAPP]",
  rutaProductos: "data/productos.json",
  imagenRespaldo: "img/placeholder.svg",
};

/* Nombres "bonitos" para mostrar en las etiquetas de las tarjetas */
const ETIQUETAS = {
  hombre: "Hombre",
  mujer: "Mujer",
  ninos: "Niños",
  unisex: "Unisex",
  casual: "Casual",
  deportiva: "Deportiva",
  accesorios: "Accesorios",
  maquillaje: "Maquillaje",
  piel: "Piel",
  cabello: "Cabello",
  fragancias: "Fragancias",
  otros: "Otros",
};

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/* ---------- Utilidades ---------- */

// Pasa a minúsculas y quita tildes: "Niños" -> "ninos", "Maquillaje" -> "maquillaje"
function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function escaparHTML(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function etiqueta(valor) {
  const clave = normalizar(valor);
  return ETIQUETAS[clave] || valor;
}

function enlaceWhatsApp(mensaje) {
  const numero = CONFIG.whatsapp.replace(/\D/g, "");
  const texto = encodeURIComponent(mensaje);
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

const ICONO_WHATSAPP = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>`;

/* ---------- Menú hamburguesa ---------- */
function iniciarMenu() {
  const boton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu-principal");
  if (!boton || !nav) return;

  const cerrar = () => {
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("abierto");
  };

  boton.addEventListener("click", () => {
    const abierto = boton.getAttribute("aria-expanded") === "true";
    boton.setAttribute("aria-expanded", String(!abierto));
    boton.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
    nav.classList.toggle("abierto", !abierto);
  });

  // Cierra con Escape y al elegir un enlace
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("abierto")) {
      cerrar();
      boton.focus();
    }
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) cerrar();
  });
}

/* ---------- Enlaces de WhatsApp estáticos (contacto, footer, flotante) ---------- */
function iniciarEnlacesWhatsApp() {
  document.querySelectorAll("[data-whatsapp]").forEach((enlace) => {
    const mensaje = enlace.dataset.mensaje || "¡Hola! Quiero más información sobre sus productos.";
    enlace.href = enlaceWhatsApp(mensaje);
    enlace.target = "_blank";
    enlace.rel = "noopener";
  });
}

/* ---------- Productos ---------- */
async function cargarProductos() {
  const respuesta = await fetch(CONFIG.rutaProductos, { cache: "no-cache" });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  // Acepta tanto un arreglo como { "productos": [...] }
  return Array.isArray(datos) ? datos : datos.productos || [];
}

function tarjetaProducto(p) {
  const precio = formatoCOP.format(Number(p.precio) || 0);
  const etiquetas = [p.genero, p.subcategoria].filter(Boolean).map(etiqueta).join(" · ");
  const mensaje = `¡Hola! Me interesa el producto "${p.nombre}" (${precio}) que vi en la página web. ¿Está disponible?`;
  const alt = p.alt || `${p.nombre}. ${p.descripcion || ""}`.trim();

  return `
    <li class="producto">
      <div class="producto-imagen">
        <img src="${escaparHTML(p.imagen || CONFIG.imagenRespaldo)}" alt="${escaparHTML(alt)}"
             loading="lazy" width="600" height="600">
      </div>
      <div class="producto-info">
        ${etiquetas ? `<span class="producto-etiqueta">${escaparHTML(etiquetas)}</span>` : ""}
        <h3>${escaparHTML(p.nombre)}</h3>
        <p class="producto-descripcion">${escaparHTML(p.descripcion)}</p>
        <p class="producto-precio">${precio}</p>
        <a class="btn btn-whatsapp" href="${escaparHTML(enlaceWhatsApp(mensaje))}" target="_blank" rel="noopener"
           aria-label="Pedir ${escaparHTML(p.nombre)} por WhatsApp (se abre en una nueva pestaña)">
          ${ICONO_WHATSAPP}<span>Pedir por WhatsApp</span>
        </a>
      </div>
    </li>`;
}

function pintarProductos(contenedor, productos) {
  if (!productos.length) {
    contenedor.innerHTML = `<li class="mensaje-estado">No encontramos productos con esos filtros. Prueba con otra combinación.</li>`;
    return;
  }
  contenedor.innerHTML = productos.map(tarjetaProducto).join("");

  // Si una imagen no carga, muestra la imagen de respaldo
  contenedor.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      if (!img.src.endsWith(CONFIG.imagenRespaldo)) img.src = CONFIG.imagenRespaldo;
    }, { once: true });
  });
}

function mostrarError(contenedor) {
  const esArchivoLocal = location.protocol === "file:";
  contenedor.innerHTML = `
    <li class="mensaje-estado" role="alert">
      No pudimos cargar los productos.
      ${esArchivoLocal
        ? `<br>Estás abriendo la página como archivo local. Los navegadores bloquean la lectura de
           <code>productos.json</code> así: abre el sitio con un servidor local
           (por ejemplo <code>python -m http.server</code>) o súbelo a tu hosting.`
        : `<br>Revisa que <code>data/productos.json</code> exista y no tenga errores de formato.`}
    </li>`;
}

/* ---------- Filtros ---------- */
function iniciarCatalogo(contenedor, productos) {
  const conteo = document.getElementById("resultado-conteo");
  const grupos = document.querySelectorAll("[data-filtro]");
  const filtros = {}; // ej: { genero: "mujer", subcategoria: "casual" }

  // Filtros iniciales desde la URL: ropa.html?genero=mujer&subcategoria=deportiva
  const params = new URLSearchParams(location.search);

  grupos.forEach((grupo) => {
    const campo = grupo.dataset.filtro;
    const desdeURL = normalizar(params.get(campo));
    const chipURL = desdeURL && grupo.querySelector(`[data-valor="${CSS.escape(desdeURL)}"]`);
    filtros[campo] = chipURL ? desdeURL : "todos";
    marcarChip(grupo, filtros[campo]);

    grupo.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-valor]");
      if (!chip) return;
      filtros[campo] = chip.dataset.valor;
      marcarChip(grupo, filtros[campo]);
      aplicar();
    });
  });

  function marcarChip(grupo, valor) {
    grupo.querySelectorAll("[data-valor]").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.valor === valor));
    });
  }

  function aplicar() {
    const visibles = productos.filter((p) =>
      Object.entries(filtros).every(([campo, valor]) => {
        if (valor === "todos") return true;
        const valorProducto = normalizar(p[campo]);
        // Un producto "unisex" aparece en Hombre y en Mujer
        if (campo === "genero" && valorProducto === "unisex") return valor !== "ninos";
        return valorProducto === valor;
      })
    );
    pintarProductos(contenedor, visibles);
    if (conteo) {
      conteo.textContent = `${visibles.length} ${visibles.length === 1 ? "producto" : "productos"}`;
    }
  }

  aplicar();
}

async function iniciarProductos() {
  const contenedor = document.querySelector("[data-productos]");
  if (!contenedor) return;

  try {
    const todos = await cargarProductos();
    const categoria = normalizar(contenedor.dataset.categoria);

    if (contenedor.hasAttribute("data-destacados")) {
      // Inicio: productos marcados como destacados (máximo 8)
      const limite = Number(contenedor.dataset.limite) || 8;
      pintarProductos(contenedor, todos.filter((p) => p.destacado).slice(0, limite));
    } else {
      const deCategoria = todos.filter((p) => normalizar(p.categoria) === categoria);
      iniciarCatalogo(contenedor, deCategoria);
    }
  } catch (error) {
    console.error("Error cargando productos:", error);
    mostrarError(contenedor);
  } finally {
    contenedor.setAttribute("aria-busy", "false");
  }
}

/* ---------- Inicio ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarEnlacesWhatsApp();
  iniciarProductos();
  document.querySelectorAll("[data-anio]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  if (CONFIG.whatsapp.replace(/\D/g, "").length < 10) {
    console.warn("Configura tu número en CONFIG.whatsapp (js/main.js).");
  }
});
