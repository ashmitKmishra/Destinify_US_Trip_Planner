
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxwickzavcafmxetrxrt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4d2lja3phdmNhZm14ZXRyeHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTM2MDksImV4cCI6MjA1NjE2OTYwOX0.bcx2sT663RhweKiz9qdCaa7Dena4x3q6DsKbcWO3muc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
