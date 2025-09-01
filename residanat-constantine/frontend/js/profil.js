(async function(){
  const info = document.getElementById('profileInfo');
  const my = document.getElementById('myCourses');
  try{
    const me = await API.auth.me();
    const u = me.user;
    info.innerHTML = `<p><strong>Nom:</strong> ${u.name}</p><p><strong>Email:</strong> ${u.email}</p><p><strong>Rôle:</strong> ${u.role}</p>`;
    const all = await API.courses.list();
    const mine = all.filter(c => (u.courses||[]).includes(c.id));
    my.innerHTML = mine.length ? mine.map(c=>`<div class="card" style="margin-bottom:8px"><strong>${c.title}</strong><br><span class="muted">${c.description}</span></div>`).join('') : '<p class="muted">Aucune formation inscrite.</p>';
  }catch(e){
    toast('Connectez-vous pour voir votre profil','danger'); location.href='login.html';
  }
})();
