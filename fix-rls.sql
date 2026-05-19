-- Run this in Supabase SQL Editor to fix the RLS + FK errors for demo mode

-- 1. Disable RLS on expenses (no auth needed for demo)
alter table public.expenses disable row level security;

-- 2. Drop the foreign key constraint so user_id doesn't need a matching profile
alter table public.expenses drop constraint if exists expenses_user_id_fkey;

-- 3. Make user_id nullable so form works without auth
alter table public.expenses alter column user_id drop not null;
