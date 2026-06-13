// Abre o cierra el menú hamburguesa
function abrirMenu() {
  const menu    = document.getElementById('menu');
  const overlay = document.getElementById('overlay');
  const estaAbierto = menu.classList.contains('abierto');

  const todosHamburgers = document.querySelectorAll('.hamburger');

  const hayDetalleAbierto = document.querySelector('.detalle-overlay.abierto');
  menu.style.zIndex    = hayDetalleAbierto ? '1700' : '';
  overlay.style.zIndex = hayDetalleAbierto ? '1600' : '';

  if (estaAbierto) {
    menu.classList.remove('abierto');
    overlay.classList.remove('abierto');
    todosHamburgers.forEach(h => h.classList.remove('abierto'));
  } else {
    menu.classList.add('abierto');
    overlay.classList.add('abierto');
    todosHamburgers.forEach(h => h.classList.add('abierto'));
  }
}

// Cierra el menú al hacer clic afuera
function cerrarMenu() {
  const menu    = document.getElementById('menu');
  const overlay = document.getElementById('overlay');
  menu.classList.remove('abierto');
  overlay.classList.remove('abierto');
  menu.style.zIndex    = '';
  overlay.style.zIndex = '';
  document.querySelectorAll('.hamburger').forEach(h => h.classList.remove('abierto'));
}

// Navega a la sección de Inicio desde cualquier navbar
function irAInicio() {
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d => d.classList.remove('abierto'));
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s => s.classList.remove('abierto'));
  document.body.style.overflow = '';
  cerrarMenu();

  const btnInicio = document.querySelector('.sec-btn[onclick*="inicio"]');
  if (btnInicio) {
    document.querySelectorAll('.sec-btn').forEach(btn => btn.classList.remove('activo'));
    btnInicio.classList.add('activo');
  }
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('activo'));
  const panelInicio = document.getElementById('inicio');
  if (panelInicio) panelInicio.classList.add('activo');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cambia la sección activa (barra verde)
function cambiarSeccion(botonClickeado, idSeccion) {
  document.querySelectorAll('.sec-btn').forEach(btn => btn.classList.remove('activo'));
  botonClickeado.classList.add('activo');
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('activo'));
  const panel = document.getElementById(idSeccion);
  panel.classList.add('activo');

  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

// ══════════════════════════════════════════════════════════
// SECCIONES DEL MENÚ: Mitos, Artesanías, Festividades, Curiosidades
// ══════════════════════════════════════════════════════════
function abrirSeccionMenu(id) {
  cerrarMenu();
  const sec = document.getElementById('seccion-' + id);
  if (!sec) return;
  sec.classList.add('abierto');
  document.body.style.overflow = 'hidden';
  sec.scrollTop = 0;
}

function cerrarSeccionMenu(id) {
  const sec = document.getElementById('seccion-' + id);
  if (!sec) return;
  sec.classList.remove('abierto');
  document.body.style.overflow = '';
}

const _origenDetalle = {};

// Abre la página de detalle
function abrirDetalle(id) {
  // Registrar desde qué seccion-overlay se abrió (para volverAtras)
  const seccionAbierta = document.querySelector('.seccion-overlay.abierto');
  _origenDetalle[id] = seccionAbierta ? seccionAbierta.id.replace('seccion-', '') : null;

  // Mover el detalle al <body> si está dentro de un seccion-overlay,
  // porque transform en el padre atrapa los position:fixed
  const detalle = document.getElementById('detalle-' + id);
  if (!detalle) return;

  if (detalle.closest('.seccion-overlay')) {
    document.body.appendChild(detalle);
  }

  // Cerrar TODOS los detalle-overlays abiertos (evita que queden tapando el nuevo)
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d => d.classList.remove('abierto'));

  // Cerrar secciones de menú antes de abrir el detalle
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s => s.classList.remove('abierto'));

  // Inyectar navbar dentro del detalle si no existe aún
  if (!detalle.querySelector('.detalle-navbar')) {
    const nav = document.createElement('div');
    nav.className = 'detalle-navbar';
    nav.innerHTML = `
      <div class="logo-wrap" onclick="irAInicio()" style="cursor:pointer;" title="Ir a Inicio">
        <div class="logo-caja">
          <img src="Imagenes/Escudo Salazar De Las Palmas.png" style="width:30px;height:auto;border-radius:5px;" alt="Escudo">
        </div>
        <div>
          <strong>Salazar de las Palmas</strong>
          <span>Norte de Santander · Colombia</span>
        </div>
      </div>
      <button class="detalle-navbar-x" onclick="cerrarDetalleActivo()" title="Cerrar" aria-label="Cerrar">✕</button>`;
    detalle.insertBefore(nav, detalle.firstChild);
  }

  detalle.classList.add('abierto');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  // Ocultar/mostrar detalle-navbar al hacer scroll dentro del detalle
  const detalleNav = detalle.querySelector('.detalle-navbar');
  if (detalleNav && !detalle._scrollListener) {
    let ultimoScrollDetalle = 0;
    detalle._scrollListener = () => {
      const s = detalle.scrollTop;
      if (s > ultimoScrollDetalle && s > 80) {
        detalleNav.classList.add('navbar-oculto');
      } else {
        detalleNav.classList.remove('navbar-oculto');
      }
      ultimoScrollDetalle = s <= 0 ? 0 : s;
    };
    detalle.addEventListener('scroll', detalle._scrollListener, { passive: true });
  }
}

