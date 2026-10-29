/* Entre Nós — a mesa: saguão, leque de cartas, vez de cada um e a conversa */
(function () {
  document.querySelectorAll('button').forEach(function (b) {
    b.innerHTML = b.innerHTML.replace(/%%(\w+)%%/g, function (m, n) { return icone(n); });
  });

  var palco = document.getElementById('palco');
  var chat = document.getElementById('chat');
  var caixaMsgs = document.getElementById('mensagens');
  var form = document.getElementById('compor');
  var texto = document.getElementById('texto');
  var contador = document.getElementById('contador');
  var reacoes = document.getElementById('reacoes');

  var cod = Api.normaliza(new URLSearchParams(location.search).get('sala'));
  var eu = cod ? Identidade.ler(cod) : null;
  var vista = null;
  var seq = 0;
  var vistas = {};
  var chavePalco = '';
  var cartaMostrada = 0;
  var ocupado = false;
  var timer = null;
  var falhas = 0;

  if (!Api.remoto) document.getElementById('demo-aviso').hidden = false;
  if (cod.length !== 5) { semMesa('Este link não traz o código de uma mesa.'); return; }

  function linkConvite() { return location.origin + location.pathname + '?sala=' + cod; }

  function semMesa(msg) {
    palco.innerHTML = '<div class="entrada"><h1>Mesa não encontrada</h1><p>' + esc(msg) + '</p>' +
      '<div><a class="btn" href="./#mesa">Abrir uma mesa nova</a></div></div>';
  }

  function nomeDe(pid) {
    var j = vista && vista.jogadores.filter(function (x) { return x.id === pid; })[0];
    return j || { nome: 'Alguém', cor: '#c9b597' };
  }
  function sentado() {
    if (!eu || !vista) return false;
    var j = vista.jogadores.filter(function (x) { return x.id === eu.pid; })[0];
    return !!(j && !j.saiu);
  }
  function ativos() { return vista.jogadores.filter(function (j) { return !j.saiu; }); }
  function souAnfitriao() { return eu && vista.anfitriao === eu.pid; }
  function minhaVez() { return eu && vista.vezId === eu.pid; }

  /* ---------- conversa com o servidor ---------- */
  function agendar(ms) {
    clearTimeout(timer);
    var base = Api.remoto ? 2200 : 900;
    timer = setTimeout(puxar, ms != null ? ms : (document.hidden ? base * 3 : base));
  }

  function puxar() {
    Api.estado(cod, eu && eu.pid, seq)
      .then(function (v) { falhas = 0; aplicar(v); agendar(); })
      .catch(function (err) {
        if (!vista) { semMesa(err.message); return; }
        falhas++;
        if (falhas === 2) toast('Conexão instável. Tentando de novo...', true);
        agendar(Math.min(10000, 2000 * falhas));
      });
  }

  function acao(nome, extra) {
    if (ocupado) return Promise.resolve();
    ocupado = true;
    var dados = Object.assign({ cod: cod, pid: eu.pid, tok: eu.tok, desde: seq }, extra || {});
    return Api.chamar(nome, dados)
      .then(function (v) { aplicar(v); })
      .catch(function (err) { toast(err.message, true); chavePalco = ''; render(); throw err; })
      .finally(function () { ocupado = false; });
  }

  var meuBaralho = document.body.dataset.baralho || 'classico';

  function aplicar(v) {
    if (v.baralho && v.baralho !== meuBaralho) {
      clearTimeout(timer);
      location.replace((v.baralho === 'picante' ? '18/' : '../') + 'jogo.html?sala=' + cod);
      throw new Error('Mudando para a mesa certa...');
    }
    if (vista && v.seq < seq) return;
    vista = v;
    v.msgs.forEach(function (m) { if (!vistas[m.n]) { vistas[m.n] = 1; desenharMsg(m); } });
    seq = Math.max(seq, v.seq);
    render();
  }

  /* ---------- telas ---------- */
  function render() {
    if (!vista) return;
    var info = document.getElementById('info-sala');
    info.hidden = false;
    info.textContent = 'Mesa ' + vista.cod;
    var dentro = sentado();
    document.getElementById('acoes-barra').hidden = !dentro;
    chat.hidden = !dentro && vista.status !== 'fim';
    form.hidden = !dentro || vista.status === 'fim';
    contador.hidden = form.hidden;
    if (reacoes) reacoes.hidden = form.hidden;
    document.getElementById('chat-quem').textContent = ativos().length + (ativos().length === 1 ? ' pessoa' : ' pessoas');
    document.title = (dentro && vista.status === 'jogo' && minhaVez() ? 'Sua vez · ' : 'Mesa ' + vista.cod + ' · ') + 'Entre Nós';
    atualizarPlaceholder();

    var chave = JSON.stringify([dentro, vista.status, vista.vezId, vista.anfitriao, vista.carta, vista.monte,
      vista.jogadores.map(function (j) { return [j.id, j.saiu, j.online, j.ausente]; })]);
    if (chave === chavePalco) return;
    if (!dentro && document.getElementById('f-entrar') && vista.status !== 'fim') return;
    chavePalco = chave;

    if (!dentro) return telaEntrada();
    if (vista.status === 'espera') return telaSaguao();
    if (vista.status === 'jogo') return telaJogo();
    return telaFim();
  }

  function lugaresHTML(comVazios) {
    var h = ativos().map(function (j) {
      var cls = 'lugar' + (j.online ? ' on' : '') + (vista.status === 'jogo' && j.id === vista.vezId ? ' vez' : '');
      var tirar = souAnfitriao() && j.id !== eu.pid
        ? '<button class="tirar" type="button" data-tirar="' + j.id + '" aria-label="Tirar ' + esc(j.nome) + ' da mesa">' + icone('x') + '</button>' : '';
      return '<li class="' + cls + '" style="--c:' + j.cor + '"><span class="ini" aria-hidden="true">' + esc(j.nome.charAt(0).toUpperCase()) + '</span>' +
        '<span>' + esc(j.nome) + (j.id === (eu && eu.pid) ? ' (você)' : '') + '</span>' +
        (j.id === vista.anfitriao ? '<svg class="ico coroa" viewBox="0 0 24 24" role="img" aria-label="organiza a mesa">' + ICONES.coroa + '</svg>' : '') +
        (j.online ? '' : '<span class="oculto">fora do ar</span>') + tirar + '</li>';
    }).join('');
    if (comVazios) for (var i = ativos().length; i < vista.cap; i++) h += '<li class="lugar vazio"><span class="ini" aria-hidden="true"></span><span>Lugar livre</span></li>';
    return '<ul class="lugares" aria-label="Quem está na mesa">' + h + '</ul>';
  }

  function telaEntrada() {
    var cheia = ativos().length >= vista.cap;
    var saiu = eu && vista.jogadores.some(function (j) { return j.id === eu.pid && j.saiu; });
    if (vista.status === 'fim') return telaFim();
    palco.innerHTML =
      '<form class="entrada" id="f-entrar" novalidate>' +
        '<h1>' + (saiu ? 'Voltar para a mesa ' : 'Você foi chamado para a mesa ') + esc(vista.cod) + '</h1>' +
        '<p>' + ativos().length + ' de ' + vista.cap + ' lugares ocupados · tom ' + esc(vista.modoNome.toLowerCase()) +
        (vista.status === 'jogo' ? ' · a partida já começou' : '') + '</p>' +
        lugaresHTML(false).replace('class="lugares"', 'class="lugares" style="--surface:#e3d8bd"') +
        (cheia && !saiu ? '<p><b>Todos os lugares estão ocupados.</b> Peça para alguém sair ou abra uma mesa nova.</p><div><a class="btn" href="./#mesa">Abrir uma mesa nova</a></div>' :
        '<label class="campo"><span>Seu nome na mesa</span><input name="nome" maxlength="20" autocomplete="nickname" required value="' + esc((eu && eu.nome) || Identidade.ultimoNome()) + '"></label>' +
        '<p class="aviso-erro" id="erro-entrar" role="alert"></p>' +
        '<div><button class="btn" type="submit">Sentar à mesa</button></div>') +
      '</form>';
    var f = document.getElementById('f-entrar');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = Logica.limpa(f.nome.value, 20);
      if (nome.length < 2) { document.getElementById('erro-entrar').textContent = 'Escreva seu nome com pelo menos 2 letras.'; return; }
      var b = f.querySelector('button'); b.disabled = true; b.textContent = 'Sentando...';
      Api.chamar('entrar', { cod: cod, nome: nome, pid: eu && eu.pid, tok: eu && eu.tok })
        .then(function (r) {
          eu = { pid: r.pid, tok: r.tok, nome: nome };
          Identidade.gravar(cod, eu);
          seq = 0; vistas = {}; caixaMsgs.innerHTML = ''; chavePalco = '';
          aplicar(r.vista);
          agendar(0);
        })
        .catch(function (err) { document.getElementById('erro-entrar').textContent = err.message; b.disabled = false; b.textContent = 'Sentar à mesa'; });
    });
  }

  function telaSaguao() {
    var n = ativos().length;
    var dono = souAnfitriao();
    palco.innerHTML =
      '<h1 class="status">Esperando o grupo</h1>' +
      '<p class="status-sub">' + n + ' de ' + vista.cap + ' lugares ocupados. Tom ' + esc(vista.modoNome.toLowerCase()) + ', ' + vista.monte + ' cartas no baralho.</p>' +
      '<div class="saguao">' +
        '<div class="convite-cartao"><p class="cab">Código da mesa</p><p class="codigo-grande">' + esc(vista.cod) + '</p>' +
          '<div class="link"><label class="oculto" for="link-conv">Link de convite</label><input id="link-conv" readonly value="' + esc(linkConvite()) + '">' +
          '<button class="btn btn-peq" type="button" data-copiar>' + icone('copiar') + 'Copiar</button></div>' +
          '<p>Mande o link no grupo. Quem abrir digita um nome e senta.</p></div>' +
        '<div style="display:grid;gap:22px">' + lugaresHTML(true) +
          (dono
            ? '<div><button class="btn btn-ocre" type="button" data-acao="iniciar"' + (n < 2 ? ' disabled' : '') + '>' + icone('jogar') + 'Começar a partida</button></div>' +
              '<p class="status-sub" style="margin:0">' + (n < 2 ? 'Precisa de pelo menos mais uma pessoa.' : 'Pode começar agora ou esperar os lugares encherem. Quem chegar depois ainda senta.') + '</p>'
            : '<p class="status-sub" style="margin:0">' + esc(nomeDe(vista.anfitriao).nome) + ' começa a partida quando todos chegarem.</p>') +
        '</div>' +
      '</div>';
  }

  function telaJogo() {
    var vez = nomeDe(vista.vezId);
    var minha = minhaVez();
    var c = vista.carta;
    var titulo, sub;
    if (minha && !c) { titulo = 'Sua vez. Escolha uma carta.'; sub = 'Estão todas viradas para baixo: qualquer uma serve.'; }
    else if (minha) { titulo = 'Sua carta'; sub = c.todos ? 'Esta é para todos: cada um responde no chat.' : 'Responda no chat. Quando terminar, encerre a sua vez.'; }
    else if (!c) { titulo = 'Vez de ' + vez.nome; sub = vez.nome + ' está escolhendo uma carta.'; }
    else { titulo = 'Carta de ' + vez.nome; sub = c.todos ? 'Esta é para todos: responda também no chat.' : 'Acompanhe a resposta no chat. Pode perguntar mais, se ' + vez.nome + ' topar.'; }

    var area;
    if (c) {
      var nova = c.id !== cartaMostrada;
      area = '<div class="carta-mao' + (nova ? ' entrando' : '') + '">' + cartaHTML(c.id, { virada: nova }) + '</div>';
    } else {
      var qtd = Math.min(7, vista.monte);
      area = '<div class="leque' + (minha ? ' ativo' : '') + '" role="group" aria-label="Cartas viradas para baixo">';
      for (var i = 0; i < qtd; i++) {
        var meio = (qtd - 1) / 2, a = (i - meio) * 7, dx = (i - meio) * 13;
        area += '<button class="carta-monte" type="button" data-pos="' + i + '" style="--i:' + i + ';transform:translateX(calc(-50% + ' + dx + '%)) rotate(' + a + 'deg)"' +
          (minha ? ' aria-label="Tirar a carta ' + (i + 1) + ' de ' + qtd + '"' : ' tabindex="-1" aria-hidden="true"') + '>' + versoSVG() + '</button>';
      }
      area += '</div>';
    }

    var bt = '';
    if (minha && c) {
      bt += '<button class="btn btn-ocre" type="button" data-acao="concluir">' + icone('ok') + 'Encerrar minha vez</button>';
      if (c.trocas < 2) bt += '<button class="btn btn-fantasma" type="button" data-acao="trocar">' + icone('trocar') + 'Trocar carta (' + (2 - c.trocas) + ')</button>';
      bt += '<button class="btn btn-fantasma" type="button" data-acao="passar">' + icone('passar') + 'Passar a vez</button>';
    } else if (minha) {
      bt += '<button class="btn btn-fantasma" type="button" data-acao="passar">' + icone('passar') + 'Passar a vez</button>';
    } else if (souAnfitriao() || vez.ausente) {
      bt += '<button class="btn btn-fantasma" type="button" data-acao="concluir">' + icone('passar') + 'Pular a vez de ' + esc(vez.nome) + '</button>';
    }

    palco.innerHTML = lugaresHTML(false) +
      '<h1 class="status">' + esc(titulo) + '</h1><p class="status-sub">' + esc(sub) + '</p>' +
      '<div class="area-carta">' + area + '</div>' +
      '<div class="botoes-vez">' + bt + '</div>' +
      '<p class="status-sub" style="text-align:center;margin:0">Rodada ' + vista.rodada + ' · ' + vista.monte + ' cartas no monte' +
      (souAnfitriao() ? ' · <button type="button" data-acao="fechar" style="background:none;border:0;padding:0;color:inherit;text-decoration:underline">encerrar a mesa</button>' : '') + '</p>';

    if (c && c.id !== cartaMostrada) {
      cartaMostrada = c.id;
      var el = palco.querySelector('.carta');
      setTimeout(function () { el && el.classList.remove('virada'); }, 260);
      if (picante()) setTimeout(function () { explodir(el, ['coracao', 'fogo', 'brilho', 'cereja'], 16); }, 700);
    } else if (!c) cartaMostrada = 0;
  }

  function telaFim() {
    palco.innerHTML = '<div class="fim-mesa"><h1 class="status">Esta mesa terminou</h1>' +
      '<p class="status-sub" style="margin:0">' + vista.sorteadas + ' cartas foram tiradas. A conversa continua aí ao lado para quem quiser reler.</p>' +
      '<a class="btn btn-ocre" href="./#mesa">Abrir uma mesa nova</a></div>';
    chat.hidden = false;
  }

  /* ---------- cliques no palco ---------- */
  palco.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.hasAttribute('data-copiar')) return copiarConvite();
    if (b.dataset.tirar) {
      var alvo = nomeDe(b.dataset.tirar);
      if (confirm('Tirar ' + alvo.nome + ' da mesa?')) acao('remover', { alvo: b.dataset.tirar }).catch(function () {});
      return;
    }
    if (b.dataset.pos != null) {
      if (!minhaVez() || ocupado) return;
      b.style.transform += ' translateY(-60px)';
      b.classList.add('saindo');
      palco.querySelectorAll('.carta-monte').forEach(function (x) { x.disabled = true; });
      acao('tirar', { pos: b.dataset.pos }).catch(function () {});
      return;
    }
    var nome = b.dataset.acao;
    if (!nome) return;
    if (nome === 'fechar' && !confirm('Encerrar a mesa para todos?')) return;
    b.disabled = true;
    acao(nome).catch(function () {});
  });

  function copiarConvite() {
    var link = linkConvite();
    var texto = 'Bora jogar Entre Nós? Entra na minha mesa: ' + link;
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      navigator.share({ title: 'Entre Nós', text: texto, url: link }).catch(function () {});
      return;
    }
    (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject())
      .then(function () { toast('Link copiado. Agora é só mandar no grupo.'); })
      .catch(function () { prompt('Copie o link da mesa:', link); });
  }
  document.getElementById('b-convidar').addEventListener('click', copiarConvite);
  document.getElementById('b-sair').addEventListener('click', function () {
    if (!confirm('Sair desta mesa? Você pode voltar pelo mesmo link enquanto houver lugar.')) return;
    acao('sair').then(function () { location.href = './'; }).catch(function () {});
  });

  /* ---------- chat ---------- */
  function hora(t) { var d = new Date(t); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }

  function desenharMsg(m) {
    var perto = caixaMsgs.scrollHeight - caixaMsgs.scrollTop - caixaMsgs.clientHeight < 120;
    var el = document.createElement('div');
    var p = m.de ? nomeDe(m.de) : null;
    var minha = eu && m.de === eu.pid;
    if (m.tipo === 'sis') {
      el.className = 'msg sis';
      el.textContent = m.txt;
    } else if (m.tipo === 'rea') {
      el.className = 'msg sis rea r-' + m.rea;
      el.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[m.rea] || '') + '</svg>' +
        esc((minha ? 'Você' : p.nome) + ' ' + (REACAO_NOME[m.rea] || 'reagiu'));
      if (Date.now() - m.t < 8000) explodir(reacoes && !reacoes.hidden ? reacoes : caixaMsgs, [m.rea], 9);
    } else if (m.tipo === 'carta') {
      var c = carta(m.carta) || { txt: '', cat: 1 };
      el.className = 'msg mini-carta';
      el.style.setProperty('--cat', categoria(c.cat).cor);
      el.innerHTML = '<div><span class="quem">' + esc(p.nome) + (m.troca ? ' trocou e tirou' : ' tirou') + ' a carta Nº ' + pad2(m.carta) + ' · ' + esc(categoria(c.cat).sub) + '</span>' +
        '<q>' + esc((c.titulo ? c.titulo + ': ' : '') + c.txt) + '</q></div>';
    } else {
      el.className = 'msg' + (minha ? ' minha' : '') + (m.tipo === 'resp' ? ' resp' : '');
      el.style.setProperty('--c', p.cor);
      if (m.carta) el.style.setProperty('--cat', categoria((carta(m.carta) || { cat: 1 }).cat).cor);
      el.innerHTML = '<div class="quem">' + esc(minha ? 'Você' : p.nome) + '<time>' + hora(m.t) + '</time></div>' +
        '<div class="bolha">' + (m.tipo === 'resp' ? '<span class="marca-resp">Resposta à carta Nº ' + pad2(m.carta) + '</span>' : '') + esc(m.txt) + '</div>';
    }
    caixaMsgs.appendChild(el);
    if (perto || minha) caixaMsgs.scrollTop = caixaMsgs.scrollHeight;
  }

  function atualizarPlaceholder() {
    var c = vista && vista.carta;
    var ph = 'Escreva para a mesa';
    if (vista && vista.status === 'jogo' && c) {
      if (c.por === (eu && eu.pid)) ph = 'Escreva sua resposta';
      else if (c.todos) ph = 'Esta carta é para todos: escreva sua resposta';
      else ph = 'Comente ou pergunte mais a ' + nomeDe(c.por).nome;
    }
    if (texto.placeholder !== ph) texto.placeholder = ph;
  }

  function ajustarAltura() {
    texto.style.height = 'auto';
    texto.style.height = Math.min(140, texto.scrollHeight) + 'px';
    var resta = 300 - texto.value.length;
    contador.textContent = resta < 60 ? resta + ' caracteres restantes' : '';
  }
  texto.addEventListener('input', ajustarAltura);
  texto.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = texto.value.trim();
    if (!t || !sentado()) return;
    texto.value = ''; ajustarAltura();
    var dados = { cod: cod, pid: eu.pid, tok: eu.tok, desde: seq, txt: t };
    Api.chamar('msg', dados).then(aplicar).catch(function (err) {
      toast(err.message, true);
      if (!texto.value) { texto.value = t; ajustarAltura(); }
    });
    texto.focus();
  });

  if (reacoes) reacoes.addEventListener('click', function (e) {
    var b = e.target.closest('[data-rea]');
    if (!b || !sentado()) return;
    b.classList.remove('pulou'); void b.offsetWidth; b.classList.add('pulou');
    Api.chamar('msg', { cod: cod, pid: eu.pid, tok: eu.tok, desde: seq, rea: b.dataset.rea })
      .then(aplicar).catch(function (err) { toast(err.message, true); });
  });

  document.addEventListener('visibilitychange', function () { if (!document.hidden) agendar(0); });

  puxar();
})();
