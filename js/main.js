var muted=false,ctx=null;
var C={
 gru:{base:420,pitch:.8,rate:1.05,act:'act-gru',fx:['💢','💨'],lines:['흥, 따라오든가.','별로 걱정돼서 온 거 아니거든?','고마워, 라고 한 번만 말할 거야.']},
 lulu:{base:780,pitch:1.9,rate:1.12,act:'act-lulu',fx:['✨','💖','🎀'],lines:['어머, 나 지금 너무 예쁘지 않아?','공주님이 나가신다! 길을 비켜라냥!','내 리본 건드리면 가만 안 둬!']},
 momo:{base:560,pitch:1.35,rate:1,act:'act-momo',fx:['⭐','🛡️'],lines:['걱정 마, 내가 지켜줄게!','친구는 내가 꼭 지킨다냥!','다 함께라면 할 수 있어!']},
 eagle:{base:0,pitch:.1,rate:.75,act:'act-eagle',fx:['⚡','💀'],lines:['크하하하! 이 왕국은 이제 내 것이다!','하찮은 고양이들 따위가 감히!']}
};
function ac(){try{if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();}catch(e){}return ctx}
function tone(type,f0,f1,f2,len,vol,fa,fb){var c=ac();if(!c||muted)return;var t=c.currentTime,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();
 o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f1,t+len*.35);o.frequency.linearRampToValueAtTime(f2,t+len);
 f.type='bandpass';f.Q.value=4;f.frequency.setValueAtTime(fa,t);f.frequency.linearRampToValueAtTime(fb,t+len*.4);f.frequency.linearRampToValueAtTime(fa,t+len);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.06);g.gain.linearRampToValueAtTime(0,t+len);
 o.connect(f);f.connect(g);g.connect(c.destination);o.start(t);o.stop(t+len+.05)}
function meow(b){tone('sawtooth',b*.8,b*1.25,b*.7,.55,.3,900,2200)}
function screech(){tone('sawtooth',2400,1500,700,.9,.22,1400,3000)}
function speak(text,pitch,rate){if(muted||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';
 var v=speechSynthesis.getVoices().filter(function(x){return x.lang&&x.lang.toLowerCase().indexOf('ko')===0})[0];if(v)u.voice=v;u.pitch=pitch;u.rate=rate;u.onstart=function(){duck(true)};u.onend=u.onerror=function(){duck(false)};speechSynthesis.speak(u)}catch(e){}}
function fx(el,list,n){var r=el.getBoundingClientRect();for(var i=0;i<n;i++){var s=document.createElement('span');s.className='fx';s.textContent=list[i%list.length];
 s.style.left=(r.left+r.width*(.2+Math.random()*.6))+'px';s.style.top=(r.top+r.height*(.3+Math.random()*.5))+'px';s.style.setProperty('--dx',(Math.random()*80-40)+'px');
 document.body.appendChild(s);setTimeout(function(x){x.remove()}.bind(null,s),1000)}}
function play(id,root){var d=C[id],line=d.lines[Math.floor(Math.random()*d.lines.length)];
 var art=root.querySelector('img')||root.querySelector('svg');
 if(art){art.classList.remove(d.act);void art.offsetWidth;art.classList.add(d.act);setTimeout(function(){art.classList.remove(d.act)},950)}
 fx(root,d.fx,4);if(id==='eagle')screech();else meow(d.base);
 var s=root.querySelector('.say');if(s){document.querySelectorAll('.say').forEach(function(x){x.classList.remove('on')});s.textContent=line;s.classList.add('on');clearTimeout(root._t);root._t=setTimeout(function(){s.classList.remove('on')},2400)}
 setTimeout(function(){speak(line,d.pitch,d.rate)},id==='eagle'?700:450)}
