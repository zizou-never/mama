(function(){
  const p = new URLSearchParams(location.search);
  const cat = p.get('cat');
  const n = Number(p.get('n')||'120');
  const durMin = Number(p.get('dur')||'180');
  const qIndex = document.getElementById('qIndex');
  const qText = document.getElementById('qText');
  const answers = document.getElementById('answers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  const progressBar = document.getElementById('progressBar');
  const result = document.getElementById('result');
  const title = document.getElementById('examTitle');
  const info = document.getElementById('examInfo');
  const timerEl = document.getElementById('timer');

  let qs = [], idx = 0, userAns = [];

  function setTimer(minutes){
    let t = minutes*60;
    const it = setInterval(()=>{
      const h = String(Math.floor(t/3600)).padStart(2,'0'), m=String(Math.floor((t%3600)/60)).padStart(2,'0'), s=String(t%60).padStart(2,'0');
      timerEl.textContent = `${h}:${m}:${s}`;
      if (--t < 0) { clearInterval(it); finish(); }
    },1000);
  }

  function render(){
    const q = qs[idx];
    qIndex.textContent = `${idx+1} / ${qs.length}`;
    qText.textContent = q.question;
    answers.innerHTML = q.options.map((o,i)=>`
      <label>
        <input type="radio" name="ans" ${userAns[idx]===i?'checked':''} value="${i}"/>
        <span>${o}</span>
      </label>
    `).join('');
    progressBar.style.width = `${((idx)/qs.length)*100}%`;
    prevBtn.disabled = idx===0;
    nextBtn.disabled = idx===qs.length-1;
  }

  function finish(){
    let good=0;
    const items = qs.map((q,i)=>({ ok: userAns[i]===q.answerIndex, q, ans: userAns[i] }));
    items.forEach(it=>{ if (it.ok) good++; });
    const score = Math.round((good/qs.length)*100);
    result.classList.remove('d-none');
    result.innerHTML = `
      <h3>Résultats</h3>
      <p>Score: <strong>${score}%</strong> • Bonnes réponses: ${good}/${qs.length}</p>
      <details class="mt-24"><summary>Voir les corrections</summary>
        <ol>
          ${items.map((it,i)=>`
            <li style="margin:8px 0">
              <div>${it.q.question}</div>
              <div>Votre réponse: <strong>${it.ans!=null ? it.q.options[it.ans] : '—'}</strong> • Bonne réponse: <strong>${it.q.options[it.q.answerIndex]}</strong></div>
              ${it.q.explanation ? `<div class="muted">${it.q.explanation}</div>` : ''}
            </li>`).join('')}
        </ol>
      </details>
    `;
    toast(`Examen terminé: ${score}%`, score>=60?'success':'danger', 4000);
    window.scrollTo({top: result.offsetTop-20, behavior:'smooth'});
  }

  prevBtn.onclick = ()=>{ saveAns(); if (idx>0) idx--; render(); }
  nextBtn.onclick = ()=>{ saveAns(); if (idx<qs.length-1) idx++; render(); }
  finishBtn.onclick = ()=>{ saveAns(); finish(); }

  function saveAns(){
    const v = document.querySelector('input[name="ans"]:checked');
    if (v) userAns[idx] = Number(v.value);
  }

  if (!cat) { qText.textContent='Catégorie manquante'; return;}
  API.qcm.questions(cat, n).then(data=>{
    qs = data; userAns = Array(qs.length).fill(null);
    title.textContent = 'Examen • ' + qs.length + ' Q';
    info.textContent = `${qs.length} questions • ${durMin} min`;
    setTimer(durMin);
    render();
  }).catch(()=>{ qText.textContent='Impossible de charger les questions'; });
})();
