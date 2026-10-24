// Logic and callback-lifecycle tests. These do not replace browser or human trials.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');

function setup(reduced=false) {
  const elements = new Map(), timers = new Map(), frames = new Map();
  const draw = [];
  let nextId=1, now=0, focused=null;
  const canvas = {fillStyle:'',clearRect(){draw.length=0;},fillRect(...args){draw.push([this.fillStyle,...args]);}};
  class Element {
    constructor(id='') { this.id=id; this.hidden=false; this.disabled=false; this.value=''; this.textContent=''; this.dataset={}; this.attrs={}; this.events={}; this.children=[]; }
    addEventListener(type,fn) { this.events[type]=fn; }
    setAttribute(key,value) { this.attrs[key]=value; }
    removeAttribute(key) { delete this.attrs[key]; }
    replaceChildren(...children) { this.children=children; }
    append(...children) { this.children.push(...children); }
    focus() { focused=this.id; }
    getContext() { return canvas; }
    showModal() { this.open=true; }
    close() { this.open=false; }
    reset() { el('puppy-name').value=''; }
    closest() { return this; }
  }
  function el(id) { if(!elements.has(id))elements.set(id,new Element(id)); return elements.get(id); }
  const buttons=['feed','play','clean','rest'].map(action=>{const e=el(action);e.dataset.action=action;return e;});
  const motion={matches:reduced,addEventListener(type,fn){this.onchange=fn;}};
  const document={hidden:false,events:{},getElementById:el,createElement:()=>new Element(),
    querySelectorAll:()=>buttons, querySelector:()=>buttons[0],addEventListener(type,fn){this.events[type]=fn;}};
  el('game').hidden=true;
  const context=vm.createContext({document,window:{matchMedia:()=>motion},performance:{now:()=>now},
    setTimeout:(fn,ms)=>{const id=nextId++;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id),
    requestAnimationFrame:fn=>{const id=nextId++;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)});
  vm.runInContext(source+'\n globalThis.api={act,drawDog,getState:()=>JSON.parse(JSON.stringify(state)),setNeeds:values=>Object.assign(state,values)};',context);
  const fire=(id,type='click')=>el(id).events[type]({preventDefault(){},target:el(id)});
  return {el,document,motion,buttons,draw,timers,frames,api:context.api,fire,
    start(name='Biscuit'){el('puppy-name').value=name;fire('name-form','submit');},
    finish(){for(const [id,{fn,ms}] of [...timers]){timers.delete(id);now+=ms;fn();}},
    frame(time){now=time;for(const [id,fn] of [...frames]){frames.delete(id);fn(now);}},
    focus:()=>focused};
}

