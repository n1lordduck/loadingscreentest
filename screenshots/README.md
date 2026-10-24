# screenshots/

Prints do servidor usados na polaroid da tela de carregamento.

## Como adicionar um print

1. Solte o arquivo (`.jpg`, `.png` ou `.webp`) nesta pasta. Prefira `.webp` com até 1280 px de largura,
   porque o jogador baixa a pasta toda ao conectar.
2. Adicione o nome exato, com extensão, na lista `screenshots` de `js/data.js`.

Um print que está na pasta mas não está na lista nunca aparece.

## Comportamento

A polaroid troca de print a cada 7 s, escolhendo um aleatório sem repetir o anterior, com fade entre eles.
Se a lista estiver vazia, a polaroid some.
