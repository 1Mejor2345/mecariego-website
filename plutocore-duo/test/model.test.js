'use strict';const assert=require('node:assert/strict'),G=require('../public/story-model');
const tick=(s,n)=>{for(let t=0;t<n;t+=.04)G.update(s,.04);};
function start(i,mode){const s=G.create(mode);G.reset(s,i);G.command(s,{type:'start'});return s;}
for(const mode of ['solo','duo']){const r=mode==='solo'?0:1;
 const a=start(0,mode);G.command(a,{type:'rescue',who:0},0);assert(!a.scene.crew[0].moving);G.command(a,{type:'hatch'},r);for(let who=0;who<3;who++)G.command(a,{type:'rescue',who},who===2?r:0);tick(a,6);assert.equal(a.status,'won','crew reaches Aquarius');assert.equal(a.scene.safe,3);
 const b=start(1,mode);G.command(b,{type:'place',item:'filter',x:590,y:315});assert.equal(b.scene.placed.length,0);for(const item of ['cardboard','filter','bag','hose'])G.command(b,{type:'place',item,x:590,y:315},['cardboard','filter'].includes(item)?0:r);G.command(b,{type:'test'});assert.equal(b.scene.air,0);for(let n=0;n<20;n++)G.command(b,{type:'tape',amount:.06},r);G.command(b,{type:'test'});tick(b,3);assert.equal(b.status,'won');
 const c=start(2,mode);for(const item of ['camera','lights','heater'])G.command(c,{type:'switch',item},item==='heater'?r:0);tick(c,5);assert.equal(c.status,'won');
 const d=start(3,mode);G.command(d,{type:'aim'},0);G.command(d,{type:'input',thrust:true},r);tick(d,3.2);assert.equal(d.status,'won');
 const e=start(4,mode);G.command(e,{type:'chute'},r);assert(!e.scene.opened);G.command(e,{type:'separate'});tick(e,5);assert.equal(e.scene.altitude,.43);G.command(e,{type:'chute'},r);tick(e,8);assert.equal(e.status,'won');assert(e.scene.landed);
 const f=start(5,mode);for(let t=0;t<40&&f.status==='playing';t+=.04){if(t>9&&t<9.05){G.command(f,{type:'allocate',system:1,delta:-1},0);G.command(f,{type:'allocate',system:2,delta:1},r);}if(t>28&&t<28.05){G.command(f,{type:'allocate',system:2,delta:-1},r);G.command(f,{type:'allocate',system:1,delta:1},0);}G.update(f,.04);}assert.equal(f.status,'won');console.log('PASS '+mode+': five Apollo 13 chapters and lunar base bonus');}
const p=start(0,'duo');G.command(p,{type:'hatch'},0);assert(!p.scene.hatch);G.command(p,{type:'pause'},1);assert.equal(p.status,'paused');G.command(p,{type:'resume'},1);assert.equal(p.status,'playing');
console.log('PASS: historical sequence, incomplete assembly, premature parachute and role validation');
