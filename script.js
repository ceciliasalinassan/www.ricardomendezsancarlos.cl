const ADMIN_PASS = "admin1932";

const defaults = {
  news: [
    {title:"Gran victoria en casa", text:"El equipo suma tres puntos importantes y sigue firme en la competencia.", date:"20 Mayo, 2026"},
    {title:"Entrenamiento intenso", text:"Las series se preparan para los próximos desafíos deportivos.", date:"18 Mayo, 2026"},
    {title:"Campaña de socios", text:"Únete a la familia Ricardo Méndez y apoya al crecimiento del club.", date:"15 Mayo, 2026"}
  ],
  media: [
    {title:"Partidos", type:"Foto", url:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80"},
    {title:"Entrenamientos", type:"Foto", url:"https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80"},
    {title:"Hinchada", type:"Foto", url:"https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80"},
    {title:"Celebraciones", type:"Foto", url:"https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80"}
  ],
  fixture: [
    {date:"25/05/2026", serie:"Primera", game:"Ricardo Méndez vs Atlético Juventud", place:"Local", hour:"15:00"},
    {date:"01/06/2026", serie:"Senior", game:"Deportivo Unión vs Ricardo Méndez", place:"Visita", hour:"17:00"},
    {date:"08/06/2026", serie:"Juvenil", game:"Ricardo Méndez vs Club San José", place:"Local", hour:"12:00"}
  ],
  positions: [
    {pos:1, team:"Ricardo Méndez", pj:10, pg:7, pe:2, pp:1, dg:"+15", pts:23},
    {pos:2, team:"Atlético Juventud", pj:10, pg:6, pe:2, pp:2, dg:"+9", pts:20},
    {pos:3, team:"Deportivo Unión", pj:10, pg:5, pe:3, pp:2, dg:"+6", pts:18}
  ],
  requests: []
};

function getData(){
  const saved = localStorage.getItem("clubRMData");
  if(!saved){
    localStorage.setItem("clubRMData", JSON.stringify(defaults));
    return structuredClone(defaults);
  }
  return JSON.parse(saved);
}
function saveData(data){
  localStorage.setItem("clubRMData", JSON.stringify(data));
}
function render(){
  const data = getData();

  document.getElementById("newsGrid").innerHTML = data.news.map(n => `
    <article class="card">
      <div class="thumb"></div>
      <h3>${n.title}</h3>
      <p>${n.text}</p>
      <small>${n.date || "Publicado por administración"}</small>
    </article>
  `).join("");

  document.getElementById("galleryGrid").innerHTML = data.media.map(m => `
    <article>
      <img src="${m.url}" onerror="this.src='https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80'">
      <div><h3>${m.title}</h3><p>${m.type}</p></div>
    </article>
  `).join("");

  document.getElementById("fixtureRows").innerHTML = data.fixture.map(f => `
    <tr><td>${f.date}</td><td>${f.serie}</td><td>${f.game}</td><td>${f.place}</td><td>${f.hour}</td></tr>
  `).join("");

  document.getElementById("positionRows").innerHTML = data.positions.map(p => `
    <tr class="${p.pos==1?'leader':''}"><td>${p.pos}</td><td>${p.team}</td><td>${p.pj}</td><td>${p.pg}</td><td>${p.pe}</td><td>${p.pp}</td><td>${p.dg}</td><td>${p.pts}</td></tr>
  `).join("");

  renderRequests();
}
function renderRequests(){
  const data = getData();
  const list = document.getElementById("requestList");
  if(!list) return;
  if(data.requests.length === 0){
    list.innerHTML = "<p>No hay solicitudes pendientes.</p>";
    return;
  }
  list.innerHTML = data.requests.map((r,i)=>`
    <div class="request">
      <p><b>Nombre:</b> ${r.name}</p>
      <p><b>RUT:</b> ${r.rut}</p>
      <p><b>Teléfono:</b> ${r.phone}</p>
      <p><b>Tipo:</b> ${r.type}</p>
      <div class="actions">
        <button onclick="approveRequest(${i})">Aprobar</button>
        <button class="danger" onclick="rejectRequest(${i})">Rechazar</button>
      </div>
    </div>
  `).join("");
}
window.approveRequest = function(index){
  const data = getData();
  data.requests.splice(index,1);
  saveData(data);
  alert("Solicitud aprobada. En versión Supabase quedaría registrada como socio.");
  render();
}
window.rejectRequest = function(index){
  const data = getData();
  data.requests.splice(index,1);
  saveData(data);
  render();
}

document.getElementById("memberRequestForm").addEventListener("submit", e=>{
  e.preventDefault();
  const data = getData();
  data.requests.push({
    name:memberName.value,
    rut:memberRut.value,
    phone:memberPhone.value,
    type:memberType.value
  });
  saveData(data);
  e.target.reset();
  alert("Solicitud enviada. Queda pendiente de aprobación del administrador.");
});

openAdmin.onclick = ()=>adminModal.classList.add("show");
closeAdmin.onclick = ()=>adminModal.classList.remove("show");

loginBtn.onclick = ()=>{
  if(adminPassword.value !== ADMIN_PASS){
    alert("Clave incorrecta");
    return;
  }
  loginPanel.classList.add("hidden");
  adminPanel.classList.remove("hidden");
};

document.querySelectorAll(".tab").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tabContent").forEach(c=>c.classList.add("hidden"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.remove("hidden");
    renderRequests();
  }
});

addNews.onclick=()=>{
  if(!newsTitle.value || !newsText.value) return alert("Completa título e información.");
  const data=getData();
  data.news.unshift({title:newsTitle.value,text:newsText.value,date:new Date().toLocaleDateString("es-CL")});
  saveData(data);
  newsTitle.value=""; newsText.value="";
  render();
};
addMedia.onclick=()=>{
  if(!mediaTitle.value || !mediaUrl.value) return alert("Completa título y URL.");
  const data=getData();
  data.media.unshift({title:mediaTitle.value,type:mediaType.value,url:mediaUrl.value});
  saveData(data);
  mediaTitle.value=""; mediaUrl.value="";
  render();
};
addFixture.onclick=()=>{
  if(!fxDate.value || !fxSerie.value || !fxGame.value) return alert("Completa los datos del partido.");
  const data=getData();
  data.fixture.unshift({date:fxDate.value,serie:fxSerie.value,game:fxGame.value,place:fxPlace.value,hour:fxHour.value});
  saveData(data);
  fxDate.value=fxSerie.value=fxGame.value=fxPlace.value=fxHour.value="";
  render();
};

document.querySelectorAll("[data-count]").forEach(el=>{
  const target=Number(el.textContent);
  let cur=0, step=Math.max(1,Math.ceil(target/55));
  const timer=setInterval(()=>{
    cur+=step;
    if(cur>=target){cur=target;clearInterval(timer)}
    el.textContent=cur;
  },25);
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}
  });
},{threshold:.12});
document.querySelectorAll(".section,.dashboard article").forEach(el=>{
  el.classList.add("reveal");
  observer.observe(el);
});

render();
