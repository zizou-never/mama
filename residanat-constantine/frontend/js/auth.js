(function(){
  // Login
  const lForm = document.getElementById('loginForm');
  lForm && lForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try{
      const { token, user } = await API.auth.login(email, password);
      API.auth.setToken(token); API.auth.setUser(user);
      toast('Bienvenue '+user.name,'success'); location.href = 'index.html';
    }catch(err){ toast(err.message,'danger'); }
  });

  // Register
  const rForm = document.getElementById('registerForm');
  rForm && rForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try{
      const { token, user } = await API.auth.register(name, email, password);
      API.auth.setToken(token); API.auth.setUser(user);
      toast('Inscription réussie','success'); location.href = 'index.html';
    }catch(err){ toast(err.message,'danger'); }
  });
})();
