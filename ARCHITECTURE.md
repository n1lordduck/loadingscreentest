# Architecture

Página estática, sem build nem dependências além de duas fontes do Google Fonts. Cada arquivo
de `js/` é um módulo ES5 que se registra no namespace global `Duck`.

## Estrutura

```
index.html          esqueleto da página e ordem dos scripts
css/style.css       visual (tamanhos em rem, ver "Escala")
js/
  data.js           conteúdo: regras, Discord, lista de prints
  sprites.js        carrega os PNGs e desenha sprites em canvas sem suavização
  scene.js          cena em pixel art (céu, sol, nuvens, morros, grama, patos)
  music.js          chiptune procedural com WebAudio
  rules.js          nuvem das regras: paginação, troca a cada 8 s, indicador 1..10
  loading.js        barra de progresso, status, arquivo baixando, modo demonstração
  gmod.js           callbacks globais que o GMod chama (GameDetails, SetStatusChanged...)
  gallery.js        polaroid com os prints de screenshots/
  main.js           carrega os sprites e inicia os módulos na ordem certa
assets/sprites/     PNGs gerados pelo toolkit de pixel art
screenshots/        prints do servidor usados na polaroid
motd.html           MOTD (página separada, não usada pela loading screen)
```

## Ordem de carregamento

`data -> sprites -> scene -> music -> rules -> loading -> gmod -> gallery -> main`.
Os módulos só definem funções; nada desenha antes de `main.js` chamar `Duck.Sprites.load`,
que espera todos os PNGs e então chama `boot()`.

## Escala

Toda a arte é desenhada num canvas de baixa resolução (`scene.js`) e ampliada por um fator
inteiro `px = max(2, floor(altura / 270))`: 4 em 1080p, 5 em 1440p, 8 em 4K. Fator inteiro
mantém os pixels nítidos. O `font-size` do `html` é `px * 4`, então `1rem` acompanha a arte e a
interface (cartão, polaroid, chips) cresce junto em qualquer resolução. Quando a janela muda de
tamanho, `scene.js` recalcula `px` e avisa `main.js` por `Duck.onScaleChanged`, que redesenha os
sprites dos elementos HTML.

## Integração com o GMod

O GMod chama funções globais durante a conexão. `gmod.js` as define e repassa:

| Callback | Efeito |
|---|---|
| `GameDetails(nome, url, mapa, maxPlayers, steamid, gamemode, volume)` | chips de mapa, modo e vagas; volume da música |
| `SetFilesTotal(n)` / `SetFilesNeeded(n)` | progresso de 10% a 90% conforme os downloads |
| `DownloadingFile(arquivo)` | linha "Baixando ..." |
| `SetStatusChanged(status)` | texto amigável; Workshop sobe pra 30%, Lua pra 92%, spawn completa |

Se nenhuma callback chegar em 1,5 s, `loading.js` assume que está fora do GMod e roda o modo
demonstração.

## Compatibilidade com navegadores antigos

- ES5 apenas (`var`, `function`, sem arrow functions, template strings ou classes).
- Layout com posicionamento absoluto e `display: table` (sem flexbox/grid).
- Sprites sempre desenhados em `<canvas>` com `imageSmoothingEnabled` desligado (com prefixos),
  em vez de depender de `image-rendering: pixelated`.
- `requestAnimationFrame` com fallback para `setTimeout`.
- A música só existe se o navegador tiver WebAudio; sem ele a página funciona em silêncio.

## Música

`music.js` agenda notas com um lookahead de 250 ms: arpejo em triângulo, baixo senoidal e uma
melodia curta em onda quadrada, progressão I-vi-IV-V a 88 BPM, passando por um lowpass. O volume
base é 0,05 vezes o volume do jogo informado em `GameDetails`. Navegadores podem exigir uma
interação antes de tocar áudio; `main.js` retoma o contexto na primeira tecla, clique ou
movimento do mouse, e o botão de som silencia/retoma.
