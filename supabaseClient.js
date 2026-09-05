// Configuração de conexão com o Supabase.
// Estas duas chaves são PÚBLICAS por design (a "publishable key" é segura
// de expor no navegador) — a segurança de verdade vem do RLS no banco.
const SUPABASE_URL = "https://rvfsnqfwwxtlggyycsjl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_AMFU7B0cngpz9aufMSsHTw_j0W6jG30";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
