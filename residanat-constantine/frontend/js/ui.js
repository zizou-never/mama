function toast(msg, variant='info', timeout=2500){
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.borderColor = variant==='success' ? 'var(--acc)' : (variant==='danger'?'var(--danger)':'var(--b)');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.remove(); }, timeout);
}
function qs(s, r=document){return r.querySelector(s)}
function qsa(s, r=document){return Array.from(r.querySelectorAll(s))}
function fmt(n){ return new Intl.NumberFormat('fr-FR').format(n) }
