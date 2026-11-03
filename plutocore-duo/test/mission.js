'use strict';
const assert=require('node:assert/strict'),A=require('../public/academy-model'),origin=process.env.TEST_ORIGIN||'http://127.0.0.1:3000';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,label){const start=Date.now();while(!fn()){if(Date.now()-start>15000)throw Error('Timeout: '+label);await sleep(35);}}
async function client(){const p={ws:new WebSocket(origin.replace(/^http/,'ws')+'/ws')};p.send=x=>p.ws.send(JSON.stringify(x));p.cmd=x=>p.send({type:'command',command:x});p.ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='state')p.state=m;if(m.type==='joined'){p.id=m.id;p.role=m.role;p.code=m.code;}if(m.type==='error')p.error=m.message;};await until(()=>p.ws.readyState===1,'connect');return p;}
(async()=>{const a=await client(),b=await client();try{
 a.send({type:'create',name:'Menta'});await until(()=>a.code,'create');b.send({type:'join',code:a.code,name:'Lila'});await until(()=>b.state?.ready&&a.state?.ready,'two pupils');assert.equal(a.state.game.version,8);assert.equal(a.role,0);assert.equal(b.role,1);
 a.cmd({type:'classReady'});await sleep(100);assert.equal(a.state.game.phase,'class');b.cmd({type:'classReady'});await until(()=>a.state.game.phase==='corridor','both ready');
 for(let i=0;i<5;i++){
  a.cmd({type:'open'});await sleep(60);assert.equal(a.state.game.phase,'corridor','cannot open from far away');
  a.cmd({type:'input',x:1});b.cmd({type:'input',x:1});await until(()=>a.state.game.students.every(p=>Math.abs(p.x-A.panel(i))<145),'walk to panel');a.cmd({type:'input',x:0});b.cmd({type:'input',x:0});a.cmd({type:'open'});await sleep(100);assert.equal(a.state.game.phase,'corridor','partner must open too');b.cmd({type:'open'});await until(()=>a.state.game.phase==='task','panel opens for both');
  if(i===0){b.cmd({type:'care',item:'air'});await sleep(60);assert(a.state.game.scene.air<35,'role permission');a.cmd({type:'care',item:'air'});for(let n=0;n<2;n++)b.cmd({type:'care',item:'cool'});}
  if(i===1){for(const item of ['cardboard','filter'])a.cmd({type:'part',item});for(const item of ['bag','hose'])b.cmd({type:'part',item});await until(()=>a.state.game.scene.parts.length===4,'four pieces');a.cmd({type:'test'});await sleep(100);assert.equal(a.state.game.phase,'task','unsealed filter cannot win');for(let n=0;n<4;n++)b.cmd({type:'seal'});await until(()=>a.state.game.scene.tape>=.9,'sealed');a.cmd({type:'test'});}
  if(i===2){b.cmd({type:'arm'});await sleep(60);assert.equal(a.state.game.scene.x,260);for(let n=0;n<6;n++)a.cmd({type:'arm'});await until(()=>a.state.game.scene.stage===1,'horizontal turn');for(let n=0;n<3;n++)b.cmd({type:'arm'});await until(()=>a.state.game.scene.stage===2,'vertical turn');a.cmd({type:'stow'});}
  if(i===3){a.cmd({type:'brake'});b.cmd({type:'brake'});a.cmd({type:'grip',down:true});await sleep(400);assert.equal(a.state.game.scene.hold,0,'both grips required');b.cmd({type:'grip',down:true});}
  if(i===4){for(let n=0;n<3;n++)for(let j=0;j<2;j++)(n===2?b:a).cmd({type:'energy',system:n,delta:1});}
  await until(()=>a.state.game.phase==='fact'&&b.state.game.phase==='fact','shared historical fact room '+i);a.cmd({type:'answer',choice:A.rooms[i].correct});a.cmd({type:'continue'});await sleep(100);assert.equal(a.state.game.phase,'fact','both pupils answer');b.cmd({type:'answer',choice:A.rooms[i].correct});b.cmd({type:'continue'});await until(()=>a.state.game.phase===(i===4?'graduation':'corridor'),'advance class');
  if(i===0){a.cmd({type:'pause'});await until(()=>b.state.game.status==='paused','pause');const clock=b.state.game.clock;await sleep(150);assert.equal(b.state.game.clock,clock);b.cmd({type:'resume'});await until(()=>a.state.game.status==='playing','partner resume');}
 }
 assert.deepEqual(a.state.game.completed,[0,1,2,3,4]);console.log('PASS full online class: two real WebSocket clients, movement, five cooperative tasks, facts, answers, pause, graduation');
 }finally{a.ws.close();b.ws.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
