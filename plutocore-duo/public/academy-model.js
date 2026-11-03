(function(root){'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rooms=[
 {title:'Laika',year:'1957 · SPUTNIK 2',color:'#b7e0c0',icon:'🐾',subtitle:'Cuidar a quien viaja',intro:'Esto es una simulación de cuidados. Mantengan aire y temperatura en verde.',cooperation:'A LA VEZ',fact:'Laika fue el primer animal en orbitar la Tierra. Su nave no podía regresar. Murió durante el viaje.',why:'Una nave necesita aire y control de temperatura. Cuidar la vida importa tanto como llegar al espacio.',extra:'Nuestro reto imagina una cabina segura para aprender. No cambia lo que le ocurrió a Laika.',image:'laika',caption:'Ilustración de Laika · recreación artística, no fotografía',source:'https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/',question:'¿Qué necesita un ser vivo en una nave?',answers:['Aire y temperatura segura','Solo un cohete muy rápido'],correct:0},
 {title:'El filtro imposible',year:'1970 · APOLLO 13',color:'#f9cd7d',icon:'▧',subtitle:'Inventar con lo que hay',intro:'El filtro cuadrado no encaja. Armen una unión y séllenla juntos.',cooperation:'MITAD Y MITAD',fact:'En Apollo 13, los filtros de repuesto no encajaban. Desde tierra ayudaron a construir un adaptador con materiales de la nave.',why:'El filtro quitaba dióxido de carbono del aire. La cinta sellaba la unión para que el aire pasara por el filtro.',extra:'No fabricaba oxígeno. El juego simplifica el adaptador; no son instrucciones reales de construcción.',image:'history/apollo.jpg',caption:'Tripulación de Apollo 13 · archivo NASA',source:'https://www.nasa.gov/missions/apollo/apollo-13-mission-details/',question:'¿Para qué servía el filtro?',answers:['Para fabricar comida','Para quitar CO₂ del aire'],correct:1},
 {title:'El abrazo de Sally',year:'1983 · STS-7',color:'#c4b6fb',icon:'⌁',subtitle:'Robótica con mucho cuidado',intro:'Primero uno acerca la pinza. Después el otro la baja y recoge el satélite.',cooperation:'POR TURNOS',fact:'Sally Ride operó el brazo robótico del transbordador para soltar y recuperar el satélite SPAS-01.',why:'Un brazo robótico permite mover objetos fuera de la nave. Avanzar con cuidado ayuda a colocarlos donde deben ir.',extra:'Sally fue la primera mujer estadounidense en el espacio. Los dos turnos del juego son una simplificación del trabajo real.',image:'history/sally.jpg',caption:'SPAS-01 y el brazo robótico durante STS-7 · NASA',source:'https://www.nasa.gov/history/40-years-ago-sts-7-and-the-flight-of-sally-ride/',question:'¿Qué ayudó a recuperar el satélite?',answers:['Un brazo robótico','Un imán gigante en la Tierra'],correct:0},
 {title:'Juntos en órbita',year:'1992 · STS-49',color:'#9fdfee',icon:'✦',subtitle:'Un problema, muchas manos',intro:'El satélite gira. Frena de tu lado y mantengan las dos pinzas juntas.',cooperation:'SINCRONIZADOS',fact:'Tras varios intentos, Richard Hieb, Thomas Akers y Pierre Thuot capturaron juntos el satélite Intelsat VI.',why:'Cambiar de plan y colaborar permitió resolver el problema. En el espacio también se aprende al volver a intentar.',extra:'En la historia real participaron tres astronautas en la captura. Aquí dos alumnos y un robot de apoyo los representan.',image:'history/team.jpg',caption:'Tres astronautas con Intelsat VI, 13 de mayo de 1992 · NASA',source:'https://www.nasa.gov/image-article/may-13-1992-record-setting-spacewalk-shuttle-endeavours-first-mission/',question:'¿Qué ayudó cuando el primer plan falló?',answers:['Hacer lo mismo sin hablar','Cambiar el plan y colaborar'],correct:1},
 {title:'Nuestra pequeña Luna',year:'EXAMEN · SIMULACIÓN DEL FUTURO',color:'#eeb6d2',icon:'☾',subtitle:'Aplicar lo que aprendimos',intro:'Hay seis baterías. Compartan la energía entre aire, comida y refugio.',cooperation:'DECIDIR JUNTOS',fact:'Esta base lunar es ficticia. Es su examen: usar lo aprendido sobre cuidados, recursos y trabajo en equipo.',why:'La energía es limitada. Si un sistema recibe todo, los demás se quedan sin energía. Hay que buscar un equilibrio.',extra:'Actividad inspirada en Junior Astronaut Mission Trainer de NASA Space Apps. Las cifras y tiempos son reglas del juego.',image:'base',caption:'Base Aurora · ilustración de una simulación ficticia',source:'https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/',question:'¿Cómo cuidamos toda la base?',answers:['Repartiendo la energía','Dando todo al mismo sistema'],correct:0}
];
function task(i){return i===0?{air:34,temp:84,hold:0}:i===1?{parts:[],tape:0}:i===2?{x:260,y:150,stage:0,hold:0}:i===3?{brakes:[false,false],grips:[false,false],hold:0}: {allocation:[0,0,0],hold:0};}
function create(mode='duo'){return{version:8,mode,phase:'class',mission:0,status:'playing',clock:0,event:0,notice:'',completed:[],students:[{x:210,y:430,walk:0},{x:300,y:470,walk:0}],inputs:[{},{}],accepted:[false,false],opened:[false,false],answers:[false,false],scene:task(0)};}
const panel=i=>i*1100+740;
const can=(s,r,owner)=>s.mode==='solo'||r===owner;
const pair=(s,a)=>s.mode==='solo'?a[0]:a[0]&&a[1];
function clear(s){s.inputs=[{},{}];}
function note(s,t){s.notice=t;s.event++;}
function finish(s){s.phase='fact';s.answers=[false,false];clear(s);note(s,'¡Archivo histórico abierto!');}
function command(s,c,r=0){if(!c||typeof c!=='object'||![0,1].includes(r))return;const k=c.type;
 if(k==='pause'&&s.status==='playing'){s.status='paused';clear(s);return;}
 if(k==='resume'&&s.status==='paused'){s.status='playing';return;}
 if(s.status!=='playing')return;
 if(k==='classReady'&&s.phase==='class'){s.accepted[r]=true;if(pair(s,s.accepted)){s.phase='corridor';clear(s);}return;}
 if(k==='input'){s.inputs[r]={x:clamp(Number(c.x)||0,-1,1),y:clamp(Number(c.y)||0,-1,1),hold:c.hold===true};return;}
 if(s.phase==='corridor'){
  if(k==='open'){const p=s.students[r];if(Math.abs(p.x-panel(s.mission))<165){s.opened[r]=true;if(pair(s,s.opened)){s.phase='task';clear(s);note(s,rooms[s.mission].intro);}}else note(s,'Camina hasta el panel brillante.');}return;
 }
 if(s.phase==='fact'){
  if(k==='answer'){if(c.choice===rooms[s.mission].correct){s.answers[r]=true;note(s,'¡Eso es!');}else note(s,'Prueba otra vez. Mira el porqué.');}
  if(k==='continue'&&pair(s,s.answers)){if(!s.completed.includes(s.mission))s.completed.push(s.mission);if(s.mission===rooms.length-1){s.phase='graduation';clear(s);}else{s.mission++;s.scene=task(s.mission);s.phase='corridor';s.opened=[false,false];s.answers=[false,false];clear(s);note(s,'¡A la siguiente sala!');}}return;
 }
 if(s.phase!=='task')return;const g=s.scene;
 if(s.mission===0&&k==='care'){if(c.item==='air'&&can(s,r,0))g.air=clamp(g.air+28,0,75);if(c.item==='cool'&&can(s,r,1))g.temp=clamp(g.temp-28,35,100);}
 if(s.mission===1){const items=['cardboard','filter','bag','hose'];if(k==='part'&&items.includes(c.item)&&!g.parts.includes(c.item)&&can(s,r,['cardboard','filter'].includes(c.item)?0:1)){if(c.item==='filter'&&!g.parts.includes('cardboard'))return;g.parts.push(c.item);}if(k==='seal'&&g.parts.length===4&&can(s,r,1))g.tape=clamp(g.tape+.24,0,1);if(k==='test'){if(g.parts.length===4&&g.tape>=.9)finish(s);else note(s,'Faltan piezas o cinta. ¡Todavía podemos arreglarlo!');}}
 if(s.mission===2){if(k==='arm'&&g.stage===0&&can(s,r,0)){g.x=Math.min(650,g.x+65);if(g.x===650){g.stage=1;note(s,'¡Ahora baja la pinza!');}}else if(k==='arm'&&g.stage===1&&can(s,r,1)){g.y=Math.min(300,g.y+50);if(g.y===300){g.stage=2;note(s,'¡Satélite enganchado!');}}else if(k==='stow'&&g.stage===2&&can(s,r,0)){g.stage=3;}}
 if(s.mission===3){if(k==='brake')g.brakes[r]=true;if(k==='grip'&&g.brakes[r])g.grips[r]=c.down===true;if(s.mode==='solo'){g.brakes[1]=g.brakes[0];g.grips[1]=g.grips[0];}}
 if(s.mission===4&&k==='energy'&&Number.isInteger(c.system)&&c.system>=0&&c.system<3&&can(s,r,c.system===2?1:0)&&[-1,1].includes(c.delta)){const total=g.allocation.reduce((a,b)=>a+b,0);if(c.delta<0&&g.allocation[c.system]>0)g.allocation[c.system]--;if(c.delta>0&&total<6)g.allocation[c.system]++;}
}
function update(s,dt){if(s.status!=='playing')return;dt=clamp(dt,0,.06);s.clock+=dt;
 if(s.phase==='corridor'){for(let r=0;r<(s.mode==='solo'?1:2);r++){const p=s.students[r],v=s.inputs[r];const dx=v.x||0,dy=v.y||0,n=Math.max(1,Math.hypot(dx,dy));p.x=clamp(p.x+dx/n*330*dt,65,(s.mission+1)*1100-75);p.y=clamp(p.y+dy/n*165*dt,390,505);if(dx||dy)p.walk+=dt*11;if(Math.abs(p.x-panel(s.mission))>=165)s.opened[r]=false;}if(s.mode==='solo'){const a=s.students[0],b=s.students[1];b.x+=(a.x-90-b.x)*dt*4;b.y+=(a.y+28-b.y)*dt*4;b.walk=a.walk;}}
 if(s.phase!=='task')return;const g=s.scene;
 if(s.mission===0){g.air=clamp(g.air-dt*1.5,0,100);g.temp=clamp(g.temp+dt*1.5,0,100);g.hold=g.air>=45&&g.air<=85&&g.temp>=25&&g.temp<=65?g.hold+dt:Math.max(0,g.hold-dt);if(g.hold>=3)finish(s);}
 if(s.mission===2&&g.stage===3){g.x=Math.max(260,g.x-dt*160);g.y=Math.min(390,g.y+dt*60);if(g.x===260&&g.y===390)finish(s);}
 if(s.mission===3){g.hold=g.grips.every(Boolean)?Math.min(3,g.hold+dt):Math.max(0,g.hold-dt*.3);if(g.hold>=3)finish(s);}
 if(s.mission===4){g.hold=g.allocation.every(n=>n>=2)?g.hold+dt:Math.max(0,g.hold-dt);if(g.hold>=3)finish(s);}
}
const api={create,command,update,rooms,panel,clamp,task};if(typeof module!=='undefined')module.exports=api;else root.Academy=api;
})(typeof window==='undefined'?globalThis:window);
