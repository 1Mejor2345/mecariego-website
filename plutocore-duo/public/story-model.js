(function(root){'use strict';
const Legacy=typeof module!=='undefined'?require('./model'):root.ArchiveGame;
const sources={details:'https://www.nasa.gov/missions/apollo/apollo-13-mission-details/',return:'https://www.nasa.gov/history/apollo-13-crew-returns-safely-to-earth/',laika:'https://www.nasa.gov/history/60-years-ago-the-first-animal-in-orbit/'};
const missions=[
 {title:'¡Al Acuario!',person:'Jim, Jack y Fred',year:'APOLLO 13 · 13 DE ABRIL DE 1970',avatar:0,verb:'Lleva a los tres al refugio.',brief:'La nave perdió energía. El Acuario será su refugio.',discovery:'Tras el fallo del tanque de oxígeno, la tripulación usó el módulo lunar Aquarius como refugio y apagó el módulo de mando para conservar su energía.',source:sources.details},
 {title:'Aire para los tres',person:'Jim, Jack y Fred',year:'APOLLO 13 · CAMINO A CASA',avatar:1,verb:'Construye el adaptador del filtro.',brief:'El aire necesita un filtro. ¡Las piezas no encajan!',discovery:'Desde Houston propusieron un adaptador. La tripulación lo construyó con cartón, bolsas, mangueras y cinta para unir filtros de formas distintas y retirar CO₂.',source:sources.details},
 {title:'Cada batería cuenta',person:'Tripulación y equipo de tierra',year:'APOLLO 13 · AHORRAR PARA VOLVER',avatar:2,verb:'Apaga lo que no necesitan.',brief:'El viaje sigue. Necesitan guardar energía para volver.',discovery:'Se apagaron equipos para ahorrar energía. La cabina se enfrió. Houston preparó un procedimiento para encender de nuevo el módulo de mando antes del regreso. Los tres interruptores de este juego son una simplificación.',source:sources.return},
 {title:'La Tierra en la ventana',person:'Tripulación y equipo de tierra',year:'APOLLO 13 · CORREGIR EL RUMBO',avatar:0,verb:'Mira la Tierra. Después empuja.',brief:'La Tierra está delante. Hay que corregir el rumbo.',discovery:'La tripulación realizó maniobras de corrección con el módulo lunar. En la última fase usó su sistema de navegación para afinar la trayectoria de entrada a la atmósfera. Nuestro aro y la duración del impulso son reglas didácticas.',source:sources.return},
 {title:'¡Los tres a casa!',person:'Jim Lovell, Jack Swigert y Fred Haise',year:'APOLLO 13 · 17 DE ABRIL DE 1970',avatar:2,verb:'Abre los paracaídas para frenar.',brief:'Vuelven a la cápsula. La Tierra ya está cerca.',discovery:'El 17 de abril de 1970, los tres astronautas regresaron vivos al océano Pacífico. El juego resume la separación de módulos, la entrada atmosférica y el descenso con paracaídas; no reproduce los procedimientos reales.',source:sources.return},
 {...Legacy.missions[4],title:'Ahora, tu base',person:'Tu propia tripulación',year:'BONUS · AURORA ES FICTICIA',brief:'Ya sabes cuidar una nave. ¡Prueba con una base lunar!',discovery:Legacy.missions[4].discovery}
];
const clamp=Legacy.clamp;
function scene(i){if(i===0)return{hatch:false,crew:[{name:'Jim',who:0,x:220,y:220,aboard:false,moving:false},{name:'Jack',who:1,x:210,y:350,aboard:false,moving:false},{name:'Fred',who:2,x:310,y:440,aboard:false,moving:false}],safe:0};
 if(i===1){const t=Legacy.create();Legacy.reset(t,1);return t.scene;}
 if(i===2)return{switches:{camera:true,heater:true,lights:true},reserve:25,hold:0};
 if(i===3)return{angle:-45,thrust:false,burn:0,fuel:100};
 if(i===4)return{separated:false,altitude:1,opened:false,landed:false,splash:0};
 const t=Legacy.create();Legacy.reset(t,4);return t.scene;}
function create(mode='solo'){return{version:7,isStory:true,mode,mission:0,status:'brief',clock:0,event:0,notice:'',completed:[],scene:scene(0),inputs:[{},{}]};}
function reset(s,i=s.mission){s.mission=i;s.scene=scene(i);s.status='brief';s.inputs=[{},{}];s.notice='';s.event++;}
function notify(s,msg){s.notice=msg;s.event++;}
function win(s){s.status='won';if(!s.completed.includes(s.mission))s.completed.push(s.mission);notify(s,'¡Un paso más hacia casa!');}
const can=(s,r,n)=>s.mode==='solo'||r===n;
function legacyState(s,i){return{...s,mission:i};}
function syncLegacy(s,t){s.scene=t.scene;s.status=t.status;s.inputs=t.inputs;s.notice=t.notice;s.event=t.event;if(t.status==='won'&&!s.completed.includes(s.mission))s.completed.push(s.mission);}
function command(s,c,r=0){if(!c||typeof c!=='object')return;const k=c.type;
 if(k==='select'&&r===0&&Number.isInteger(c.mission)&&c.mission>=0&&c.mission<6){reset(s,c.mission);return;}
 if(k==='next'&&r===0&&s.status==='won'){reset(s,(s.mission+1)%6);return;}
 if(k==='retry'&&s.status==='retry'){reset(s);s.status='playing';return;}
 if(k==='start'&&s.status==='brief'){s.status='playing';return;}
 if(k==='pause'&&s.status==='playing'){s.status='paused';s.inputs=[{},{}];return;}
 if(k==='resume'&&s.status==='paused'){s.status='playing';return;}
 if(s.status!=='playing')return;
 if(s.mission===1||s.mission===5){const t=legacyState(s,s.mission===1?1:4);Legacy.command(t,c,r);syncLegacy(s,t);return;}
 const g=s.scene;
 if(k==='input'){s.inputs[r]={thrust:c.thrust===true,x:Number(c.x)||0,y:Number(c.y)||0};return;}
 if(s.mission===0){if(k==='hatch'&&can(s,r,1)){g.hatch=true;notify(s,'¡Puerta abierta!');}if(k==='rescue'&&Number.isInteger(c.who)&&c.who>=0&&c.who<3&&can(s,r,c.who===2?1:0)){if(!g.hatch){notify(s,'Primero abre la puerta.');return;}g.crew[c.who].moving=true;}}
 if(s.mission===2&&k==='switch'&&['camera','heater','lights'].includes(c.item)&&can(s,r,c.item==='heater'?1:0)){g.switches[c.item]=!g.switches[c.item];notify(s,g.switches[c.item]?'Encendido.':'¡Ahorramos energía!');}
 if(s.mission===3){if(k==='aim'&&can(s,r,0)){g.angle=0;notify(s,'¡La Tierra está en la ventana!');}if(k==='turn'&&can(s,r,0)){g.angle+=15;if(g.angle>60)g.angle=-60;}}
 if(s.mission===4){if(k==='separate'&&can(s,r,0)){g.separated=true;notify(s,'¡La cápsula sigue hacia casa!');}if(k==='chute'&&can(s,r,1)){if(g.altitude>.5){notify(s,'Espera a la señal.');return;}g.opened=true;notify(s,'¡Los paracaídas frenan la caída!');}}
}
function update(s,dt){if(s.status!=='playing')return;dt=clamp(dt,0,.06);s.clock+=dt;
 if(s.mission===1||s.mission===5){const t=legacyState(s,s.mission===1?1:4);Legacy.update(t,dt);syncLegacy(s,t);return;}
 const g=s.scene;
 if(s.mission===0){for(const p of g.crew)if(p.moving&&!p.aboard){const dest=p.mid?755:420,dx=dest-p.x,dy=305-p.y,d=Math.hypot(dx,dy);p.x+=dx*dt*2.2;p.y+=dy*dt*2.2;if(d<22){if(!p.mid)p.mid=true;else{p.aboard=true;g.safe++;notify(s,p.name+' está a salvo.');}}}if(g.safe===3)win(s);}
 if(s.mission===2){const off=Object.values(g.switches).filter(v=>!v).length;g.reserve=clamp(g.reserve+(off===3?16:-1)*dt,5,100);g.hold=off===3?g.hold+dt:0;if(g.hold>=4)win(s);}
 if(s.mission===3){g.thrust=!!(s.inputs[s.mode==='solo'?0:1]||{}).thrust;const good=Math.abs(g.angle)<=8;if(g.thrust){g.fuel=Math.max(0,g.fuel-4*dt);if(good)g.burn=Math.min(3,g.burn+dt);else{g.burn=Math.max(0,g.burn-dt);if(s.clock%2<dt)notify(s,'Primero mira la Tierra.');}}if(g.burn>=3)win(s);if(g.fuel===0){s.status='retry';notify(s,'Mira la Tierra antes de empujar.');}}
 if(s.mission===4&&g.separated){if(!g.opened)g.altitude=Math.max(.43,g.altitude-dt*.13);else g.altitude=Math.max(0,g.altitude-dt*.08);if(g.altitude===0){g.landed=true;g.splash+=dt;if(g.splash>1.4)win(s);}}
}
const api={missions,sources,create,reset,command,update,clamp,isStory:true};if(typeof module!=='undefined')module.exports=api;else root.ArchiveGame=api;
})(typeof window==='undefined'?globalThis:window);
