create table if not exists participants (
  id bigint generated always as identity primary key,
  event_id int not null default 1,
  nickname text not null,
  gender text not null check (gender in ('M','F')),
  heart_sent boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists hearts (
  id bigint generated always as identity primary key,
  event_id int not null default 1,
  from_participant_id bigint references participants(id) on delete cascade,
  to_participant_id bigint references participants(id) on delete cascade,
  created_at timestamptz default now(),
  unique(event_id, from_participant_id)
);

create table if not exists seat_tables (
  id bigint generated always as identity primary key,
  event_id int not null default 1,
  table_no int not null,
  seat_count int not null,
  created_at timestamptz default now()
);

create table if not exists assignments (
  id bigint generated always as identity primary key,
  event_id int not null default 1,
  participant_id bigint references participants(id) on delete cascade,
  table_no int not null,
  seat_no int not null,
  created_at timestamptz default now()
);

create table if not exists rounds (
  id bigint generated always as identity primary key,
  event_id int not null default 1,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz default now()
);

create table if not exists votes (
  id bigint generated always as identity primary key,
  round_id bigint references rounds(id) on delete cascade,
  participant_id bigint references participants(id) on delete cascade,
  choice text not null check (choice in ('O','X')),
  created_at timestamptz default now(),
  unique(round_id, participant_id)
);

create table if not exists matches (
  id bigint generated always as identity primary key,
  round_id bigint references rounds(id) on delete cascade,
  participant_a_id bigint references participants(id) on delete cascade,
  participant_b_id bigint references participants(id) on delete cascade,
  mode text not null,
  created_at timestamptz default now()
);

alter table participants enable row level security;
alter table hearts enable row level security;
alter table seat_tables enable row level security;
alter table assignments enable row level security;
alter table rounds enable row level security;
alter table votes enable row level security;
alter table matches enable row level security;

do $$ begin
  create policy participants_all on participants for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy hearts_all on hearts for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy seat_tables_all on seat_tables for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy assignments_all on assignments for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy rounds_all on rounds for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy votes_all on votes for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy matches_all on matches for all using (true) with check (true);
exception when duplicate_object then null; end $$;
