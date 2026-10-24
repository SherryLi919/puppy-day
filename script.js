'use strict';

// Lasting care values and temporary animation state are deliberately separate.
const initial = () => ({name:'', hour:9, food:60, happy:60, energy:70, clean:65, history:[]});
let state = initial();
const $ = id => document.getElementById(id);
const fields = [['food','Fullness'], ['happy','Mood'], ['energy','Energy'], ['clean','Cleanliness']];
const effects = {feed:{food:30,clean:-5}, play:{happy:25,energy:-20}, clean:{clean:35,energy:-10}, rest:{energy:35,happy:5}};
const labels = {feed:'Feed', play:'Play', clean:'Clean', rest:'Rest'};
const reactions = {
  feed: {duration:2600, bubble:'Nom nom... thank you!', status:'Snack time! A bowl of crunchy bites.', description:'eating from a bowl of dog food'},
  play: {duration:2400, bubble:'Throw it again!', status:'Play time! Catch that bouncing ball.', description:'jumping after a bouncing ball'},
  clean:{duration:2600, bubble:'Splish, splash, all clean!', status:'Bath time! Bubbles and a little shake.', description:'shaking off water among soap bubbles'},
  rest: {duration:2800, bubble:'Zzz... just five more minutes.', status:'Nap time. A soft mat and sweet dreams.', description:'sleeping on a mat with Zzz above its head'}
};
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ctx = $('dog').getContext('2d');
let reaction = null;
let reactionTimer = null;
let frame = null;
let generation = 0;

function moodText() {
  if (state.food < 30) return 'My tummy is rumbling...';
  if (state.energy < 25) return 'A little nap would be nice.';
  if (state.clean < 35) return 'Time for a splash!';
  if (state.happy < 35) return 'Will you play with me?';
  return 'My favorite place is with you.';
}

function render() {
  $('dog-title').textContent = `${state.name}'s day`;
  $('clock').textContent = `${String(state.hour).padStart(2,'0')}:00 · ${state.hour - 9}/8 actions`;
  $('stats').replaceChildren(...fields.map(([key,label]) => {
    const wrap = document.createElement('div');
    wrap.className = 'stat';
    const caption = document.createElement('label');
    caption.htmlFor = `stat-${key}`;
    caption.textContent = `${label}  ${state[key]} / 100`;
    const meter = document.createElement('meter');
    Object.assign(meter, {id:`stat-${key}`, min:0, max:100, low:30, high:60, optimum:100, value:state[key]});
    wrap.append(caption, meter);
    return wrap;
  }));
  $('log').replaceChildren(...state.history.slice().reverse().map(message => {
    const li = document.createElement('li');
    li.textContent = message;
    return li;
  }));
  $('summary').hidden = state.hour < 17;
  if (state.hour >= 17) {
    const average = Math.round(fields.reduce((sum,[key]) => sum + state[key], 0) / 4);
    $('result').textContent = `${state.name} shared 8 little moments with you. Final average: ${average}/100. ` +
      (average >= 60 ? 'What a comfortable day!' : 'A few needs could use more care. Try a different balance next time.');
  }
  renderReaction();
}

function renderReaction() {
  const action = reaction?.action;
  const busy = Boolean(reaction);
  $('scene').dataset.action = action || 'idle';
  $('actions').setAttribute('aria-busy', String(busy));
  document.querySelectorAll('#actions [data-action]').forEach(button => {
    button.disabled = busy || state.hour >= 17;
  });
  $('mood').textContent = busy ? reactions[action].bubble : moodText();
  $('scene-status').textContent = busy ? reactions[action].status :
    state.hour >= 17 ? 'A whole day together. Start over to play again.' : 'Ready for your next little moment.';
  $('dog').setAttribute('aria-label', `${state.name || 'Your puppy'}: ${busy ? reactions[action].description : 'a brown pixel puppy waiting for care'}.`);
}

