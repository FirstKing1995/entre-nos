# Entre Nós

Jogo de cartas online para 2, 4, 6 ou 8 pessoas, com três baralhos: Normal (65 cartas), +18 (65) e Misto (os dois juntos). Na sua vez, cada pessoa tira uma carta do leque e responde no chat que a mesa inteira lê.

- `index.html`: entrada com criar conta (nome, e-mail, apelido, senha) ou entrar
- `salao.html`: abrir mesa (baralho, tom, lugares), convites recebidos, quem está online, mesas em andamento
- `jogo.html?mesa=ID`: a mesa. Só entra quem tem o link; convite também vai direto para quem está online
- `admin.html`: área do organizador (senha na aba Config da planilha)
- `musicas/`: trilhas de cada baralho (lista em `js/musicas.js`, gerada pelo `tools/gerar-musicas.mjs`)
- `js/config.js`: `API_URL` do Apps Script. Vazio = modo demonstração, tudo guardado só no navegador.

O servidor é um Google Apps Script ligado a uma planilha (pasta `apps-script` do projeto, fora deste repositório).
