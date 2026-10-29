/* Entre Nós — conversa com o servidor (Apps Script) ou, sem servidor, com uma mesa guardada no navegador. */
var Api = (function () {
  var URL_API = (window.CONFIG && CONFIG.API_URL || '').trim();
  var remoto = !!URL_API;

  function remota(acao, dados, leitura) {
    var corpo = Object.assign({ acao: acao }, dados || {});
    var req;
    if (leitura) {
      var q = Object.keys(corpo).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(corpo[k] == null ? '' : corpo[k]);
      }).join('&');
      req = fetch(URL_API + '?' + q, { cache: 'no-store' });
    } else {
      /* text/plain evita a checagem prévia de CORS que o Apps Script não responde */
      req = fetch(URL_API, { method: 'POST', body: JSON.stringify(corpo) });
    }
    return req
      .then(function (r) { return r.json(); })
      .catch(function () { throw new Error('Sem conexão com a mesa. Tentando de novo...'); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.erro || 'Algo deu errado.');
        return r.dados;
      });
  }

  /* ---------- modo demonstração (localStorage) ---------- */
  var CHAVE = 'en_demo_sala_';
  function ler(cod) {
    try { return JSON.parse(localStorage.getItem(CHAVE + cod)); } catch (e) { return null; }
  }
  function gravar(s) { localStorage.setItem(CHAVE + s.cod, JSON.stringify(s)); }
  function presenca(cod) {
    try { return JSON.parse(localStorage.getItem('en_demo_on_' + cod)) || {}; } catch (e) { return {}; }
  }
  function tocar(cod, pid) {
    if (!pid) return;
    var p = presenca(cod); p[pid] = Date.now();
    localStorage.setItem('en_demo_on_' + cod, JSON.stringify(p));
  }
  function ctx(cod) { return { rnd: Math.random, cartas: CARTAS, online: presenca(cod) }; }
  function normaliza(cod) { return String(cod || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5); }

  function local(acao, d) {
    return new Promise(function (ok) { setTimeout(ok, 120); }).then(function () {
      d = d || {};
      var cod = normaliza(d.cod);
      if (acao === 'criar') {
        var novo;
        do { novo = Logica.novoCodigo(Math.random); } while (ler(novo));
        var r = Logica.criarSala(Object.assign({}, d, { cod: novo }), ctx(novo));
        gravar(r.sala); tocar(novo, r.jogador.id);
        return { cod: novo, pid: r.jogador.id, tok: r.jogador.tok, vista: Logica.vista(r.sala, r.jogador.id, 0, presenca(novo)) };
      }
      if (acao === 'admin') return adminLocal(d);
      var s = ler(cod);
      if (!s) throw new Error('Mesa não encontrada. Confira o código.');
      if (acao === 'estado') {
        tocar(cod, d.pid);
        return Logica.vista(s, d.pid, d.desde, presenca(cod));
      }
      if (acao === 'entrar') {
        var j = Logica.entrar(s, d, ctx(cod));
        gravar(s); tocar(cod, j.id);
        return { cod: cod, pid: j.id, tok: j.tok, vista: Logica.vista(s, j.id, 0, presenca(cod)) };
      }
      Logica.aplicar(s, acao, d, ctx(cod));
      gravar(s); tocar(cod, d.pid);
      return Logica.vista(s, d.pid, d.desde, presenca(cod));
    });
  }

  function adminLocal(d) {
    if (d.senha !== 'demo') throw new Error('Senha incorreta. No modo demonstração a senha é demo.');
    var salas = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf(CHAVE) === 0) { try { salas.push(JSON.parse(localStorage.getItem(k))); } catch (e) {} }
    }
    if (d.op === 'encerrar') {
      var s = ler(normaliza(d.cod));
      if (s) { Logica.encerrarMesa(s); gravar(s); }
    }
    var contagem = {};
    salas.forEach(function (s) {
      s.msgs.forEach(function (m) { if (m.tipo === 'carta') contagem[m.carta] = (contagem[m.carta] || 0) + 1; });
    });
    return montarResumo(salas.map(function (s) {
      var a = Logica.ativos(s);
      return { cod: s.cod, criada: s.criada, atualizada: s.atualizada, status: s.status, cap: s.cap, modo: s.modo,
        jogadores: a.length, nomes: a.map(function (j) { return j.nome; }).join(', '), sorteadas: s.sorteadas, mensagens: s.seq };
    }), contagem);
  }

  function montarResumo(salas, contagem) {
    salas.sort(function (a, b) { return b.atualizada - a.atualizada; });
    var tot = { salas: salas.length, abertas: 0, jogadores: 0, sorteadas: 0, mensagens: 0 };
    salas.forEach(function (s) {
      if (s.status !== 'fim') tot.abertas++;
      tot.jogadores += s.jogadores; tot.sorteadas += s.sorteadas; tot.mensagens += s.mensagens;
    });
    var ranking = Object.keys(contagem).map(function (id) { return { id: Number(id), vezes: contagem[id] }; })
      .sort(function (a, b) { return b.vezes - a.vezes; });
    return { totais: tot, salas: salas.slice(0, 60), cartas: ranking };
  }

  return {
    remoto: remoto,
    normaliza: normaliza,
    chamar: function (acao, dados) { return remoto ? remota(acao, dados, false) : local(acao, dados); },
    estado: function (cod, pid, desde) {
      var d = { cod: cod, pid: pid || '', desde: desde || 0 };
      return remoto ? remota('estado', d, true) : local('estado', d);
    }
  };
})();
