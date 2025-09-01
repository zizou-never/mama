(function(){
  const grid = document.getElementById('catGrid');
  const startBtn = document.getElementById('startSimBtn');
  let cats = [];

  if (grid) {
    API.qcm.categories().then(data=>{
      cats = data;
      grid.innerHTML = data.map(c=>`
        <div class="card">
          <h3>${c.name}</h3>
          <p class="muted">Entraînement thématique</p>
          <div class="mt-24" style="display:flex;gap:10px">
            <a class="btn btn-soft" href="simulateur.html?cat=${c.id}&n=20">Quiz 20</a>
            <a class="btn" href="simulateur.html?cat=${c.id}&n=60">Session 60</a>
          </div>
        </div>`).join('');
    });
  }

  startBtn && (startBtn.onclick = (e)=>{
    e.preventDefault();
    if (!cats.length) return;
    const any = cats[0].id;
    location.href = `simulateur.html?cat=${any}&n=120&dur=180`;
  });
})();
