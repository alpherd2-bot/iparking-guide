const button=document.getElementById('fontButton');
button.addEventListener('click',()=>{
  const active=document.body.classList.toggle('large-text');
  button.textContent=active?'기본 글자로 보기':'글자 크게 보기';
  button.setAttribute('aria-pressed',String(active));
  localStorage.setItem('largeText',active?'1':'0');
});
if(localStorage.getItem('largeText')==='1')button.click();
