import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://doydeobkijbxnbvklnrc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveWRlb2JraWpieG5idmtsbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjU0MDksImV4cCI6MjA1ODMwMTQwOX0.Mieyx9jS9dhtXWj60DXLdz3qujTS8c2A4pcV-FK4so4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
