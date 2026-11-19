# Argentina: Gobernala — mod para Democracy 4

Agrega la **República Argentina** como país jugable, con su propia economía política: inflación inercial, cepo y brecha cambiaria, retenciones, el FMI, Vaca Muerta, piquetes, la CGT y la grieta. Textos completos en **español e inglés**.

**Descarga directa:** [argentina_gobernala.zip](argentina_gobernala.zip)

## Qué trae

| | Cantidad | Ejemplos |
|---|---|---|
| Políticas exclusivas de Argentina | 28 | Cepo, Asistencia del BCRA al Tesoro, Retenciones, Impuesto PAIS, Programa con el FMI, RIGI, Vaca Muerta, Litio, Movilidad jubilatoria, Moratoria, Planes sociales, Protocolo antipiquetes, Reforma laboral, Monotributo, Universidad pública, CONICET, Malvinas, Mercosur, Dolarización |
| Situaciones exclusivas | 13 | Brecha cambiaria, Reservas agotadas, Riesgo país, Corrida cambiaria, Corralito, Default, Piquetes, Paros de la CGT, Crisis energética, La grieta, Cosecha récord, Boom energético, Estabilidad macro |
| Eventos con imagen | 15 | Campeones del mundo, sequía, apagón, visita del Papa, escándalo de corrupción, saqueos, marcha universitaria |
| Dilemas | 16 | Vencimiento con el FMI, paritarias, lockout del campo, fondos buitre, Malvinas, dólar blue, narco en Rosario, veto a jubilados, aguinaldos sin fondos |
| Rasgos estructurales del país | 6 | Inercia inflacionaria, evasión, corrupción, grieta, fuga de cerebros, economía informal |

El país arranca como Argentina a fines de 2023: cepo total, emisión alta, retenciones del 26 %, subsidios amplios, reservas negativas y una inflación muy alta. Dificultad 5.

## Instalación

1. Descomprimí `argentina_gobernala.zip`.
2. Copiá la carpeta `argentina_gobernala` a la carpeta de mods del juego:
   - Windows: `Documentos\My Games\democracy4\mods\`
   - Mac/Linux: la carpeta `democracy4/mods` dentro de tus documentos del juego
3. Abrí Democracy 4, entrá a **Mods** y activá **Argentina: Gobernala**.
4. Empezá una partida nueva y elegí **República Argentina**.

Es compatible con *D4 Overhaul & Expansion*: usa nombres, prerrequisitos e identificadores propios (`argentina`, `_prereq_argentina_gb`, prefijo `AR_`), así que los dos mods pueden convivir. Si usás los dos, vas a ver dos Argentinas: la de ese mod (`arg`) y esta.

## Lista de pruebas (primera vez en el juego)

El mod se generó y validó automáticamente, pero **todavía no se probó dentro de Democracy 4**. Estas son las cosas a revisar, de la más a la menos importante:

1. **¿Arranca el juego con el mod activado?** Si no, el error suele indicar el archivo y la fila.
2. **¿Aparece "República Argentina" en la lista de países**, con su bandera, su mapa y su descripción?
3. **¿Aparecen las 28 políticas propias**, con íconos y con las etiquetas de los deslizadores (por ejemplo, el cepo: "Restricciones mínimas" a "Cepo total")?
4. **¿Las políticas propias NO aparecen jugando con otro país?** (Tienen que estar limitadas a Argentina.)
5. **Moneda y cifras:** el país usa dólares (US$). Revisá que el PBI, la deuda y el presupuesto se vean razonables.
6. **Situaciones:** en las primeras semanas deberían activarse "Brecha cambiaria", "Reservas agotadas" y "Riesgo país por las nubes".
7. **Eventos y dilemas:** que aparezcan sólo jugando con Argentina y que muestren su imagen y su texto.

Hay dos puntos del formato que no pude confirmar con la documentación oficial y que conviene mirar:
- `country_specific = argentina` en los **eventos**: está confirmado para dilemas; en eventos es una suposición razonable. Si un evento aparece con otro país, hay que quitar su `_random_` y dejar sólo influencias de políticas argentinas.
- `CreateGrudge` apuntando a **situaciones del mod** (por ejemplo, `AR_ReservasAgotadas`) desde eventos y dilemas.

Si algo falla, pasame el mensaje de error o una captura y lo corrijo en el generador.

## Subirlo a Steam Workshop

Desde el menú **Mods** del juego, elegí el mod y usá la opción para subirlo al Workshop. Como imagen de portada usá `preview.jpg`, que está dentro de la carpeta del mod.

## Cómo se genera

Todo el contenido está como datos en `build/content.py`. Para regenerar el mod después de un cambio:

```bash
# una sola vez: herramientas de gráficos
npm i --no-save @tabler/icons@3.19.0 world-atlas@2.0.2 topojson-client@3.1.0
pip install potracer pillow numpy

# gráficos (íconos, bandera, mapa, imágenes de eventos, portada)
python3 -c "import sys,json; sys.path.insert(0,'build'); import content as C; json.dump({'policies':[{'name':p['name'],'icon':p['icon']} for p in C.POLICIES],'situations':[{'name':s['name'],'icon':s['icon']} for s in C.SITUATIONS],'events':[{'name':e['name'],'scene':e['scene']} for e in C.EVENTS],'dilemmas':len(C.DILEMMAS)},open('.tmp/content.json','w'))"
node build/assets.js .tmp && python3 build/trace_icons.py .tmp

# archivos del mod y validación
python3 build/build.py && python3 build/validate.py
```

`validate.py` revisa que cada nombre usado exista en el juego base o en el mod, que las fórmulas se puedan evaluar y den valores razonables, que cada situación pueda activarse, y que no falten traducciones, íconos ni imágenes.

## Créditos

- Íconos: [Tabler Icons](https://tabler.io/icons) (licencia MIT), vectorizados como formas rellenas.
- Mapa: [world-atlas](https://github.com/topojson/world-atlas), a partir de Natural Earth (dominio público). Incluye las islas Malvinas, como la cartografía oficial argentina.
- Imágenes de eventos: ilustraciones de [Gobernala](https://gobernala.vercel.app).
- El formato de los archivos se aprendió estudiando mods públicos (*The Culture War*, *D4 Overhaul & Expansion*). No se copió contenido de ellos.
