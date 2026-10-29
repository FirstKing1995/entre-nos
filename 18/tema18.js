/* Entre Nós Sem Filtro — portão de idade e o céu de símbolos ao fundo */
(function () {
  /* <i data-ico="fogo"></i> vira o desenho do ícone */
  document.querySelectorAll('[data-ico]').forEach(function (el) {
    el.outerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[el.dataset.ico] || '') + '</svg>';
  });

  var ok = false;
  try { ok = localStorage.getItem('en_18ok') === '1'; } catch (e) {}

  if (!ok) {
    var p = document.createElement('div');
    p.className = 'portao';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-modal', 'true');
    p.setAttribute('aria-labelledby', 'portao-t');
    p.innerHTML = '<div class="caixa"><div class="grande">+18</div>' +
      '<h2 id="portao-t">Só para maiores de 18</h2>' +
      '<p>Este baralho tem perguntas sexuais diretas sobre desejo, sexo e relações não monogâmicas. Entre só se você tem 18 anos ou mais e está a fim desse papo.</p>' +
      '<div class="acoes"><button class="btn" type="button" id="portao-sim">Tenho 18 anos ou mais</button>' +
      '<a href="../">Prefiro a versão clássica</a></div></div>';
    document.body.appendChild(p);
    document.documentElement.style.overflow = 'hidden';
    var sim = document.getElementById('portao-sim');
    sim.focus();
    sim.addEventListener('click', function () {
      try { localStorage.setItem('en_18ok', '1'); } catch (e) {}
      document.documentElement.style.overflow = '';
      p.remove();
    });
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var nomes = ['coracao', 'fogo', 'brilho', 'coracao', 'cereja'];
  var cores = ['#ff5f8a', '#ff8a3d', '#ffb84d', '#9b6bff', '#ff86a6'];
  var ceu = document.createElement('div');
  ceu.className = 'ceu';
  ceu.setAttribute('aria-hidden', 'true');
  var n = innerWidth < 720 ? 9 : 16;
  for (var i = 0; i < n; i++) {
    var s = document.createElement('span');
    s.style.left = Math.round(Math.random() * 96) + '%';
    s.style.setProperty('--t', Math.round(14 + Math.random() * 22) + 'px');
    s.style.setProperty('--c', cores[i % cores.length]);
    s.style.setProperty('--dur', Math.round(16 + Math.random() * 16) + 's');
    s.style.setProperty('--atraso', '-' + Math.round(Math.random() * 30) + 's');
    s.style.setProperty('--x', Math.round(Math.random() * 80 - 40) + 'px');
    s.innerHTML = '<svg viewBox="0 0 24 24">' + ICONES[nomes[i % nomes.length]] + '</svg>';
    ceu.appendChild(s);
  }
  document.body.prepend(ceu);
})();
