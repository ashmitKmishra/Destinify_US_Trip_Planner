
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxwickzavcafmxetrxrt.supabase.co';
const supabaseAnonKey = 'supabaseAnonKey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
