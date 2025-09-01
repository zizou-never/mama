(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const loginLink = document.getElementById('loginLink');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminLink = document.getElementById('adminLink');

  // Thème
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle && (themeToggle.onclick = () => {
    const t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  });

  // Menu mobile
  burger && (burger.onclick = () => menu.classList.toggle('show'));

  // Auth UI
  function refreshAuthUI(){
    const u = API.auth.getUser();
    if (u) {
      loginLink && loginLink.classList.add('d-none');
      userMenu && userMenu.classList.remove('d-none');
      userName && (userName.textContent = u.name);
      if (adminLink) {
        if (u.role === 'admin') adminLink.classList.remove('d-none');
        else adminLink.classList.add('d-none');
      }
    } else {
      loginLink && loginLink.classList.remove('d-none');
      userMenu && userMenu.classList.add('d-none');
      adminLink && adminLink.classList.add('d-none');
    }
  }
  logoutBtn && (logoutBtn.onclick = () => {
    API.auth.clearToken(); API.auth.clearUser(); toast('Déconnecté', 'success'); refreshAuthUI(); location.href='index.html';
  });
  refreshAuthUI();

  // Statistiques (Accueil)
  const sSt = document.getElementById('statStudents');
  const sCo = document.getElementById('statCourses');
  const sQc = document.getElementById('statQcm');
  const sEn = document.getElementById('statEnroll');
  if (sSt && sCo && sQc && sEn) {
    API.stats().then(d=>{
      sSt.textContent = fmt(d.students);
      sCo.textContent = fmt(d.courses);
      sQc.textContent = fmt(d.qcms);
      sEn.textContent = fmt(d.enrollments);
    }).catch(()=>{});
  }

  // Form contact
  const cForm = document.getElementById('contactForm');
  cForm && cForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();
    try{
      await API.messages.send(name,email,message);
      toast('Message envoyé ✔','success'); cForm.reset();
    }catch(e){ toast(e.message,'danger'); }
  });

  // Mise en avant (Accueil)
  const feat = document.getElementById('featured-courses');
  if (feat) {
    API.courses.list().then(cs=>{
      feat.innerHTML = cs.slice(0,3).map(c=>`
        <div class="card course-card">
          <img src="${c.image||''}" alt="">
          <h3>${c.title}</h3>
          <p class="muted">${c.description}</p>
          <div style="display:flex;gap:10px;align-items:center;justify-content:space-between">
            <span class="badge">${c.hours} h</span>
            <a class="btn btn-soft" href="cours.html?id=${c.id}">Voir</a>
          </div>
        </div>`).join('');
    });
  }
})();
