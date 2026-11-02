'use strict';
const assert=require('node:assert/strict');
const Pipes=require('../public/pipes');
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(test,label,timeout=18000){const start=Date.now();while(!test()){if(Date.now()-start>timeout)throw Error('Timeout: '+label);await wait(40);}}
async function client(){const c={ws:new WebSocket(origin.replace(/^http/,'ws')+'/ws'),state:null,id:null,events:[]};c.send=v=>c.ws.send(JSON.stringify(v));c.ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.t==='state')c.state=m;if(m.t==='joined'){c.id=m.id;c.room=m.room;}c.events.push(m);};await until(()=>c.ws.readyState===1,'socket');return c;}
async function move(c,x,y,use=false){await until(()=>c.state,'first state');const start=Date.now();while(true){const p=c.state.players.find(p=>p.id===c.id),dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<17)break;if(Date.now()-start>15000)throw Error('Movement timeout');c.send({t:'input',x:dx/d,y:dy/d,use:false});await wait(65);}c.send({t:'input',x:0,y:0,use});await wait(120);}
async function phase(c,n){await until(()=>c.state.phase===n,'phase '+n,14000);}
async function run(mode){const a=await client();let b=a;const all=[a];try{
 a.send({t:'create',mode,name:'Test A',character:2});await until(()=>a.id,'join A');
 if(mode==='duo'){b=await client();all.push(b);b.send({t:'join',room:a.room,name:'Test B',character:3});await until(()=>b.id,'join B');}
 await phase(a,0);assert.equal(a.state.mode,mode);
 // Range checks reject setting stations remotely.
 a.send({t:'solar_set',panel:'A',angle:45});await wait(150);assert.equal(a.state.solarAngles[0],12);
 await move(a,1050,247);a.send({t:'solar_set',panel:'A',angle:45});
 await move(b,1250,247);b.send({t:'solar_set',panel:'B',angle:135});await phase(a,1);
 await move(a,272,249);a.send({t:'scan',which:'oxygen'});await wait(150);assert.equal(a.state.phase,1);
 await move(b,1096,585);b.send({t:'scan',which:'carbon'});await phase(a,2);
 await move(a,600,406,mode==='duo');if(mode==='solo')a.send({t:'latch',station:'valve'});
 await move(b,813,406);b.send({t:'open_puzzle'});await wait(200);
 b.send({t:'repair',rotations:[1,1,2,1,2,1,2,3,1]});await wait(200);assert.equal(a.state.phase,2,'reject disconnected pipe route');
 b.send({t:'repair',rotations:Array(9).fill(0)});await phase(a,3);
 await move(a,192,603,mode==='duo');if(mode==='solo')a.send({t:'latch',station:'pump'});
 await move(b,364,606);b.send({t:'open_water_puzzle'});await wait(200);
 b.send({t:'water_repair',order:['verify','filter','oxidize']});await wait(200);assert.equal(a.state.phase,3);
 b.send({t:'water_repair',order:['filter','oxidize','verify']});await phase(a,4);
 await move(a,1096,616);a.send({t:'garden_setting',part:'light',value:100});
 await move(b,1265,616);b.send({t:'garden_setting',part:'water',value:100});await wait(1000);assert.equal(a.state.growth,0,'over-budget garden cannot grow');
 await move(a,1096,616);a.send({t:'garden_setting',part:'light',value:70});
 await move(b,1265,616);b.send({t:'garden_setting',part:'water',value:52});await phase(a,5);
 await move(a,580,625,mode==='duo');if(mode==='solo')a.send({t:'latch',station:'shelterA'});
 await move(b,824,625,mode==='duo');if(mode==='solo')b.send({t:'latch',station:'shelterB'});
 await phase(a,6);assert(a.state.complete);a.send({t:'restart'});await phase(a,0);assert.deepEqual(a.state.latches,{});
 console.log('PASS '+mode+': complete mission, invalid solutions rejected, energy budget and restart');
 }finally{all.forEach(c=>c.ws.close());}}
assert(Pipes.connected(Array(9).fill(0)));assert(!Pipes.connected([1,1,2,1,2,1,2,3,1]));assert(!Pipes.connected([]));assert(!Pipes.connected(Array(9).fill(-1)));
Promise.all([run('solo'),run('duo')]).catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>setTimeout(()=>process.exit(process.exitCode||0),300));
