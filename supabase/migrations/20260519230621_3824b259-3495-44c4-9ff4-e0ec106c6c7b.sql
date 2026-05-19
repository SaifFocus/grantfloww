
-- ============ ENUMS ============
create type public.app_role as enum ('admin', 'user');

-- ============ updated_at helper ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ user_roles ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles_self_read" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "user_roles_admin_all" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'));

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_self_delete" on public.profiles for delete using (auth.uid() = id);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ grants ============
create table public.grants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  funder text not null,
  country text not null,
  region text,
  amount_min integer,
  amount_max integer,
  currency text default 'EUR',
  deadline text,
  eligibility_tags text[] not null default '{}',
  sector_tags text[] not null default '{}',
  stage_tags text[] not null default '{}',
  description text,
  requirements_text text,
  application_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.grants enable row level security;

create policy "grants_public_read" on public.grants
  for select using (is_active = true);
create policy "grants_admin_all" on public.grants
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger grants_updated_at before update on public.grants
  for each row execute function public.set_updated_at();

create index grants_country_idx on public.grants(country) where is_active = true;
create index grants_sector_tags_idx on public.grants using gin(sector_tags);
create index grants_stage_tags_idx on public.grants using gin(stage_tags);
create index grants_eligibility_tags_idx on public.grants using gin(eligibility_tags);

-- ============ user_applications ============
create table public.user_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  grant_id uuid references public.grants(id) on delete set null,
  grant_name text not null,
  funder text,
  status text not null default 'drafting' check (status in ('drafting','submitted','approved','rejected','waitlisted')),
  idea_snapshot jsonb,
  draft_content jsonb,
  fit_score integer,
  notes text,
  deadline_reminder timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_applications enable row level security;

create policy "applications_own_all" on public.user_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger user_applications_updated_at before update on public.user_applications
  for each row execute function public.set_updated_at();

create index user_applications_user_idx on public.user_applications(user_id);

-- ============ saved_grants ============
create table public.saved_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  grant_id uuid references public.grants(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique (user_id, grant_id)
);
alter table public.saved_grants enable row level security;

