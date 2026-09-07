# screenshots/

Prints do servidor usados no fundo animado da tela de carregamento.

## Convenção de nomes

Qualquer nome de arquivo serve (`.jpg`, `.jpeg`, `.png` ou `.webp`) — não
precisa renomear os prints. Como é uma pagina estatica, o `index.html` nao
consegue listar a pasta sozinho, entao os nomes ficam num array `SCREENSHOTS`
no topo do bloco `// BG SLIDESHOW` do script.

Ao adicionar um print novo:

1. Solte o arquivo dentro de `screenshots/`.
2. Adicione o nome exato dele (com extensao) na lista `SCREENSHOTS` no
   `index.html`.

Um print que esta na pasta mas nao esta na lista simplesmente nunca aparece
na rotacao.

## Comportamento

- A cada ~11s o fundo troca para um print aleatorio da lista (sem repetir o
  mesmo print duas vezes seguidas), com fade cruzado entre a imagem atual e
  a proxima.
- Cada print tem um leve efeito de zoom-in/zoom-out (estilo menu principal
  do GMod) enquanto fica em tela.
- Se a lista estiver vazia, o fundo simplesmente permanece na cor solida
  padrao — nada quebra.
