# Supabase Setup (HolyVerse)

## 1) Create a Supabase project
- Create a new project in Supabase.
- Copy your Project URL and anon key.

## 2) Add credentials in auth.js
Replace the placeholders in [js/auth.js](js/auth.js):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 3) Create the `profiles` table
Run this SQL in the Supabase SQL editor:

```sql
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  favorites jsonb default '[]'::jsonb,
  search_history jsonb default '[]'::jsonb,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can manage their profile"
  on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

## 4) (Optional) Email confirmation
If you enable email confirmations in Supabase Auth, users will need to confirm before they can log in. Adjust this in the Supabase Auth settings.

## 5) Enable Google login
In Supabase Auth → Providers:
- Enable Google.
- Add OAuth credentials from the Google developer console.
- Add redirect URL:
  - https://holyverse.ca (and your preview/local URLs)

If you test locally, add:
- http://localhost:8000
- http://127.0.0.1:8000
