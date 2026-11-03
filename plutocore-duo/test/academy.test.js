'use strict';
const assert=require('node:assert/strict'),A=require('../public/academy-model');
const tick=(s,sec)=>{for(let i=0;i<Math.ceil(sec/.05);i++)A.update(s,.05);};
const cmd=(s,type,rest={},role=0)=>A.command(s,{type,...rest},role);
function enter(s){for(let r=0;r<(s.mode==='solo'?1:2);r++){cmd(s,'input',{x:1},r);const dist=A.panel(s.mission)-s.students[r].x;tick(s,dist/330);cmd(s,'input',{x:0},r);cmd(s,'open',{},r);}assert.equal(s.phase,'task');}
function solve(s){const duo=s.mode==='duo',other=duo?1:0;
 if(s.mission===0){cmd(s,'care',{item:'air'});cmd(s,'care',{item:'cool'},other);cmd(s,'care',{item:'cool'},other);tick(s,3.2);}
 if(s.mission===1){for(const item of ['cardboard','filter'])cmd(s,'part',{item});for(const item of ['bag','hose'])cmd(s,'part',{item},other);for(let i=0;i<4;i++)cmd(s,'seal',{},other);cmd(s,'test');}
 if(s.mission===2){for(let i=0;i<6;i++)cmd(s,'arm');for(let i=0;i<3;i++)cmd(s,'arm',{},other);cmd(s,'stow');tick(s,3);}
 if(s.mission===3){cmd(s,'brake');if(duo)cmd(s,'brake',{},1);cmd(s,'grip',{down:true});if(duo)cmd(s,'grip',{down:true},1);tick(s,3.2);}
 if(s.mission===4){for(let n=0;n<3;n++)for(let j=0;j<2;j++)cmd(s,'energy',{system:n,delta:1},n===2?other:0);tick(s,3.2);}
 assert.equal(s.phase,'fact','room '+s.mission+' solved');
}
for(const mode of ['solo','duo']){const s=A.create(mode);cmd(s,'classReady');if(mode==='duo'){assert.equal(s.phase,'class');cmd(s,'classReady',{},1);}assert.equal(s.phase,'corridor');
 cmd(s,'open');assert.equal(s.phase,'corridor','remote panel cannot be opened');cmd(s,'select',{mission:4});assert.equal(s.mission,0,'cannot skip class');
 for(let room=0;room<5;room++){enter(s);const clock=s.clock;cmd(s,'pause');tick(s,1);assert.equal(s.clock,clock);cmd(s,'resume',{},mode==='duo'?1:0);solve(s);
  cmd(s,'continue');assert.equal(s.phase,'fact','cannot skip explanation check');cmd(s,'answer',{choice:1-A.rooms[room].correct});assert.equal(s.answers[0],false);cmd(s,'answer',{choice:A.rooms[room].correct});if(mode==='duo'){cmd(s,'continue');assert.equal(s.phase,'fact','both pupils must answer');cmd(s,'answer',{choice:A.rooms[room].correct},1);}cmd(s,'continue');
 }
 assert.equal(s.phase,'graduation');assert.deepEqual(s.completed,[0,1,2,3,4]);console.log('PASS complete '+mode+' class: walking, five tasks, facts, both answers, graduation');}
const s=A.create();s.phase='task';s.mission=1;s.scene=A.task(1);cmd(s,'part',{item:'cardboard'},1);assert.equal(s.scene.parts.length,0);cmd(s,'part',{item:'filter'});assert.equal(s.scene.parts.length,0);cmd(s,'test');assert.equal(s.phase,'task');
s.mission=2;s.scene=A.task(2);cmd(s,'arm',{},1);assert.equal(s.scene.x,260);for(let i=0;i<6;i++)cmd(s,'arm');cmd(s,'arm');assert.equal(s.scene.y,150,'partner owns vertical turn');
s.mission=3;s.scene=A.task(3);cmd(s,'brake');cmd(s,'grip',{down:true});tick(s,4);assert.equal(s.phase,'task','one grip cannot capture');cmd(s,'brake',{},1);cmd(s,'grip',{down:true},1);tick(s,1);cmd(s,'grip',{down:false});tick(s,1);assert(s.scene.hold<1.1,'released grip stops progress');
console.log('PASS partner permissions, construction order, turns, synchronized holds and pause');
