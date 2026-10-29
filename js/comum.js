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
  baralho: '<rect width="12" height="16" x="8" y="5" rx="1"/><path d="M4 17V4a1 1 0 0 1 1-1h10"/>',
  coracao: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  fogo: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  brilho: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  cereja: '<path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12"/><path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z"/>',
  infinito: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
  cadeado: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  dado: '<rect width="18" height="18" x="3" y="3" rx="3" ry="3"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>',
  risada: '<circle cx="12" cy="12" r="10"/><path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  uau: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="15.5" r="2.2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
  escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  olhoFechado: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'
};

var REACAO_NOME = { coracao: 'mandou amor', fogo: 'achou quente', risada: 'riu', uau: 'ficou de boca aberta' };

function picante() { return document.body && document.body.dataset.baralho === 'picante'; }

/* Uma chuva de símbolos saindo do centro de um elemento (cartas viradas, reações) */
function explodir(el, nomes, qtd) {
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var r = el.getBoundingClientRect();
  var box = document.createElement('div');
  box.className = 'estouro';
  box.setAttribute('aria-hidden', 'true');
  box.style.left = (r.left + r.width / 2) + 'px';
  box.style.top = (r.top + r.height / 2) + 'px';
  qtd = qtd || 14;
  for (var i = 0; i < qtd; i++) {
    var a = (Math.PI * 2 * i) / qtd + Math.random() * 0.5;
    var d = 70 + Math.random() * 110;
    var s = document.createElement('span');
    s.style.setProperty('--dx', Math.round(Math.cos(a) * d) + 'px');
    s.style.setProperty('--dy', Math.round(Math.sin(a) * d - 40) + 'px');
    s.style.setProperty('--rot', Math.round(Math.random() * 120 - 60) + 'deg');
    s.style.setProperty('--tam', (14 + Math.random() * 16) + 'px');
    s.style.animationDelay = Math.round(Math.random() * 120) + 'ms';
    var nome = nomes[i % nomes.length];
    s.className = 'faisca f-' + nome;
    s.innerHTML = '<svg viewBox="0 0 24 24">' + ICONES[nome] + '</svg>';
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(function () { box.remove(); }, 1600);
}

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
  if (picante()) {
    var cor = '';
    for (var yy = 0; yy < 6; yy++) for (var xx = 0; xx < 4; xx++) {
      if ((xx + yy) % 2) continue;
      cor += '<path transform="translate(' + (22 + xx * 48) + ' ' + (22 + yy * 46) + ') scale(.55)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>';
    }
    return '<svg class="verso-arte" viewBox="0 0 200 280" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect width="200" height="280" fill="#ff5f8a"/>' +
      '<rect x="10" y="10" width="180" height="260" rx="16" fill="#e2264d"/>' +
      '<g fill="#ff8fb0" opacity=".55">' + cor + '</g>' +
      '<circle cx="100" cy="140" r="46" fill="#fff1f4"/>' +
      '<text x="100" y="156" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="40" fill="#e2264d">+18</text>' +
      '</svg>';
  }
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
  if (cat.simbolo) corpo += '<span class="simbolo" aria-hidden="true"><svg viewBox="0 0 24 24">' + ICONES[cat.simbolo] + '</svg></span>';
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
