# Garagem — Simulador de revenda de carros

Um pequeno jogo de gestão em português (Portugal): compra carros usados, prepara-os, define o preço de venda e faz crescer a reputação e o capital do teu stand.

## Como jogar

1. Abre `index.html` num browser moderno.
2. Explora o mercado e compra um carro que esteja abaixo do valor estimado.
3. No teu stand, define o preço e, se quiseres, paga uma revisão para melhorar o estado.
4. Avança o dia. Os carros anunciados podem vender-se consoante o preço, o estado e a reputação. Há também custos diários de funcionamento.
5. Atinge 100.000 € de capital para cumprir o objetivo.

O progresso fica guardado localmente no browser através de `localStorage`. O jogo não precisa de servidor nem de dependências externas; o Google Fonts é apenas um melhoramento visual e usa fontes de sistema se estiver offline.

## Ficheiros

- `index.html` — estrutura e navegação.
- `styles.css` — interface responsiva.
- `app.js` — regras da simulação, mercado e gravação local.
