// ============================================================
// AUTENTICAÇÃO REAL — liga os formulários existentes ao Supabase
// ============================================================

const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("signin-form");
const signupMessage = document.getElementById("signup-message");
const signinMessage = document.getElementById("signin-message");
const signupButton = document.getElementById("signup-button");
const signinButton = document.getElementById("signin-button");

function showMessage(el, text, type) {
    el.textContent = text;
    el.className = "form-message " + type;
}

// Se o usuário já está logado, manda direto pro app (evita ver o login de novo)
(async function redirectIfLoggedIn() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = "app/index.html";
    }
})();

// ------------------------------------------------------------
// CADASTRO
// ------------------------------------------------------------
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    signupButton.disabled = true;
    showMessage(signupMessage, "A criar conta...", "success");

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
    });

    signupButton.disabled = false;

    if (error) {
        showMessage(signupMessage, traduzErro(error.message), "error");
        return;
    }

    if (!data.session) {
        // Projeto exige confirmação por email antes de liberar acesso
        showMessage(signupMessage, "Conta criada! Verifica o teu email pra confirmar antes de entrar.", "success");
        return;
    }

    // Já entrou direto (confirmação de email desligada) — manda pro onboarding
    window.location.href = "onboarding.html";
});

// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------
signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;

    signinButton.disabled = true;
    showMessage(signinMessage, "A entrar...", "success");

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    signinButton.disabled = false;

    if (error) {
        showMessage(signinMessage, traduzErro(error.message), "error");
        return;
    }

    // Confere se este usuário já tem um workspace criado
    const { data: memberships } = await supabaseClient
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", data.user.id)
        .limit(1);

    if (memberships && memberships.length > 0) {
        window.location.href = "app/index.html";
    } else {
        window.location.href = "onboarding.html";
    }
});

// Traduz as mensagens de erro mais comuns do Supabase pro português
function traduzErro(msg) {
    const traducoes = {
        "Invalid login credentials": "Email ou senha incorretos.",
        "User already registered": "Já existe uma conta com este email.",
        "Password should be at least 6 characters": "A senha precisa ter pelo menos 6 caracteres.",
        "Email not confirmed": "Confirma o teu email antes de entrar.",
    };
    return traducoes[msg] || msg;
}
