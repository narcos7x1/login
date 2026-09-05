const form = document.getElementById("onboarding-form");
const button = document.getElementById("onboarding-button");
const messageEl = document.getElementById("onboarding-message");

(async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = "index.html";
    }
})();

function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Math.random().toString(36).slice(2, 7);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("business-name").value.trim();
    const businessType = document.getElementById("business-type").value;

    button.disabled = true;
    messageEl.textContent = "";

    const { data: { user } } = await supabaseClient.auth.getUser();

    const { data: workspace, error: workspaceError } = await supabaseClient
        .from("workspaces")
        .insert({
            name,
            slug: slugify(name),
            owner_id: user.id,
            business_type: businessType,
        })
        .select()
        .single();

    if (workspaceError) {
        messageEl.className = "form-message error";
        messageEl.textContent = "Erro ao criar workspace: " + workspaceError.message;
        button.disabled = false;
        return;
    }

    const { error: memberError } = await supabaseClient
        .from("workspace_members")
        .insert({
            workspace_id: workspace.id,
            user_id: user.id,
            role: "owner",
            status: "active",
        });

    if (memberError) {
        messageEl.className = "form-message error";
        messageEl.textContent = "Erro ao criar membro: " + memberError.message;
        button.disabled = false;
        return;
    }

    window.location.href = "app/index.html";
});
