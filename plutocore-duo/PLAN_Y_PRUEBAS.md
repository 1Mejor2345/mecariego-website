# PlutoCore Duo 3.0 — Rediseño ejecutado

**Objetivo:** dos personas rescatan la base lunar Aurora descubriendo cómo los sistemas espaciales dependen unos de otros. Diseño de aprendizaje: **observar → probar → ver consecuencia → comprender un hecho real**.

## Cambios realizados

- Sprites nuevos y coherentes de cuatro astronautas caricaturizados inspirados en Neil Armstrong, Sally Ride, Mae Jemison y Chris Hadfield. Animaciones de reposo, dos fases de caminata y reparación; los cuatro cuadros mantienen pies, piernas y casco completos. Los retratos históricos son homenajes, no protagonistas reales de la historia ficticia de Aurora.
- Música ambiental *original*, suave y sintetizada localmente por Web Audio; inicialmente silenciada, activable con `♫ Música`. Efectos de clic y avance; sin muestras de música comercial.
- HUD simplificado: objetivo breve, seis indicadores de progreso, invitación y control de audio. Los detalles científicos se consultan tras experimentarlos.
- Fase de energía: dos jugadores orientan **distintos paneles solares** con controles continuos, buscando máxima generación observable.
- Fase de investigación: los dos inspeccionan O₂ y CO₂; descubren que puede haber CO₂ peligroso aun con O₂ presente.
- Fase del filtro: uno mantiene una válvula y el otro gira los tres codos del conducto. La reparación se completa únicamente si coinciden condiciones y posiciones.
- Fase de agua: uno mantiene la bomba, el otro **ordena las etapas** de purificación (`filtrar → oxidar → verificar`). Es un modelo pedagógico simplificado del tratamiento del agua, no un diagrama exacto de un equipo de NASA.
- Fase de cultivo: cada jugador regula uno de dos parámetros **continuos** (luz/riego) y observa el crecimiento compartido de la planta. Los valores y umbrales son inventados para el videojuego.
- Fase de tormenta solar: los dos deben acudir a estaciones distintas del refugio y sostener su acción simultáneamente para sellar el refugio.
- Sistema de salas con enlace privado de 6 caracteres y WebSockets. Límite de dos jugadores simultáneos por sala.

## Investigación y fuentes reales

1. NASA — Apollo 13: adaptador de filtros cuadrados a tomas redondas, creado por el equipo en Houston y astronautas con materiales a bordo: https://www.nasa.gov/history/houston-weve-had-a-problem/
2. NASA — Environmental Control and Life Support Systems (reciclaje de agua y generación de oxígeno): https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/
3. NASA — Cultivar plantas en el espacio; Veggie, LEDs y agua/nutrientes: https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/
4. NASA — Space radiation: https://www.nasa.gov/humans-in-space/space-radiation/
5. Reto NASA Space Apps Challenge 2026: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

**Precisiones:** Apollo 13 involucró a Jim Lovell, Jack Swigert y Fred Haise, no a los cuatro personajes de selección. Aurora es ficticia. Los escenarios de protección y los parámetros de minijuegos son representaciones educativas, no física validada por NASA.

## Cómo probar

1. Abre el enlace del juego en dos navegadores/dispositivos distintos.
2. Jugador 1 pulsa "Crear sala para dos" y envía el enlace; jugador 2 entra.
3. Ambos eligen su personaje. Mueven con WASD/flechas, clic en el mapa o joystick en móvil.
4. Al llegar a un dispositivo, pulsa **E** o **USAR**. Observa los controles de cada minijuego.
5. Si quieres música, activa `♫ Música` (apagada inicialmente).

## Pruebas

- Validación de sintaxis de servidor Node y JavaScript de interfaz.
- Prueba real mediante dos conexiones WebSocket locales: creación de sala, dos personajes distintos y progreso exitoso por las seis fases.
- Inspección visual del nuevo sprite-sheet con cuatro cuadros por personaje.
- Pendiente: pruebas de usabilidad con niños y validación visual integral de esta versión en navegadores reales. Se debe verificar la comodidad del control en celulares tras publicarse.

## Limitaciones

- Demostración conceptual separada de cualquier entrega oficial de hackatón.
- La sala vive en memoria y puede desaparecer cuando el servicio gratuito de Render se suspende o reinicia.
- La mayoría de fotografías de archivo se cargan desde servicios externos; pueden fallar según su disponibilidad.
- No hay cuentas, contraseñas ni compras.