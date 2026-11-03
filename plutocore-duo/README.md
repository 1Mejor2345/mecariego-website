# PlutoCore · Academia del tiempo — 8.0

Juego cooperativo para 7–12 años. Dos alumnos alienígenas del año 3026 recorren una nave por salas, abren paneles, resuelven simulaciones y descubren hechos documentados de la historia espacial. La clase acaba con un diploma compartido.

## Jugar

La opción principal es CON AMIGO: un alumno crea la clase y comparte el código o enlace; el otro entra desde otro dispositivo. Cada uno pulsa LISTO. Flechas o WASD para caminar; botones táctiles equivalentes. E o ABRIR PANEL cerca del panel. Ambos deben acercarse y abrir. El portón a la siguiente sala se desbloquea tras descubrir el archivo. PRACTICAR permite controlar las tareas de ambos puestos con un acompañante automático; no es un segundo jugador humano.

- Laika: uno cuida el aire y el otro enfría. Mantienen ambas condiciones seguras a la vez.
- Apollo 13: uno coloca cartón y filtro; el otro coloca bolsa, tubo y cinta. Después prueban el adaptador.
- Sally Ride: primero el alumno 1 acerca la pinza, después el 2 la baja y el 1 devuelve el satélite a la bodega.
- Intelsat VI: cada uno frena y ambos mantienen sus pinzas al mismo tiempo. Un robot representa la tercera ayuda histórica.
- Aurora: comparten seis baterías entre aire, comida y refugio. Es un examen ficticio inspirado en Junior Astronaut Mission Trainer.

Después de cada reto aparece automáticamente una imagen, qué pasó de verdad y por qué importó. La narración se reproduce en español. Los dos responden una pregunta con reintentos libres antes de seguir caminando. No hay muerte del jugador, puntuación por velocidad, chat, cuentas, anuncios ni compras.

## Historia, ficción y fuentes

Los alumnos y la academia son ficción; no se afirma que cambiaron el pasado. Laika no fue rescatada: su ficha explica que no podía volver y murió durante el viaje. Su reto es una simulación educativa de cuidados. Los dos turnos de Sally, las dos pinzas de Intelsat, las piezas y los tiempos son simplificaciones, no procedimientos reales.

- Laika, 1957: https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/
- Apollo 13, 1970: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/
- Sally Ride / STS-7, 1983: https://www.nasa.gov/history/40-years-ago-sts-7-and-the-flight-of-sally-ride/
- Intelsat VI / STS-49, 1992: https://www.nasa.gov/image-article/may-13-1992-record-setting-spacewalk-shuttle-endeavours-first-mission/
- Examen ficticio: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

## Imágenes y sonido

Fotos históricas, crédito NASA, alojadas localmente y con sus pies visibles:

- history/apollo.jpg: tripulación antes de la misión; https://www.nasa.gov/wp-content/uploads/2020/04/as13-503b_70pc-73_crew_posing_at_pad_39a_4.6.70.jpg ; contexto https://www.nasa.gov/history/apollo-13-crew-returns-safely-to-earth/
- history/sally.jpg: SPAS-01 y brazo robótico; https://www.nasa.gov/wp-content/uploads/2023/06/sts_7_21_spas_and_rms.jpg
- history/team.jpg: Hieb, Akers y Thuot con Intelsat VI; https://www.nasa.gov/wp-content/uploads/2023/03/s49-91-029.jpg

story-portraits.png procede de ImageGen integrado: atlas transparente de tres astronautas Apollo y Laika con arnés; caricatura semirrealista, sin texto ni logos. Solo la ilustración de Laika se usa en esta versión y se identifica como recreación. Alumnos y escenarios nuevos: dibujos Canvas/CSS originales, sin recursos de Among Us. Aurora usa una ilustración simbólica identificada como ficción.

orbital-theme.wav: música original sintetizada. academy-01 a academy-35.wav: narración sintética española Sabina de Windows; no son grabaciones de astronautas. El juego no depende de tener voces instaladas en el navegador. Tipografía Nunito con alternativa local Segoe UI.

## Implementación y pruebas

Node.js 22 o posterior, sin dependencias. npm start sirve el juego en http://127.0.0.1:3000. npm test completa las dos modalidades, valida límites de acceso al panel, los roles, turnos, agarres simultáneos, respuestas y diploma. Verifica también los 35 audios y las imágenes. Con el servidor activo, npm run test:online recorre la clase entera con dos clientes WebSocket reales. TEST_ORIGIN selecciona otro servidor de prueba.

El servidor es autoritativo para movimiento y tareas online. Si un compañero sale, la clase se detiene; otro puede entrar con el mismo código mientras quede alguien conectado. Las salas están en memoria y no sobreviven a reinicios del servicio. Una sala admite dos conexiones. El modo práctica corre en el navegador. Se requiere red o servidor local para cargar archivos; no se ha instalado caché offline.

La interfaz usa instrucciones cortas, verbos, pictogramas con palabras, colores más números, mano animada, audio y opciones táctiles y de teclado. Referencias de diseño previas: https://www.nngroup.com/articles/kids-cognition/ y https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox . No sustituyen pruebas de comprensión con niños; esas pruebas siguen pendientes. Revisar las bases completas y declaraciones de trabajo previo e IA antes de presentar al concurso.

Los archivos archive.js, story-model.js y sus recursos se conservan como implementación anterior de Apollo 13. El punto de entrada actual usa exclusivamente academy-model.js, academy.js y academy.css.
