const ADMIN_PASS='admin1932';
const SERIES=['SERIE PEQUES','SERIE SEGUNDA INFANTIL','SERIE PRIMERA INFANTIL','SERIE JUVENILES','SERIE ORO','SERIE SUPER SENIOR','SERIE SENIOR','SERIE SEGUNDA ADULTOS','SERIE PRIMERA ADULTOS','SERIE PLATINOS','SERIE HONOR'];

function emptyStandings(){
  const obj={};
  SERIES.forEach(s=>obj[s]=[
    {team:'Ricardo Méndez',pj:0,pg:0,pe:0,pp:0,dg:'0',pts:0},
    {team:'Equipo Rival 1',pj:0,pg:0,pe:0,pp:0,dg:'0',pts:0},
    {team:'Equipo Rival 2',pj:0,pg:0,pe:0,pp:0,dg:'0',pts:0}
  ]);
  obj['SERIE HONOR']=[
    {team:'Ricardo Méndez',pj:10,pg:7,pe:2,pp:1,dg:'+15',pts:23},
    {team:'Atlético Juventud',pj:10,pg:6,pe:2,pp:2,dg:'+9',pts:20},
    {team:'Deportivo Unión',pj:10,pg:5,pe:3,pp:2,dg:'+6',pts:18}
  ];
  return obj;
}

