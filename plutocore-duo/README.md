# PlutoCore — Rescate Aurora 4.0

Aventura de ciencia para 7–12 años. Una base lunar, seis etapas: energía solar, diagnóstico del aire, filtración de CO₂, reciclaje de agua, cultivo y protección contra una tormenta solar.

## Ejecutar

Requiere Node.js 22 o posterior. Sin dependencias ni instalación.

```sh
node server.js
```

Abrir http://localhost:3000. Para probar el servidor, dejarlo encendido y ejecutar en otra terminal:

```sh
npm test
```

Las pruebas conectan tres clientes WebSocket reales en dos salas independientes; completan individual y cooperativo, comprueban validación de distancia, tuberías y orden del agua, el presupuesto energético y el reinicio. TEST_ORIGIN permite apuntar a otro servidor de pruebas.

## Cómo jugar

- Individual: orienta ambos paneles. Fija válvula y bomba antes de resolver sus reparaciones. Los ajustes permanecen. Sella las dos entradas del refugio.
- Dos personas: una crea la sala, copia la invitación y la comparte. Cada persona usa su propio navegador o dispositivo. Cada una controla un panel y una estación de cultivo; válvula/filtro, bomba/agua y refugio requieren cooperación.
- Muévete con WASD, flechas o clic sobre el mapa. Acércate a las estaciones y usa E. En pantallas pequeñas hay joystick y botón USAR. Pulsar una estación también permite caminar hasta ella e interactuar.
- Música ambiental original y efectos sintetizados: activar con el botón musical. Apagados inicialmente para respetar las preferencias del jugador y las restricciones de audio del navegador.
- Descubrimientos: fichas opcionales con fotografías y enlaces a fuentes oficiales, sin interrumpir la siguiente tarea.

## Relación con el reto

Reto: Build a Junior Astronaut Mission Trainer (NASA Space Apps 2026).
https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

El resumen oficial pide operar una base lunar o marciana y experimentar decisiones entre soporte vital, radiación, energía y alimentos. Esta versión conecta los sistemas en una aventura y añade un presupuesto compartido de energía para luz y riego. Superarlo detiene el crecimiento; el jugador debe experimentar y reducir el consumo. No basta con subir ambos controles.

El resumen oficial se verificó mediante su resultado indexado; el acceso directo al texto completo devolvió 502. No se afirma cumplimiento integral de las bases ni aceptación del concurso. Esta es una evolución de un prototipo previo: hay que declarar el trabajo y las herramientas anteriores al evento según las reglas que correspondan.

## Ciencia, simplificaciones y créditos

Aurora y sus fallos son ficticios. Parámetros, porcentajes de progreso, unidades de energía y valores ideales son reglas didácticas; no son mediciones ni una simulación física validada. El sensor de O₂ se expresa como nivel adecuado, sin el 96% de oxígeno ficticio de la versión anterior. La historia del filtro de Apollo 13 se distingue de los personajes jugables.

- Apollo 13 y filtros incompatibles: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/
- ECLSS, soporte vital y recuperación de agua: https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/
- Cultivos: https://science.nasa.gov/mission/veggie/
- Radiación: https://www.nasa.gov/humans-in-space/space-radiation/

Neil Armstrong, Sally Ride, Mae Jemison y Chris Hadfield son homenajes ilustrados. No se sugiere que participaron juntos en Apollo 13 ni que NASA avala el juego. Los cuatro cascos de helmets.png son ilustraciones generadas con IA mediante la herramienta integrada ImageGen; las caras no son fotografías. Brazos, piernas, botas y animaciones se dibujan mediante código para conservar su integridad y proporciones. Hay poses de espera, caminata continua y reparación, interpolación de posiciones recibidas del servidor y respeto a la preferencia de movimiento reducido.

Prompt utilizado para helmets.png: retratos de cascos de Neil Armstrong, Sally Ride, Mae Jemison y Chris Hadfield, caricaturas semirrealistas amables; cuadrícula 2×2 con celdas iguales, ángulo frontal y escala uniforme, fondo transparente, sin cuerpos, textos ni logotipos. El atlas se usa sin recortar ni alterar la imagen generada.

## Limitaciones

Las salas viven en memoria y se pierden con reinicios o suspensión de Render. No hay recuperación de sesión tras desconexión; se informa al jugador y puede crear otra sala. Las fichas dependen de imágenes externas y se ocultan si no cargan. La experiencia requiere conexión, incluso en individual. El prototipo necesita pruebas de comprensión y comodidad con niños de la edad objetivo antes de presentarlo como producto validado.