// Cierra la página de detalle
function cerrarDetalle(id) {
  document.getElementById('detalle-' + id).classList.remove('abierto');
  document.body.style.overflow = '';
}

// Cierra el detalle y vuelve a la ventana anterior
function volverAtras(id) {
  const detalle = document.getElementById('detalle-' + id);
  if (detalle) detalle.classList.remove('abierto');

  const origen = _origenDetalle[id];
  if (origen) {
    const sec = document.getElementById('seccion-' + origen);
    if (sec) {
      sec.classList.add('abierto');
      document.body.style.overflow = 'hidden';
      return;
    }
  }
  document.body.style.overflow = '';
}

// Cierra cualquier detalle que esté abierto actualmente
function cerrarDetalleActivo() {
  document.querySelectorAll('.detalle-overlay.abierto').forEach(detalle => {
    detalle.classList.remove('abierto');
  });
  document.body.style.overflow = '';
}

// Abre o cierra un acordeón de historia
function toggleAcordeon(id) {
  const acordeon = document.getElementById('acordeon-' + id);
  const yaAbierto = acordeon.classList.contains('abierto');
  document.querySelectorAll('.acordeon.abierto').forEach(a => a.classList.remove('abierto'));
  if (!yaAbierto) {
    acordeon.classList.add('abierto');
    setTimeout(() => {
      acordeon.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
}

// ══════════════════════════════════════════════════════════
// ANIMACIONES DE SCROLL — REVEAL
// ══════════════════════════════════════════════════════════
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      e.target.querySelectorAll('.si-count:not(.counted)').forEach(animarContador);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.13 });

  document.querySelectorAll('.reveal-sec, .reveal-card').forEach(el => obs.observe(el));
}

// ══════════════════════════════════
// CONTADORES ANIMADOS 0 → target
// ══════════════════════════════════
function animarContador(el) {
  el.classList.add('counted');
  const target = parseInt(el.dataset.target, 10);
  const dur = 1100;
  const t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target).toLocaleString('es-CO');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('es-CO');
  }
  requestAnimationFrame(step);
}

