'use strict';
const assert=require('node:assert/strict'),G=require('../public/model');
const tick=(s,seconds)=>{for(let t=0;t<seconds;t+=.04)G.update(s,.04);};
function start(i,mode='solo'){const s=G.create(mode);G.reset(s,i);G.command(s,{type:'start'},0);return s;}
for(const mode of ['solo','duo']){
 const s=start(0,mode);G.command(s,{type:'target',x:745},0);
 for(let t=0;t<50&&s.status==='playing';t+=.04){const g=s.scene,alt=g.ground-42-g.y,desired=Math.min(45,Math.max(10,alt/3));G.command(s,{type:'input',thrust:g.vy>desired},mode==='duo'?1:0);G.update(s,.04);}
 assert.equal(s.status,'won','controlled landing '+mode);assert(s.scene.fuel>0);
 const b=start(1,mode),cmd=(c,r=0)=>G.command(b,c,r);
 cmd({type:'place',item:'filter',x:590,y:315});assert(!b.scene.placed.includes('filter'));
 cmd({type:'test'});assert.equal(b.scene.air,0);
 for(const item of ['cardboard','filter','bag','hose'])cmd({type:'place',item,x:590,y:315},['cardboard','filter'].includes(item)?0:mode==='duo'?1:0);
 cmd({type:'test'});assert.equal(b.scene.air,0,'unsealed assembly must leak');
 for(let i=0;i<20;i++)cmd({type:'tape',amount:.06},mode==='duo'?1:0);cmd({type:'test'});tick(b,3);assert.equal(b.status,'won','adapter '+mode);
 const r=start(2,mode);for(let t=0;t<10&&!r.scene.captured;t+=.04){const g=r.scene;G.command(r,{type:'target',x:g.sx,y:g.sy},0);if(mode==='duo')G.command(r,{type:'target',x:g.sx,y:g.sy},1);G.update(r,.04);}assert(r.scene.captured);
 G.command(r,{type:'target',x:335,y:405},0);if(mode==='duo')G.command(r,{type:'target',x:335,y:405},1);tick(r,5);assert.equal(r.status,'won','arm '+mode);
 const w=start(3,mode);G.command(w,{type:'squeeze'},mode==='duo'?1:0);assert.equal(w.scene.drops.length,8);G.command(w,{type:'gravity'},mode==='duo'?1:0);tick(w,.4);assert(w.scene.drops.some(d=>d.vy>10));G.command(w,{type:'gravity'},mode==='duo'?1:0);
 for(let t=0;t<80&&w.status==='playing';t+=.04){const d=w.scene.drops[0];if(d)G.command(w,{type:'target',x:d.x,y:d.y},0);G.update(w,.04);}assert.equal(w.status,'won','water '+mode);
 const f=start(4,mode);let moved=false,restored=false;
 for(let t=0;t<40&&f.status==='playing';t+=.04){if(t>10&&!moved){G.command(f,{type:'allocate',system:1,delta:-1},0);G.command(f,{type:'allocate',system:2,delta:1},mode==='duo'?1:0);moved=true;}if(t>28&&!restored){G.command(f,{type:'allocate',system:2,delta:-1},mode==='duo'?1:0);G.command(f,{type:'allocate',system:1,delta:1},0);restored=true;}G.update(f,.04);}assert.equal(f.status,'won','resource choices '+mode);
 console.log('PASS '+mode+': all five missions completed');
}
const fail= start(4);tick(fail,38);assert.equal(fail.status,'retry','default energy allocation must require a change');
const authority=start(1,'duo');G.command(authority,{type:'place',item:'filter',x:590,y:315},1);assert.equal(authority.scene.placed.length,0);G.command(authority,{type:'place',item:'cardboard',x:10,y:10},0);assert.equal(authority.scene.placed.length,0);
console.log('PASS: failed experiments, budget consequences and multiplayer roles');
