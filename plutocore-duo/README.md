# PlutoCore: Volvamos a casa — 7.0

Historia jugable para 7–12 años: un prólogo de Laika, cinco capítulos del rescate real de Apollo 13 y un bonus de base lunar.

## Historia

Laika aparece en 1957. El prólogo cuenta de forma breve, sin imágenes gráficas, que su nave no podía volver y que murió durante el viaje. No se inventa un rescate ni se la presenta como integrante de Apollo 13.

La aventura principal sigue a Jim Lovell, Jack Swigert y Fred Haise: refugiarse en el Acuario, adaptar el filtro de CO₂, ahorrar electricidad, corregir el rumbo y regresar a la Tierra. Los problemas resueltos abren el siguiente capítulo. Al final, Aurora permite aplicar lo aprendido a una base lunar ficticia y al reto Junior Astronaut Mission Trainer.

## Diseñar para entender jugando

Acciones grandes: ABRE, PASA, APAGA, APUNTA, EMPUJA y PEGA. Una instrucción por vez, pictogramas con palabras, flechas y mano que señala. Las ayudas verificadas no superan ocho palabras: es una decisión del proyecto, no un umbral científico universal. VER CÓMO repite la demostración. ESCUCHAR reproduce la instrucción mediante un WAV español, aunque el navegador no tenga voces instaladas. El contexto del capítulo también se narra.

CON AYUDAS presenta una pieza del filtro por vez. SIN AYUDAS permite explorar sin esa selección. Se mantienen toque, botones y teclado donde corresponde. Cualquiera puede pausar en cooperativo. Las explicaciones históricas ampliadas están detrás de ¿PASÓ DE VERDAD?, después del logro. No hay cuentas, compras, anuncios ni rachas.

## Investigación aplicada

Nielsen Norman Group documenta el valor de mostrar el objetivo y el gesto con animación y audio, y las diferencias entre edades. Se sustituyen los párrafos iniciales por demostraciones y acciones concretas; se conservan palabras junto a los símbolos.

https://www.nngroup.com/articles/kids-cognition/
https://www.nngroup.com/articles/childrens-websites-usability-issues/

UNICEF RITEC orienta a favorecer agencia, logro y conexión: aquí se aplica mediante ayudas opcionales, cooperación, repetición sin castigo y pausa. CAST recomienda múltiples representaciones e interacciones: texto corto, imágenes, gesto, audio y formas alternativas de actuar. Estas referencias informan el diseño; no validan este producto con niños.

https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox
https://udlguidelines.cast.org/representation/

## Fuentes históricas y simplificaciones

- Laika: https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/
- Refugio y filtro: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/
- Ahorro, rumbo y regreso: https://www.nasa.gov/history/apollo-13-crew-returns-safely-to-earth/
- Cronología: https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_13h_Timeline.htm
- Reto: https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/

La tripulación pasó entre módulos por el interior; el juego muestra un corte esquemático de cabinas y paso presurizado, no un paseo espacial. Los materiales del filtro representan funciones, no instrucciones de fabricación. Los interruptores, el aro de rumbo, los tiempos, baterías y botones de paracaídas son simplificaciones, no procedimientos reales. Apollo 13 no aterrizó en la Luna. Aurora es ficticia.

## Ejecutar y probar

Node.js 22 o posterior, sin dependencias. Ejecutar npm start y abrir http://127.0.0.1:3000. En individual las reglas corren en el navegador. La primera carga y los archivos necesitan conexión o servidor local; no hay caché offline instalada.

npm test comprueba los cinco capítulos, el bonus, roles, filtro sin sellar, momento de paracaídas, ayudas breves y todos los archivos de voz. Con el servidor activo, npm run test:online conecta dos clientes WebSocket y verifica cooperación, victoria, avance y pausa. TEST_ORIGIN selecciona otro servidor de pruebas.

## Recursos y créditos

public/story-portraits.png es un atlas de Lovell, Swigert, Haise y Laika generado con la herramienta integrada ImageGen. No son fotografías. Prompt: cuadrícula transparente 2×2; retratos caricaturizados semirrealistas de los tres astronautas con cascos Apollo de 1970 y Laika como perrita con arnés, sin casco; estilo amable y uniforme, sin texto ni logotipos. Laika es un recuerdo histórico, no una viajera de Apollo 13.

Pictogramas y escenarios: SVG y Canvas. orbital-theme.wav: música original sintetizada. voice/story-*.wav: frases originales con síntesis de voz española de Windows (Sabina), enlazadas en kid-voice-map.js. No son voces de astronautas ni grabaciones históricas.

## Verificación pendiente

Las pruebas confirman funcionamiento y consistencia de las ayudas. Falta probar comprensión y comodidad con niños de 7–12 años. No se promete comprensión instantánea para todas las personas.

Los sellos y el prólogo visto se guardan localmente. Las salas viven en memoria y se pierden con reinicios. Antes de entregar al concurso hay que revisar las bases completas y declarar el trabajo previo y el uso de IA según corresponda.