const defaults={
history:'El Club Deportivo Ricardo Méndez nace como una institución deportiva y social formada por vecinos, jugadores y familias que buscaban crear un espacio de unión, competencia y orgullo local. Desde sus inicios, el club ha representado pasión, esfuerzo y compromiso en cada serie, manteniendo viva su identidad a través del fútbol, el básquetbol, el ping pong y el trabajo comunitario.',
president:'Información pendiente de confirmar',
news:[
{title:'Inicio de temporada',text:'El club prepara sus series para una nueva competencia.',date:'Publicado por administración'},
{title:'Entrenamientos oficiales',text:'Las categorías trabajan con disciplina y compromiso.',date:'Publicado por administración'},
{title:'Campaña de socios',text:'Súmate a la familia del Club Deportivo Ricardo Méndez.',date:'Publicado por administración'}
],
media:[
{title:'Partidos',type:'Foto',url:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80'},
{title:'Hinchada',type:'Foto',url:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80'},
{title:'Entrenamientos',type:'Foto',url:'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80'},
{title:'Celebraciones',type:'Foto',url:'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80'}
],
fixture:[
{date:'25/05/2026',serie:'SERIE HONOR',game:'Ricardo Méndez vs Atlético Juventud',place:'Local',hour:'15:00'},
{date:'01/06/2026',serie:'SERIE SENIOR',game:'Deportivo Unión vs Ricardo Méndez',place:'Visita',hour:'17:00'},
{date:'08/06/2026',serie:'SERIE JUVENILES',game:'Ricardo Méndez vs Club San José',place:'Local',hour:'12:00'}
],
standings:emptyStandings(),
sponsors:[
{name:'Auspiciador 1',desc:'Apoyo oficial del club',logo:''},
{name:'Auspiciador 2',desc:'Colaborador deportivo',logo:''},
{name:'Auspiciador 3',desc:'Empresa local',logo:''},
{name:'Auspiciador 4',desc:'Comercio asociado',logo:''}
],
requests:[]
};

function getData(){
  const saved=localStorage.getItem('clubRMNikeV3');
  if(!saved){localStorage.setItem('clubRMNikeV3',JSON.stringify(defaults));return structuredClone(defaults)}
  const data=JSON.parse(saved);
  if(!data.standings)data.standings=emptyStandings();
  if(!data.sponsors)data.sponsors=defaults.sponsors;
  if(!data.history)data.history=defaults.history;
  if(!data.president)data.president=defaults.president;
  return data;
}
function saveData(d){localStorage.setItem('clubRMNikeV3',JSON.stringify(d))}
function render(){
  const d=getData();
  clubHistory.textContent=d.history;
  clubPresident.textContent=d.president;
  newsGrid.innerHTML=d.news.map(n=>`<article><div class="thumb"></div><h3>${n.title}</h3><p>${n.text}</p><small>${n.date}</small></article>`).join('');
  galleryGrid.innerHTML=d.media.map(m=>`<article><img src="${m.url}" onerror="this.src='https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80'"><div><h3>${m.title}</h3><p>${m.type}</p></div></article>`).join('');
  fixtureRows.innerHTML=d.fixture.map(f=>`<tr><td>${f.date}</td><td>${f.serie}</td><td>${f.game}</td><td>${f.place}</td><td>${f.hour}</td></tr>`).join('');
  sponsorGrid.innerHTML=d.sponsors.map(s=>`<article>${s.logo?`<img src="${s.logo}">`:`<div style="font-size:42px;color:#d7aa31;margin-bottom:10px">◆</div>`}<h3>${s.name}</h3><p>${s.desc}</p></article>`).join('');
  renderStandings();
  renderRequests();
}
function renderStandings(){
  const d=getData();
  const serie=standingSerieSelect.value;
  const rows=[...(d.standings[serie]||[])].sort((a,b)=>Number(b.pts)-Number(a.pts));
  standingRows.innerHTML=rows.map((r,i)=>`<tr class="${i===0?'leader':''}"><td>${i+1}</td><td>${r.team}</td><td>${r.pj}</td><td>${r.pg}</td><td>${r.pe}</td><td>${r.pp}</td><td>${r.dg}</td><td>${r.pts}</td></tr>`).join('');
}
standingSerieSelect.onchange=renderStandings;
document.querySelectorAll('.seriePill').forEach(btn=>btn.onclick=()=>{standingSerieSelect.value=btn.dataset.serie;document.querySelector('#posiciones').scrollIntoView({behavior:'smooth'});renderStandings();});
addDemoTeam.onclick=()=>{alert('Puedes cargar puntajes reales desde Administrador > Posiciones.');openAdmin.click();};

memberRequestForm.onsubmit=e=>{e.preventDefault();const d=getData();d.requests.push({name:memberName.value,rut:memberRut.value,phone:memberPhone.value,type:memberType.value});saveData(d);e.target.reset();alert('Solicitud enviada. Queda pendiente de aprobación.');renderRequests();}

function renderRequests(){
  if(!requestList)return;
  const d=getData();
  requestList.innerHTML=d.requests.length?d.requests.map((r,i)=>`<div class="request"><p><b>Nombre:</b> ${r.name}</p><p><b>RUT:</b> ${r.rut}</p><p><b>Teléfono:</b> ${r.phone}</p><p><b>Tipo:</b> ${r.type}</p><div class="actions"><button onclick="approveRequest(${i})">Aprobar</button><button class="danger" onclick="rejectRequest(${i})">Rechazar</button></div></div>`).join(''):'<p>No hay solicitudes pendientes.</p>';
}
window.approveRequest=i=>{const d=getData();d.requests.splice(i,1);saveData(d);alert('Solicitud aprobada.');render();}
window.rejectRequest=i=>{const d=getData();d.requests.splice(i,1);saveData(d);render();}

function openModal(){adminModal.classList.add('show');}
openAdmin.onclick=openModal;openAdminTop.onclick=openModal;
closeAdmin.onclick=()=>adminModal.classList.remove('show');
loginBtn.onclick=()=>{if(adminPassword.value!==ADMIN_PASS)return alert('Clave incorrecta');loginPanel.classList.add('hidden');adminPanel.classList.remove('hidden');const d=getData();historyInput.value=d.history;presidentInput.value=d.president;}

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tabContent').forEach(x=>x.classList.add('hidden'));b.classList.add('active');document.getElementById(b.dataset.tab).classList.remove('hidden');renderRequests();});

saveHistory.onclick=()=>{const d=getData();d.history=historyInput.value;d.president=presidentInput.value;saveData(d);render();alert('Historia actualizada.');}
addNews.onclick=()=>{if(!newsTitle.value||!newsText.value)return alert('Completa los datos.');const d=getData();d.news.unshift({title:newsTitle.value,text:newsText.value,date:new Date().toLocaleDateString('es-CL')});saveData(d);newsTitle.value='';newsText.value='';render();}
addMedia.onclick=()=>{if(!mediaTitle.value||!mediaUrl.value)return alert('Completa los datos.');const d=getData();d.media.unshift({title:mediaTitle.value,type:mediaType.value,url:mediaUrl.value});saveData(d);mediaTitle.value='';mediaUrl.value='';render();}
addFixture.onclick=()=>{if(!fxDate.value||!fxSerie.value||!fxGame.value)return alert('Completa fecha, serie y partido.');const d=getData();d.fixture.unshift({date:fxDate.value,serie:fxSerie.value,game:fxGame.value,place:fxPlace.value,hour:fxHour.value});saveData(d);fxDate.value=fxGame.value=fxPlace.value=fxHour.value='';render();}
addPosition.onclick=()=>{if(!posTeam.value)return alert('Ingresa equipo.');const d=getData();if(!d.standings[posSerie.value])d.standings[posSerie.value]=[];d.standings[posSerie.value].push({team:posTeam.value,pj:posPJ.value||0,pg:posPG.value||0,pe:posPE.value||0,pp:posPP.value||0,dg:posDG.value||'0',pts:posPTS.value||0});saveData(d);[posTeam,posPJ,posPG,posPE,posPP,posDG,posPTS].forEach(i=>i.value='');standingSerieSelect.value=posSerie.value;render();}
addSponsor.onclick=()=>{if(!sponsorName.value)return alert('Ingresa nombre del auspiciador.');const d=getData();d.sponsors.unshift({name:sponsorName.value,desc:sponsorDesc.value||'Auspiciador oficial',logo:sponsorLogo.value});saveData(d);sponsorName.value=sponsorDesc.value=sponsorLogo.value='';render();}

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.section,.metrics article').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
render();
