-- Hoplink MVP schema. Every business record belongs to one organization (tenant).
-- Create organizations and memberships through a trusted onboarding flow before opening sign-ups.

create extension if not exists pgcrypto;

create type public.organization_role as enum ('owner', 'admin', 'representative');
create type public.prospect_stage as enum ('new', 'contacted', 'visit_scheduled', 'proposal_sent', 'active_customer', 'not_interested');
create type public.craft_beer_signal as enum ('found', 'not_found', 'needs_confirmation');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'representative',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.breweries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  website_url text,
  coverage_notes text,
  created_at timestamptz not null default now(),
  unique (organization_id, name),
  unique (organization_id, id)
);

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text,
  city text,
  state text,
  neighborhood text,
  address text,
  phone text,
  website_url text,
  source_provider text,
  source_url text,
  source_checked_at timestamptz,
  external_place_id text,
  craft_beer_signal public.craft_beer_signal not null default 'needs_confirmation',
  craft_beer_evidence text,
  craft_beer_evidence_url text,
  stage public.prospect_stage not null default 'new',
  next_follow_up_at timestamptz,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table public.prospect_breweries (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null,
  brewery_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (prospect_id, brewery_id),
  foreign key (organization_id, prospect_id) references public.prospects(organization_id, id) on delete cascade,
  foreign key (organization_id, brewery_id) references public.breweries(organization_id, id) on delete cascade
);

create table public.prospect_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null,
  activity_type text not null check (activity_type in ('note', 'call', 'message', 'visit', 'stage_change')),
  summary text not null,
  happened_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (organization_id, prospect_id) references public.prospects(organization_id, id) on delete cascade
);

create index prospects_org_stage_idx on public.prospects (organization_id, stage);
create index prospects_org_city_idx on public.prospects (organization_id, city);
create index activities_prospect_time_idx on public.prospect_activities (prospect_id, happened_at desc);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.breweries enable row level security;
alter table public.prospects enable row level security;
alter table public.prospect_breweries enable row level security;
alter table public.prospect_activities enable row level security;

-- A user's own membership row is the tenant access grant.
create policy "Members can view their memberships"
  on public.organization_members for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Members can view their organizations"
  on public.organizations for select to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = id and m.user_id = (select auth.uid())
  ));

create policy "Organization members can manage breweries"
  on public.breweries for all to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.breweries.organization_id and m.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.breweries.organization_id and m.user_id = (select auth.uid())
  ));

create policy "Organization members can manage prospects"
  on public.prospects for all to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospects.organization_id and m.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospects.organization_id and m.user_id = (select auth.uid())
  ));

create policy "Organization members can manage prospect breweries"
  on public.prospect_breweries for all to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospect_breweries.organization_id and m.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospect_breweries.organization_id and m.user_id = (select auth.uid())
  ));

create policy "Organization members can manage prospect activities"
  on public.prospect_activities for all to authenticated
  using (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospect_activities.organization_id and m.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.organization_members m
    where m.organization_id = public.prospect_activities.organization_id and m.user_id = (select auth.uid())
  ));