test('blank names fail; HTML-like names are literal text; submit works once',()=>{
  const g=setup();g.start('   ');assert.equal(g.el('game').hidden,true);assert.match(g.el('name-error').textContent,/Enter a name/);assert.equal(g.focus(),'puppy-name');
  g.start('<b>Dog</b>');assert.equal(g.el('dog-title').textContent,"<b>Dog</b>'s day");assert.equal(g.focus(),'feed');
  g.start('Another');assert.equal(g.api.getState().name,'<b>Dog</b>');
});
test('first feed commits once; all controls lock, then unlock',()=>{
  const g=setup();g.start();g.api.act('feed');
  const s=g.api.getState();assert.deepEqual([s.hour,s.food,s.happy,s.energy,s.clean],[10,82,56,70,57]);
  assert.ok(g.buttons.every(b=>b.disabled));assert.equal(g.el('scene').dataset.action,'feed');
  for(let i=0;i<30;i++)g.api.act('play');assert.deepEqual(g.api.getState(),s);
  g.finish();assert.ok(g.buttons.every(b=>!b.disabled));assert.equal(g.el('scene').dataset.action,'idle');
});
test('a second feed is valid; a third refuses without time or diary changes',()=>{
  const g=setup();g.start();g.api.act('feed');g.finish();g.api.act('feed');g.finish();
  const before=g.api.getState();assert.equal(before.food,100);assert.equal(before.hour,11);
  g.api.act('feed');assert.deepEqual(g.api.getState(),before);assert.match(g.el('feedback').textContent,/No time used/);
});
test('all refusal thresholds and exact allowed boundaries retain the original rules',()=>{
  for(const [action,needs] of [['feed',{food:86}],['play',{energy:19}],['clean',{energy:9}],['clean',{clean:86}],['rest',{energy:86}]]){
    const g=setup();g.start();g.api.setNeeds(needs);const before=g.api.getState();g.api.act(action);assert.deepEqual(g.api.getState(),before);assert.equal(g.timers.size,0);
  }
  for(const [action,needs] of [['feed',{food:85}],['play',{energy:20}],['clean',{energy:10,clean:85}],['rest',{energy:85}]]){
    const g=setup();g.start();g.api.setNeeds(needs);g.api.act(action);assert.equal(g.api.getState().hour,10);
  }
});
test('eight choices end at 17:00 and stay locked after the last reaction',()=>{
  const g=setup();g.start();for(const action of ['feed','play','clean','rest','feed','play','clean','rest']){g.api.act(action);g.finish();}
  const s=g.api.getState();assert.equal(s.hour,17);assert.equal(s.history.length,8);assert.equal(g.el('summary').hidden,false);assert.ok(g.buttons.every(b=>b.disabled));
  g.api.act('feed');assert.deepEqual(g.api.getState(),s);
});
test('reset cancels a reaction, and even an already queued stale callback cannot affect a new day',()=>{
  const g=setup();g.start();g.api.act('feed');const stale=[...g.timers.values()][0].fn;
  g.fire('reset');g.fire('cancel-reset');assert.equal(g.api.getState().hour,10);
  g.fire('reset');g.fire('confirm-reset');assert.equal(g.el('game').hidden,true);assert.equal(g.timers.size,0);assert.equal(g.frames.size,0);
  g.start('New puppy');g.api.act('play');stale();assert.equal(g.el('scene').dataset.action,'play');assert.ok(g.buttons.every(b=>b.disabled));
  g.finish();assert.equal(g.api.getState().history.length,1);assert.equal(g.api.getState().name,'New puppy');
});
test('reduced motion keeps activity props and feedback without scheduling frames',()=>{
  const g=setup(true);g.start();const idle=JSON.stringify(g.draw);g.api.act('feed');
  assert.equal(g.frames.size,0);assert.notEqual(JSON.stringify(g.draw),idle);assert.match(g.el('scene-status').textContent,/bowl/);
  const frozen=JSON.stringify(g.draw);g.api.drawDog(1200);assert.equal(JSON.stringify(g.draw),frozen);g.finish();assert.ok(g.buttons.every(b=>!b.disabled));
});
test('each activity produces a different drawing and a changing animated frame',()=>{
  const pictures=new Set();
  for(const action of ['feed','play','clean','rest']){
    const g=setup();g.start();g.api.act(action);const first=JSON.stringify(g.draw);pictures.add(first);g.frame(320);assert.notEqual(JSON.stringify(g.draw),first,action);
    assert.ok(g.draw.every(([,x,y,w,h])=>[x,y,w,h].every(Number.isInteger)&&x>=0&&y>=0&&x+w<=128&&y+h<=96));
  }assert.equal(pictures.size,4);
});
test('tab visibility and motion changes stop or resume the animation loop',()=>{
  const g=setup();g.start();assert.equal(g.frames.size,1);g.document.hidden=true;g.document.events.visibilitychange();assert.equal(g.frames.size,0);
  g.document.hidden=false;g.document.events.visibilitychange();assert.equal(g.frames.size,1);
  g.motion.matches=true;g.motion.onchange();assert.equal(g.frames.size,0);
});
