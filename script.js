document.querySelectorAll("[data-count]").forEach(el=>{
  const target=Number(el.dataset.count);
  let current=0;
  const step=Math.max(1,Math.ceil(target/70));
  const timer=setInterval(()=>{
    current+=step;
    if(current>=target){current=target;clearInterval(timer);}
    el.textContent=current;
  },24);
});

const items=document.querySelectorAll(".section,.quickStats article,.card,.gallery div,.tableBox,.panel,.bars");
items.forEach(i=>i.classList.add("reveal"));
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      obs.unobserve(e.target);
    }
  });
},{threshold:.12});
items.forEach(i=>obs.observe(i));
