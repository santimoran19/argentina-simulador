# Sistema de diseño

Referencia de género: juegos de gestión de gobierno (tablero de políticas conectadas). Sobrio, legible, de "sala de situación": la información manda, la decoración no.

## Principios
1. **Pictogramas, no emojis.** Todos los íconos salen de un único set de línea (Tabler Icons, trazo 1.8). Los emojis quedan sólo donde los usaría una persona real: los posteos en redes.
2. **Plano.** Sin brillos neón, sin pulsos permanentes, sin degradados de colores. Una sola sombra para lo que flota (paneles y ventanas).
3. **El color significa algo.** Verde = bueno, rojo = malo, ámbar = atención. El color de área sólo aparece como acento fino (anillo del círculo y título de la caja).
4. **Una familia tipográfica.** Barlow para todo; Barlow Semi Condensed sólo para cifras grandes. Mayúsculas espaciadas sólo en rótulos chicos.

## Colores
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0d1822` | fondo de la aplicación |
| `--board` | `#112131` | fondo del tablero |
| `--panel` | `#16283a` | cajas, tarjetas, ventanas |
| `--panel-2` | `#1d3247` | elementos dentro de cajas, hover |
| `--line` | `#2b4158` | bordes de 1px |
| `--text` | `#e7edf4` | texto principal |
| `--muted` | `#94a6ba` | texto secundario (contraste 6.2:1 sobre `--panel`) |
| `--accent` | `#6cb4e8` | celeste: selección, links, foco |
| `--gold` | `#e3b341` | acción principal (Siguiente mes, Firmar) |
| `--good` | `#43b26f` | mejora |
| `--bad` | `#e2574c` | empeora |
| `--warn` | `#e0a33a` | atención |
| `--node` | `#eef3f8` | relleno de los círculos de política y sector |
| `--ink` | `#1b2b3d` | pictograma dentro de los círculos |

Áreas (acento): monetaria `#c9a227` · impuestos `#d9822b` · gasto `#cf6060` · trabajo `#4fa36b` · producción `#3a9fb5` · seguridad `#7584d8` · sociedad `#c76aa5` · instituciones `#8b98a8`.

## Tipografía
- Texto: Barlow 400/500/600, 13–15px.
- Títulos: Barlow 600, 20–28px, sin mayúsculas.
- Rótulos: Barlow 600, 11px, mayúsculas, espaciado 0.08em.
- Cifras: Barlow Semi Condensed 600, números tabulares.

## Forma
- Radio: 6px en cajas y botones, 50% en nodos.
- Espaciado base 4px (4, 8, 12, 16, 24).
- Sombra única: `0 8px 24px rgb(0 0 0 / .35)`.
- Foco visible: anillo de 2px `--accent`.

## Componentes del tablero
- **Política:** círculo claro `--node`, pictograma `--ink`, anillo de 2px del color del área, nivel en una barra fina debajo, nombre en una o dos líneas.
- **Sector:** círculo claro con pictograma y un arco alrededor que muestra la aprobación (verde → ámbar → rojo).
- **Indicador:** tarjeta plana con pictograma, cifra, nombre y minigráfico; el color de la cifra dice si está bien o mal.
- **Situación:** rótulo con pictograma, fondo rojo o verde apagado.
- **Conexiones:** líneas finas verdes o rojas; punteadas animadas sólo al previsualizar un cambio.