// Each shape lands on whole canvas pixels, keeping the original dog crisp.
function rect(color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function pixelHeart(x, y) {
  rect('#b76454',x+1,y,2,1); rect('#b76454',x+4,y,2,1);
  rect('#b76454',x,y+1,7,2); rect('#b76454',x+1,y+3,5,1);
  rect('#b76454',x+2,y+4,3,1); rect('#b76454',x+3,y+5,1,1);
}
function bubble(x, y, size) {
  rect('#f4f9eb',x+1,y,size-2,1); rect('#f4f9eb',x+1,y+size-1,size-2,1);
  rect('#f4f9eb',x,y+1,1,size-2); rect('#f4f9eb',x+size-1,y+1,1,size-2);
  rect('#a4d6d8',x+1,y+1,size-2,size-2); rect('#ffffff',x+1,y+1,2,1);
}
function zed(x,y,size) {
  rect('#405849',x,y,size,1); rect('#405849',x,y+size-1,size,1);
  for (let i=1; i<size-1; i++) rect('#405849',x+size-i-1,y+i,1,1);
}
function drawDog(now) {
  ctx.clearRect(0,0,128,96);
  const action = reaction?.action || 'idle';
  const elapsed = reaction ? now - reaction.started : now;
  const still = motion.matches;
  const wave = still ? 0 : Math.sin(elapsed / 110);
  const hop = action === 'play' && !still ? Math.round(Math.abs(Math.sin(elapsed/150))*7) : 0;
  const shake = action === 'clean' ? Math.round(wave*2) : 0;
  const x = 46 + shake + (action === 'play' && !still ? Math.round(Math.sin(elapsed/260)*4) : 0);
  const y = 51 - hop;
  rect('#637b49',49,79,34,3);

  if (action === 'rest') {
    rect('#8e6651',42,76,43,7); rect('#bf9980',44,75,39,6);
    rect('#e2bb91',47,78,33,2);
    const breath = !still && Math.sin(elapsed/450)>0 ? 1 : 0;
    rect('#724b32',49,63-breath,31,14+breath);
    rect('#c99252',51,63-breath,27,12+breath);
    rect('#e7b477',67,73,12,4);
    rect('#724b32',47,66,6,11); rect('#d5a268',51,66,17,11);
    rect('#e9be82',54,66,12,9); rect('#f8e0af',57,72,11,5);
    rect('#352f2b',55,70,4,1); rect('#352f2b',63,70,3,1);
    rect('#352f2b',64,73,3,2); rect('#a64e38',68,67,2,7);
    rect('#c99252',78,68,5,7); rect('#e7b477',77,67,6,3);
    const drift = still ? 0 : Math.floor(elapsed/220)%5;
    zed(70,58-drift,4); zed(78,50-drift,5); zed(89,40-drift,6);
    return;
  }

  // Tail sits behind the body; head and paws react independently.
  const wag = still ? 0 : Math.round(Math.sin(now/(action==='play'?65:180))*3);
  rect('#724b32',x+27,y+16,3,9); rect('#c99252',x+28,y+14+wag,3,8);
  rect('#e7b477',x+29,y+12+wag,3,3);
  rect('#724b32',x+7,y+13,20,13); rect('#c99252',x+8,y+12,18,13);
  rect('#e7b477',x+8,y+24,5,4); rect('#e7b477',x+22,y+24,5,4);
  rect('#a64e38',x+10,y+20,15,2); rect('#eaca73',x+17,y+21,2,2);
  const dip = action === 'feed' ? (still ? 3 : 2 + Math.round((wave+1)*2)) : 0;
  const hx = x + (action==='feed'?2:0), hy = y + dip;
  rect('#724b32',hx+5,hy+5,6,12); rect('#724b32',hx+23,hy+5,6,12);
  rect('#d5a268',hx+9,hy+5,16,15); rect('#e9be82',hx+11,hy+6,12,12);
  rect('#f8e0af',hx+12,hy+14,10,6);
  const eyesClosed = action==='clean' || action==='feed' || (!still && now%4400>4180);
  rect('#352f2b',hx+12,hy+11,eyesClosed?3:2,eyesClosed?1:2);
  rect('#352f2b',hx+21,hy+11,eyesClosed?3:2,eyesClosed?1:2);
  rect('#352f2b',hx+16,hy+15,3,2); rect('#a26043',hx+17,hy+18,3,1);
  if ((state.happy>=60 || action==='play') && action!=='feed') rect('#d4796a',hx+18,hy+18,2,3);
  if (state.clean<35 && action!=='clean') {
    rect('#806849',hx+10,hy+16,2,2); rect('#806849',x+23,y+23,2,2);
  }

  if (action === 'feed') {
    rect('#4d5941',62,77,26,3); rect('#a95642',64,80,22,5);
    rect('#d7865b',66,80,18,3); rect('#f3d8a1',72,81,6,2);
    [[65,75],[70,73],[75,75],[80,74]].forEach(([fx,fy],i) => {
      rect(i%2?'#805235':'#a67542',fx,fy,4,3);
      rect('#d5a268',fx,fy,2,1);
    });
    if (still || wave>0) { rect('#a67542',65,72,2,2); rect('#d5a268',70,70,2,2); }
    pixelHeart(84,57+(still?0:Math.round(wave*2)));
  } else if (action === 'play') {
    const bx = still ? 88 : 88 + Math.round(Math.sin(elapsed/240)*7);
    const by = still ? 69 : 76 - Math.round(Math.abs(Math.sin(elapsed/180))*15);
    rect('#637b49',87,82,15,2);
    rect('#a95642',bx+2,by,8,2); rect('#d7865b',bx,by+2,12,8);
    rect('#a95642',bx+2,by+10,8,2); rect('#f3d582',bx+5,by+1,3,10);
    rect('#fff1bd',bx+2,by+3,3,2); pixelHeart(34,46-hop);
  } else if (action === 'clean') {
    [[39,60,6],[81,56,8],[47,39,5],[72,38,6],[91,70,5]].forEach(([bx,by,size],i) => {
      const rise = still ? 0 : Math.floor((elapsed/95+i*3)%9);
      bubble(bx,by-rise,size);
    });
    rect('#719f9a',47,82,37,2); rect('#a8d5ce',52,81,26,2);
    rect('#dcead9',x+10,hy+3,14,3); rect('#ffffff',x+13,hy+1,6,3);
    rect('#add5d8',x+3,hy+20,2,4); rect('#add5d8',x+31,hy+17,2,3);
  }
}

function stopFrames() {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
}
function animate(now) {
  frame = null;
  if ($('game').hidden || document.hidden) return;
  drawDog(now);
  if (!motion.matches) frame = requestAnimationFrame(animate);
}
function startFrames() {
  stopFrames();
  if (!$('game').hidden && !document.hidden) animate(performance.now());
}
function cancelReaction() {
  generation++;
  if (reactionTimer !== null) clearTimeout(reactionTimer);
  reactionTimer = null;
  reaction = null;
  stopFrames();
}
function beginReaction(action) {
  const token = ++generation;
  reaction = {action, started:performance.now()};
  renderReaction();
  startFrames();
  reactionTimer = setTimeout(() => {
    // A reset invalidates the callback even if it was already queued.
    if (token !== generation) return;
    reaction = null;
    reactionTimer = null;
    renderReaction();
    startFrames();
  }, reactions[action].duration);
}

function act(action) {
  if ($('game').hidden || reaction || state.hour >= 17 || !Object.hasOwn(effects,action)) return;
  let error = '';
  if (action==='feed' && state.food>85) error='That tummy is already full (above 85). Try another activity.';
  if (action==='play' && state.energy<20) error='Playing needs at least 20 Energy. Rest first.';
  if (action==='clean' && state.energy<10) error='Cleaning needs at least 10 Energy. Rest first.';
  if (action==='clean' && state.clean>85) error='Already squeaky clean (above 85). Care for another need.';
  if (action==='rest' && state.energy>85) error='Plenty of Energy already (above 85). Try another activity.';
  if (error) {
    $('feedback').textContent = `${error} No time used.`;
    $('scene-status').textContent = 'Try a different activity. No time used.';
    return;
  }
  const before = {...state};
  for (const [key,delta] of Object.entries(effects[action])) state[key] += delta;
  state.food -= 8; state.happy -= 4; state.clean -= 3;
  fields.forEach(([key]) => { state[key] = Math.max(0,Math.min(100,state[key])); });
  state.hour++;
  const changes = fields.filter(([key]) => state[key]!==before[key]).map(([key,label]) =>
    `${label} ${state[key]-before[key]>0?'+':''}${state[key]-before[key]}`).join(', ');
  const message = `${state.hour}:00 · ${labels[action]}: ${changes}.`;
  state.history.push(message);
  beginReaction(action);
  render();
  $('feedback').textContent = message + (state.hour===17 ? ' Your day is complete. See your summary below.' : ' Watch your puppy, then choose again.');
}

$('name-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!$('game').hidden) return;
  const name = $('puppy-name').value.trim();
  if (!name || Array.from(name).length>12) {
    $('name-error').textContent = 'Enter a name with 1–12 characters, not just spaces.';
    $('puppy-name').setAttribute('aria-invalid','true');
    $('puppy-name').focus();
    return;
  }
  $('name-error').textContent = '';
  $('puppy-name').removeAttribute('aria-invalid');
  state.name = name;
  $('welcome').hidden = true;
  $('game').hidden = false;
  render();
  startFrames();
  $('feedback').textContent = `Welcome home, ${name}! Check the needs, then choose an activity.`;
  document.querySelector('#actions [data-action]').focus();
});
$('actions').addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (button && !button.disabled) act(button.dataset.action);
});
$('reset').addEventListener('click', () => $('reset-dialog').showModal());
$('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
$('confirm-reset').addEventListener('click', () => {
  cancelReaction();
  state = initial();
  $('reset-dialog').close();
  $('game').hidden = true;
  $('welcome').hidden = false;
  $('name-form').reset();
  $('name-error').textContent = '';
  $('puppy-name').removeAttribute('aria-invalid');
  render();
  ctx.clearRect(0,0,128,96);
  $('puppy-name').focus();
});
motion.addEventListener('change', startFrames);
document.addEventListener('visibilitychange', startFrames);
