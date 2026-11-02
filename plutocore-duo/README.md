# PlutoCore: Archivo de lo imposible — 5.0

Reconstrucción del juego: nuevas escenas, reglas, controles, navegación, audio y protocolo cooperativo. La versión anterior permanece en el historial de Git.

## Experiencia

Cinco misiones abiertas desde el comienzo. Cada una empieza con un contexto breve, permite experimentar, muestra consecuencias y termina con una explicación histórica y su fuente. No hay cuestionarios. Los errores dan una pista y permiten repetir.

1. **El suelo equivocado — Apollo 11 (1969).** Desviar el Eagle de las rocas y aterrizar con velocidad baja y combustible restante. Cooperativo: dirección / impulso.
2. **Lo que no encajaba — Apollo 13 (1970).** Construir el adaptador del filtro con cartón, filtro, bolsa, manguera y cinta. Un filtro sin adaptador no encaja; sin sellar, pierde aire. Cooperativo: montaje / conducción y sellado.
3. **Un abrazo en órbita — STS-7 (1983).** Capturar SPAS-01 con el brazo robótico, estabilizar la pinza y volver a la bodega. Cooperativo: posición horizontal / altura.
4. **El agua que no cae — ISS (2013).** Exprimir una toalla y recoger gotas con movimientos suaves. Comparar con la Tierra. Las gotas cercanas se unen conservando su cantidad de agua en la representación. Cooperativo: toalla / experimento.
5. **Tu propia pequeña Luna — Aurora ficticia.** Repartir seis baterías entre aire, huerto y refugio. La tormenta cambia la demanda; dejar la distribución inicial no permite completar la misión. Cooperativo: aire y huerto / refugio.

Los cascos de astronautas son ilustraciones generadas con IA. El personaje de Mae en Aurora es un homenaje visual dentro de una historia ficticia, no una misión histórica suya. La misión Apollo 13 identifica correctamente a Lovell, Swigert y Haise.

## Ejecutar y probar

Node.js 22 o posterior; sin dependencias.

```sh
npm start
```

Abrir http://127.0.0.1:3000. El modo individual ejecuta las reglas dentro del navegador; una vez cargados los archivos no depende de un servidor de partidas. No hay una caché offline instalada: el primer acceso necesita conexión o un servidor local.

```sh
npm test
```

Simula las cinco misiones en individual y con roles separados. Comprueba aterrizaje, orden funcional del adaptador, fugas, captura, agua, reparto de recursos y consecuencias de no cambiarlo.

Con el servidor en otra terminal:

```sh
npm run test:online
```

Conecta dos clientes WebSocket reales, comprueba funciones distintas, resuelve Apollo 13 entre ambos y verifica victoria, pausa y avance compartidos. TEST_ORIGIN permite apuntar a otro servidor de prueba.

## Audio

orbital-theme.wav contiene una composición original de 24 segundos en bucle: acordes suaves y arpegios. Se reproduce mediante un elemento HTMLAudioElement, activado en el mismo gesto de pulsar Jugar. El botón muestra si está sonando y permite silenciarlo; el control de volumen afecta música y efectos. Si el navegador impide reproducir, muestra Activar audio. Los efectos de interacción y éxito usan Web Audio. No se usan grabaciones históricas ni canciones comerciales.

## Fuentes históricas

- Apollo 11 Lunar Surface Journal, misión y elección de terreno: https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.summary.html
- Apollo 13, filtros incompatibles y adaptación: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/
- Sally Ride y despliegue/recuperación de SPAS-01: https://www.nasa.gov/history/sally-ride-first-american-woman-in-space/
- Experimento de Chris Hadfield propuesto por Kendra Lemke y Meredith Faulkner: https://www.csa-asc.gc.ca/eng/multimedia/search/video/17862
- NASA APOD, descripción del experimento y tensión superficial: https://science.nasa.gov/image-article/apod-2013-april-24-wringing-a-wet-towel-in-orbit/
- Reto de referencia, Build a Junior Astronaut Mission Trainer: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

## Qué es histórico y qué es una regla del juego

Los hechos y participantes se basan en las fuentes anteriores. La pista de aterrizaje, tiempos, combustible, velocidad, espacio de trabajo del brazo, cantidad de gotas y baterías son valores didácticos. El adaptador representa la función de los materiales, no instrucciones de fabricación ni una réplica del diseño original. La recogida de gotas con la toalla es una ampliación jugable del experimento de Hadfield, no una reproducción exacta de cada acción del video. Las gotas se dibujan en dos dimensiones y no constituyen una simulación de fluidos validada.

Aurora traslada el aprendizaje al reto de operar una base lunar, con demandas simultáneas y recursos limitados. No se presenta como hecho histórico ni como una entrega aceptada del concurso. La revisión de bases completas y la declaración del trabajo anterior al evento deben hacerse antes de una presentación oficial.

## Implementación y límites

model.js comparte reglas entre navegador individual y servidor cooperativo. El servidor controla el estado, valida funciones y comparte resultados; no confía en una señal de victoria enviada por el cliente. Los mandos de teclado, botones y destino por toque se explican al comenzar. Apollo 13 acepta selección + toque y arrastre. Los textos no dependen solo del color.

El pasaporte de sellos se guarda localmente en el navegador. No hay cuentas ni mensajería. Las salas cooperativas viven en memoria y se pierden si Render reinicia; al desconectarse alguien se detiene la simulación hasta reunir de nuevo dos personas. Los personajes tienen animación de flotación, movimiento de brazos y pasos en Aurora. La preferencia del sistema de movimiento reducido elimina las animaciones decorativas principales.

Hace falta una prueba de comprensión y comodidad con niños de 7–12 años para validar la experiencia educativa; las pruebas automáticas no la sustituyen.
