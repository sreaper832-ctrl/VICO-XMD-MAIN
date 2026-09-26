'use strict';

const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const crypto = require('crypto');

// These are self-contained HTML games sent through the same rich-response
// structure used by the user's Roulette example. They use virtual credits only.
const BASE = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:radial-gradient(circle at 50% 5%,#251010,#100707 65%,#050303);font-family:Arial,sans-serif;color:#fff;touch-action:manipulation}.game{width:min(94vw,420px);margin:10px auto;padding:18px;border:2px solid #8a3a3a;border-radius:20px;background:linear-gradient(145deg,#281515,#130909);box-shadow:0 10px 30px #000c}.title{text-align:center;font-size:27px;font-weight:900;color:#ffd54f;margin-bottom:12px}.stats{display:flex;justify-content:space-between;gap:8px;padding:10px;background:#090909;border-radius:10px;margin-bottom:12px}.stats b{color:#aed581}.result{text-align:center;min-height:48px;padding:12px;border-radius:12px;background:#1c1010;margin:10px 0;font-weight:900}.win{background:#123f20}.lose{background:#491515}.grid{display:grid;gap:8px}.grid2{grid-template-columns:1fr 1fr}.grid3{grid-template-columns:repeat(3,1fr)}button{border:0;border-radius:10px;padding:13px 8px;font-size:15px;font-weight:900;background:#2e7d32;color:#fff}button:active{transform:scale(.95)}.gold{background:#f9a825;color:#111}.red{background:#c62828}.dark{background:#272727}.big{font-size:38px;text-align:center;padding:18px;border-radius:16px;background:#0b0b0b;margin:10px 0}.board{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.cell{aspect-ratio:1;display:grid;place-items:center;border-radius:10px;background:#241313;font-size:24px}.small{text-align:center;color:#bbb;font-size:12px;margin-top:10px}</style></head><body>`;
const END = `</body></html>`;

const GAMES = {};

GAMES.roulette = BASE + `<div class="game"><div class="title">🎰 ROULETTE</div><div class="big" id="wheel">🎯</div><div id="result" class="result">Place your bet!</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><div class="grid grid3"><button onclick="pick('red')">🔴 RED</button><button onclick="pick('black')">⚫ BLACK</button><button onclick="pick('green')">🟢 GREEN</button></div><button class="gold" style="width:100%;margin-top:8px" onclick="spin()">🎰 SPIN</button><div class="small">Green pays 35x • Red/Black pays 2x</div></div><script>let c=500,b=10,ch='red',run=0;const red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];function pick(x){ch=x;result.textContent='Betting on '+x.toUpperCase()}function spin(){if(run||c<b)return;run=1;result.textContent='🎰 Spinning...';wheel.textContent='🌀';setTimeout(()=>{let n=Math.floor(Math.random()*37),col=n===0?'green':red.includes(n)?'red':'black',win=col===ch;c+=win?b*(ch==='green'?35:2):-b;wheel.textContent=n;result.className='result '+(win?'win':'lose');result.textContent=win?'🎉 WIN! '+n+' '+col:'💀 LOSE! '+n+' '+col;c=Math.max(0,c);document.getElementById('c').textContent=c;run=0;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}},1600)}</script>` + END;

GAMES.fight = BASE + `<div class="game"><div class="title">🥊 NAIJA STREET FIGHT</div><canvas id="fightCanvas" width="300" height="250" style="background:linear-gradient(#071d10,#010e06);border:2px solid #0e3a1f;border-radius:12px;display:block;margin:8px auto"></canvas><div class="stats"><span>❤️ YOU <b id="fightYou">100</b></span><span>❤️ BOT <b id="fightBot">100</b></span></div><div class="grid grid3"><button onclick="fightAct('punch')">👊 PUNCH</button><button onclick="fightAct('kick')">🦶 KICK</button><button onclick="fightAct('block')">🛡️ BLOCK</button></div><button class="gold" style="width:100%;margin-top:8px" onclick="initFight()">🥊 RESET FIGHT</button><div class="small">Punch=fast, Kick=strong, Block=reduce</div></div><script>let fightYou=100,fightBot=100,fightBlock=false;function initFight(){fightYou=100;fightBot=100;fightBlock=false;document.getElementById('fightYou').textContent=100;document.getElementById('fightBot').textContent=100;drawFight()}function drawFight(){let c=document.getElementById('fightCanvas');if(!c) return;let ctx=c.getContext('2d');ctx.clearRect(0,0,300,250);ctx.fillStyle='#2dd4d0';ctx.fillRect(60,120,30,80);ctx.beginPath();ctx.arc(75,100,20,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff4a4a';ctx.fillRect(210,120,30,80);ctx.beginPath();ctx.arc(225,100,20,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a8a3d';ctx.fillRect(20,20,fightYou*0.8,10);ctx.fillStyle='#ff4a4a';ctx.fillRect(200,20,fightBot*0.8,10)}function fightAct(act){if(fightYou<=0||fightBot<=0) return;let dmg=0;if(act==='punch') dmg=Math.floor(Math.random()*15)+10;if(act==='kick') dmg=Math.floor(Math.random()*20)+15;if(act==='block'){fightBlock=true;setTimeout(botFight,500);drawFight();return}fightBot-=dmg;if(fightBot<0) fightBot=0;document.getElementById('fightBot').textContent=fightBot;drawFight();if(fightBot<=0){alert('YOU WIN FIGHT! 🥊🔥');return}setTimeout(botFight,400)}function botFight(){if(fightBot<=0||fightYou<=0) return;let dmg=Math.floor(Math.random()*18)+10;if(fightBlock){dmg=Math.floor(dmg/3);fightBlock=false}fightYou-=dmg;if(fightYou<0) fightYou=0;document.getElementById('fightYou').textContent=fightYou;drawFight();if(fightYou<=0) alert('BOT WINS!')}initFight();<\/script>` + END;

GAMES.slide = BASE + `<div class="game"><div class="title">🔢 SLIDE PUZZLE</div><div class="stats"><span>Moves <b id="s-moves">0</b></span><span id="s-win" style="color:#2dd4d0;font-weight:900"></span></div><div id="s-board" style="width:280px;height:280px;margin:10px auto;background:#071d10;border:2px solid #0e3a1f;border-radius:10px;padding:6px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px"></div><button class="gold" style="width:100%" onclick="sReset()">↻ RESET SLIDE</button><div class="small">Tap tile next to empty space • Arrange 1-15</div></div><script>
let sTiles=[], sMoves=0, sWon=false;
function sReset(){ let a=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0], e=15; for(let i=0;i<250;i++){ let nb=[]; let r=Math.floor(e/4), c=e%4; if(r>0) nb.push(e-4); if(r<3) nb.push(e+4); if(c>0) nb.push(e-1); if(c<3) nb.push(e+1); let n=nb[Math.floor(Math.random()*nb.length)]; [a[e],a[n]]=[a[n],a[e]]; e=n; } sTiles=a; sMoves=0; sWon=false; sRender(); }
function sRender(){
 let b=document.getElementById('s-board'); b.innerHTML=''; document.getElementById('s-moves').textContent=sMoves; document.getElementById('s-win').textContent=sWon?'YOU WIN! 🎉':'';
 sTiles.forEach((v,i)=>{ let d=document.createElement('div'); d.style.cssText='border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;cursor:pointer;border:2px solid '+(v===0?'transparent':(sWon?'#2dd4d0':'#1a4a2e'))+';background:'+(v===0?'transparent':'#0f2e1d')+';color:#fff;'; d.textContent=v||''; d.onclick=()=>sMove(i); b.appendChild(d); });
}
function sMove(i){ if(sWon) return; let e=sTiles.indexOf(0), r1=Math.floor(i/4), c1=i%4, r2=Math.floor(e/4), c2=e%4; if(Math.abs(r1-r2)+Math.abs(c1-c2)===1){ [sTiles[e],sTiles[i]]=[sTiles[i],sTiles[e]]; sMoves++; if(sTiles.every((v,idx)=>idx===15?v===0:v===idx+1)) sWon=true; sRender(); } }
setTimeout(sReset,50);
</script>` + END;

GAMES.car = BASE + `<div class="game"><div class="title">🏎️ CAR RACE - EASY</div><div class="stats"><span>SCORE <b id="car-score">0</b></span><span>BEST <b id="car-best">0</b></span><span id="car-msg" style="color:#ff4a4a;font-weight:900"></span></div><canvas id="car-canvas" width="300" height="420" style="border-radius:10px;border:2px solid #0e3a1f;background:#071d10;display:block;margin:10px auto;touch-action:manipulation"></canvas><div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;width:300px;margin:10px auto"><button onclick="carMove(-1)" style="background:#0f2e1d;border:1px solid #1a4a2e;color:#fff;border-radius:10px;padding:14px;font-size:20px">◀</button><button onclick="carReset()" style="background:#1a8a3d;color:#fff;border-radius:10px;padding:11px;font-weight:900;border:none">RESET<br>RACE</button><button onclick="carMove(1)" style="background:#0f2e1d;border:1px solid #1a4a2e;color:#fff;border-radius:10px;padding:14px;font-size:20px">▶</button></div><div class="small">Easier • Slower traffic • More space</div></div><script>
let carCanvas=document.getElementById('car-canvas'), carCtx=carCanvas.getContext('2d'), carScore=0, carBest=0, carState={x:130,obs:[],spd:2,sc:0,running:true,raf:0}, carRun=true;
function carReset(){ carState={x:130,obs:[],spd:2,sc:0,running:true,raf:0}; carScore=0; carRun=false; let msg=document.getElementById('car-msg'); if(msg) msg.textContent=''; setTimeout(()=>{carRun=true; carLoop();},100); }
function carMove(d){ if(!carState.running) return; carState.x=Math.max(32,Math.min(218,carState.x+d*50)); }
function carLoop(){
 if(!carState.running) return; let ctx=carCtx, s=carState; ctx.fillStyle='#0a2213'; ctx.fillRect(0,0,300,420); ctx.fillStyle='#1a1a1a'; ctx.fillRect(30,0,240,420); ctx.fillStyle='#ffffff22'; for(let y=-20+s.sc*2%40;y<420;y+=40){ ctx.fillRect(109,y,4,20); ctx.fillRect(189,y,4,20); } ctx.fillStyle='#2dd4d0'; ctx.fillRect(28,0,4,420); ctx.fillRect(268,0,4,420);
 // EASIER: spawn less often 0.012 vs 0.025
 if(Math.random()<0.012+s.spd*0.0005){ let lanes=[40,110,180]; s.obs.push({x:lanes[Math.floor(Math.random()*3)],y:-60,w:50,h:50,c:'hsl('+(Math.random()*60)+',75%,60%)'}); }
 s.spd+=0.0008; s.sc++; carScore=Math.floor(s.sc/10); let scEl=document.getElementById('car-score'); if(scEl) scEl.textContent=carScore;
 for(let i=s.obs.length-1;i>=0;i--){ let o=s.obs[i]; o.y+=s.spd; if(o.y>420) s.obs.splice(i,1); else { ctx.fillStyle=o.c; ctx.fillRect(o.x,o.y,o.w,o.h); ctx.fillStyle='#000'; ctx.fillRect(o.x+5,o.y+6,10,10); ctx.fillRect(o.x+35,o.y+6,10,10); if(o.x<s.x+46&&o.x+o.w>s.x+4&&o.y<390&&o.y+o.h>340){ s.running=false; carBest=Math.max(carBest,carScore); let bestEl=document.getElementById('car-best'); if(bestEl) bestEl.textContent=carBest; let msg=document.getElementById('car-msg'); if(msg) msg.textContent='CRASH! 💥'; return; } } }
 ctx.fillStyle='#2dd4d0'; ctx.fillRect(s.x,340,50,48); ctx.fillStyle='#f5b82a'; ctx.fillRect(s.x+15,335,20,6);
 if(carRun) carState.raf=requestAnimationFrame(carLoop);
}
setTimeout(()=>{ carReset(); carLoop(); carCanvas.addEventListener('touchstart',e=>{ let tx=e.touches[0].clientX-carCanvas.getBoundingClientRect().left; carState.x=tx<150?45:175; }); },150);
</script>` + END;

GAMES.hang = BASE + `<div class="game"><div class="title">🪢 HANGMAN</div><div class="stats"><span>WRONG <b id="h-wrong">0/6</b></span><span id="h-msg">GUESS NAIJA WORD</span></div><div style="background:#071d10;border:2px solid #0e3a1f;border-radius:10px;padding:10px;display:flex;gap:10px;align-items:center;justify-content:center;margin:10px 0"><div style="width:100px;height:120px;background:#010e06;border-radius:8px;border:1px solid #1a4a2e;display:flex;align-items:center;justify-content:center"><svg id="h-svg" width="80" height="100" viewBox="0 0 90 110"></svg></div><div style="flex:1"><div id="h-word" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center"></div></div></div><div id="h-letters" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px"></div><button style="width:100%;margin-top:10px;background:#1a8a3d;color:#fff;border-radius:8px;padding:10px;font-weight:900;border:none" onclick="hReset()">RESET HANGMAN</button></div><script>
let hWords=["JOLLOF","LAGOS","DANFO","SUYA","ABUJA","EBA","GARRI","OKADA","MAMA","NAIJA","AKARA","GALA","BEND","SHEGE","WAHALA","OGBONO"], hWord="", hGuessed=new Set(), hWrong=0;
function hReset(){ hWord=hWords[Math.floor(Math.random()*hWords.length)]; hGuessed=new Set(); hWrong=0; hRender(); }
function hRender(){
 let wrongEl=document.getElementById('h-wrong'); if(wrongEl) wrongEl.textContent=hWrong+'/6';
 let wordDiv=document.getElementById('h-word'); wordDiv.innerHTML=''; hWord.split('').forEach(ch=>{ let d=document.createElement('div'); let rev=hGuessed.has(ch)||hWrong>=6||[...hWord].every(c=>hGuessed.has(c)); d.style.cssText='width:24px;height:32px;border-radius:6px;border:2px solid '+(rev?'#2dd4d0':'#1a4a2e')+';background:'+(rev?'#0f2e1d':'#010e06')+';display:flex;align-items:center;justify-content:center;font-weight:900;color:'+(rev?'#fff':'transparent')+';font-size:13px'; d.textContent=ch; wordDiv.appendChild(d); });
 let over=hWrong>=6, win=[...hWord].every(c=>hGuessed.has(c)); let msgEl=document.getElementById('h-msg'); if(msgEl){ msgEl.textContent=win?'YOU WIN! 🎉':over?'LOST! WAS '+hWord:'GUESS NAIJA WORD'; msgEl.style.color=win?'#2dd4d0':over?'#ff4a4a':'#fff'; }
 let lettersDiv=document.getElementById('h-letters'); lettersDiv.innerHTML=''; 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(ch=>{ let b=document.createElement('button'); let guessed=hGuessed.has(ch), correct=hWord.includes(ch)&&guessed, wrong=!hWord.includes(ch)&&guessed; b.textContent=ch; b.style.cssText='height:34px;border-radius:6px;font-weight:900;font-size:12px;border:2px solid '+(guessed?(correct?'#1a8a3d':'#5a2a2a'):'#1a4a2e')+';background:'+(guessed?(correct?'#1a8a3d':'#3a1a1a'):'#0f2e1d')+';color:'+(guessed&&wrong?'rgba(255,255,255,.4)':'#fff'); b.disabled=guessed||win||over; b.onclick=()=>{hGuessed.add(ch); if(!hWord.includes(ch)) hWrong++; hRender(); hDrawMan();}; lettersDiv.appendChild(b); });
}
function hDrawMan(){ let svg=document.getElementById('h-svg'); if(!svg) return; svg.innerHTML='<line x1="10" y1="100" x2="80" y2="100" stroke="#1a4a2e" stroke-width="4"/><line x1="25" y1="100" x2="25" y2="10" stroke="#1a4a2e" stroke-width="4"/><line x1="25" y1="10" x2="60" y2="10" stroke="#1a4a2e" stroke-width="4"/><line x1="60" y1="10" x2="60" y2="20" stroke="#1a4a2e" stroke-width="3"/>'+(hWrong>=1?'<circle cx="60" cy="32" r="12" stroke="#f5b82a" stroke-width="3" fill="none"/>':'')+(hWrong>=2?'<line x1="60" y1="44" x2="60" y2="70" stroke="#f5b82a" stroke-width="3"/>':'')+(hWrong>=3?'<line x1="60" y1="50" x2="45" y2="60" stroke="#f5b82a" stroke-width="3"/>':'')+(hWrong>=4?'<line x1="60" y1="50" x2="75" y2="60" stroke="#f5b82a" stroke-width="3"/>':'')+(hWrong>=5?'<line x1="60" y1="70" x2="45" y2="85" stroke="#f5b82a" stroke-width="3"/>':'')+(hWrong>=6?'<line x1="60" y1="70" x2="75" y2="85" stroke="#f5b82a" stroke-width="3"/>':''); }
setTimeout(()=>{hReset(); hDrawMan();},80);
</script>` + END;

GAMES.tetris = BASE + `<div class="game"><div class="title">🧩 TETRIS</div><div class="stats"><span>Score <b id="te-score">0</b></span><span id="te-over" style="color:#ff4a4a;font-weight:900"></span></div><div id="te-board" style="width:180px;height:360px;margin:8px auto;background:#071d10;border:2px solid #0e3a1f;border-radius:8px;display:grid;gap:1px"></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;max-width:200px;margin:8px auto"><button onclick="teMove(-1)" style="background:#0f2e1d;border:1px solid #1a4a2e;color:#fff;border-radius:8px;padding:10px">◀</button><button onclick="teRot()" style="background:#1a8a3d;color:#fff;border-radius:8px;padding:10px">↻</button><button onclick="teMove(1)" style="background:#0f2e1d;border:1px solid #1a4a2e;color:#fff;border-radius:8px;padding:10px">▶</button><button onclick="teDrop()" style="grid-column:span 3;background:#0f2e1d;border:1px solid #1a4a2e;color:#fff;border-radius:8px;padding:8px">▼ DROP</button></div><button style="width:100%;background:#1a8a3d;color:#fff;border-radius:8px;padding:10px;font-weight:900;border:none" onclick="teReset()">RESET TETRIS</button></div><script>
let teShapes=[{c:'#2dd4d0',m:[[1,1,1,1]]},{c:'#f5b82a',m:[[1,1],[1,1]]},{c:'#ff4a4a',m:[[1,1,1],[0,1,0]]},{c:'#1a8a3d',m:[[1,1,0],[0,1,1]]},{c:'#7a5CFA',m:[[0,1,1],[1,1,0]]},{c:'#ff9a00',m:[[1,0,0],[1,1,1]]}];
let teBoard=[], teCur=null, tePos={x:3,y:0}, teScore=0, teOver=false, teTimer=null;
// FIXED: proper collision check - like original code you gave
function teNewBoard(){ return Array.from({length:20},()=>Array(10).fill('')); }
function teCollide(x,y,mat,board){ for(let r=0;r<mat.length;r++){ for(let c=0;c<mat[r].length;c++){ if(mat[r][c]){ let nx=x+c, ny=y+r; if(nx<0||nx>=10||ny>=20) return true; if(ny>=0&&board[ny][nx]) return true; } } } return false; }
function teSpawn(){ let s=teShapes[Math.floor(Math.random()*teShapes.length)]; teCur={c:s.c, m:s.m.map(row=>[...row])}; tePos={x:3,y:0}; if(teCollide(tePos.x,tePos.y,teCur.m,teBoard)){ teOver=true; let overEl=document.getElementById('te-over'); if(overEl) overEl.textContent='GAME OVER'; clearInterval(teTimer); } }
function teRender(){
 let boardEl=document.getElementById('te-board'); if(!boardEl) return; boardEl.style.gridTemplateColumns='repeat(10,1fr)'; boardEl.style.gridTemplateRows='repeat(20,1fr)';
 let tmp=teBoard.map(r=>[...r]); if(teCur){ for(let r=0;r<teCur.m.length;r++){ for(let c=0;c<teCur.m[r].length;c++){ if(teCur.m[r][c]){ let ny=tePos.y+r, nx=tePos.x+c; if(ny>=0&&ny<20&&nx>=0&&nx<10) tmp[ny][nx]=teCur.c; } } } }
 boardEl.innerHTML=''; tmp.flat().forEach(col=>{ let d=document.createElement('div'); d.style.background=col||'#0a2213'; d.style.borderRadius='2px'; if(col) d.style.boxShadow='inset 0 0 2px #000'; boardEl.appendChild(d); });
 let scoreEl=document.getElementById('te-score'); if(scoreEl) scoreEl.textContent=teScore;
}
function teTick(){
 if(teOver||!teCur) return;
 if(!teCollide(tePos.x,tePos.y+1,teCur.m,teBoard)){
   tePos.y++; // FALLING - this was missing before
 } else {
   // lock piece - like your original code
   for(let r=0;r<teCur.m.length;r++){ for(let c=0;c<teCur.m[r].length;c++){ if(teCur.m[r][c]&&tePos.y+r>=0) teBoard[tePos.y+r][tePos.x+c]=teCur.c; } }
   let cleared=0; for(let r=19;r>=0;r--){ if(teBoard[r].every(v=>v)){ teBoard.splice(r,1); teBoard.unshift(Array(10).fill('')); cleared++; r++; } } teScore+=cleared*10; teSpawn();
 }
 teRender();
}
function teMove(dir){ if(teOver||!teCur) return; if(!teCollide(tePos.x+dir,tePos.y,teCur.m,teBoard)){ tePos.x+=dir; teRender(); } }
function teRot(){ if(!teCur) return; let rotated=teCur.m[0].map((_,i)=>teCur.m.map(row=>row[i]).reverse()); if(!teCollide(tePos.x,tePos.y,rotated,teBoard)) teCur.m=rotated; teRender(); }
function teDrop(){ if(teOver) return; while(!teCollide(tePos.x,tePos.y+1,teCur.m,teBoard)) tePos.y++; teTick(); }
function teReset(){ teBoard=teNewBoard(); teScore=0; teOver=false; let overEl=document.getElementById('te-over'); if(overEl) overEl.textContent=''; teSpawn(); teRender(); if(teTimer) clearInterval(teTimer); teTimer=setInterval(teTick,500); }
setTimeout(teReset,100);
</script>` + END;

GAMES.memory = BASE + `<div class="game"><div class="title">🧠 MEMORY</div><div class="stats"><span>Moves <b id="me-moves">0</b></span><span>Best <b id="me-best">-</b></span><span id="me-win" style="color:#2dd4d0;font-weight:900"></span></div><div id="me-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:280px;margin:10px auto"></div><button style="width:100%;background:#1a8a3d;color:#fff;border-radius:8px;padding:10px;font-weight:900;border:none" onclick="meReset()">RESET MEMORY</button></div><script>
let meEmojis=["🍚","🇳🇬","🍗","🥘","🎶","🦁","🌴","⭐"], meTiles=[], meFlipped=[], meMoves=0, meBest=0, meLock=false;
function meReset(){ let arr=[...meEmojis,...meEmojis].map((e,i)=>({emoji:e,sort:Math.random(),id:i})).sort((a,b)=>a.sort-b.sort).map((v,i)=>({id:i,emoji:v.emoji,flipped:false,matched:false})); meTiles=arr; meFlipped=[]; meMoves=0; meLock=false; let winEl=document.getElementById('me-win'); if(winEl) winEl.textContent=''; meRender(); }
function meRender(){
 let board=document.getElementById('me-board'); if(!board) return; board.innerHTML=''; let movesEl=document.getElementById('me-moves'); if(movesEl) movesEl.textContent=meMoves; let bestEl=document.getElementById('me-best'); if(bestEl) bestEl.textContent=meBest||'-';
 meTiles.forEach((t,idx)=>{ let d=document.createElement('div'); d.style.cssText='height:60px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;border:2px solid '+(t.matched?'#2dd4d0':'#1a4a2e')+';background:'+(t.matched?'#1a8a3d':'#0f2e1d'); d.textContent=t.flipped||t.matched?t.emoji:'?'; d.style.color=t.flipped||t.matched?'#fff':'rgba(255,255,255,.3)'; d.onclick=()=>meFlip(idx); board.appendChild(d); });
}
function meFlip(i){
 if(meTiles[i].flipped||meTiles[i].matched||meFlipped.length>=2||meLock) return; meTiles[i].flipped=true; meFlipped.push(i); meRender();
 if(meFlipped.length===2){ meMoves++; let [a,b]=meFlipped; if(meTiles[a].emoji===meTiles[b].emoji){ setTimeout(()=>{ meTiles[a].matched=true; meTiles[b].matched=true; meFlipped=[]; meRender(); if(meTiles.every(t=>t.matched)){ meBest=meBest===0?meMoves:Math.min(meBest,meMoves); let winEl=document.getElementById('me-win'); if(winEl) winEl.textContent='YOU WIN! 🎉'; let bestEl=document.getElementById('me-best'); if(bestEl) bestEl.textContent=meBest; } },400); } else { meLock=true; setTimeout(()=>{ meTiles[a].flipped=false; meTiles[b].flipped=false; meFlipped=[]; meLock=false; meRender(); },700); }
 }
}
setTimeout(meReset,80);
</script>` + END;


GAMES.whack = BASE + `<div class="game"><div class="title">🐹 WHACK A MOLE</div><div id="whackBoard" style="display:grid;grid-template-columns:repeat(3,80px);gap:8px;justify-content:center;margin:10px auto"></div><div class="stats"><span>Score <b id="whackS">0</b></span><span>Time <b id="whackT">20</b>s</span></div><button class="gold" style="width:100%;margin-top:8px" onclick="whackStart()">START 20s</button></div><script>let whackMole=null,whackScore=0,whackTime=20,whackLoop=null,whackTimer=null;function whackStart(){whackScore=0;whackTime=20;document.getElementById('whackS').textContent=0;document.getElementById('whackT').textContent=20;clearInterval(whackLoop);clearInterval(whackTimer);whackLoop=setInterval(()=>{whackMole=Math.floor(Math.random()*9);drawWhack()},600);whackTimer=setInterval(()=>{whackTime--;document.getElementById('whackT').textContent=whackTime;if(whackTime<=0){clearInterval(whackLoop);clearInterval(whackTimer);whackMole=null;drawWhack()}},1000);drawWhack()}function drawWhack(){let b=document.getElementById('whackBoard');if(!b) return;b.innerHTML='';for(let i=0;i<9;i++){let btn=document.createElement('button');btn.textContent=whackMole===i?'🐹':'🕳️';btn.style.cssText='width:80px;height:80px;border-radius:16px;border:1px solid '+(whackMole===i?'#2dd4d0':'#0e3a1f')+';background:'+(whackMole===i?'#2dd4d0':'#071d10')+';font-size:28px';btn.onclick=()=>{if(i===whackMole){whackScore+=10;document.getElementById('whackS').textContent=whackScore;whackMole=null;drawWhack()}};b.appendChild(btn)}}drawWhack();<\/script>` + END;

GAMES.pacman = BASE + `<div class="game"><div class="title">👾 PACMAN NAIJA</div><canvas id="pacCanvas" width="300" height="300" style="background:#071d10;border:2px solid #0e3a1f;border-radius:12px;display:block;margin:8px auto"></canvas><div class="stats"><span>💰 Score <b id="pacScore">0</b></span><span>🏆 Best <b id="pacBest">0</b></span></div><div class="small">Move mouse/finger - chop yellow dots!</div><button class="gold" style="width:100%;margin-top:8px" onclick="initPac()">👾 START PACMAN</button></div><script>let pacX=150,pacY=150,pacDots=[],pacScore=0,pacBest=0,pacLoop=null;function initPac(){pacX=150;pacY=150;pacScore=0;pacDots=[];for(let i=0;i<22;i++) pacDots.push({x:Math.random()*270+15,y:Math.random()*270+15});drawPac();clearInterval(pacLoop);pacLoop=setInterval(drawPac,60)}function drawPac(){let c=document.getElementById('pacCanvas');if(!c) return;let ctx=c.getContext('2d');ctx.fillStyle='#071d10';ctx.fillRect(0,0,300,300);pacDots.forEach(d=>{ctx.fillStyle='#f1c40f';ctx.beginPath();ctx.arc(d.x,d.y,3,0,Math.PI*2);ctx.fill();if(Math.hypot(d.x-pacX,d.y-pacY)<12){d.x=Math.random()*270+15;d.y=Math.random()*270+15;pacScore+=10;pacBest=Math.max(pacBest,pacScore);let a=document.getElementById('pacScore');if(a) a.textContent=pacScore;let b=document.getElementById('pacBest');if(b) b.textContent=pacBest}});ctx.fillStyle='#f1c40f';ctx.beginPath();ctx.arc(pacX,pacY,12,0.3,Math.PI*1.7);ctx.lineTo(pacX,pacY);ctx.fill()}let pc=document.getElementById('pacCanvas');if(pc){pc.onmousemove=e=>{let r=pc.getBoundingClientRect();pacX=e.clientX-r.left;pacY=e.clientY-r.top};pc.ontouchmove=e=>{let r=pc.getBoundingClientRect();pacX=e.touches[0].clientX-r.left;pacY=e.touches[0].clientY-r.top}}initPac();<\/script>` + END;

GAMES.space = BASE + `<div class="game"><div class="title">🚀 SPACE SHOOTER</div><canvas id="spaceCanvas" width="300" height="400" style="background:#010e06;border:2px solid #0e3a1f;border-radius:12px;display:block;margin:8px auto"></canvas><div class="stats"><span>💰 Score <b id="spaceScore">0</b></span></div><button class="gold" style="width:100%;margin-top:8px" onclick="initSpace()">🚀 START SHOOT</button><div class="small">Tap to shoot</div></div><script>let shipX=130,bullets=[],aliens=[],spaceScore=0,spaceLoop=null;function initSpace(){shipX=130;bullets=[];aliens=[];spaceScore=0;let s=document.getElementById('spaceScore');if(s) s.textContent=0;clearInterval(spaceLoop);spaceLoop=setInterval(()=>{let c=document.getElementById('spaceCanvas');if(!c) return;let ctx=c.getContext('2d');ctx.fillStyle='#010e06';ctx.fillRect(0,0,300,400);if(Math.random()<0.05) aliens.push({x:Math.random()*260,y:0});bullets.forEach(b=>{b.y-=7;ctx.fillStyle='#2dd4d0';ctx.fillRect(b.x,b.y,4,12)});aliens.forEach(a=>{a.y+=2;ctx.fillStyle='#ff4a4a';ctx.fillRect(a.x,a.y,22,22)});bullets=bullets.filter(b=>b.y>0);aliens=aliens.filter(a=>a.y<420);for(let b of bullets)for(let a of aliens){if(b.x>a.x&&b.x<a.x+22&&b.y>a.y&&b.y<a.y+22){a.y=500;b.y=-10;spaceScore+=10;let s=document.getElementById('spaceScore');if(s) s.textContent=spaceScore}}ctx.fillStyle='#2dd4d0';ctx.fillRect(shipX,360,44,12);ctx.fillStyle='#fff';ctx.fillRect(shipX+18,350,8,12)},30)}let sc=document.getElementById('spaceCanvas');if(sc){sc.onclick=()=>{bullets.push({x:shipX+20,y:350})};sc.onmousemove=e=>{shipX=e.clientX-sc.getBoundingClientRect().left-22}}initSpace();<\/script>` + END;

GAMES.word = BASE + `<div class="game"><div class="title">🔤 WORD SCRAMBLE</div><div class="big" id="wordScr" style="font-size:26px;letter-spacing:4px;font-weight:900;color:#2dd4d0">LAGOS</div><input id="wordIn" placeholder="Your guess" style="width:100%;padding:10px;border-radius:10px;border:1px solid #0e3a1f;background:#010e06;color:#fff;text-align:center;font-weight:800;margin:8px 0"><div id="wordRes" class="result">Unscramble Naija word!</div><div class="grid grid3"><button onclick="wordCheck()">CHECK</button><button onclick="wordNew()">NEW</button><button onclick="wordHint()">HINT</button></div><div class="stats"><span>Score <b id="wordSc">0</b></span></div></div><script>let wordList=['LAGOS','ABUJA','JOLLOF','SUYA','DANFO','OKADA','NIGERIA','AFROBEATS','AMALA','EGUSI','ZOBO','AGBADA'],wordCur='LAGOS',wordScr='',wordScore=0;function wordNew(){wordCur=wordList[Math.floor(Math.random()*wordList.length)];let a=wordCur.split('').sort(()=>Math.random()-0.5);if(a.join('')===wordCur) a.reverse();wordScr=a.join('');document.getElementById('wordScr').textContent=wordScr;document.getElementById('wordIn').value='';document.getElementById('wordRes').textContent=wordScr.length+' letters'}function wordCheck(){let g=document.getElementById('wordIn').value.toUpperCase();if(g===wordCur){wordScore+=10;document.getElementById('wordSc').textContent=wordScore;document.getElementById('wordRes').textContent='Correct! 🔥 '+wordCur;setTimeout(wordNew,700)}else document.getElementById('wordRes').textContent='Try again!'}function wordHint(){document.getElementById('wordRes').textContent='First: '+wordCur[0]+' | Len: '+wordCur.length}wordNew();<\/script>` + END;

GAMES.tictactoe = BASE + `<div class="game"><div class="title">⭕ TIC TAC TOE</div><div id="ticBoard" style="display:grid;grid-template-columns:repeat(3,80px);gap:6px;justify-content:center;margin:10px auto"></div><div id="ticRes" class="result">Your turn X</div><button class="gold" style="width:100%;margin-top:8px" onclick="ticReset()">RESET</button></div><script>let ticB=Array(9).fill(null),ticOver=false;function ticReset(){ticB=Array(9).fill(null);ticOver=false;drawTic();document.getElementById('ticRes').textContent='Your turn X'}function drawTic(){let d=document.getElementById('ticBoard');if(!d) return;d.innerHTML='';ticB.forEach((v,i)=>{let b=document.createElement('button');b.textContent=v||'';b.style.cssText='width:80px;height:80px;background:#071d10;border:1px solid #0e3a1f;border-radius:12px;color:'+(v==='X'?'#2dd4d0':'#f1c40f')+';font-size:28px;font-weight:900';b.onclick=()=>ticPlay(i);d.appendChild(b)})}function ticPlay(i){if(ticB[i]||ticOver) return;ticB[i]='X';if(ticWin('X')){document.getElementById('ticRes').textContent='YOU WIN! 🎉';ticOver=true;drawTic();return}if(ticB.every(x=>x)){document.getElementById('ticRes').textContent='DRAW!';ticOver=true;drawTic();return}let empty=ticB.map((v,j)=>v?null:j).filter(v=>v!==null);let bot=empty[Math.floor(Math.random()*empty.length)];if(bot!==undefined) ticB[bot]='O';if(ticWin('O')){document.getElementById('ticRes').textContent='BOT WINS!';ticOver=true}else document.getElementById('ticRes').textContent='Your turn';drawTic()}function ticWin(p){let w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];return w.some(a=>a.every(i=>ticB[i]===p))}ticReset();<\/script>` + END;

GAMES.blackjack = BASE + `<div class="game"><div class="title">🃏 BLACKJACK</div><div id="dealer" class="big">Dealer: ?</div><div id="hand" class="big">Your hand</div><div id="result" class="result">Beat the dealer without going over 21.</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><div class="grid grid2"><button onclick="deal()">🃏 DEAL</button><button class="gold" onclick="hit()">➕ HIT</button><button class="dark" onclick="stand()">✋ STAND</button><button class="red" onclick="reset()">🔄 RESET</button></div></div><script>let c=500,b=10,p=[],d=[],active=0;function card(){return Math.floor(Math.random()*10)+1}function total(a){return a.reduce((x,y)=>x+y,0)}function draw(){hand.textContent='You: '+p.join(' + ')+' = '+total(p);dealer.textContent='Dealer: '+(d[0]||'?')+(active?' + ?':' = '+total(d));}function deal(){if(active||c<b)return;c-=b;p=[card(),card()];d=[card(),card()];active=1;result.className='result';result.textContent='Your move';draw();if(total(p)===21)finish(true)}function hit(){if(!active)return;p.push(card());draw();if(total(p)>21)finish(false)}function stand(){if(!active)return;while(total(d)<17)d.push(card());let pt=total(p),dt=total(d);finish(pt<=21&&(dt>21||pt>dt))}function finish(win){active=0;let pt=total(p),dt=total(d);dealer.textContent='Dealer: '+d.join(' + ')+' = '+dt;result.className='result '+(win?'win':'lose');if(win){c+=b*2;result.textContent='🎉 YOU WIN!'}else if(pt===dt&&pt<=21){c+=b;result.textContent='🤝 PUSH'}else result.textContent='💀 YOU LOSE';document.getElementById('c').textContent=c;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}}function reset(){active=0;p=[];d=[];dealer.textContent='Dealer: ?';hand.textContent='Your hand';result.className='result';result.textContent='Beat the dealer without going over 21.'}reset()</script>` + END;

GAMES.slots = BASE + `<div class="game"><div class="title">🎰 VICO SLOTS</div><div id="reels" class="big">🍒 | 🍋 | 🔔</div><div id="result" class="result">Match 3 symbols to win!</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><button class="gold" style="width:100%" onclick="spin()">🎰 SPIN</button><div class="small">3x same = 5x • 2x same = 2x</div></div><script>let c=500,b=10,run=0,a=['🍒','🍋','🔔','⭐','💎','7️⃣'];function spin(){if(run||c<b)return;run=1;c-=b;result.textContent='Spinning...';reels.textContent='🌀 | 🌀 | 🌀';setTimeout(()=>{let r=[0,0,0].map(()=>a[Math.floor(Math.random()*a.length)]);reels.textContent=r.join(' | ');let n=r.filter(x=>x===r[0]).length;let mult=n===3?5:n===2?2:0;if(mult){c+=b*mult;result.className='result win';result.textContent='🎉 WIN '+mult+'x!'}else{result.className='result lose';result.textContent='💀 No match'}document.getElementById('c').textContent=c;run=0;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}},1000)}</script>` + END;

GAMES.mines = BASE + `<div class="game"><div class="title">💣 MINES</div><div id="board" class="board"></div><div id="result" class="result">Pick a tile. Avoid the mines!</div><div class="stats"><span>💰 <b id="c">500</b></span><span>💎 Win <b id="w">0</b></span></div><button class="gold" style="width:100%" onclick="start()">🔄 NEW ROUND</button></div><script>let c=500,w=0,m=[];function start(){m=[...Array(25)].map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,5);w=0;board.innerHTML=[...Array(25)].map((_,i)=>'<button class="cell" onclick="tap('+i+')">❓</button>').join('');result.className='result';result.textContent='Avoid 5 hidden mines.'}function tap(i){let b=board.children[i];if(b.disabled)return;if(m.includes(i)){b.textContent='💣';b.disabled=true;result.className='result lose';result.textContent='💥 BOOM! Round lost';w=0;return}b.textContent='💎';b.disabled=true;w+=10;document.getElementById('w').textContent=w;if(w>=50){c+=w;result.className='result win';result.textContent='🎉 CASHED OUT +'+w+' credits'}}start()</script>` + END;

GAMES.plinko = BASE + `<div class="game"><div class="title">🔴 PLINKO</div><div class="big" id="ball">🔴</div><div id="result" class="result">Drop the ball!</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><div class="grid grid3"><button onclick="drop(0)">⬅️ LEFT</button><button class="gold" onclick="drop(1)">🔴 DROP</button><button onclick="drop(2)">RIGHT ➡️</button></div></div><script>let c=500,b=10;function drop(dir){if(c<b)return;c-=b;let slots=[0,0.5,1,2,5,10],mult=slots[Math.floor(Math.random()*slots.length)];if(dir===0)mult=Math.max(0,mult-.5);if(dir===2)mult=Math.min(10,mult+.5);c+=Math.floor(b*mult);ball.textContent='🔴';result.className='result '+(mult>=2?'win':'lose');result.textContent=(mult>=1?'🎉 '+mult+'x WIN':'💀 '+mult+'x');document.getElementById('c').textContent=c;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}}</script>` + END;

GAMES.crash = BASE + `<div class="game"><div class="title">📈 CRASH</div><div id="mult" class="big">1.00x</div><div id="result" class="result">Press START and cash out before the crash.</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><div class="grid grid2"><button onclick="start()">🚀 START</button><button class="gold" onclick="cash()">💰 CASH OUT</button></div></div><script>let c=500,b=10,x=1,timer=0,run=0;function start(){if(run||c<b)return;c-=b;x=1;run=1;result.className='result';result.textContent='Multiplier rising...';timer=setInterval(()=>{x+=.03+Math.random()*.12;mult.textContent=x.toFixed(2)+'x';if(Math.random()<.018+x*.001){clearInterval(timer);run=0;result.className='result lose';result.textContent='💥 CRASHED at '+x.toFixed(2)+'x';document.getElementById('c').textContent=c}},120)}function cash(){if(!run)return;clearInterval(timer);run=0;let win=Math.floor(b*x);c+=win;result.className='result win';result.textContent='🎉 CASHED OUT '+x.toFixed(2)+'x • +'+win;document.getElementById('c').textContent=c}</script>` + END;

GAMES.dice = BASE + `<div class="game"><div class="title">🎲 DICE DUEL</div><div id="result" class="result">Roll higher than VICO!</div><div class="grid grid2"><div class="big" id="you">⚀</div><div class="big" id="bot">⚀</div></div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><button class="gold" style="width:100%" onclick="roll()">🎲 ROLL</button></div><script>let c=500,b=10,f=['⚀','⚁','⚂','⚃','⚄','⚅'];function roll(){if(c<b)return;let a=1+Math.floor(Math.random()*6),z=1+Math.floor(Math.random()*6);c+=a>z?b:a===z?0:-b;you.textContent=f[a-1];bot.textContent=f[z-1];result.className='result '+(a>z?'win':'lose');result.textContent=a>z?'🎉 YOU WIN +'+b:a===z?'🤝 DRAW':'💀 VICO WINS -'+b;document.getElementById('c').textContent=c;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}}</script>` + END;

GAMES.coinflip = BASE + `<div class="game"><div class="title">🪙 COIN FLIP</div><div id="coin" class="big">🪙</div><div id="result" class="result">Choose a side.</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🎯 Bet <b id="b">10</b></span></div><div class="grid grid2"><button onclick="flip('heads')">🟡 HEADS</button><button onclick="flip('tails')">⚪ TAILS</button></div></div><script>let c=500,b=10;function flip(ch){if(c<b)return;let r=Math.random()<.5?'heads':'tails';coin.textContent=r==='heads'?'🟡':'⚪';if(ch===r){c+=b*2;result.className='result win';result.textContent='🎉 '+r.toUpperCase()+' — WIN!'}else{c-=b;result.className='result lose';result.textContent='💀 '+r.toUpperCase()+' — LOSE'}document.getElementById('c').textContent=c;if(c<b){c=500;result.textContent+=' • Credits reset to 500'}}</script>` + END;

GAMES.higherlower = BASE + `<div class="game"><div class="title">🔢 HIGHER OR LOWER</div><div id="num" class="big">50</div><div id="result" class="result">Guess whether the next number is higher or lower.</div><div class="stats"><span>💰 <b id="c">500</b></span><span>🔥 Streak <b id="s">0</b></span></div><div class="grid grid2"><button onclick="guess('higher')">⬆️ HIGHER</button><button onclick="guess('lower')">⬇️ LOWER</button></div><button class="red" style="width:100%;margin-top:8px" onclick="reset()">🔄 RESET</button></div><script>let c=500,s=0,n=50;function guess(x){let z=1+Math.floor(Math.random()*100),ok=x==='higher'?z>n:z<n;if(z===n)ok=true;if(ok){s++;c+=10;result.className='result win';result.textContent='🎉 Correct! '+z; }else{s=0;c=Math.max(0,c-10);result.className='result lose';result.textContent='💀 Wrong! '+z}n=z;num.textContent=n;document.getElementById('c').textContent=c;document.getElementById('s').textContent=s;if(c<10){c=500;s=0;result.textContent+=' • Credits reset to 500'}}function reset(){c=500;s=0;n=50;num.textContent=n;result.className='result';result.textContent='Guess whether the next number is higher or lower.';document.getElementById('c').textContent=c;document.getElementById('s').textContent=s}</script>` + END;

GAMES.snake = BASE + `<div class="game" style="background:#010e06;padding:8px">
<div class="stats" style="display:flex;justify-content:space-around;background:#0a2614;border:1px solid #123a20;border-radius:10px;padding:6px 0;margin-bottom:6px;font-size:14px">
<span>🍎 <b id="apples">0</b></span><span>🏆 <b id="score">0</b></span><span>⚡ <b id="speed">1</b></span>
</div>

<div id="boardWrap" style="position:relative;background:#071d10;border:2px solid #0e3a1f;border-radius:12px;overflow:hidden">
<div id="board" style="display:grid;grid-template-columns:repeat(18,1fr);grid-template-rows:repeat(22,1fr);width:100%;aspect-ratio:18/22;background-image:linear-gradient(#0e2f1c 1px, transparent 1px),linear-gradient(90deg,#0e2f1c 1px, transparent 1px);background-size:100% calc(100% / 22), calc(100% / 18) 100%"></div>

<div id="overlay" class="overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:5">
<div class="modal" style="background:#0a2213;border:2px solid #20c5a0;border-radius:16px;padding:16px 18px;min-width:180px;text-align:center;box-shadow:0 0 20px rgba(32,197,160,0.3)">
<div id="mIcon" style="font-size:26px">🐍</div>
<div id="mTitle" style="font-weight:800;font-size:18px;margin:4px 0;color:#fff;letter-spacing:1px">SNAKE</div>
<div id="mSub" style="font-size:12px;opacity:0.8;margin-bottom:12px;color:#b8d8c8">Tap START to play</div>
<div id="mScore" style="font-size:13px;margin-bottom:10px;color:#fff;display:none"></div>
<button id="mBtn" onclick="startGame()" style="background:#2dd4d0;color:#002a26;border:none;border-radius:10px;padding:8px 18px;font-weight:800;width:100%">▶ START</button>
</div>
</div>
</div>

<div class="grid grid3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px">
<button onclick="startGame()" style="background:#1a8a3d;border:1px solid #2ab356;color:#fff;border-radius:10px;padding:10px 0;font-weight:700">▶ START</button>
<button onclick="togglePause()" style="background:#d89a0a;border:1px solid #f5b82a;color:#fff;border-radius:10px;padding:10px 0;font-weight:700">⏸ PAUSE</button>
<button onclick="resetGame()" style="background:#c82a2a;border:1px solid #ff4a4a;color:#fff;border-radius:10px;padding:10px 0;font-weight:700">🔄 RESET</button>
</div>

<div class="dpad" style="display:grid;grid-template-columns:1fr 60px 1fr;grid-template-rows:56px 56px 56px;gap:8px;margin:12px 18px 0;place-items:center">
<div></div><button onclick="setDir(0,-1)" style="width:100%;height:100%;background:#0f2e1d;border:1px solid #1a4a2e;border-radius:12px;color:#d6e8d6;font-size:18px">▲</button><div></div>
<button onclick="setDir(-1,0)" style="width:100%;height:100%;background:#0f2e1d;border:1px solid #1a4a2e;border-radius:12px;color:#d6e8d6;font-size:18px">◀</button><div></div><button onclick="setDir(1,0)" style="width:100%;height:100%;background:#0f2e1d;border:1px solid #1a4a2e;border-radius:12px;color:#d6e8d6;font-size:18px">▶</button>
<div></div><button onclick="setDir(0,1)" style="width:100%;height:100%;background:#0f2e1d;border:1px solid #1a4a2e;border-radius:12px;color:#d6e8d6;font-size:18px">▼</button><div></div>
</div>
</div>

<script>
let W=18,H=22, snake=[], dir={x:1,y:0}, ndir={x:1,y:0}, food={x:10,y:10}, apples=0, score=0, speed=1, tickMs=130, loop=null, paused=false, over=false, started=false;
const board=document.getElementById('board');
const overlay=document.getElementById('overlay');
const mIcon=document.getElementById('mIcon');
const mTitle=document.getElementById('mTitle');
const mSub=document.getElementById('mSub');
const mScore=document.getElementById('mScore');
const mBtn=document.getElementById('mBtn');

function initBoard(){
 board.innerHTML='';
 for(let i=0;i<W*H;i++){
   let c=document.createElement('div');
   c.style.width='100%';c.style.height='100%';c.style.display='flex';c.style.alignItems='center';c.style.justifyContent='center';
   board.appendChild(c);
 }
}
function resetState(){
 snake=[{x:3,y:11},{x:4,y:11},{x:5,y:11},{x:6,y:11},{x:7,y:11}];
 dir={x:1,y:0};ndir={x:1,y:0};apples=0;score=0;speed=1;tickMs=130;paused=false;over=false;started=false;
 placeFood(); updateStats();
}
function placeFood(){
 let p;
 do{ p={x:Math.floor(Math.random()*W), y:Math.floor(Math.random()*H)} }while(snake.some(s=>s.x===p.x&&s.y===p.y));
 food=p;
}
function updateStats(){
 document.getElementById('apples').textContent=apples;
 document.getElementById('score').textContent=score;
 document.getElementById('speed').textContent=speed;
}
function draw(){
 const cells=board.children;
 for(let i=0;i<cells.length;i++) cells[i].innerHTML='';
 // food
 let fi=food.y*W+food.x;
 if(cells[fi]) cells[fi].innerHTML='<div style="width:9px;height:9px;background:#ff3b3b;border-radius:50%;box-shadow:0 0 6px #ff3b3b"></div>';
 // snake
 snake.forEach((s,idx)=>{
   let ci=s.y*W+s.x;
   if(cells[ci]){
     let isHead=idx===snake.length-1;
     cells[ci].innerHTML='<div style="width:'+(isHead?'12px':'10px')+';height:'+(isHead?'12px':'10px')+';background:'+(isHead?'#aef4e6':'#4dc4b0')+';border-radius:50%;opacity:'+(isHead?'1':'0.9')+';box-shadow:'+(isHead?'0 0 8px #7ff0d0':'none')+'"></div>';
   }
 });
}
function showStart(){
 mIcon.textContent='🐍'; mTitle.textContent='SNAKE'; mSub.textContent='Tap START to play'; mSub.style.display='block'; mScore.style.display='none'; mBtn.textContent='▶ START'; mBtn.style.display='block'; overlay.style.display='flex';
}
function showPause(){
 mIcon.textContent='⏸️'; mTitle.textContent='PAUSED'; mSub.textContent=''; mSub.style.display='none'; mScore.textContent='Score: '+score; mScore.style.display='block'; mBtn.textContent='▶ RESUME'; mBtn.style.display='block'; overlay.style.display='flex';
}
function showOver(){
 mIcon.textContent='💀'; mTitle.textContent='GAME OVER'; mSub.textContent=''; mSub.style.display='none'; mScore.textContent='Score: '+score; mScore.style.display='block'; mBtn.textContent='🔄 RETRY'; mBtn.style.display='block'; overlay.style.display='flex';
}
function setDir(x,y){
 if(dir.x===-x && dir.y===-y) return;
 ndir={x,y};
 if(!started){ startGame(); }
}
function step(){
 if(paused||over) return;
 dir=ndir;
 let head={x:snake[snake.length-1].x+dir.x, y:snake[snake.length-1].y+dir.y};
 // wall collision = game over (no wrap) like vid
 if(head.x<0||head.x>=W||head.y<0||head.y>=H){ gameOver(); return; }
 // self collision
 if(snake.some(s=>s.x===head.x&&s.y===head.y)){ gameOver(); return; }
 snake.push(head);
 if(head.x===food.x&&head.y===food.y){
   apples++; score++; if(score%3===0){ speed++; tickMs=Math.max(55,tickMs-10); restartLoop(); }
   placeFood();
 }else{
   snake.shift();
 }
 updateStats(); draw();
}
function restartLoop(){
 if(loop) clearInterval(loop);
 loop=setInterval(step,tickMs);
}
function startGame(){
 if(!started||over){ resetState(); started=true; over=false; paused=false; overlay.style.display='none'; draw(); restartLoop(); }
 else if(paused){ paused=false; overlay.style.display='none'; restartLoop(); }
}
function togglePause(){
 if(!started||over) return;
 if(!paused){ paused=true; clearInterval(loop); showPause(); }
 else{ paused=false; overlay.style.display='none'; restartLoop(); }
}
function gameOver(){
 over=true; started=false; clearInterval(loop); showOver();
}
function resetGame(){
 clearInterval(loop); resetState(); draw(); showStart();
}
initBoard(); resetState(); draw(); showStart();
// keyboard
document.addEventListener('keydown',e=>{
 if(e.key==='ArrowUp') setDir(0,-1);
 if(e.key==='ArrowDown') setDir(0,1);
 if(e.key==='ArrowLeft') setDir(-1,0);
 if(e.key==='ArrowRight') setDir(1,0);
 if(e.key===' ') { e.preventDefault(); if(!started||over) startGame(); else togglePause(); }
});
</script>` + END;

GAMES.wheel = BASE + `<div class="game"><div class="title">🎡 PRIZE WHEEL</div><div id="wheel" class="big">🎡</div><div id="result" class="result">Spin for a virtual prize!</div><div class="stats"><span>💰 Credits <b id="c">500</b></span><span>🎁 Prize <b id="p">0</b></span></div><button class="gold" style="width:100%" onclick="spin()">🎡 SPIN</button></div><script>let c=500,pr=[0,5,10,20,50,100,250];function spin(){let x=pr[Math.floor(Math.random()*pr.length)];c+=x;p.textContent=x;c.textContent=c;wheel.textContent='🎉';result.className='result '+(x?'win':'lose');result.textContent=x?'🎁 You won '+x+' credits!':'💀 Empty prize';document.getElementById('c').textContent=c}</script>` + END;

function makePayload(html) {
  return JSON.stringify({
    __typename: 'GenAIUnifiedResponse',
    response_id: crypto.randomUUID(),
    sections: [{
      __typename: 'GenAIUnifiedResponseSection',
      view_model: {
        __typename: 'GenAISingleLayoutViewModel',
        primitive: {
          __typename: 'FOAHtmlPrimitiveDemoDONOTUSE',
          trusted_sources: [],
          payload: html
        }
      }
    }]
  });
}

async function executeRichGame(sock, msg, jid, name) {
  const key = String(name || '').toLowerCase();
  const html = GAMES[key];
  if (!html) throw new Error('Unknown rich game: ' + key);
  try {
    const payload = makePayload(html);
    const gameMessage = {
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            unifiedResponse: { data: Buffer.from(payload).toString('base64') },
            contextInfo: { isForwarded: true, forwardOrigin: 4 }
          }
        }
      }
    };
    const message = generateWAMessageFromContent(jid, gameMessage, {});
    await sock.relayMessage(jid, message.message, { messageId: message.key.id });
  } catch (err) {
    console.error('[richgames:'+key+'] Error:', err);
    await sock.sendMessage(jid, { text: '❌ Failed to load ' + key.toUpperCase() }, { quoted: msg });
  }
}

module.exports = { executeRichGame, GAMES };
