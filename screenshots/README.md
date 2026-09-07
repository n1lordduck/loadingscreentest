# screenshots/

Prints do servidor usados no fundo animado da tela de carregamento.

## Convenção de nomes

Os arquivos devem ser numerados sequencialmente a partir de `1`, com uma das
extensões suportadas: `.jpg`, `.jpeg`, `.png` ou `.webp`.

```
screenshots/1.jpg
screenshots/2.png
screenshots/3.webp
...
```

O `index.html` tenta carregar cada número nessa sequência (testando as
extensões nessa ordem) e monta a lista de fundos automaticamente a partir
dos arquivos que existirem — não precisa ser sequência sem furos nem usar a
mesma extensão em todos.

## Atualizando a quantidade

O `index.html` define uma constante `TOTAL_SCREENSHOTS` (dentro do bloco
`// BG SLIDESHOW`) com o maior número que ele vai tentar carregar. Se você
adicionar mais prints do que esse valor, aumente a constante para o novo
total; caso contrário os prints extras não entram na rotação.

## Comportamento

- A cada ~11s o fundo troca para um print aleatório (sem repetir o mesmo
  print duas vezes seguidas), com fade cruzado entre a imagem atual e a
  próxima.
- Cada print tem um leve efeito de zoom-in/zoom-out (estilo menu principal
  do GMod) enquanto fica em tela.
- Se a pasta estiver vazia, o fundo simplesmente permanece na cor sólida
  padrão — nada quebra.
