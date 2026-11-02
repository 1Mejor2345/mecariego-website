'use strict';
const assert=require('node:assert/strict'),origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,label){const start=Date.now();while(!fn()){if(Date.now()-start>12000)throw Error('Timeout: '+label);await sleep(30);}}
async function client(){const p={ws:new WebSocket(origin.replace(/^http/,'ws')+'/ws')};p.send=x=>p.ws.send(JSON.stringify(x));p.cmd=x=>p.send({type:'command',command:x});p.ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='state')p.state=m;if(m.type==='joined'){p.id=m.id;p.role=m.role;p.code=m.code;}if(m.type==='error')p.error=m.message;};await until(()=>p.ws.readyState===1,'connect');return p;}
(async()=>{const a=await client(),b=await client();try{
 a.send({type:'create',name:'Pilot'});await until(()=>a.code,'create');b.send({type:'join',code:a.code,name:'Engineer'});await until(()=>b.state?.ready&&a.state?.ready,'two players');assert.equal(a.role,0);assert.equal(b.role,1);assert.equal(a.state.game.version,5);
 b.cmd({type:'select',mission:3});await sleep(100);assert.equal(a.state.game.mission,0,'role 1 cannot change mission');
 a.cmd({type:'select',mission:1});await until(()=>a.state.game.mission===1,'select Apollo13');a.cmd({type:'start'});await until(()=>a.state.game.status==='playing','start');
 b.cmd({type:'place',item:'cardboard',x:590,y:315});await sleep(100);assert.equal(a.state.game.scene.placed.length,0,'wrong role rejected');
 for(const item of ['cardboard','filter'])a.cmd({type:'place',item,x:590,y:315});for(const item of ['bag','hose'])b.cmd({type:'place',item,x:590,y:315});await until(()=>a.state.game.scene.placed.length===4,'build together');
 a.cmd({type:'test'});await sleep(100);assert.equal(b.state.game.scene.air,0,'unsealed adapter leaks');
 for(let i=0;i<20;i++)b.cmd({type:'tape',amount:.06});a.cmd({type:'test'});await until(()=>a.state.game.status==='won'&&b.state.game.status==='won','shared win');
 a.cmd({type:'next'});await until(()=>a.state.game.mission===2,'next mission');b.cmd({type:'start'});await until(()=>a.state.game.status==='playing','partner starts');a.cmd({type:'pause'});await until(()=>b.state.game.status==='paused','shared pause');const clock=b.state.game.clock;await sleep(200);assert.equal(b.state.game.clock,clock);a.cmd({type:'resume'});await until(()=>b.state.game.status==='playing','resume');
 console.log('PASS: two real WebSocket clients, distinct roles, adapter solved cooperatively, shared victory, pause and next mission');
 }finally{a.ws.close();b.ws.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
