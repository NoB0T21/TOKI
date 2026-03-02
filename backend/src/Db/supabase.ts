import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'
dotenv.config()
import https from 'https';

// 🔥 Keep-Alive Agent
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 100,        // allow concurrency
  maxFreeSockets: 20,
  timeout: 60000,
});

// Custom fetch with keep-alive
const customFetch = (url: any, options: any) => {
  return fetch(url, {
    ...options,
    agent: httpsAgent,
  });
};

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://yxbboqcacbihxherpisb.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''// use service role for backend
)

export default supabase;