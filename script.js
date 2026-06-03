document.querySelectorAll("[data-count]").forEach(el=>{
  const target=Number(el.dataset.count);
  let current=0;
  const step=Math.max(1,Math.ceil(target/80));
  const timer=setInterval(()=>{
    current+=step;
    if(current>=target){current=target;clearInterval(timer)}
    el.textContent=current;
  },22);
});

const revealItems=document.querySelectorAll(".section,.metrics article,.card,.gallery div,.table-card,.gold-panel,.stats-bars");
revealItems.forEach(i=>i.classList.add("reveal"));
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      observer.unobserve(e.target);
    }
  });
},{threshold:.12});
revealItems.forEach(i=>observer.observe(i));

document.querySelectorAll(".sidebar nav a").forEach(link=>{
  link.addEventListener("click",()=>{
    document.querySelectorAll(".sidebar nav a").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
  });
});
