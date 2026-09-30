-- للمشاريع التي شغّلت schema.sql القديم (قبل مرحلة Google Drive). آمن لإعادة التشغيل.
alter table public.content_items add column if not exists drive_url text;
alter table public.content_items add column if not exists drive_file_id text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'content_pdf_has_drive') then
    alter table public.content_items add constraint content_pdf_has_drive
      check (type <> 'pdf' or drive_file_id is not null) not valid;  -- not valid: لا يفحص الصفوف القديمة
  end if;
end $$;
