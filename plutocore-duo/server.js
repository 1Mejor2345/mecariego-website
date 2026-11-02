'use strict';
// PlutoCore Duo - tiny dependency-free, authoritative 2-player WebSocket game server.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PORT = Number(process.env.PORT) || 3000;
const BASE = path.join(__dirname, 'public');
const rooms = new Map();
const LIMIT = 2;
const SPEED = 238;
const SPAWNS = [{x:650,y:387},{x:724,y:387}];
const TARGETS = {padA:{x:1050,y:247},padB:{x:1250,y:247},oxygen:{x:272,y:249},carbon:{x:1096,y:585},valve:{x:600,y:406},filter:{x:813,y:406},pump:{x:192,y:603},pipe:{x:364,y:606},lamp:{x:1096,y:616},irrigation:{x:1265,y:616},shelterA:{x:580,y:625},shelterB:{x:824,y:625}};
const closeTo=(a,b,dist=72)=>Math.hypot(a.x-b.x,a.y-b.y)<=dist;
function send(ws,obj){if(ws&&ws.socket&&!ws.socket.destroyed){try{const payload=Buffer.from(JSON.stringify(obj));const n=payload.length;const header=n<126?Buffer.from([129,n]):n<65536?Buffer.from([129,126,n>>8,n&255]):Buffer.from([129,127,0,0,0,0,(n/0x1000000)&255,(n>>16)&255,(n>>8)&255,n&255]);ws.socket.write(Buffer.concat([header,payload]));}catch(e){}}}
function broadcast(room,obj){for(const p of room.players)send(p.ws,obj);}
function newRoom(){let code;do{code=crypto.randomBytes(4).toString('hex').toUpperCase().slice(0,6);}while(rooms.has(code));const room={code,players:[],phase:0,hold:0,solar:0,solarAngles:[12,172],solarOwners:[null,null],scans:{oxygen:false,carbon:false},valveBy:null,cleanAir:0,pumpBy:null,waterClean:0,garden:{lightBy:null,waterBy:null},settings:{light:25,water:88},growth:0,shieldHold:0,completedAt:null,created:Date.now(),lastTick:Date.now(),events:[],timeout:0};rooms.set(code,room);return room;}
function compact(room){return {t:'state',room:room.code,phase:room.phase,players:room.players.map(p=>({id:p.id,name:p.name,color:p.color,x:Math.round(p.x),y:Math.round(p.y),connected:true,holding:p.input.use,character:p.character,pose:p.puzzle?'repair':(p.input.use?'repair':'idle')})),count:room.players.length,hold:Math.round(room.hold*100),scans:room.scans,valveBy:room.valveBy,air:Math.round(room.cleanAir),solar:Math.round(room.solar*100),solarAngles:room.solarAngles,solarOwners:room.solarOwners,settings:room.settings,waterClean:Math.round(room.waterClean),pumpBy:room.pumpBy,garden:room.garden,growth:Math.round(room.growth),shieldHold:Math.round(room.shieldHold*100),complete:room.phase===6};}
function story(room,msg,kind='story'){const event={t:kind,text:msg,phase:room.phase};room.events.push(event);if(room.events.length>12)room.events.shift();broadcast(room,event);}
function reset(room){room.phase=0;room.hold=0;room.solar=0;room.solarAngles=[12,172];room.solarOwners=[null,null];room.scans={oxygen:false,carbon:false};room.valveBy=null;room.cleanAir=0;room.pumpBy=null;room.waterClean=0;room.garden={lightBy:null,waterBy:null};room.settings={light:25,water:88};room.growth=0;room.shieldHold=0;room.completedAt=null;room.players.forEach((p,i)=>{p.x=SPAWNS[i].x;p.y=SPAWNS[i].y;p.input={x:0,y:0,use:false};p.puzzle=false;});broadcast(room,{t:'reset'});story(room,'¡Se fue la luz! Dos personas deben activar el reactor a la vez.');}
function remove(ws){const room=ws.room;if(!room)return;room.players=room.players.filter(p=>p.ws!==ws);ws.room=null;if(!room.players.length){rooms.delete(room.code);return;}room.players[0].id=room.players[0].id;room.hold=0;room.valveBy=null;room.pumpBy=null;broadcast(room,{t:'peer_left'});story(room,'Tu compañero salió. Comparte el enlace para continuar.');}
function join(ws,code,name,character){if(ws.room)return;const room=rooms.get(code);if(!room){send(ws,{t:'error',message:'Esa sala no existe. Revisa el código.'});return;}if(room.players.length>=LIMIT){send(ws,{t:'error',message:'La sala ya tiene dos jugadores.'});return;}
const id=crypto.randomBytes(5).toString('hex');const p={id,ws,name:String(name||'Explorador').trim().slice(0,16).replace(/[<>]/g,'')||'Explorador',color:room.players.length===0?'#80f5d2':'#ffca79',character:Math.max(0,Math.min(3,Math.floor(Number(character)||0))),x:SPAWNS[room.players.length].x,y:SPAWNS[room.players.length].y,input:{x:0,y:0,use:false},puzzle:false};ws.room=room;ws.player=p;room.players.push(p);send(ws,{t:'joined',room:room.code,id,color:p.color,phase:room.phase,events:room.events});broadcast(room,compact(room));if(room.players.length===2){if(room.phase===0&&room.events.length===0)reset(room);story(room,'¡Equipo reunido! Caminen a los dos círculos del reactor.');}else story(room,'Esperando a un segundo explorador…');}
function onMessage(ws,obj){if(!obj||typeof obj!=='object')return;const t=obj.t;if(t==='create'){if(ws.room)return;const room=newRoom();join(ws,room.code,obj.name,obj.character);return;}if(t==='join'){if(ws.room)return;const code=String(obj.room||'').toUpperCase().trim();if(!/^[A-Z0-9]{6}$/.test(code)){send(ws,{t:'error',message:'Usa un código de seis letras o números.'});return;}join(ws,code,obj.name,obj.character);return;}const room=ws.room,p=ws.player;if(!room||!p)return;
if(t==='input'){const ax=Number(obj.x)||0,ay=Number(obj.y)||0;p.input.x=Math.max(-1,Math.min(1,ax));p.input.y=Math.max(-1,Math.min(1,ay));p.input.use=obj.use===true;return;}
if(t==='solar_set'&&room.phase===0){
 const idx=obj.panel==='A'?0:obj.panel==='B'?1:-1;
 const station=idx===0?'padA':'padB';
 if(idx<0||!closeTo(p,TARGETS[station],100))return;
 const value=Number(obj.angle);if(!Number.isFinite(value))return;
 const other=1-idx;if(room.solarOwners[other]===p.id)return;
 room.solarOwners[idx]=p.id;room.solarAngles[idx]=Math.max(0,Math.min(180,value));return;
 }
if(t==='scan'&&room.players.length===2&&room.phase===1){const which=obj.which;if((which==='oxygen'||which==='carbon')&&closeTo(p,TARGETS[which])){if(!room.scans[which]){room.scans[which]=true;story(room,which==='oxygen'?'Oxígeno: 96 %. Parece normal…':'CO₂: MUY ALTO. ¡Ese es el peligro invisible!');}if(room.scans.oxygen&&room.scans.carbon){room.phase=2;story(room,'¡Ya saben qué ocurre! Uno sostiene la válvula y otro arregla el filtro.');}broadcast(room,compact(room));}return;}
if(t==='open_puzzle'&&room.phase===2&&closeTo(p,TARGETS.filter)){p.puzzle=true;send(ws,{t:'puzzle'});return;}
if(t==='repair'&&room.phase===2&&p.puzzle&&closeTo(p,TARGETS.filter)&&room.valveBy&&room.valveBy!==p.id){room.phase=3;room.cleanAir=6;room.valveBy=null;room.players.forEach(x=>x.puzzle=false);story(room,'¡Filtro de CO₂ reparado! Así evitaron un peligro real en Apollo 13. Ahora necesitamos agua para nuestra base.');broadcast(room,compact(room));return;}
if(t==='open_water_puzzle'&&room.phase===3&&closeTo(p,TARGETS.pipe)){p.puzzle=true;send(ws,{t:'water_puzzle'});return;}
if(t==='water_repair'&&room.phase===3&&p.puzzle&&closeTo(p,TARGETS.pipe)&&room.pumpBy&&room.pumpBy!==p.id&&Array.isArray(obj.order)&&obj.order.join(',')==='filter,oxidize,verify'){room.phase=4;room.waterClean=12;room.pumpBy=null;room.players.forEach(x=>x.puzzle=false);story(room,'¡Agua limpia! En la ISS el agua se recupera y también alimenta la fabricación de oxígeno. Ahora toca cultivar.');broadcast(room,compact(room));return;}
if(t==='garden_setting'&&room.phase===4){
 const part=obj.part,at=part==='light'?TARGETS.lamp:part==='water'?TARGETS.irrigation:null;
 if(!at||!closeTo(p,at,95))return;
 const val=Number(obj.value);if(!Number.isFinite(val))return;
 if(room.garden[part+'By']&&room.garden[part+'By']!==p.id)return;
 const other=part==='light'?'water':'light';if(room.garden[other+'By']===p.id)return;
 room.garden[part+'By']=p.id;room.settings[part]=Math.max(0,Math.min(100,val));return;
 }
if(t==='restart'&&room.players.length===2){reset(room);return;}}
function tick(){for(const room of rooms.values()){
 if(!room.players.length)continue;const dt=Math.min(.1,(Date.now()-room.lastTick)/1000);room.lastTick=Date.now();
 for(const p of room.players){let dx=p.input.x,dy=p.input.y,mag=Math.hypot(dx,dy);if(mag>1){dx/=mag;dy/=mag;}p.x=Math.min(1365,Math.max(35,p.x+dx*SPEED*dt));p.y=Math.min(775,Math.max(35,p.y+dy*SPEED*dt));}
 if(room.players.length===2){if(room.phase===0){
 const a=room.solarAngles[0],b=room.solarAngles[1];
 const effA=Math.max(0,1-Math.abs(a-45)/85),effB=Math.max(0,1-Math.abs(b-135)/85);
 const distinct=room.solarOwners[0]&&room.solarOwners[1]&&room.solarOwners[0]!==room.solarOwners[1];
 const good=distinct&&effA>.87&&effB>.87;
 room.solar=Math.max(0,Math.min(1,(effA+effB)/2));
 room.hold=Math.max(0,Math.min(2,room.hold+(good?dt:-dt*.7)));
 if(room.hold>=2){room.phase=1;room.solar=1;story(room,'¡La energía regresó! Ahora revisen por qué hay astronautas mareados.');}
 }
 if(room.phase===2){const holder=room.players.find(p=>closeTo(p,TARGETS.valve)&&p.input.use);room.valveBy=holder?holder.id:null;}
if(room.phase===3){const holder=room.players.find(p=>closeTo(p,TARGETS.pump)&&p.input.use);room.pumpBy=holder?holder.id:null;}
if(room.phase>=4){room.waterClean=Math.min(100,room.waterClean+dt*21);}
if(room.phase===4&&room.garden.lightBy&&room.garden.waterBy&&room.garden.lightBy!==room.garden.waterBy){
 const light=Math.max(0,1-Math.abs(room.settings.light-70)/70),water=Math.max(0,1-Math.abs(room.settings.water-52)/55);
 const quality=Math.min(light,water);
 room.growth=Math.max(0,Math.min(100,room.growth+(quality>.72?dt*(11+quality*11):-dt*3)));
 if(room.growth>=100){room.phase=5;story(room,'¡El primer brote creció! Se acerca una tormenta solar. Ambos deben mantener el refugio sellado.');}
 }
 if(room.phase===5){const a=room.players.some(p=>closeTo(p,TARGETS.shelterA,48)&&p.input.use);const b=room.players.some(p=>closeTo(p,TARGETS.shelterB,48)&&p.input.use);const distinct=room.players.some(p=>closeTo(p,TARGETS.shelterA,48))&&room.players.some(p=>closeTo(p,TARGETS.shelterB,48)&&p.input.use&&!closeTo(p,TARGETS.shelterA,48));room.shieldHold=Math.max(0,Math.min(2.6,room.shieldHold+(a&&b&&distinct?dt:-dt)));
if(room.shieldHold>=2.6){room.phase=6;room.completedAt=Date.now();story(room,'¡A salvo de la tormenta! La Luna no tiene una atmósfera como la terrestre que nos proteja de la radiación.');broadcast(room,{t:'win'});}}
if(room.phase>=3)room.cleanAir=Math.min(100,room.cleanAir+dt*14);
 }
 broadcast(room,compact(room));
 } }
