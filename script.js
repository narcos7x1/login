const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const signInForm = document.querySelector('.sign-in');
const signUpForm = document.querySelector('.sign-up');
const switchLinks = document.querySelectorAll('.switch-link');
const togglePanelLeft = document.querySelector('.toggle-left');   // "Bem-vindo de volta!"
const togglePanelRight = document.querySelector('.toggle-right'); // "Olá, amigo!"

// Toggle usado no desktop (painel deslizante)
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Estado inicial: mostra o form de login (desktop e mobile)
signInForm.classList.add('mobile-visible');
togglePanelLeft.classList.add('mobile-active');

// Troca usada no mobile (links "Entrar" / "Cadastre-se")
switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');

        if (target === 'register') {
            signInForm.classList.remove('mobile-visible');
            signUpForm.classList.add('mobile-visible');
            togglePanelLeft.classList.remove('mobile-active');
            togglePanelRight.classList.add('mobile-active');
            container.classList.add('active'); // mantém coerência se a tela crescer (ex: rotação/desktop)
        } else {
            signUpForm.classList.remove('mobile-visible');
            signInForm.classList.add('mobile-visible');
            togglePanelRight.classList.remove('mobile-active');
            togglePanelLeft.classList.add('mobile-active');
            container.classList.remove('active');
        }
    });
});
