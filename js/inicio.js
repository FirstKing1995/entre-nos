/* Entre Nós — página inicial: abrir mesa, entrar com código e o baralho de amostra */
(function () {
  document.documentElement.classList.remove('sem-js');

  var nomeSalvo = Identidade.ultimoNome();
  document.querySelectorAll('input[name="nome"]').forEach(function (i) { if (nomeSalvo) i.value = nomeSalvo; });

  /* convite por link antigo (?sala=XXXXX) vai direto para a mesa */
  var q = new URLSearchParams(location.search);
  if (q.get('sala')) { location.replace('jogo.html?sala=' + encodeURIComponent(Api.normaliza(q.get('sala')))); return; }

  function ocupado(form, sim, texto) {
    var b = form.querySelector('button[type="submit"]');
    if (!b.dataset.txt) b.dataset.txt = b.textContent;
    b.disabled = sim;
    b.textContent = sim ? texto : b.dataset.txt;
  }

  var fCriar = document.getElementById('form-criar');
  fCriar.addEventListener('submit', function (e) {
    e.preventDefault();
    var erro = document.getElementById('erro-criar');
    var d = new FormData(fCriar);
    var nome = Logica.limpa(d.get('nome'), 20);
    if (nome.length < 2) { erro.textContent = 'Escreva seu nome para a mesa saber quem é você.'; fCriar.nome.focus(); return; }
    erro.textContent = '';
    ocupado(fCriar, true, 'Abrindo a mesa...');
    Api.chamar('criar', { nome: nome, cap: d.get('cap'), modo: d.get('modo') })
      .then(function (r) {
        Identidade.gravar(r.cod, { pid: r.pid, tok: r.tok, nome: nome });
        location.href = 'jogo.html?sala=' + r.cod;
      })
      .catch(function (err) { erro.textContent = err.message; ocupado(fCriar, false); });
  });

  var fEntrar = document.getElementById('form-entrar');
  fEntrar.addEventListener('submit', function (e) {
    e.preventDefault();
    var erro = document.getElementById('erro-entrar');
    var cod = Api.normaliza(fEntrar.cod.value);
    var nome = Logica.limpa(fEntrar.nome.value, 20);
    if (cod.length !== 5) { erro.textContent = 'O código tem cinco letras ou números.'; fEntrar.cod.focus(); return; }
    if (nome.length < 2) { erro.textContent = 'Escreva seu nome para a mesa saber quem é você.'; fEntrar.nome.focus(); return; }
    erro.textContent = '';
    ocupado(fEntrar, true, 'Procurando a mesa...');
    var eu = Identidade.ler(cod) || {};
    Api.chamar('entrar', { cod: cod, nome: nome, pid: eu.pid, tok: eu.tok })
      .then(function (r) {
        Identidade.gravar(r.cod, { pid: r.pid, tok: r.tok, nome: nome });
        location.href = 'jogo.html?sala=' + r.cod;
      })
      .catch(function (err) { erro.textContent = err.message; ocupado(fEntrar, false); });
  });

  /* ---------- baralho de amostra ---------- */
  var placa = document.getElementById('placa');
  var lista = document.getElementById('lista-macos');
  var baralho = document.body.dataset.baralho || 'classico';
  var macos = CATEGORIAS.filter(function (c) { return (c.baralho || 'classico') === baralho; });
  var atual = macos[0].id, ultima = 0;

  macos.forEach(function (c) {
    var n = CARTAS.filter(function (x) { return x.cat === c.id; }).length;
    var li = document.createElement('li');
    li.innerHTML = '<button type="button" data-cat="' + c.id + '" aria-pressed="false">' +
      '<span>' + esc(c.nome) + '</span><small>' + n + ' cartas</small></button>';
    lista.appendChild(li);
  });

  function tirarAmostra(cat) {
    atual = cat;
    var maco = CARTAS.filter(function (x) { return x.cat === cat && x.id !== ultima; });
    var c = maco[Math.floor(Math.random() * maco.length)];
    ultima = c.id;
    placa.innerHTML = cartaHTML(c.id, { virada: true });
    var el = placa.firstChild;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('virada'); }); });
    if (picante() && tirarAmostra.ja) setTimeout(function () { explodir(el, [categoria(cat).simbolo, 'coracao'], 10); }, 450);
    tirarAmostra.ja = true;
    lista.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.cat) === cat));
    });
  }

  lista.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-cat]');
    if (b) tirarAmostra(Number(b.dataset.cat));
  });
  /* apontar para um maço mostra uma carta dele (no toque, o clique faz o mesmo) */
  var tHover;
  lista.addEventListener('mouseover', function (e) {
    var b = e.target.closest('button[data-cat]');
    if (!b || Number(b.dataset.cat) === atual) return;
    clearTimeout(tHover);
    tHover = setTimeout(function () { tirarAmostra(Number(b.dataset.cat)); }, 140);
  });
  lista.addEventListener('mouseleave', function () { clearTimeout(tHover); });
  document.getElementById('outra').addEventListener('click', function () { tirarAmostra(atual); });

  document.querySelectorAll('.pasta[data-cat]').forEach(function (p) {
    p.addEventListener('click', function () { tirarAmostra(Number(p.dataset.cat)); });
  });

  tirarAmostra(atual);
  animarEntradas();
})();
