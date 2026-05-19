-- Run this in your Supabase SQL Editor

-- 1. Create Profiles Table (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Auto-create profile trigger on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Groups Table
create table public.groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  icon text,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.groups enable row level security;

create policy "Groups are viewable by authenticated users."
  on groups for select
  to authenticated
  using ( true );


-- 3. Create Expenses Table
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  amount numeric not null,
  description text not null,
  date date not null,
  user_id uuid references public.profiles(id) not null,
  group_id uuid references public.groups(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses."
  on expenses for select
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can insert their own expenses."
  on expenses for insert
  to authenticated
  with check ( auth.uid() = user_id );


-- Seed Sample Groups
insert into public.groups (name, icon, summary) values
('CSK Cricket team', '🏏', 'Ticket fees'),
('Goa Trip', '🏖️', 'Travel and stay'),
('Roommates', '🏠', 'Rent and utilities');
