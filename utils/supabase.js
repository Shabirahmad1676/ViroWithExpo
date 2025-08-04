import 'react-native-url-polyfill/auto'; // Needed for RN support
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quonuxvuxwavpuqcbxeb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1b251eHZ1eHdhdnB1cWNieGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjgxNTYsImV4cCI6MjA2Njg0NDE1Nn0.3V_xLtXXvWsSihlLePKmO2jGgsuTYIDyTkfzG2l9ObU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
