const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const original=read('original-bundle.js');let bundle=original;
fs.mkdirSync('updated-modules',{recursive:true});
function replace(id,change){const old=read(`original-modules/${id}.js`).trimEnd();if(!bundle.includes(old))throw Error('Missing module '+id);const next=typeof change==='function'?change(old):change;new vm.Script(next);bundle=bundle.replace(old,next);fs.writeFileSync(`updated-modules/${id}.js`,next+'\n');}
function once(s,from,to){if(s.split(from).length!==2)throw Error('Expected one match: '+from.slice(0,90));return s.replace(from,to);}
function append(s,id,code){return once(s,`},${id},`,`;${code}\n},${id},`);}
const exercises=JSON.parse(read('src/exercises.json')),program=JSON.parse(read('src/program.json'));
replace(2698,`__d(function(g,r,i,a,m,e,d){"use strict";Object.defineProperty(e,'__esModule',{value:true});e.exercises=${JSON.stringify(exercises)};e.getExercise=id=>e.exercises.find(x=>x.id===id);},2698,[]);`);
replace(2703,`__d(function(g,r,i,a,m,e,d){"use strict";Object.defineProperty(e,'__esModule',{value:true});Object.assign(e,${JSON.stringify(program)});},2703,[]);`);
replace(2701,s=>{
 s=once(s,'return C?',`(0,o.useEffect)(()=>{if(w?.days?.some(day=>/^(Среда|Пятница|Воскресенье)\\s*[·—–-]/i.test(day.name)))y(updateFlexibleSplit).catch(error=>B(error.message));},[w,y]);return C?`);
 const chips='(0,j.jsx)(i.default,{style:{color:p.colors.text,fontSize:24,fontWeight:"700"},children:v.name})';
 s=once(s,chips,chips+`,(0,j.jsx)(u.Button,{title:e.active?"Продолжить тренировку":"Начать: "+v.name,disabled:f,onPress:async()=>{try{await y(data=>data.active?data:{...data,program:{...data.program,nextDayId:v.id},active:r(2695).startWorkout({...data.program,nextDayId:v.id},data.profile.unit)});d.router.push("/workout");}catch(error){B(error.message);}}})`);
 return append(s,2701,read('src/flexible-split.js'));
});
replace(2695,s=>append(s,2695,read('src/install-targets.js')+';installTargets(_e);'));
replace(2700,s=>append(s,2700,`const _save=_e.saveProgram;_e.saveProgram=function(current,name,days,version,id){for(const day of days)for(const item of day.exercises)e.validateTargets(item);return _save(current,name,days,version,id);};`));
replace(2704,s=>append(s,2704,`const _apply=_e.applyProgramProposal;_e.applyProgramProposal=function(data,name,days,expected){const converted=days.map(day=>({...day,exercises:o.convertTargetItems(day.exercises,'kg',data.profile.unit)}));return _apply(data,name,converted,expected);};`));
replace(2713,s=>{
 s=once(s,'||3===s.formatVersion,','||3===s.formatVersion||4===s.formatVersion,');
 s=once(s,'formatVersion:3,','formatVersion:4,');
 s=once(s,'"weightKg","repsMax","rest","note"]','"weightKg","repsMax","rest","note","targets"]');
 s=once(s,'return l(n.id),b(n.exerciseId),p(n.sets','return e.validateTargets(n),l(n.id),b(n.exerciseId),p(n.sets');
 s=once(s,'["id","weight","reps","completed","kind"]','["id","weight","reps","completed","kind","targetWeight","targetReps"]');
 s=once(s,'return l(n.id),c(n.weight,64),','return void 0!==n.targetWeight&&(c(n.targetWeight,64),o(n.targetWeight===""||null!==e.parseNumber(n.targetWeight)),p(n.targetReps,1,1e5,!0)),void 0!==n.targetReps&&o(void 0!==n.targetWeight),l(n.id),c(n.weight,64),');
 return s;
});
replace(2717,s=>{
 s=once(s,'function E(e,s){k(t=>t.map(t=>t.id===e?{...t,...s}:t))}',`function E(e,s){k(items=>items.map(item=>{if(item.id!==e)return item;const next={...item,...s};if('weight' in s||'reps' in s)delete next.targets;else if('sets' in s&&item.targets)next.targets=Array.from({length:s.sets},(_,i)=>item.targets[i]??{weight:item.weight,reps:item.reps});return next;}))}`);
 const field='value:e.weight,onChangeText:s=>E(e.id,{weight:s,weightKg:void 0})}),';
 s=once(s,field,field+`e.targets&&(0,j.jsxs)(n.default,{style:{gap:12},children:[(0,j.jsx)(d.Body,{children:"Цели отдельных подходов. Общий вес или повторения выше заменят эти цели. Фактические результаты вводятся на тренировке."}),...e.targets.map((target,index)=>(0,j.jsxs)(n.default,{style:{gap:8},children:[(0,j.jsx)(d.Field,{label:"Цель подхода "+(index+1)+": вес",keyboardType:"decimal-pad",value:target.weight,onChangeText:value=>E(e.id,{targets:e.targets.map((t,i)=>i===index?{...t,weight:value,weightKg:undefined}:t)})}),(0,j.jsx)(d.Field,{label:"Цель подхода "+(index+1)+": повторения",keyboardType:"number-pad",value:target.reps?String(target.reps):"",onChangeText:value=>{if(/^\\d*$/.test(value))E(e.id,{targets:e.targets.map((t,i)=>i===index?{...t,reps:Number(value)}:t)})}})]},index))]}),`);
 return s;
});
replace(2719,s=>{
 s=once(s,'borderColor:y.colors.line},children:[(0,j.jsxs)(i.default,{style:h.s.row,','borderColor:y.colors.line},children:[s.targetWeight!==undefined&&(0,j.jsx)(h.Body,{children:"План подхода: "+(s.targetWeight||"вес подобрать")+" "+(R.unit==="kg"?"кг":"lb")+" × "+s.targetReps+" · не результат"}),(0,j.jsxs)(i.default,{style:h.s.row,');
 s=once(s,'back:!0,children:[(0,j.jsxs)(i.default', 'back:!0,children:[(0,j.jsx)(RestTimer,{active:R,onSkip:()=>I(e=>({...e,restUntil:null,restRemaining:null}))}),(0,j.jsxs)(i.default');
 // Remove the old inline rest card; the floating timer is the sole display.
 const restStart=s.indexOf('D>0&&(0,j.jsxs)(h.Card'),restEnd=s.indexOf('R.exercises.map((t,s)=>',restStart);
 if(restStart<0||restEnd<0)throw Error('Rest card boundaries not found');
 s=once(s,s.slice(restStart,restEnd),'');
 const stepsStart=s.indexOf('(0,j.jsxs)(i.default,{style:{flexDirection:"row",gap:8},children:[(0,j.jsx)(h.Chip'),stepsEnd=s.indexOf(']},s.id))',stepsStart);
 if(stepsStart<0||stepsEnd<0)throw Error('Weight step buttons not found');
 s=once(s,s.slice(stepsStart,stepsEnd),'');
 return append(s,2719,read('src/rest-timer.js')+';const RestTimer=makeRestTimer(s,r(132).createPortal);');
});
replace(2702,s=>{
 let count=0;s=s.replace(/"(?:\\.|[^"\\])*"/g,token=>{let value;try{value=vm.runInNewContext(token);}catch{return token;}
 if(typeof value==='string'&&value.startsWith('Три занятия: два для верха тела')){count++;return JSON.stringify('Грудь и руки, спина и плечи, ноги — без привязки к дням недели. Пресс исключён. Выбирай нужную тренировку в программе и запускай её сразу. Веса ног сохранены в целях подходов.');}return token;});if(count!==1)throw Error('Overview not found');
 s=once(s,'e.rest," \\u0441"]','e.rest," \\u0441",e.targets?"\\n"+e.targets.map((t,i)=>(i+1)+": "+t.weight+" кг × "+t.reps).join("; "):"",e.note?"\\n"+e.note:""]');
 return s;
});
replace(10,s=>{
 s=once(s,'name:"exercises",options:{','name:"exercises",options:{href:null,');
 return s.replaceAll('o/5-2','o/4-2');
});
replace(2697,`__d(function(g,r,i,a,m,e,d){Object.defineProperty(e,'__esModule',{value:true});e.default=function(){return r(d[0]).createElement(r(d[1]).Redirect,{href:'/program'});};},2697,[15,17]);`);
replace(2692,`__d(function(g,r,i,a,m,e,d){Object.defineProperty(e,'__esModule',{value:true});${read('src/coach-context.js')}
${read('src/coach-screen.js')}
const text=r(d[1]),view=r(d[2]);e.default=makeCoachScreen(r(d[0]),text.default||text,view.default||view,r(d[3]),r(d[4]),r(d[5]).exercises,r(d[6]).colors);},2692,[15,204,84,2693,2694,2698,2691]);`);
const hash=crypto.createHash('sha256').update(bundle).digest('hex').slice(0,32);const dir='dist/_expo/static/js/web';for(const f of fs.readdirSync(dir))if(f.endsWith('.js'))fs.unlinkSync(path.join(dir,f));
const file='entry-'+hash+'.js';fs.writeFileSync(path.join(dir,file),bundle);
let html=read('dist/index.html').replace(/entry-[a-f0-9]+\.js/g,file);fs.writeFileSync('dist/index.html',html);fs.writeFileSync('dist/_redirects','/* /index.html 200\n');
console.log(file);
