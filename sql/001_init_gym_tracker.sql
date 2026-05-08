-- Gym Tracker schema + seed data
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

-- =========================
-- Tables
-- =========================

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  days_per_week int not null check (days_per_week between 1 and 7),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.template_days (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates(id) on delete cascade,
  day_index int not null check (day_index between 1 and 7),
  name text not null,
  created_at timestamptz not null default now(),
  unique (template_id, day_index)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  muscle_group text,
  created_at timestamptz not null default now()
);

create table if not exists public.template_day_exercises (
  id uuid primary key default gen_random_uuid(),
  template_day_id uuid not null references public.template_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  exercise_order int not null default 1,
  target_sets int not null check (target_sets > 0),
  target_reps int not null check (target_reps > 0),
  created_at timestamptz not null default now(),
  unique (template_day_id, exercise_order)
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workout_templates(id) on delete restrict,
  template_day_id uuid not null references public.template_days(id) on delete restrict,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'cancelled')),
  scheduled_for date,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text
);

create table if not exists public.session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  exercise_order int not null default 1,
  planned_sets int not null check (planned_sets > 0),
  planned_reps int not null check (planned_reps > 0),
  unique (session_id, exercise_order)
);

create table if not exists public.session_sets (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references public.session_exercises(id) on delete cascade,
  set_number int not null check (set_number > 0),
  reps int not null check (reps > 0),
  weight_kg numeric(6,2),
  rpe numeric(3,1),
  completed_at timestamptz not null default now(),
  unique (session_exercise_id, set_number)
);

-- helpful indexes
create index if not exists idx_template_days_template_id on public.template_days(template_id);
create index if not exists idx_tde_template_day_id on public.template_day_exercises(template_day_id);
create index if not exists idx_workout_sessions_template_id on public.workout_sessions(template_id);
create index if not exists idx_workout_sessions_status on public.workout_sessions(status);
create index if not exists idx_session_exercises_session_id on public.session_exercises(session_id);
create index if not exists idx_session_sets_session_exercise_id on public.session_sets(session_exercise_id);

-- =========================
-- Seed Data
-- =========================

insert into public.exercises (name, muscle_group)
values
  ('Bench Press', 'Chest'),
  ('Incline Dumbbell Press', 'Chest'),
  ('Overhead Press', 'Shoulders'),
  ('Barbell Row', 'Back'),
  ('Pull Up', 'Back'),
  ('Barbell Squat', 'Legs'),
  ('Romanian Deadlift', 'Legs')
on conflict (name) do nothing;

with new_template as (
  insert into public.workout_templates (name, days_per_week)
  values ('Push Pull Legs - Beginner', 3)
  returning id
),
insert_days as (
  insert into public.template_days (template_id, day_index, name)
  select id, 1, 'Push' from new_template
  union all
  select id, 2, 'Pull' from new_template
  union all
  select id, 3, 'Legs' from new_template
  returning id, template_id, day_index
)
insert into public.template_day_exercises (template_day_id, exercise_id, exercise_order, target_sets, target_reps)
select d.id,
       e.id,
       x.exercise_order,
       x.target_sets,
       x.target_reps
from insert_days d
join lateral (
  select 1 as exercise_order, 'Bench Press'::text as exercise_name, 4 as target_sets, 8 as target_reps where d.day_index = 1
  union all
  select 2, 'Incline Dumbbell Press', 3, 10 where d.day_index = 1
  union all
  select 3, 'Overhead Press', 3, 8 where d.day_index = 1
  union all
  select 1, 'Barbell Row', 4, 8 where d.day_index = 2
  union all
  select 2, 'Pull Up', 3, 8 where d.day_index = 2
  union all
  select 1, 'Barbell Squat', 4, 6 where d.day_index = 3
  union all
  select 2, 'Romanian Deadlift', 3, 8 where d.day_index = 3
) x on true
join public.exercises e on e.name = x.exercise_name;

-- sample completed session with logged sets
with selected_template as (
  select id from public.workout_templates
  where name = 'Push Pull Legs - Beginner'
  order by created_at desc
  limit 1
),
selected_day as (
  select td.id as template_day_id, st.id as template_id
  from public.template_days td
  join selected_template st on st.id = td.template_id
  where td.day_index = 1
  limit 1
),
new_session as (
  insert into public.workout_sessions (template_id, template_day_id, status, scheduled_for, started_at, ended_at, notes)
  select template_id, template_day_id, 'completed', current_date - interval '7 days', now() - interval '7 days' + interval '45 minutes', now() - interval '7 days', 'Solid session.'
  from selected_day
  returning id
),
insert_session_exercises as (
  insert into public.session_exercises (session_id, exercise_id, exercise_order, planned_sets, planned_reps)
  select ns.id, tde.exercise_id, tde.exercise_order, tde.target_sets, tde.target_reps
  from new_session ns
  join selected_day sd on true
  join public.template_day_exercises tde on tde.template_day_id = sd.template_day_id
  returning id, exercise_order
)
insert into public.session_sets (session_exercise_id, set_number, reps, weight_kg, rpe)
select se.id,
       s.set_number,
       s.reps,
       s.weight_kg,
       s.rpe
from insert_session_exercises se
join lateral (
  select 1 as set_number, 8 as reps, case when se.exercise_order = 1 then 60 else 20 end::numeric as weight_kg, 7.5::numeric as rpe
  union all
  select 2, 8, case when se.exercise_order = 1 then 60 else 20 end::numeric, 8.0::numeric
  union all
  select 3, 7, case when se.exercise_order = 1 then 62.5 else 22.5 end::numeric, 8.5::numeric
) s on true;

alter table public.workout_templates
add column color text;

alter table public.workout_templates
add column description text;
