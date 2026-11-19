-- 신랑측/신부측 구분과 하객 관계(가족·친척, 부모님 지인, 직장, 친구 등)
alter table entries
  add column if not exists side text check (side in ('groom', 'bride')),
  add column if not exists relation text;

alter table entries drop constraint if exists entries_relation_check;
alter table entries add constraint entries_relation_check check (
  relation in ('family', 'parents', 'work', 'friend', 'school', 'community', 'other')
);

create index if not exists entries_side_idx on entries (side);
