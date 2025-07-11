import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'
dotenv.config()

const supabaseURI = 'https://yxbboqcacbihxherpisb.supabase.co'
const supabaseKEY = `${process.env.SUPABASE_KEY}`

const supabase = createClient(supabaseURI, supabaseKEY)

export default supabase