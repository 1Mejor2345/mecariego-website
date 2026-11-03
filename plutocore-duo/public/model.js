/* Shared simulation: browser solo and authoritative online rooms run the same rules. */
(function(root){'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),num=(v,a,b)=>Number.isFinite(Number(v))?clamp(Number(v),a,b):a;
const missions=[
 {id:'eagle',title:'El suelo equivocado',person:'Neil Armstrong y Buzz Aldrin',year:'APOLLO 11 · 1969',avatar:0,verb:'Aterriza más allá de las rocas.',brief:'El lugar previsto está lleno de rocas. Busca el claro y usa pequeños impulsos para bajar despacio.',discovery:'Armstrong tomó el control para evitar un campo de rocas. Aldrin le comunicaba los datos de descenso. Elegir un lugar seguro también costaba combustible.',source:'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.summary.html',concept:'Impulso, inercia y combustible',roles:['Dirige hacia el claro con ← → o toca el terreno.','Mantén IMPULSO para frenar la caída. Suelta para bajar.']},
 {id:'mailbox',title:'Lo que no encajaba',person:'Lovell, Swigert y Haise',year:'APOLLO 13 · 1970',avatar:null,verb:'Inventa una unión que no deje escapar aire.',brief:'Hay filtros de repuesto, pero son cuadrados y la entrada es redonda. Construye una unión con lo que hay a bordo.',discovery:'El equipo de tierra diseñó un adaptador que la tripulación construyó con materiales disponibles: bolsas, cartón, mangueras y cinta. El filtro eliminaba CO₂; no fabricaba oxígeno.',source:'https://www.nasa.gov/missions/apollo/apollo-13-mission-details/',concept:'Diseñar, probar y mejorar',roles:['Arrastra cartón y filtro a la entrada redonda.','Coloca bolsa y manguera; después sella la unión con cinta.']},
 {id:'canadarm',title:'Un abrazo en órbita',person:'Sally Ride',year:'STS-7 · 1983',avatar:1,verb:'Recupera el satélite sin golpearlo.',brief:'SPAS-01 flota junto al transbordador. Lleva la pinza hasta su aro, espera a que se enganche y devuélvelo a la bodega.',discovery:'En STS-7, Sally Ride operó el brazo robótico para desplegar y recuperar SPAS-01. Nuestra grúa simplifica el movimiento del Canadarm: la precisión importa más que la velocidad.',source:'https://www.nasa.gov/history/sally-ride-first-american-woman-in-space/',concept:'Robótica y movimientos precisos',roles:['Controlas el movimiento horizontal de la pinza.','Controlas la altura de la pinza.']},
 {id:'water',title:'El agua que no cae',person:'Chris Hadfield',year:'ISS · 2013',avatar:3,verb:'Recoge el agua con movimientos suaves.',brief:'Exprime la toalla y observa. Luego muévela despacio para reunir las gotas. Prueba también cómo se comportan en la Tierra.',discovery:'Hadfield exprimió una toalla en un experimento propuesto por estudiantes. Gran parte del agua permaneció unida a la tela y sus manos por tensión superficial. En órbita, la tripulación y el agua están en caída libre.',source:'https://www.csa-asc.gc.ca/eng/multimedia/search/video/17862',concept:'Microgravedad y tensión superficial',roles:['Mueves la toalla para recoger las gotas.','Exprimes la tela y comparas Tierra / órbita.']},
 {id:'aurora',title:'Tu propia pequeña Luna',person:'Tu tripulación',year:'AURORA · MISIÓN FICTICIA',avatar:2,verb:'Mantén aire, alimento y protección al mismo tiempo.',brief:'Llegó la noche lunar. Reparte seis baterías entre aire, huerto y refugio. Observa el pronóstico: la tormenta cambia lo que necesitas.',discovery:'Una base depende de sistemas conectados. Si el huerto recibe toda la energía, queda menos para respirar y protegerse. Esta misión es ficticia; sus baterías y tiempos son reglas del juego, no cifras de NASA.',source:'https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/',concept:'Recursos limitados y decisiones',roles:['Reparte la energía entre aire y huerto.','Reparte la energía del refugio según el pronóstico.']}
];
function scene(i){if(i===0)return{x:235,y:120,vx:0,vy:18,targetX:235,fuel:100,thrust:false,pad:745,ground:540};
 if(i===1)return{placed:[],tape:0,air:0,tested:false,flow:0};
 if(i===2)return{x:365,y:280,tx:365,ty:280,vx:0,vy:0,sx:610,sy:235,captured:false,hold:0,battery:100};
 if(i===3)return{squeezed:false,gravity:false,earthSeen:false,x:500,y:390,tx:500,ty:390,drops:[],collected:0,burst:0};
 return{allocation:[2,2,2],air:75,food:70,shield:75,battery:100,elapsed:0,storm:false};}
function create(mode='solo'){return{version:6,mode,mission:0,status:'brief',clock:0,attempt:1,notice:'',event:0,completed:[],scene:scene(0),inputs:[{},{}]};}
function notify(s,msg){s.notice=msg;s.event++;}
function reset(s,i=s.mission){s.mission=i;s.scene=scene(i);s.status='brief';s.inputs=[{},{}];notify(s,'');}
function allowed(s,role,owner){return s.mode==='solo'||role===owner;}
function win(s){s.status='won';if(!s.completed.includes(s.mission))s.completed.push(s.mission);notify(s,'¡Lo conseguiste! Abre el archivo de esta misión.');}
function fail(s,msg){s.status='retry';s.inputs=[{},{}];notify(s,msg);}
function command(s,c,role=0){if(!c||typeof c!=='object')return;const k=c.type;
 if(k==='start'&&s.status==='brief'){s.status='playing';notify(s,'');return;}
 if(k==='retry'){if(s.status==='retry'){s.attempt++;reset(s);s.status='playing';}return;}
 if(k==='select'&&role===0&&Number.isInteger(c.mission)&&c.mission>=0&&c.mission<5){reset(s,c.mission);return;}
 if(k==='next'&&role===0&&s.status==='won'){reset(s,(s.mission+1)%5);return;}
 if(k==='pause'&&s.status==='playing'){s.status='paused';s.inputs=[{},{}];return;}
 if(k==='resume'&&s.status==='paused'){s.status='playing';return;}
 if(s.status!=='playing')return;const m=s.mission,g=s.scene;
 if(k==='input'){s.inputs[role]={x:num(c.x??0,-1,1),y:num(c.y??0,-1,1),thrust:c.thrust===true};return;}
 if(m===0&&k==='target'&&allowed(s,role,0))g.targetX=num(c.x,60,940);
 if(m===1){if(k==='place'&&['cardboard','filter','bag','hose'].includes(c.item)){
  const owner=['cardboard','filter'].includes(c.item)?0:1;if(!allowed(s,role,owner))return;
  if(Math.hypot(num(c.x,0,1000)-590,num(c.y,0,600)-315)>145){notify(s,'Acerca el material a la unión del centro.');return;}
  if(c.item==='filter'&&!g.placed.includes('cardboard')){notify(s,'El cuadrado no entra en el círculo. ¿Qué material puede cambiar la forma de la unión?');return;}
  if(!g.placed.includes(c.item)){g.placed.push(c.item);notify(s,{cardboard:'El cartón crea una unión entre formas distintas.',filter:'El filtro está colocado. Ahora hay que conducir el aire.',bag:'La bolsa envuelve la conexión.',hose:'La manguera conecta el filtro con la cabina.'}[c.item]);}}
  if(k==='tape'&&allowed(s,role,1)){if(g.placed.length<4){notify(s,'Primero coloca las cuatro piezas. La cinta sella el conjunto.');return;}g.tape=clamp(g.tape+num(c.amount,0,.08),0,1);}
  if(k==='test'){g.tested=true;if(g.placed.length<4||g.tape<.85){g.air=0;notify(s,g.placed.length<4?'El aire escapa: faltan piezas. Puedes volver a intentarlo.':'Hay una fuga. Pasa la cinta por la costura marcada.');}else{g.air=1;notify(s,'¡Sin fugas! El aire está pasando por el filtro.');}}}
 if(m===2&&k==='target'){if(allowed(s,role,0))g.tx=num(c.x,250,760);if(allowed(s,role,1))g.ty=num(c.y,130,430);}
 if(m===3){if(k==='target'&&allowed(s,role,0)){g.tx=num(c.x,70,930);g.ty=num(c.y,120,490);}
  if(k==='squeeze'&&allowed(s,role,1)&&!g.squeezed){g.squeezed=true;g.drops=Array.from({length:8},(_,i)=>({x:250+(i%4)*150,y:180+Math.floor(i/4)*130,vx:Math.sin(i*2.3)*12,vy:Math.cos(i*1.7)*9,r:15+i%3,mass:1}));notify(s,'El agua no cae. Las gotas se quedan juntas. Acerca la toalla despacio.');}
  if(k==='gravity'&&allowed(s,role,1)){g.gravity=!g.gravity;if(g.gravity)g.earthSeen=true;notify(s,g.gravity?'Comparación Tierra: aquí el agua sí cae.':'De nuevo en órbita: las gotas flotan.');}}
 if(m===4&&k==='allocate'){const i=c.system;if(!Number.isInteger(i)||i<0||i>2||!allowed(s,role,i===2?1:0))return;const delta=c.delta===1?1:c.delta===-1?-1:0,total=g.allocation.reduce((a,b)=>a+b,0);if(delta>0&&total>=6){notify(s,'Las seis baterías ya están ocupadas. Retira una de otro sistema.');return;}g.allocation[i]=clamp(g.allocation[i]+delta,0,4);}
}
function update(s,dt){if(s.status!=='playing')return;dt=clamp(dt,0,.06);s.clock+=dt;const g=s.scene,a=s.inputs[0]||{},b=s.inputs[1]||{},solo=s.mode==='solo';
 if(s.mission===0){if(a.x)g.targetX=clamp(g.targetX+a.x*220*dt,60,940);g.thrust=solo?!!a.thrust:!!b.thrust;
  const desired=clamp((g.targetX-g.x)*1.5,-105,105);g.vx+=(desired-g.vx)*Math.min(1,dt*2);g.x+=g.vx*dt;
  const burning=g.thrust&&g.fuel>0;g.vy=clamp(g.vy+(18-(burning?43:0))*dt,-35,72);g.y+=g.vy*dt;g.fuel=Math.max(0,g.fuel-(burning?4.8:0)*dt);
  if(g.y<75){g.y=75;g.vy=Math.max(0,g.vy);}if(g.y>=g.ground-42){g.y=g.ground-42;if(Math.abs(g.x-g.pad)<70&&Math.abs(g.vx)<42&&g.vy<35)win(s);else fail(s,Math.abs(g.x-g.pad)>=70?'Ese terreno tiene rocas. Busca el claro iluminado.':'Llegaste demasiado rápido. Usa impulsos cortos antes de tocar el suelo.');}}
 if(s.mission===1){g.flow+=dt*(g.air?1:0);if(g.air&&g.flow>2.2)win(s);}
 if(s.mission===2){if(a.x)g.tx=clamp(g.tx+a.x*160*dt,250,760);if((solo?a.y:b.y))g.ty=clamp(g.ty+(solo?a.y:b.y)*160*dt,130,430);
  const oldx=g.x,oldy=g.y;g.x+=(g.tx-g.x)*Math.min(1,dt*2.8);g.y+=(g.ty-g.y)*Math.min(1,dt*2.8);g.vx=(g.x-oldx)/Math.max(.001,dt);g.vy=(g.y-oldy)/Math.max(.001,dt);const speed=Math.hypot(g.vx,g.vy);g.battery=Math.max(0,g.battery-speed*dt*.018);
  if(!g.captured){g.sy=235+Math.sin(s.clock*.5)*10;const near=Math.hypot(g.x-g.sx,g.y-g.sy)<42;g.hold=clamp(g.hold+(near&&speed<45?dt:-dt),0,1.5);if(g.hold>=1.5){g.captured=true;notify(s,'¡Capturado! Lleva el satélite al rectángulo de la bodega, abajo a la izquierda.');}}
  else{g.sx=g.x;g.sy=g.y;if(Math.hypot(g.x-335,g.y-405)<48&&speed<45)win(s);}
  if(g.battery<=0)fail(s,'Movimientos más cortos ahorran batería. Acércate, espera a que se estabilice y vuelve a la bodega.');}
 if(s.mission===3){if(a.x)g.tx=clamp(g.tx+a.x*200*dt,70,930);if(a.y)g.ty=clamp(g.ty+a.y*200*dt,120,490);
  const oldx=g.x,oldy=g.y;g.x+=(g.tx-g.x)*Math.min(1,dt*5);g.y+=(g.ty-g.y)*Math.min(1,dt*5);const speed=Math.hypot(g.x-oldx,g.y-oldy)/Math.max(.001,dt);
  for(const d of g.drops){if(g.gravity)d.vy+=80*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;
   if(d.x<85||d.x>915){d.vx*=-.8;d.x=clamp(d.x,85,915);}if(d.y<130||d.y>490){d.vy*=-.6;d.y=clamp(d.y,130,490);}
   if(!g.gravity&&Math.hypot(d.x-g.x,d.y-g.y)<d.r+50&&speed<135){d.collected=true;g.collected+=d.mass;}}
  g.drops=g.drops.filter(d=>!d.collected);
  // Nearby drops stick together: conserve mass and approximate volume in a 2D view.
  for(let i=0;i<g.drops.length;i++)for(let j=g.drops.length-1;j>i;j--){const d=g.drops[i],e=g.drops[j];if(!g.gravity&&Math.hypot(d.x-e.x,d.y-e.y)<(d.r+e.r)*.8){const total=d.mass+e.mass;d.vx=(d.vx*d.mass+e.vx*e.mass)/total;d.vy=(d.vy*d.mass+e.vy*e.mass)/total;d.x=(d.x*d.mass+e.x*e.mass)/total;d.y=(d.y*d.mass+e.y*e.mass)/total;d.mass=total;d.r=Math.sqrt(d.r*d.r+e.r*e.r);g.drops.splice(j,1);}}
  if(g.collected>=8)win(s);}
 if(s.mission===4){const wasStorm=g.storm;g.elapsed+=dt;g.storm=g.elapsed>=13&&g.elapsed<27;if(g.storm&&!wasStorm)notify(s,'Llegó la tormenta. El refugio necesita más energía.');if(!g.storm&&wasStorm)notify(s,'La tormenta pasó. Puedes devolver energía al huerto.');const [air,food,shield]=g.allocation;
  g.air=clamp(g.air+(air-1.5)*6*dt,0,100);g.food=clamp(g.food+(food-1.6)*4*dt,0,100);g.shield=clamp(g.shield+(shield-(g.storm?3.5:1))*7*dt,0,100);
  if(Math.min(g.air,g.food,g.shield)<=0)fail(s,g.air<=0?'El aire necesita energía continua. Reserva baterías para él.':g.food<=0?'Sin luz ni riego, el huerto pierde su reserva. No lo dejes sin energía tanto tiempo.':'La tormenta necesita más protección. Mira el pronóstico y mueve baterías al refugio.');
  else if(g.elapsed>=38)win(s);}
}
const api={missions,create,reset,command,update,clamp};if(typeof module!=='undefined')module.exports=api;else root.ArchiveGame=api;
})(typeof window==='undefined'?globalThis:window);
