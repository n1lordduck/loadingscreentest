# Duck's Server - Loading Screen

![HTML](https://img.shields.io/badge/HTML-static-2d3b5c?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES5-ffd23f?style=flat-square)
![Garry's Mod](https://img.shields.io/badge/Garry's%20Mod-sv__loadingurl-79c4f2?style=flat-square)

Tela de carregamento do Duck's Server: céu em pixel art com nuvens e sol, morros, uma fila de
patinhos andando na grama, as regras do servidor escritas numa nuvem (um sprite, não uma caixa
de CSS), barra de progresso ligada à API de loading do GMod, polaroid com prints do servidor e
uma musiquinha chiptune bem baixa gerada no próprio navegador.

## Usar no servidor

No `server.cfg`:

```
sv_loadingurl "https://n1lordduck.github.io/loadingscreentest/"
```

A página é estática (GitHub Pages), sem build. Aberta fora do GMod ela entra num modo de
demonstração que simula o carregamento.

## Editar

| O que | Onde |
|---|---|
| Texto das regras, link do Discord, lista de prints | `js/data.js` |
| Cores, tamanhos, posições | `css/style.css` |
| Sprites (patos, nuvens, sol, ícones) | `assets/sprites/` (gerados, ver abaixo) |
| Prints do fundo da polaroid | `screenshots/` + lista em `js/data.js` |

Os sprites vêm do mesmo gerador de pixel art dos addons do servidor
(`garrysmod/addons/_ducks_server_assets/art`). Para regenerar:

```
cd garrysmod/addons/_ducks_server_assets/art
python3 export_png.py sprites loading_sprites <este repo>/assets/sprites
```

## Compatibilidade

O GMod mostra a loading screen num navegador embutido que pode ser antigo (Awesomium no branch
de 32 bits). Por isso o JavaScript é ES5, o layout usa posicionamento absoluto e os sprites são
desenhados em `<canvas>` com suavização desligada. Detalhes em `ARCHITECTURE.md`.
