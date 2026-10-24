// Browser overlay: the deadline remains in the existing workout backup format.
function makeRestTimer(React,createPortal) {
 const h=React.createElement;
 return function RestTimer({active,onSkip}) {
  const audio=React.useRef(null), notified=React.useRef(null);
  const [sound,setSound]=React.useState(false);
  const [hidden,setHidden]=React.useState(null);
  const skip=React.useRef(onSkip);skip.current=onSkip;
  const deadline=active?.restUntil;
  const seconds=deadline?Math.max(0,Math.ceil((deadline-Date.now())/1000)):active?.restRemaining||0;
  React.useEffect(()=>{
   function unlock(){
    try {
     const Audio=window.AudioContext||window.webkitAudioContext;
     if(!Audio)return;
     const ctx=audio.current||(audio.current=new Audio());
     ctx.resume().then(()=>setSound(ctx.state==='running')).catch(()=>{});
    } catch {}
   }
   document.addEventListener('pointerdown',unlock);
   document.addEventListener('keydown',unlock);
   return()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);audio.current?.close().catch(()=>{});};
  },[]);
  React.useEffect(()=>{
   if(!deadline)return;
   if(deadline<=Date.now()){setHidden(deadline);return;}
   let dismiss;
   const voices=[];
   const id=setTimeout(()=>{
    if(notified.current===deadline)return;
    notified.current=deadline;
    dismiss=setTimeout(()=>{setHidden(deadline);skip.current();},3000);
    const ctx=audio.current;
    if(!ctx||ctx.state!=='running')return;
    // A gentle three-second rising chime, with a soft fade between notes.
    [523.25,659.25,783.99].forEach((frequency,index)=>{
     const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+index*0.8;
     oscillator.type='sine';oscillator.frequency.value=frequency;
     gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(0.09,start+0.06);gain.gain.exponentialRampToValueAtTime(0.001,start+1.35);
     oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(start);oscillator.stop(start+1.4);voices.push(oscillator);
    });
   },Math.max(0,deadline-Date.now()));
   return()=>{clearTimeout(id);clearTimeout(dismiss);voices.forEach(v=>{try{v.stop();}catch{}});};
  },[deadline]);
  if(!active||(!deadline&&!seconds)||(deadline&&hidden===deadline))return null;
  const time=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
  // Portal escapes the scrolling screen's transformed/overflow containers.
  return createPortal(h('div',{title:sound?'Звуковой сигнал включён':'Коснись экрана, чтобы включить звук',style:{position:'fixed',top:'max(16px, env(safe-area-inset-top))',right:'max(16px, env(safe-area-inset-right))',width:132,boxSizing:'border-box',zIndex:10000,background:'linear-gradient(145deg,rgba(37,48,33,.96),rgba(16,22,16,.96))',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(197,243,107,.22)',borderRadius:24,padding:'16px 12px 8px',boxShadow:'0 12px 36px #0005, inset 0 1px 0 #ffffff0d',fontFamily:'system-ui, sans-serif',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',gap:6}},
   h('div',{style:{fontSize:10,fontWeight:600,letterSpacing:2,color:'#c5f36b'}},seconds?(deadline?'● ОТДЫХ':'ПАУЗА'):'✓ ГОТОВО'),
   h('div',{role:'timer','aria-label':'Осталось времени отдыха',style:{fontSize:34,fontWeight:500,letterSpacing:-1.5,fontVariantNumeric:'tabular-nums',lineHeight:1.2}},time),
   h('button',{onClick:onSkip,'aria-label':seconds?'Пропустить отдых':'Закрыть таймер',style:{background:'transparent',color:'#aab5a5',border:0,borderRadius:12,minHeight:36,padding:'6px 12px',fontSize:11,cursor:'pointer'}},seconds?'Пропустить →':'Закрыть')),document.body);
 };
}