create policy "saved_grants_own_all" on public.saved_grants
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ SEED 30 GRANTS ============
insert into public.grants (name, funder, country, currency, amount_min, amount_max, deadline, eligibility_tags, sector_tags, stage_tags, requirements_text, application_url) values
-- Sweden
('Innovative Startups', 'Vinnova', 'Sweden', 'SEK', 100000, 300000, 'Rolling', '{startup,tech}', '{general,tech}', '{idea,early}', 'Swedish-registered company, max 5 years old, scalable tech-based business model, must have at least 1 employee', 'https://www.vinnova.se/e/innovative-startups/'),
('Innovationslån', 'Almi', 'Sweden', 'SEK', 100000, 5000000, 'Rolling', '{startup,sme}', '{general}', '{early,growth}', 'Registered in Sweden, innovative product or service, must demonstrate market potential, co-financing required', 'https://www.almi.se/finansiering/lan/innovationslaan/'),
('Grön omställning', 'Tillväxtverket', 'Sweden', 'SEK', 50000, 2000000, 'Rolling', '{sme}', '{green}', '{growth}', 'Swedish SME, must contribute to green transition, documented environmental impact plan', 'https://www.tillvaxtverket.se'),
('Klimatklivet', 'Swedish Energy Agency', 'Sweden', 'SEK', 50000, 50000000, 'Rolling', '{sme,startup}', '{green}', '{early,growth}', 'Project must reduce greenhouse gas emissions in Sweden, open to businesses, municipalities, and organisations', 'https://www.energimyndigheten.se/klimatklivet'),
('Kulturstöd', 'Kulturrådet', 'Sweden', 'SEK', 10000, 500000, 'Rolling', '{creative,non-profit}', '{art}', '{idea,early,growth}', 'Cultural or artistic project, Swedish applicant, must demonstrate artistic merit and public benefit', 'https://www.kulturradet.se/bidrag/'),
-- Denmark
('InnoBooster', 'Innovationsfonden', 'Denmark', 'DKK', 50000, 5000000, 'Rolling', '{startup,tech}', '{tech,general}', '{early}', 'Danish company or researcher, innovative project with clear commercialisation plan, must apply online', 'https://innovationsfonden.dk/da/programmer/innobooster'),
('SMV:Digital', 'Erhvervsstyrelsen', 'Denmark', 'DKK', 10000, 400000, 'Rolling', '{sme}', '{general}', '{established}', 'Danish SME with fewer than 250 employees, project must support digital transformation', 'https://smvdigital.dk'),
('Eksportfremme', 'Dansk Erhverv', 'Denmark', 'DKK', 25000, 500000, 'Rolling', '{sme}', '{general}', '{growth}', 'Danish company, must target export markets, documented export strategy required', 'https://www.danskerhverv.dk'),
('Filantropiske projekter', 'Realdania', 'Denmark', 'DKK', 100000, 10000000, 'Rolling', '{non-profit,social-enterprise}', '{education,general}', '{early,growth,established}', 'Project must benefit the built environment or quality of life, non-profit or public body preferred', 'https://realdania.dk/ansoeg-om-stoette'),
('Vækstlån', 'Vækstfonden', 'Denmark', 'DKK', 500000, 10000000, 'Rolling', '{startup,sme}', '{general}', '{growth}', 'Danish company, must demonstrate growth potential, requires co-financing from private bank', 'https://vf.dk/vaekstlaan'),
-- Norway
('Establish and Grow', 'Innovation Norway', 'Norway', 'NOK', 100000, 500000, 'Rolling', '{startup}', '{general}', '{idea,early}', 'Norwegian resident or company, innovative business concept, must complete establishment program', 'https://www.innovasjonnorge.no/no/tjenester/etablerertilskudd/'),
('Commercialisation', 'Research Council of Norway', 'Norway', 'NOK', 500000, 5000000, 'Rolling', '{startup}', '{general,tech}', '{early}', 'Norwegian business or research institution, research-based innovation, must have IP or prototype', 'https://www.forskningsradet.no/en/apply-for-funding/funding-from-the-research-council/commercialisation/'),
('Business Energy', 'Enova', 'Norway', 'NOK', 100000, 10000000, 'Rolling', '{sme,startup}', '{green}', '{early,growth}', 'Norwegian business, project must reduce energy consumption or increase renewable energy use', 'https://www.enova.no/bedrift/'),
('Gaver', 'Sparebankstiftelsen DNB', 'Norway', 'NOK', 10000, 500000, 'Rolling', '{non-profit,creative}', '{art,education}', '{idea,early,growth}', 'Norwegian non-profit or community organisation, project must benefit local communities', 'https://sparebankstiftelsen.no/soke-midler/'),
('Project Grant', 'Arts Council Norway', 'Norway', 'NOK', 20000, 1000000, 'Rolling', '{creative,non-profit}', '{art}', '{early,growth}', 'Norwegian cultural practitioner or organisation, artistic and cultural project, must demonstrate professional quality', 'https://www.kulturradet.no/stotteordninger/'),
-- UK
('Smart Grants', 'Innovate UK', 'United Kingdom', 'GBP', 25000, 500000, 'Rolling', '{startup,sme,tech}', '{tech,general}', '{early,growth}', 'UK-registered business, must have innovative technology product or process, collaborative projects preferred', 'https://www.ukri.org/opportunity/innovate-uk-smart-grants/'),
('Start Up Loans', 'British Business Bank', 'United Kingdom', 'GBP', 500, 25000, 'Rolling', '{startup}', '{general}', '{idea,early}', 'UK resident, business less than 3 years old or pre-revenue, personal loan — not a business grant', 'https://www.startuploans.co.uk'),
('Project Grants', 'Arts Council England', 'United Kingdom', 'GBP', 1000, 100000, 'Rolling', '{creative,non-profit}', '{art}', '{idea,early}', 'Based in England, arts or cultural project, must demonstrate public benefit and artistic quality', 'https://www.artscouncil.org.uk/project-grants'),
('Future Leaders Fellowships', 'UKRI', 'United Kingdom', 'GBP', 400000, 1500000, 'Rolling', '{tech}', '{general,tech}', '{early,established}', 'UK researcher or innovator, must be affiliated with UK research organisation, early career stage', 'https://www.ukri.org/opportunity/future-leaders-fellowships/'),
('Challenge Prizes', 'Nesta', 'United Kingdom', 'GBP', 50000, 1000000, 'Rolling', '{startup,sme}', '{general,tech,health}', '{early,growth}', 'Open to organisations and individuals globally, must address specific societal challenge defined by prize, competitive application', 'https://www.nesta.org.uk/challenge-prize/'),
-- US
('SBIR Phase I', 'Small Business Innovation Research', 'United States', 'USD', 50000, 275000, 'Rolling', '{startup,tech}', '{tech,health}', '{idea,early}', 'US for-profit small business, fewer than 500 employees, must propose R&D with commercial potential, principal investigator employed by company', 'https://www.sbir.gov'),
('SBIR Phase II', 'Small Business Innovation Research', 'United States', 'USD', 275000, 2000000, 'Rolling', '{tech}', '{tech,health}', '{early,growth}', 'Must have completed SBIR Phase I, continued R&D with clear path to commercialisation', 'https://www.sbir.gov'),
('Grants for Arts Projects', 'NEA', 'United States', 'USD', 10000, 100000, 'Rolling', '{creative,non-profit}', '{art}', '{early,growth,established}', 'US non-profit, government entity, or federally-recognized tribe, arts or cultural project, must match grant funding', 'https://www.arts.gov/grants/grants-for-arts-projects'),
('Rural Development Business Grants', 'USDA Rural Development', 'United States', 'USD', 10000, 500000, 'Rolling', '{sme,non-profit}', '{agriculture,general}', '{early,growth}', 'Located in rural area (population under 50,000), for-profit or non-profit business, must create or save jobs', 'https://www.rd.usda.gov/programs-services/business-programs'),
('Small Business Development Grants', 'SBA', 'United States', 'USD', 5000, 250000, 'Rolling', '{startup,sme}', '{general}', '{idea,early}', 'US-registered small business, varies by specific program, most SBA programs are loans not grants — check specific eligibility', 'https://www.sba.gov/funding-programs/grants'),
-- Spain
('Proyectos de I+D', 'CDTI', 'Spain', 'EUR', 175000, 1500000, 'Rolling', '{sme,startup}', '{tech,general}', '{early,growth}', 'Spanish company, R&D or innovation project, must have technical and commercial viability, minimum 75% Spanish costs', 'https://www.cdti.es/index.asp?MP=100&MS=735&MN=3'),
('Jóvenes Emprendedores', 'ENISA', 'Spain', 'EUR', 25000, 75000, 'Rolling', '{startup}', '{general}', '{idea,early}', 'Spanish company less than 2 years old, majority controlled by founders under 40, innovative business model', 'https://www.enisa.es/es/financiacion/prestamos-enisa/jovenes-emprendedores'),
('Emprendedores', 'ENISA', 'Spain', 'EUR', 25000, 300000, 'Rolling', '{startup,sme}', '{general}', '{early}', 'Spanish company less than 2 years old, innovative or technology-based, annual revenue under €2M', 'https://www.enisa.es/es/financiacion/prestamos-enisa/emprendedores'),
('Kit Digital', 'Red.es', 'Spain', 'EUR', 2000, 15000, 'Rolling', '{sme}', '{general}', '{established}', 'Spanish SME with fewer than 250 employees, registered in Spain, must use funds for specific digital tools', 'https://www.red.es/es/iniciativas/kit-digital'),
('Ayudas a la Creación', 'Ministerio de Cultura', 'Spain', 'EUR', 5000, 100000, 'Rolling', '{creative,non-profit}', '{art}', '{early}', 'Spanish individual or organisation, cultural or creative project, must demonstrate artistic merit and cultural impact in Spain', 'https://www.culturaydeporte.gob.es/cultura/industriasculturales/ayudas-subvenciones.html');
