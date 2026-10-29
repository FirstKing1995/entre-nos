# Entre Nós

Jogo de cartas online para 2, 4, 6 ou 8 amigos. Na sua vez, cada pessoa tira uma carta do leque e responde no chat que a mesa inteira lê. Baralho de 65 perguntas em sete maços.

- `index.html`: página de entrada (abrir mesa, entrar com código, baralho de amostra)
- `jogo.html?sala=CODIGO`: a mesa (saguão, cartas, vez de cada um, chat)
- `admin.html`: área do organizador (senha na aba Config da planilha)
- `js/config.js`: `API_URL` do Apps Script. Vazio = modo demonstração, com a mesa guardada só no navegador.

O servidor é um Google Apps Script ligado a uma planilha (pasta `apps-script` do projeto, fora deste repositório).
