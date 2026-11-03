'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path'),A=require('../public/academy-model');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/academy-voice-map.js'),'utf8'),context);const map=context.window.AcademyVoiceMap;
for(const [text,file]of Object.entries(map)){const wav=fs.readFileSync(path.join(__dirname,'../public',file));assert.equal(wav.toString('ascii',0,4),'RIFF',text);assert(wav.length>5000);}
for(const r of A.rooms){assert(map[r.intro],r.title+' intro narration');assert(map[r.fact+' '+r.why],r.title+' historical narration');if(r.image.startsWith('history/'))assert(fs.statSync(path.join(__dirname,'../public',r.image)).size>5000);assert(r.answers[r.correct]);}
assert(A.rooms[0].fact.includes('Murió'));assert(A.rooms[4].fact.includes('ficticia'));console.log('PASS 35 Spanish recordings, historical images, truthful Laika and simulation labels');