setInterval(tick,80).unref();setInterval(()=>{const now=Date.now();for(const [code,room] of rooms){if(!room.players.length||(!room.players.some(p=>p.ws.socket&&!p.ws.socket.destroyed)&&now-room.created>300000))rooms.delete(code);}},300000).unref();
function decodeSocket(socket){const ws={socket,buffer:Buffer.alloc(0),room:null,player:null};socket.on('data',chunk=>{ws.buffer=Buffer.concat([ws.buffer,chunk]);if(ws.buffer.length>20000){socket.destroy();return;}while(ws.buffer.length>=2){const b0=ws.buffer[0],b1=ws.buffer[1],opcode=b0&0x0f,masked=!!(b1&0x80);if(!masked){socket.destroy();return;}let size=b1&127,off=2;if(size===126){if(ws.buffer.length<4)return;size=ws.buffer.readUInt16BE(2);off=4;}else if(size===127){if(ws.buffer.length<10)return;const big=ws.buffer.readBigUInt64BE(2);if(big>BigInt(16000)){socket.destroy();return;}size=Number(big);off=10;}if(size>16000){socket.destroy();return;}if(ws.buffer.length<off+4+size)return;const key=ws.buffer.subarray(off,off+4);const msg=Buffer.from(ws.buffer.subarray(off+4,off+4+size));ws.buffer=ws.buffer.subarray(off+4+size);for(let i=0;i<msg.length;i++)msg[i]^=key[i%4];if(opcode===8){socket.end();return;}if(opcode===9){socket.write(Buffer.from([0x8a,msg.length,...msg]));continue;}if(opcode!==1)continue;try{onMessage(ws,JSON.parse(msg.toString('utf8')));}catch(e){} }});socket.on('close',()=>remove(ws));socket.on('error',()=>remove(ws));return ws;}
const server=http.createServer((req,res)=>{if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({status:'ok',rooms:rooms.size}));return;}const pathname=(req.url||'/').split('?')[0];const file=path.resolve(BASE,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(BASE+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(err,bytes)=>{if(err){res.writeHead(404);res.end('Not found');return;}const ext=path.extname(file);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[ext]||'application/octet-stream','Cache-Control':'public, max-age=60'});res.end(bytes);});});
server.on('upgrade',(req,socket)=>{if(req.url!=='/ws'||req.headers.upgrade?.toLowerCase()!=='websocket'||!req.headers['sec-websocket-key']){socket.destroy();return;}const origin=req.headers.origin||'',host=req.headers.host||''; // same-origin browser use only
if(origin && !origin.endsWith('://'+host)){socket.destroy();return;}
const key=req.headers['sec-websocket-key'];const accept=crypto.createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');decodeSocket(socket);});
server.listen(PORT,'0.0.0.0',()=>console.log('PlutoCore Duo listening on '+PORT));