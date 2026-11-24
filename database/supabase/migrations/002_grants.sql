revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select, insert, update on auth_profiles to authenticated;
grant select, insert, update, delete on courses to authenticated;
grant select, insert, update, delete on documents to authenticated;
grant select, insert, update, delete on document_chunks to authenticated;
grant select, insert, update, delete on deadlines to authenticated;
grant select, insert, update, delete on threads to authenticated;
grant select, insert, update, delete on messages to authenticated;

-- Narrow service role: no normal user read grants and no blanket writes.
revoke all on all tables in schema public from service_role;
