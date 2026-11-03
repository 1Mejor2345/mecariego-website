(function(root){'use strict';
const cards=[
 {title:'ATERRIZA',name:'Neil · Apollo 11',icon:'rocket',color:'#ffd26f',goal:'Lleva la nave al círculo.',fact:'Neil evitó las rocas para aterrizar.',story:'Neil Armstrong y Buzz Aldrin, Apollo 11, 1969.'},
 {title:'CONSTRUYE',name:'Apollo 13',icon:'filter',color:'#9be7c2',goal:'Une el filtro con la entrada.',fact:'El cartón y la cinta ayudaron a limpiar el aire.',story:'Lovell, Swigert y Haise, Apollo 13, 1970.'},
 {title:'ATRAPA',name:'Sally · STS-7',icon:'satellite',color:'#d0b9ff',goal:'Lleva la mano hasta el aro.',fact:'Sally usó un brazo robot para recuperar un satélite.',story:'Sally Ride, STS-7, 1983.'},
 {title:'JUNTA AGUA',name:'Chris · ISS',icon:'drop',color:'#93def8',goal:'Toca una gota para recogerla.',fact:'En órbita, el agua se mantiene unida y flota.',story:'Chris Hadfield, ISS, 2013. Experimento propuesto por estudiantes.'},
 {title:'CUIDA LA BASE',name:'Tu misión · Aurora',icon:'base',color:'#ffbda0',goal:'Dale energía a quien la necesita.',fact:'El aire, el huerto y el refugio comparten energía.',story:'Aurora es una misión inventada. Sus recursos son reglas del juego.'}
];
const tools=[['cardboard','CARTÓN','cardboard'],['filter','FILTRO','filter'],['bag','BOLSA','bag'],['hose','TUBO','hose'],['tape','CINTA','tape']];
function nextPiece(g){return tools.slice(0,4).find(t=>!g.placed.includes(t[0]))?.[0]||(g.tape<.85?'tape':'test');}
function guide(s,mode='solo',role=0,picked=false){const g=s.scene,i=s.mission,can=r=>mode==='solo'||r===role;
 if(i===0){if(can(0)&&Math.abs(g.x-g.pad)>95)return{key:'land-target',text:'Toca el círculo.',x:g.pad,y:505,icon:'tap'};
 if(can(1))return g.vy>30?{key:'land-brake',text:'Mantén FRENA.',selector:'[data-hold="thrust"]',icon:'hold'}:{key:'land-release',text:'Suelta para bajar.',x:g.x,y:g.y+90,icon:'down'};
 return{key:'land-team',text:'Tu compañero frena. Tú diriges.',x:g.pad,y:505,icon:'tap'};}
 if(i===1){const item=nextPiece(g),owner=['cardboard','filter'].includes(item)?0:1;
 if(item==='test')return{key:'assembly-test',text:'Pulsa PRUEBA.',selector:'#testFilter',icon:'play'};
 if(!can(owner))return{key:'assembly-team-'+item,text:'Ahora le toca a tu compañero.',x:590,y:315,icon:'team'};
 if(item==='tape')return{key:'assembly-tape',text:'Mantén PEGA.',selector:'[data-hold="tape"]',x:590,y:315,icon:'hold'};
 const name=tools.find(t=>t[0]===item)[1];return picked?{key:'place-'+item,text:'Ahora toca AQUÍ.',x:590,y:315,icon:'tap'}:{key:'pick-'+item,text:'Toca '+name+'.',selector:'[data-tool="'+item+'"]',x:590,y:315,icon:'tap'};}
 if(i===2){if(g.captured)return{key:'arm-home',text:'Ahora toca la caja.',x:335,y:405,icon:'tap'};const near=Math.hypot(g.x-g.sx,g.y-g.sy)<45;return near?{key:'arm-wait',text:'Espera. La mano está agarrando.',x:g.sx,y:g.sy,icon:'wait'}:{key:'arm-ring',text:mode==='duo'?(role===0?'Mueve la mano: izquierda o derecha.':'Mueve la mano: arriba o abajo.'):'Toca el aro.',x:g.sx,y:g.sy,icon:'tap'};}
 if(i===3){if(!g.squeezed)return{key:'water-squeeze',text:can(1)?'Pulsa EXPRIME.':'Tu compañero exprime la toalla.',selector:'#squeeze',x:500,y:390,icon:'tap'};
 if(g.gravity)return{key:'water-space',text:can(1)?'Vuelve al espacio.':'Tu compañero cambia a ESPACIO.',selector:'#gravity',icon:'tap'};
 if(!can(0))return{key:'water-team',text:'Tu compañero junta las gotas.',icon:'team'};
 const d=[...g.drops].sort((a,b)=>Math.hypot(a.x-g.x,a.y-g.y)-Math.hypot(b.x-g.x,b.y-g.y))[0];return{key:'water-collect',text:'Toca una gota. Espera.',x:d?.x||500,y:d?.y||300,icon:'tap'};}
 const stormSoon=g.storm||g.elapsed>7&&g.elapsed<27,desired=stormSoon?[2,1,3]:[2,2,2];
 const donor=g.allocation.findIndex((n,i)=>n>desired[i]),recipient=g.allocation.findIndex((n,i)=>n<desired[i]),total=g.allocation.reduce((a,b)=>a+b,0);
 if(recipient<0)return{key:'base-balanced',text:g.storm?'¡Refugio protegido!':'¡La base funciona!',icon:'battery'};
 if(total>=6&&donor>=0){const owner=donor===2?1:0;return{key:'base-take-'+donor,text:can(owner)?'Toma una batería.':'Tu amigo toma una batería.',selector:can(owner)?'[data-energy="'+donor+'"][data-delta="-1"]':null,icon:'battery'};}
 const owner=recipient===2?1:0;return{key:'base-give-'+recipient,text:can(owner)?['Dásela al AIRE.','Dásela al HUERTO.','Dásela al REFUGIO.'][recipient]:'Tu amigo coloca la batería.',selector:can(owner)?'[data-energy="'+recipient+'"][data-delta="1"]':null,x:[190,500,810][recipient],y:[380,340,380][recipient],icon:'battery'};

}
function icon(name){const common='viewBox="0 0 120 100" aria-hidden="true" focusable="false"';const p={
 rocket:'<path d="M47 68 34 83h20l6-12 6 12h20L73 68" fill="#a4cde0"/><path d="M60 7Q34 30 41 66h38Q86 30 60 7Z" fill="#f9fbf5" stroke="#193d61" stroke-width="4"/><circle cx="60" cy="38" r="12" fill="#68c9ef" stroke="#193d61" stroke-width="4"/><path d="M53 75 60 95 67 75" fill="#ff955e"/>',
 satellite:'<path d="M12 33h28v34H12zm68 0h28v34H80z" fill="#719bdf" stroke="#18395b" stroke-width="4"/><path d="M40 50H80" stroke="#fff" stroke-width="6"/><rect x="39" y="22" width="42" height="56" rx="10" fill="#ffe1a2" stroke="#18395b" stroke-width="4"/><circle cx="60" cy="13" r="9" fill="none" stroke="#9aefce" stroke-width="5"/><path d="M22 35v31m69-31v31" stroke="#bfe9ff" stroke-width="3"/>',
 filter:'<rect x="24" y="17" width="70" height="68" rx="9" fill="#f1e7ba" stroke="#193d61" stroke-width="5"/><path d="M38 29v44m15-44v44m15-44v44m15-44v44" stroke="#6c9da3" stroke-width="5"/><path d="M4 50H24m70 0h23" stroke="#8ae9d1" stroke-width="8"/>',
 drop:'<path d="M60 8Q18 49 29 73q9 25 31 24 25 0 33-24Q104 49 60 8Z" fill="#72d8fb" stroke="#24567a" stroke-width="4"/><path d="M42 56q-9 15 3 23" fill="none" stroke="#e5fbff" stroke-width="7" stroke-linecap="round"/>',
 base:'<path d="M12 75V53a25 25 0 0 1 50 0v22zm46 0V43a26 26 0 0 1 52 0v32z" fill="#a7e1c4" stroke="#254b66" stroke-width="4"/><rect x="73" y="48" width="17" height="27" rx="4" fill="#315d78"/><path d="m16 85 20-17 19 17" fill="#ffd589"/><path d="M19 54h36" stroke="#f1f5d3" stroke-width="8"/>',
 cardboard:'<path d="m15 28 69-13 24 18-68 16z" fill="#f1c992" stroke="#4d5d65" stroke-width="4"/><path d="m15 28 25 21v38L15 67zm25 21 68-16v38L40 87Z" fill="#d6a975" stroke="#4d5d65" stroke-width="4"/>',
 bag:'<path d="M28 20h64l-5 65H33Z" fill="#d4f4ff99" stroke="#3c6c82" stroke-width="5"/><path d="M43 20V10h34v10M45 35v35m28-35v35" stroke="#7caeb6" stroke-width="4" fill="none"/>',
 hose:'<path d="M18 80V40q0-20 20-20t20 20v20q0 20 20 20t20-20V24" fill="none" stroke="#80b4c0" stroke-width="17" stroke-linecap="round"/><path d="M9 72h18m62-40h18" stroke="#e7f2df" stroke-width="9"/>',
 tape:'<ellipse cx="60" cy="40" rx="37" ry="28" fill="#ffdf8e" stroke="#3b5a6a" stroke-width="4"/><ellipse cx="60" cy="40" rx="19" ry="14" fill="#315a6b"/><path d="M25 43v29q26 18 70 0V43" fill="#e9c677" stroke="#3b5a6a" stroke-width="4"/><path d="m70 67 29 20 17-10-21-16" fill="#fff1b7"/>',
 hand:'<path d="M48 51V20q0-10 10-10t10 10v27q8-9 15 1 10-5 14 7l-2 24q-4 17-20 17H54q-12-2-18-13L22 62q-4-12 8-12l18 14" fill="#fff2d0" stroke="#244964" stroke-width="4"/>',
 wind:'<path d="M12 35h60q24-25 34-5t-15 19H12m0 17h59q24 0 21 16T70 85" fill="none" stroke="#71cce8" stroke-width="8" stroke-linecap="round"/>',
 plant:'<path d="M60 80V32" stroke="#44865b" stroke-width="9"/><path d="M58 53Q19 55 21 22q34-5 37 31m5-11Q98 46 102 13 68 6 63 42" fill="#8dd5a0" stroke="#44865b" stroke-width="3"/><path d="M30 77h60l-10 20H40Z" fill="#ddaa8b"/>',
 shield:'<path d="M60 8 102 24v28Q99 81 60 96 21 81 18 52V24Z" fill="#c7b5ff" stroke="#405180" stroke-width="5"/><path d="m36 52 17 17 32-34" fill="none" stroke="#fffbe3" stroke-width="8"/>',
 battery:'<rect x="29" y="20" width="62" height="72" rx="9" fill="#ffe39a" stroke="#435569" stroke-width="5"/><path d="M47 9h26v11H47" fill="#bad3dc"/><path d="m65 29-20 29h15l-6 24 24-35H63Z" fill="#f4a25d"/>',
 play:'<path d="m37 14 58 37-58 37z" fill="currentColor"/>',
 left:'<path d="M104 38H52V16L10 50l42 34V62h52Z" fill="currentColor"/>',
 right:'<path d="M16 38h52V16l42 34-42 34V62H16Z" fill="currentColor"/>',
 up:'<path d="M47 92V40H25L60 6l35 34H73v52Z" fill="currentColor"/>',
 down:'<path d="M47 8v52H25l35 34 35-34H73V8Z" fill="currentColor"/>'};
 return '<svg '+common+'>'+(p[name]||p.hand)+'</svg>';}
const api={cards,tools,nextPiece,guide,icon};if(typeof module!=='undefined')module.exports=api;else root.KidUI=api;
})(typeof window==='undefined'?globalThis:window);
