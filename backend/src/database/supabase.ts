import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabase = (dbUrl: string, dbServiceRole: string) => ({
    setup(): SupabaseClient {
        return createClient( 
            dbUrl, 
            dbServiceRole,
            { auth: { persistSession: false, autoRefreshToken: false } }
        )
    }
});
