(function(){
  const params = new URLSearchParams(location.search);
  const detailContainer = document.getElementById('courseDetail');
  const listContainer = document.getElementById('coursesList');

  // Liste
  if (listContainer) {
    const search = document.getElementById('search');
    const category = document.getElementById('category');
    async function load(){
      const cs = await API.courses.list(search.value.trim(), category.value || '');
      listContainer.innerHTML = cs.map(c=>`
        <div class="card course-card">
          <img src="${c.image||''}" alt="">
          <h3>${c.title}</h3>
          <p class="muted">${c.description}</p>
          <div style="display:flex;gap:10px;align-items:center;justify-content:space-between">
            <span class="badge">${c.hours} h</span>
            <a class="btn btn-soft" href="cours.html?id=${c.id}">Voir</a>
          </div>
        </div>`).join('');
    }
    search.addEventListener('input', ()=>load());
    category.addEventListener('change', ()=>load());
    load();
  }

  // Détail
  if (detailContainer) {
    const id = params.get('id');
    if (!id) { detailContainer.textContent = 'Cours introuvable'; return; }
    API.courses.one(id).then(c=>{
      detailContainer.innerHTML = `
        <div>
          <img src="${c.image||''}" alt="">
        </div>
        <div class="card">
          <h1>${c.title}</h1>
          <p class="muted">${c.description}</p>
          <p><span class="badge">${c.category}</span> • <span class="badge">${c.hours} h</span> • <span class="badge">${(c.price||0).toLocaleString()} DA</span></p>
          <h3>Programme</h3>
          <ul>
            ${(c.content||[]).map(s=>`<li><strong>${s.title}</strong>: ${s.items.join(', ')}</li>`).join('')}
          </ul>
          <div class="mt-24">
            <button id="enrollBtn" class="btn">S'inscrire</button>
          </div>
        </div>`;
      const enrollBtn = document.getElementById('enrollBtn');
      enrollBtn.onclick = async ()=>{
        if (!API.auth.getUser()) { toast('Connectez-vous pour vous inscrire','danger'); location.href='login.html'; return; }
        try { await API.courses.enroll(c.id); toast('Inscription réussie ✔','success'); }
        catch(e){ toast(e.message,'danger'); }
      };
    }).catch(()=> detailContainer.textContent='Cours introuvable');
  }
})();
