(async function(){
  // Vérif admin
  try {
    const me = await API.auth.me();
    if (me.user.role !== 'admin') { location.href='index.html'; return; }
  } catch { location.href='login.html'; return; }

  const statWrap = document.getElementById('statCards');
  const { students, courses, qcms, messages, enrollments } = await API.stats();
  statWrap.innerHTML = [
    {label:'Étudiants', val: students},
    {label:'Formations', val: courses},
    {label:'QCM', val: qcms},
    {label:'Inscriptions', val: enrollments}
  ].map(s=>`<div class="card"><h3>${s.val}</h3><p class="muted">${s.label}</p></div>`).join('');

  // Graphiques
  const ctx1 = document.getElementById('chart1'); const ctx2 = document.getElementById('chart2');
  new Chart(ctx1, { type:'doughnut', data:{ labels:['Étudiants','Inscriptions'], datasets:[{ data:[students, enrollments], backgroundColor:['#3b82f6','#22c55e'] }] } });
  new Chart(ctx2, { type:'bar', data:{ labels:['QCM','Cours'], datasets:[{ data:[qcms, courses], backgroundColor:['#7c3aed','#3b82f6'] }] }, options:{ plugins:{legend:{display:false}} } });

  // CRUD Cours
  const list = document.getElementById('adminCourses');
  async function load(){
    const cs = await API.courses.list();
    list.innerHTML = cs.map(c=>`
      <div class="card" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div><strong>${c.title}</strong><div class="muted">${c.category} • ${c.hours}h</div></div>
        <button data-id="${c.id}" class="btn btn-soft btn-del">Supprimer</button>
      </div>`).join('');
    list.querySelectorAll('.btn-del').forEach(b=>b.onclick=async()=>{
      if(!confirm('Supprimer ce cours ?')) return;
      try{ await API.courses.remove(b.dataset.id); toast('Supprimé','success'); load(); }catch(e){ toast(e.message,'danger'); }
    });
  }
  load();

  const form = document.getElementById('courseForm');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      title: document.getElementById('cTitle').value.trim(),
      description: document.getElementById('cDesc').value.trim(),
      category: document.getElementById('cCat').value,
      price: Number(document.getElementById('cPrice').value||0),
      hours: Number(document.getElementById('cHours').value||0),
      image: document.getElementById('cImage').value.trim()
    };
    try{ await API.courses.create(payload); toast('Cours créé ✔','success'); form.reset(); load(); }catch(e){ toast(e.message,'danger'); }
  });
})();
