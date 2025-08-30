import 'react-native-url-polyfill/auto'; // Needed for RN support
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const supabaseUrl = 'https://quonuxvuxwavpuqcbxeb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1b251eHZ1eHdhdnB1cWNieGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjgxNTYsImV4cCI6MjA2Njg0NDE1Nn0.3V_xLtXXvWsSihlLePKmO2jGgsuTYIDyTkfzG2l9ObU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey ,{
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});



if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}