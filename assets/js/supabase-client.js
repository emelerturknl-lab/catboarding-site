// Supabase Configuration
const SUPABASE_URL = 'https://hrlvsrvkaoepblodsdmt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pvGGrrnT0-B9VPTsx3j97Q_5IDViROP';

// Initialize Supabase SDK
// CDN generates `var supabase`. We overwrite it with the client instance.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