document.querySelectorAll('[data-c]').forEach(function(el){
 el.addEventListener('click',function(){play(el.dataset.c,el)});
 el.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&el.getAttribute('role')==='button'){e.preventDefault();play(el.dataset.c,el)}});
});
var trio=document.getElementById('trio'),timers=[];
function enter(sound){timers.forEach(clearTimeout);timers=[];trio.classList.remove('enter');void trio.offsetWidth;trio.classList.add('enter');
 [['.r',1200,'momo'],['.l',2000,'gru'],['.mid',3000,'lulu']].forEach(function(a){timers.push(setTimeout(function(){var el=trio.querySelector(a[0]);fx(el,a[2]==='lulu'?['✨','💖']:['💨','💨'],3);if(sound&&ctx)meow(C[a[2]].base)},a[1]))})}
enter(false);
document.getElementById('replay').addEventListener('click',function(){ac();enter(true)});
var m=document.getElementById('mute');
m.addEventListener('click',function(){muted=!muted;m.textContent=muted?'🔇':'🔊';if(muted&&'speechSynthesis' in window)speechSynthesis.cancel();else ac()});
if('speechSynthesis' in window)speechSynthesis.getVoices();

(function(){var arena=document.getElementById('arena');if(!arena)return;
var L=[['eagle','독수리 대왕','여기까지 오다니, 겁도 없구나. 이 왕국은 이제 내 것이다.'],['gru','그루','흥, 말이 많으면 약해 보인대. 그쯤 해 둬.'],['lulu','루루','내 왕국에서 이 무슨 무례야! 각오는 됐겠지?'],['momo','모모','얘들아, 내 뒤로! 이번엔 절대 물러서지 않아.'],['eagle','독수리 대왕','하찮은 고양이 셋이 대체 무얼 할 수 있다고!'],['momo','세 고양이','우리 셋이라면 충분해!']];
var col={eagle:'#c9a6ff',gru:'#d4cdd8',lulu:'#ffb3cd',momo:'#ffd36b'},box=document.querySelector('.dlg'),nm=box.querySelector('b'),tx=box.querySelector('span'),tm=[],started=false;
function start(){tm.forEach(clearTimeout);tm=[];if('speechSynthesis' in window)speechSynthesis.cancel();arena.classList.remove('fin');void arena.offsetWidth;arena.classList.add('go');nm.textContent='대치';nm.style.color='#ffd36b';tx.textContent='...';
 L.forEach(function(l,i){tm.push(setTimeout(function(){nm.textContent=l[1];nm.style.color=col[l[0]];tx.textContent=l[2];
  var a=arena.querySelector('[data-a="'+l[0]+'"]'),k=l[0]==='eagle'?'act-eagle':'talk';a.classList.remove(k);void a.getBoundingClientRect();a.classList.add(k);setTimeout(function(){a.classList.remove(k)},900);
  if(l[0]==='eagle'&&i===0&&ctx)screech();var d=C[l[0]];speak(l[2],d.pitch,d.rate)},900+i*4300))});
 tm.push(setTimeout(function(){arena.classList.add('fin');nm.textContent='결전 개시';nm.style.color='#ff6b6b';tx.textContent='이제 물러설 곳은 없다. 왕국의 운명을 건 싸움이 시작된다!'},900+L.length*4300))}
if('IntersectionObserver' in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting&&!started){started=true;start()}},{threshold:.6}).observe(arena)}
document.getElementById('duelPlay').addEventListener('click',function(){ac();started=true;start()});
})();

var bgm=document.getElementById('bgm'),musicBtn=document.getElementById('music'),musicOn=true,ducked=false;
function vol(){bgm.volume=ducked?.12:.45}
function duck(on){ducked=on;if(bgm)vol()}
function setMusic(){musicBtn.classList.toggle('off',!musicOn);musicBtn.setAttribute('aria-pressed',String(musicOn));if(musicOn){vol();var p=bgm.play();if(p&&p.catch)p.catch(function(){})}else bgm.pause()}
function firstTap(){if(musicOn)setMusic();['pointerdown','keydown','touchstart'].forEach(function(ev){document.removeEventListener(ev,firstTap)})}
['pointerdown','keydown','touchstart'].forEach(function(ev){document.addEventListener(ev,firstTap)});
musicBtn.addEventListener('click',function(e){e.stopPropagation();musicOn=!musicOn;setMusic()});
vol();var ap=bgm.play();if(ap&&ap.catch)ap.catch(function(){});
