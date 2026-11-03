(function(root){'use strict';const K=root.KidUI,oldGuide=K.guide;
K.cards=[
 {title:'REFUGIO',name:'1 · El Acuario',icon:'rocket',color:'#ffd26f',goal:'Lleva a los tres al refugio.',fact:'¡Jim, Jack y Fred están a salvo!',story:'Apollo 13 · 13 de abril de 1970.'},
 {title:'AIRE',name:'2 · El filtro',icon:'filter',color:'#9be7c2',goal:'Construye el adaptador del filtro.',fact:'¡El aire pasa por el filtro!',story:'Apollo 13 · Un adaptador hecho a bordo.'},
 {title:'ENERGÍA',name:'3 · Las baterías',icon:'battery',color:'#d0b9ff',goal:'Apaga lo que no necesitan.',fact:'¡Tienen energía guardada para volver!',story:'Apollo 13 · Ahorrar electricidad para el regreso.'},
 {title:'RUMBO',name:'4 · Hacia la Tierra',icon:'rocket',color:'#93def8',goal:'Mira la Tierra. Después empuja.',fact:'¡Ahora van hacia la Tierra!',story:'Apollo 13 · Correcciones de trayectoria.'},
 {title:'CASA',name:'5 · Los tres regresan',icon:'shield',color:'#ffbda0',goal:'Abre los paracaídas para frenar.',fact:'¡Los tres regresaron vivos a la Tierra!',story:'17 de abril de 1970 · Océano Pacífico.'},
 {title:'MI BASE',name:'Bonus · Aurora',icon:'base',color:'#ffbda0',goal:'Dale energía a quien la necesita.',fact:'¡Tu base sigue funcionando!',story:'Aurora es ficticia: aquí aplicas lo aprendido.'}
];
const baseIcon=K.icon;K.icon=function(name){const shapes={camera:'<rect x="18" y="30" width="84" height="57" rx="12" fill="#adcfe0" stroke="#244967" stroke-width="5"/><path d="M34 30V17h28v13" fill="#bdd8e0" stroke="#244967" stroke-width="4"/><circle cx="65" cy="58" r="20" fill="#65c9e7" stroke="#244967" stroke-width="6"/>',lights:'<path d="M60 9a30 30 0 0 0-20 53v13h40V62A30 30 0 0 0 60 9Z" fill="#ffeaa0" stroke="#315570" stroke-width="5"/><path d="M42 79h36m-31 10h26" stroke="#b7c9c8" stroke-width="7"/>',heater:'<rect x="18" y="14" width="84" height="77" rx="12" fill="#c5d9d7" stroke="#315570" stroke-width="4"/><path d="m39 27-6 12 10 13-10 13 7 14m20-52-6 12 10 13-10 13 7 14m20-52-6 12 10 13-10 13 7 14" fill="none" stroke="#df986d" stroke-width="6"/>',parachute:'<path d="M12 43a48 36 0 0 1 96 0Z" fill="#ffd4ba" stroke="#315570" stroke-width="4"/><path d="M12 43 52 87m56-44L68 87M60 8v79" stroke="#e4eee0" stroke-width="4"/><rect x="48" y="82" width="24" height="14" rx="4" fill="#8dc9dd"/>'};return shapes[name]?'<svg viewBox="0 0 120 100" aria-hidden="true">'+shapes[name]+'</svg>':baseIcon(name);};
K.prologue=[
 {line:'Laika viajó al espacio en 1957.',voice:'Laika viajó al espacio en mil novecientos cincuenta y siete.',year:'LAIKA · 1957',dog:true},
 {line:'Su nave no podía volver.',voice:'Su nave no podía volver.',year:'UN VIAJE SIN REGRESO',dog:true},
 {line:'Laika murió durante el viaje.',voice:'Laika murió durante el viaje.',year:'LA RECORDAMOS',dog:true},
 {line:'Su historia nos recuerda cuidar a cada viajero.',voice:'Su historia nos recuerda cuidar a cada viajero.',year:'CUIDAR IMPORTA',dog:true},
 {line:'Años después, tres astronautas necesitaron volver a casa.',voice:'Años después, tres astronautas necesitaron volver a casa.',year:'APOLLO 13 · 1970',dog:false},
 {line:'Ellos son Jim, Jack y Fred. ¡Vamos a ayudar!',voice:'Ellos son Jim, Jack y Fred. Vamos a ayudar.',year:'UNA HISTORIA REAL',dog:false}
];
K.guide=function(s,mode='solo',role=0,picked=false){const g=s.scene,i=s.mission,can=n=>mode==='solo'||role===n;
 if(i===1)return oldGuide(s,mode,role,picked);
 if(i===5)return oldGuide({...s,mission:4},mode,role,picked);
 if(i===0){if(!g.hatch)return{key:'rescue-hatch',text:can(1)?'Abre la puerta.':'Tu amigo abre la puerta.',selector:can(1)?'#hatchBtn':null,x:755,y:305,icon:'tap'};const who=g.crew.findIndex(p=>!p.aboard&&!p.moving);if(who<0)return{key:'rescue-wait',text:'¡Van al refugio!',icon:'wait'};const p=g.crew[who],owner=who===2?1:0;return{key:'rescue-'+who,text:can(owner)?'Toca a '+p.name+'.':'Tu amigo ayuda a '+p.name+'.',selector:can(owner)?'#rescue-'+who:null,x:p.x,y:p.y-55,icon:'tap'};}
 if(i===2){const item=['camera','lights','heater'].find(k=>g.switches[k]);if(!item)return{key:'energy-wait',text:'¡La batería se llena!',icon:'battery'};const name={camera:'la cámara',lights:'la luz extra',heater:'el calor'},owner=item==='heater'?1:0;return{key:'energy-'+item,text:can(owner)?'Apaga '+name[item]+'.':'Tu amigo apaga '+name[item]+'.',selector:can(owner)?'#switch-'+item:null,x:{camera:230,lights:500,heater:770}[item],y:300,icon:'tap'};}
 if(i===3){if(Math.abs(g.angle)>8)return{key:'course-aim',text:can(0)?'Toca la Tierra.':'Tu amigo apunta a la Tierra.',selector:can(0)?'#aimBtn':null,x:800,y:205,icon:'tap'};return{key:'course-burn',text:can(1)?'Mantén EMPUJA.':'Tu amigo enciende el motor.',selector:can(1)?'[data-hold="thrust"]':null,icon:'hold'};}
 if(!g.separated)return{key:'return-separate',text:can(0)?'Pulsa SEPARA.':'Tu amigo separa los módulos.',selector:can(0)?'#separateBtn':null,x:500,y:255,icon:'tap'};
 if(g.opened)return{key:'return-home',text:'¡Volvemos a casa!',icon:'wait'};
 if(g.altitude>.5)return{key:'return-wait',text:'Espera la señal.',x:500,y:160,icon:'wait'};
 return{key:'return-open',text:can(1)?'Pulsa ABRE.':'Tu amigo abre los paracaídas.',selector:can(1)?'#chuteBtn':null,icon:'tap'};
};
})(window);
