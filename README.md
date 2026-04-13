# Conversor de Cores

Uma aplicação web simples e intuitiva para conversão de cores entre diferentes sistemas: RGB, CMYK, HSL e HSV. Permite visualizar as mudanças em tempo real, com um preview da cor e uma área de pintura interativa.

## Funcionalidades

- **Seleção de Sistema de Cores**: Escolha entre RGB, CMYK, HSL ou HSV no painel esquerdo.
- **Campos de Entrada com Labels Descritivos**: Mostra nomes completos como "Red", "Green", "Blue" em vez de siglas.
- **Paleta de Cores do Arco-Íris**: Clique em um dos 7 quadrados coloridos (vermelho, laranja, amarelo, verde, azul, índigo, violeta) para selecionar rapidamente uma cor.
- **Preview em Tempo Real**: Veja a cor resultante no painel direito, com o código hexadecimal editável abaixo (digite um hex válido para alterar a cor).
- **Tabela de Conversões Detalhada**: Mostra os valores dos outros sistemas com labels explicativos completos (ex.: Red: 255, Green: 0, Blue: 0).
- **Área de Pintura**: Desenhe com a cor selecionada em um canvas interativo, como um paint simples.
- **Limpar Canvas**: Botão para limpar a área de pintura.

## Como Usar

1. Abra o arquivo `index.html` em um navegador web.
2. Selecione o sistema de cores desejado no dropdown ou clique em uma cor da paleta do arco-íris para seleção rápida.
3. Insira os valores nos campos correspondentes ou ajuste via paleta.
4. Observe o preview da cor (com código hexadecimal abaixo) e a tabela com conversões.
5. Use o mouse para pintar no canvas central com a cor atual.
6. Clique em "Limpar" para resetar o canvas.

## Tecnologias Utilizadas

- HTML5
- CSS3 (com Flexbox e Grid)
- JavaScript (ES6+)

## Estrutura do Projeto

- `index.html`: Estrutura da página com layout responsivo.
- `styles.css`: Estilos visuais com design moderno e responsividade para dispositivos móveis.
- `script.js`: Lógica de conversão de cores e interatividade.

## Design e Interatividade

- **Interface Dinâmica**: Animações suaves de transição em mudanças de cor, foco em campos e hover effects.
- **Responsividade**: Layout adaptável para desktop, tablets e dispositivos móveis.
- **Estilo Moderno**: Gradientes, sombras e tipografia elegante para uma experiência visual agradável.