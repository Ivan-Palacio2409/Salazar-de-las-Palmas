
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
