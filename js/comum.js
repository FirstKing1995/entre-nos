/* Entre Nós — peças usadas em todas as telas */
var ICONES = {
  enviar: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  trocar: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  passar: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
  ok: '<path d="M20 6 9 17l-5-5"/>',
  copiar: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  coroa: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  pessoas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  jogar: '<polygon points="6 3 20 12 6 21 6 3"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  conversa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  baralho: '<rect width="12" height="16" x="8" y="5" rx="1"/><path d="M4 17V4a1 1 0 0 1 1-1h10"/>'
};

function icone(nome, rotulo) {
  return '<svg class="ico" viewBox="0 0 24 24" ' + (rotulo ? 'role="img" aria-label="' + rotulo + '"' : 'aria-hidden="true"') + '>' + ICONES[nome] + '</svg>';
}

function esc(t) {
  return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function categoria(id) {
  for (var i = 0; i < CATEGORIAS.length; i++) if (CATEGORIAS[i].id === id) return CATEGORIAS[i];
  return CATEGORIAS[0];
}

function carta(id) {
  for (var i = 0; i < CARTAS.length; i++) if (CARTAS[i].id === id) return CARTAS[i];
  return null;
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }

/* O verso: campo oliva, moldura cheia e o monograma */
function versoSVG() {
  var pontos = '';
  for (var y = 0; y < 7; y++) for (var x = 0; x < 5; x++) {
    if ((x + y) % 2) continue;
    pontos += '<circle cx="' + (34 + x * 33) + '" cy="' + (40 + y * 32) + '" r="2.4"/>';
  }
  return '<svg class="verso-arte" viewBox="0 0 200 280" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect width="200" height="280" fill="#525e1b"/>' +
    '<rect x="12" y="12" width="176" height="256" fill="#46511a"/>' +
    '<g fill="#c79a3e" opacity=".55">' + pontos + '</g>' +
    '<rect x="52" y="96" width="96" height="88" fill="#efe7d2"/>' +
    '<text x="100" y="152" text-anchor="middle" font-family="Bodoni Moda, Georgia, serif" font-size="40" font-style="italic" fill="#525e1b">EN</text>' +
    '<text x="100" y="250" text-anchor="middle" font-family="Jost, sans-serif" font-size="11" letter-spacing="1" fill="#efe7d2">ENTRE NÓS</text>' +
    '</svg>';
}

/* A frente da carta. op.virada = começa de costas (para girar depois). */
function cartaHTML(id, op) {
  op = op || {};
  var c = carta(id);
  if (!c) return '';
  var cat = categoria(c.cat);
  var corpo = '';
  if (c.titulo) {
    corpo = '<p class="titulo">' + esc(c.titulo) + '</p><p class="perg instrucao">' + esc(c.txt) + '</p>';
  } else {
    corpo = '<p class="perg' + (c.txt.length > 80 ? ' longa' : '') + '">' + esc(c.txt) + '</p>';
  }
  if (c.todos) corpo += '<span class="todos">Todos respondem</span>';
  return '<div class="carta ' + (op.virada ? 'virada' : 'so-frente') + ' ' + (op.classe || '') + '" style="--cat:' + cat.cor + '" role="img" aria-label="Carta ' + c.id + ', ' + esc(cat.nome) + ': ' + esc((c.titulo ? c.titulo + '. ' : '') + c.txt) + '">' +
    '<div class="giro">' +
      '<div class="face"><div class="cab"><span>' + esc(cat.nome) + '</span><span>Nº ' + pad2(c.id) + '</span></div>' + corpo +
        '<div class="pe"><span>Entre Nós</span><span>' + esc(cat.sub) + '</span></div></div>' +
      '<div class="verso">' + versoSVG() + '</div>' +
    '</div></div>';
}

var _toastT;
function toast(msg, erro) {
  var el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.toggle('erro', !!erro);
  el.classList.add('on');
  clearTimeout(_toastT);
  _toastT = setTimeout(function () { el.classList.remove('on'); }, erro ? 4200 : 2600);
}

/* Quem eu sou em cada mesa. No modo demonstração fica só nesta aba, para testar várias pessoas no mesmo navegador. */
var Identidade = {
  chave: function (cod) { return 'en_eu_' + cod; },
  ler: function (cod) {
    try {
      var v = sessionStorage.getItem(this.chave(cod)) || (Api.remoto ? localStorage.getItem(this.chave(cod)) : null);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  },
  gravar: function (cod, eu) {
    var v = JSON.stringify(eu);
    try { sessionStorage.setItem(this.chave(cod), v); if (Api.remoto) localStorage.setItem(this.chave(cod), v); } catch (e) {}
    try { localStorage.setItem('en_nome', eu.nome || ''); } catch (e) {}
  },
  apagar: function (cod) {
    try { sessionStorage.removeItem(this.chave(cod)); localStorage.removeItem(this.chave(cod)); } catch (e) {}
  },
  ultimoNome: function () { try { return localStorage.getItem('en_nome') || ''; } catch (e) { return ''; } }
};

/* Entradas das seções ao rolar */
function animarEntradas() {
  var els = document.querySelectorAll('.revela');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('visto'); }); return; }
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
}
