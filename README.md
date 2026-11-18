# Argentina: Simulador de Gobierno

Juego de simulación política al estilo Democracy, basado en la historia económica, política y social argentina.

## Escenarios
- **Julio 1989**: hiperinflación, saqueos, Plan Bonex.
- **Enero 2002**: default, corralito, 57% de pobreza.
- **Diciembre 2015**: cepo, brecha cambiaria, déficit del 5%.
- **Diciembre 2023**: inflación del 25% mensual, reservas negativas.

## Cómo jugar
Abrí `index.html` en el navegador. Para instalarlo como app (PWA) y jugar sin internet, servilo por HTTPS (GitHub Pages, Netlify, Vercel) o en local con `python3 -m http.server`, y tocá **Instalar el juego** en el inicio o en el Menú. En iPhone: Compartir → Agregar a inicio.

Al publicar cambios, subí `VERSION` en `sw.js` para que los jugadores reciban la actualización.

- **Arriba**, los 15 sectores sociales. La cara y el anillo de color muestran cuánto te aprueban.
- **En el centro**, los indicadores del país, con su evolución reciente y las situaciones activas (crisis y logros).
- **A los costados**, las políticas agrupadas por área. Pasá el mouse para ver qué afectan; hacé clic para cambiarlas.
- **Cadena nacional** (una vez por mes), **Encuestas** con intención de voto, **Redes sociales** con lo que dice la gente, **tapas de diarios** en el informe mensual y **Objetivos del mandato** por escenario.
- Tres niveles de dificultad. Barra espaciadora = siguiente mes.
- Las medidas se aplican por decreto, por DNU o por ley (con votación animada en el Congreso).

## Estructura
- `js/engine.js`: modelo económico y político (~80 variables).
- `js/data/`: partidos, sectores, políticas, eventos y escenarios.
- `js/ui/`: interfaz, arte SVG, audio sintetizado (multitudes, cánticos, bombos) y flujos de juego.
- `test/regression.js`: calibración contra datos históricos (`node test/regression.js`).

## Diseño
Ver [DESIGN.md](DESIGN.md). Íconos: subconjunto de [Tabler Icons](https://tabler.io/icons) (MIT), regenerable con `tools/build-icons.js`. Tipografía: Barlow (SIL Open Font License), incluida en `fonts/`.

Los datos son aproximaciones de INDEC y BCRA. Los personajes son ficticios.