// ══════════════════════════════════════════════════════════
// CLIMA
// ══════════════════════════════════════════════════════════
async function cargarClimaVisual() {
  const lat = 7.7736, lon = -72.8122;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=America%2FBogota`;
  const descs = {
    0:'Despejado',1:'Principalmente despejado',2:'Parcialmente nublado',3:'Nublado',
    45:'Niebla',48:'Niebla con escarcha',51:'Llovizna ligera',53:'Llovizna moderada',
    55:'Llovizna densa',61:'Lluvia leve',63:'Lluvia moderada',65:'Lluvia fuerte',
    71:'Nieve leve',73:'Nieve moderada',75:'Nieve fuerte',80:'Aguacero leve',
    81:'Aguacero moderado',82:'Aguacero violento',95:'Tormenta',96:'Tormenta con granizo',99:'Tormenta severa'
  };
  try {
    const r = await fetch(url);
    const d = await r.json();
    const c = d.current;
    const desc = descs[c.weather_code] ?? 'Condición desconocida';
    const t  = document.getElementById('clima-titulo-vis');
    const tv = document.getElementById('clima-temp-vis');
    const hv = document.getElementById('clima-hum-vis');
    const wv = document.getElementById('clima-viento-vis');
    const tb = document.getElementById('clima-temp-badge');
    if (t)  t.textContent  = desc;
    if (tv) tv.textContent = `${Math.round(c.temperature_2m)}°C`;
    if (hv) hv.textContent = `${c.relative_humidity_2m}%`;
    if (wv) wv.textContent = `${Math.round(c.wind_speed_10m)} km/h`;
    if (tb) tb.textContent = `${Math.round(c.temperature_2m)}°C`;
  } catch(e) {
    const t = document.getElementById('clima-titulo-vis');
    if (t) t.textContent = 'No disponible';
  }
}

// ══════════════════════════════════════════════════════════
// NAVBAR: ocultar al bajar, mostrar al subir
// ══════════════════════════════════════════════════════════
function initNavbarScroll() {
  let ultimoScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollActual = window.scrollY;
      const navbar = document.getElementById('navbar-global');

      if (navbar) {
        if (scrollActual > ultimoScroll && scrollActual > 80) {
          navbar.classList.add('navbar-oculto');
        } else {
          navbar.classList.remove('navbar-oculto');
        }
      }

      ultimoScroll = scrollActual <= 0 ? 0 : scrollActual;
      ticking = false;
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  cargarClimaVisual();
  initNavbarScroll();
});
function irANoticias() {
  if(typeof cerrarMenu==='function') cerrarMenu();
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s=>s.classList.remove('abierto'));
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d=>d.classList.remove('abierto'));
  document.body.style.overflow='';
  const btn=document.querySelector('.sec-btn[onclick*="noticias"]');
  if(btn){document.querySelectorAll('.sec-btn').forEach(b=>b.classList.remove('activo'));btn.classList.add('activo');}
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('activo'));
  const panel=document.getElementById('noticias');
  if(panel){panel.classList.add('activo');setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}),50);}
}
// Abre el detalle de turismo desde la sección de Sitios Turísticos (puente Historia → Turismo)
function abrirTurismoDesdeHistoria(turismoId) {
  const detalle = document.getElementById('detalle-' + turismoId);
  if (!detalle) return;

  // Si el detalle ya está abierto, no hacer nada (el clic fue desde dentro del mismo overlay)
  if (detalle.classList.contains('abierto')) return;

  // Cerrar cualquier detalle abierto
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d => d.classList.remove('abierto'));
  // Cerrar seccion-overlay abierta (para que no atrape el position:fixed del detalle)
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s => s.classList.remove('abierto'));

  // Registrar origen como turismo
  _origenDetalle[turismoId] = 'turismo';

  // Mover el detalle al <body> si está dentro de un seccion-overlay,
  // porque transform en el padre atrapa los position:fixed
  if (detalle.closest('.seccion-overlay')) {
    document.body.appendChild(detalle);
  }

  // Inyectar navbar si no existe
  if (!detalle.querySelector('.detalle-navbar')) {
    const nav = document.createElement('div');
    nav.className = 'detalle-navbar';
    nav.innerHTML = `
      <div class="logo-wrap" onclick="irAInicio()" style="cursor:pointer;" title="Ir a Inicio">
        <div class="logo-caja">
          <img src="Imagenes/Escudo Salazar De Las Palmas.png" style="width:30px;height:auto;border-radius:5px;" alt="Escudo">
        </div>
        <div>
          <strong>Salazar de las Palmas</strong>
          <span>Norte de Santander · Colombia</span>
        </div>
      </div>
      <button class="detalle-navbar-x" onclick="cerrarDetalleActivo()" title="Cerrar" aria-label="Cerrar">✕</button>`;
    detalle.insertBefore(nav, detalle.firstChild);
  }

  detalle.classList.add('abierto');
  detalle.scrollTop = 0;
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  // Ocultar/mostrar detalle-navbar al hacer scroll dentro del detalle
  const detalleNav = detalle.querySelector('.detalle-navbar');
  if (detalleNav && !detalle._scrollListener) {
    let ultimoScrollDetalle = 0;
    detalle._scrollListener = () => {
      const s = detalle.scrollTop;
      if (s > ultimoScrollDetalle && s > 80) {
        detalleNav.classList.add('navbar-oculto');
      } else {
        detalleNav.classList.remove('navbar-oculto');
      }
      ultimoScrollDetalle = s <= 0 ? 0 : s;
    };
    detalle.addEventListener('scroll', detalle._scrollListener, { passive: true });
  }
}

// Navega a cualquier panel por id (usado desde footer y otros enlaces)
function irASeccion(idSeccion) {
  if (typeof cerrarMenu === 'function') cerrarMenu();
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s => s.classList.remove('abierto'));
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d => d.classList.remove('abierto'));
  document.body.style.overflow = '';
  const btn = document.querySelector('.sec-btn[onclick*="' + idSeccion + '"]');
  if (btn) {
    document.querySelectorAll('.sec-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
  }
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('activo'));
  const panel = document.getElementById(idSeccion);
  if (panel) {
    panel.classList.add('activo');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
}

// Abre la sección Turismo (overlay)
function irATurismo() {
  if (typeof cerrarMenu === 'function') cerrarMenu();
  document.querySelectorAll('.seccion-overlay.abierto').forEach(s => s.classList.remove('abierto'));
  document.querySelectorAll('.detalle-overlay.abierto').forEach(d => d.classList.remove('abierto'));
  document.body.style.overflow = 'hidden';
  const sec = document.getElementById('seccion-turismo');
  if (sec) {
    sec.classList.add('abierto');
    sec.scrollTop = 0;
  }
}



let _lightboxGaleria = null;
let _lightboxIndex   = 0;

function abrirLightboxTurismo(galeriaId, index) {
  _lightboxGaleria = galeriaId;
  _lightboxIndex   = index;
  _mostrarFotoLightbox();
  const lb = document.getElementById('turismo-lightbox');
  // Mover el lightbox al body para que no quede atrapado en overflow:hidden del detalle-overlay
  if (lb.parentElement !== document.body) {
    document.body.appendChild(lb);
  }
  lb.classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function _mostrarFotoLightbox() {
  const galeria = document.getElementById(_lightboxGaleria);
  if (!galeria) return;
  const items = galeria.querySelectorAll('.turismo-galeria-item');
  if (!items.length) return;
  _lightboxIndex = ((_lightboxIndex % items.length) + items.length) % items.length;
  const item    = items[_lightboxIndex];
  const img     = item.querySelector('img');
  const caption = item.querySelector('.turismo-galeria-caption span');
  const lbImg   = document.getElementById('turismo-lightbox-img');
  const lbCap   = document.getElementById('turismo-lightbox-caption');
  const lbCount = document.getElementById('turismo-lightbox-counter');
  if (lbImg) { lbImg.src = img ? img.src : ''; lbImg.alt = img ? img.alt : ''; }
  if (lbCap) lbCap.textContent = caption ? caption.textContent : '';
  if (lbCount) lbCount.textContent = `${_lightboxIndex + 1} / ${items.length}`;
}

function navLightboxTurismo(dir) {
  _lightboxIndex += dir;
  _mostrarFotoLightbox();
  // animación rápida
  const lbImg = document.getElementById('turismo-lightbox-img');
  if (lbImg) {
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = 'turismo-zoom-in .22s cubic-bezier(.22,.68,0,1.2)';
  }
}

function cerrarLightboxTurismo(e, forzar) {
  if (!forzar && e && e.target !== document.getElementById('turismo-lightbox')) return;
  document.getElementById('turismo-lightbox').classList.remove('abierto');
  document.body.style.overflow = '';
}

// Navegar entre detalles de turismo desde las sugerencias
function abrirDetalleTurismo(idNuevo, idActual) {
  const actual = document.getElementById('detalle-' + idActual);
  if (actual) actual.classList.remove('abierto');
  // Registrar que el origen es la sección turismo para volverAtras
  _origenDetalle[idNuevo] = 'turismo';
  const nuevo = document.getElementById('detalle-' + idNuevo);
  if (!nuevo) return;
  // Inyectar navbar si no existe
  if (!nuevo.querySelector('.detalle-navbar')) {
    const nav = document.createElement('div');
    nav.className = 'detalle-navbar';
    nav.innerHTML = `
      <div class="logo-wrap" onclick="irAInicio()" style="cursor:pointer;" title="Ir a Inicio">
        <div class="logo-caja">
          <img src="Imagenes/Escudo Salazar De Las Palmas.png" style="width:30px;height:auto;border-radius:5px;" alt="Escudo">
        </div>
        <div>
          <strong>Salazar de las Palmas</strong>
          <span>Norte de Santander · Colombia</span>
        </div>
      </div>
      <button class="detalle-navbar-x" onclick="cerrarDetalleActivo()" title="Cerrar" aria-label="Cerrar">✕</button>`;
    nuevo.insertBefore(nav, nuevo.firstChild);
  }
  nuevo.classList.add('abierto');
  nuevo.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

// Teclado: flechas y Escape para el lightbox turismo
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('turismo-lightbox');
  if (!lb || !lb.classList.contains('abierto')) return;
  if (e.key === 'ArrowRight') navLightboxTurismo(1);
  if (e.key === 'ArrowLeft')  navLightboxTurismo(-1);
  if (e.key === 'Escape')     cerrarLightboxTurismo(null, true);
});