insert into public.qcm_categories (id, name, slug) values
  (gen_random_uuid(), 'Médecine Interne', 'medecine'),
  (gen_random_uuid(), 'Chirurgie', 'chirurgie'),
  (gen_random_uuid(), 'Pédiatrie', 'pediatrie');

-- Exemples de cours
insert into public.courses (title, description, category, price, hours, image) values
  ('Médecine Interne', 'Pathologies majeures et protocoles', 'medecine', 15000, 48, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=60'),
  ('Chirurgie Générale', 'Techniques et urgences fréquentes', 'chirurgie', 18000, 52, 'https://images.unsplash.com/photo-1580281657527-47e6ba6c4962?auto=format&fit=crop&w=800&q=60'),
  ('Pédiatrie', 'Cas cliniques et PEC', 'pediatrie', 12000, 40, 'https://images.unsplash.com/photo-1584015936565-c3f6e1440722?auto=format&fit=crop&w=800&q=60');

-- Quelques QCM d'exemple
with c as (select id from public.qcm_categories where slug='medecine' limit 1)
insert into public.qcms (category_id, question, options, answer_index, explanation)
select id, 'Traitement de 1ère intention de l HTA essentielle ?', '["Régime seul","IEC/ARA2","Diurétique","Bêta-bloquant"]'::jsonb, 1, 'IEC/ARA2 privilégiés selon profil' from c;
