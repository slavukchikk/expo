function updateFlexibleSplit(data){
 const names={'split-wed':'Грудь и руки','split-fri':'Спина и плечи','split-sun':'Ноги'};
 const abs=new Set(['cable-crunch','hanging-knee','reverse-crunch']);
 const program=data.program;
 if(!program?.days)return data;
 const days=program.days.map(day=>{
  const legacy=/^(Среда|Пятница|Воскресенье)\s*[·—–-]\s*/i.test(day.name);
  const name=legacy?day.name.replace(/^(Среда|Пятница|Воскресенье)\s*[·—–-]\s*/i,'').replace(/^Ноги и пресс$/i,'Ноги'):names[day.id];
  return name?{...day,name,exercises:day.exercises.filter(e=>!abs.has(e.exerciseId))}:day;
 });
 if(JSON.stringify(days)===JSON.stringify(program.days))return data;
 return {...data,program:{...program,days,exercises:days[0].exercises,version:program.version+1}};
}
