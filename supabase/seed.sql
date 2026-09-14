begin;

insert into public.vocabulary
  (id, word, lang, translation, meaning, example, level, tags, created_by)
values
  (1, 'serendipity', 'en', 'السعادة المفاجئة / حسن الحظ', 'The occurrence of happy or beneficial events by chance', 'Finding that old friend at the café was pure serendipity.', 'advanced', array['emotion', 'luck']::text[], 'seed'),
  (2, 'ephemeral', 'en', 'زائل / مؤقت', 'Lasting for a very short time', 'The ephemeral beauty of cherry blossoms makes them more precious.', 'intermediate', array['time', 'nature']::text[], 'seed'),
  (3, 'resilience', 'en', 'المرونة / القدرة على التعافي', 'The ability to recover quickly from difficulties', 'Her resilience after the loss inspired everyone around her.', 'intermediate', array['character', 'strength']::text[], 'seed'),
  (4, 'ambiguous', 'en', 'غامض / ملتبس', 'Open to more than one interpretation; not clear', 'The contract had several ambiguous clauses that caused confusion.', 'intermediate', array['language', 'clarity']::text[], 'seed'),
  (5, 'eloquent', 'en', 'بليغ / فصيح', 'Fluent and persuasive in speaking or writing', 'She gave an eloquent speech that moved the entire audience.', 'intermediate', array['language', 'communication']::text[], 'seed'),
  (6, 'melancholy', 'en', 'حزن عميق / كآبة', 'A deep, persistent feeling of sadness or depression', 'A sense of melancholy settled over him as autumn arrived.', 'intermediate', array['emotion', 'feeling']::text[], 'seed'),
  (7, 'pragmatic', 'en', 'براغماتي / عملي', 'Dealing with things sensibly and realistically', 'We need a pragmatic approach to solve this problem quickly.', 'advanced', array['thinking', 'behavior']::text[], 'seed'),
  (8, 'candid', 'en', 'صريح / صادق', 'Truthful and straightforward; frank', 'I appreciate your candid feedback on my work.', 'beginner', array['character', 'communication']::text[], 'seed'),
  (9, 'tenacious', 'en', 'مثابر / عنيد بإيجابية', 'Holding firmly to a purpose; persistent and determined', 'His tenacious pursuit of the goal finally paid off.', 'advanced', array['character', 'strength']::text[], 'seed'),
  (10, 'subtle', 'en', 'خفي / دقيق', 'So delicate or precise as to be difficult to notice', 'There was a subtle difference in tone between the two paintings.', 'beginner', array['perception', 'detail']::text[], 'seed'),
  (11, 'intuition', 'en', 'الحدس / الإحساس الداخلي', 'The ability to understand something instinctively, without reasoning', 'Her intuition told her something was wrong before anyone spoke.', 'intermediate', array['thinking', 'feeling']::text[], 'seed'),
  (12, 'profound', 'en', 'عميق / بالغ الأثر', 'Having deep meaning or great insight', 'Reading that book had a profound effect on how I see the world.', 'intermediate', array['depth', 'thinking']::text[], 'seed'),
  (13, 'meticulous', 'en', 'دقيق / مدقق', 'Showing great attention to detail; very careful and precise', 'She was meticulous in reviewing every line of the report.', 'advanced', array['behavior', 'work']::text[], 'seed'),
  (14, 'obsolete', 'en', 'متقادم / قديم الطراز', 'No longer in use; out of date', 'That technology became obsolete within just a few years.', 'intermediate', array['technology', 'time']::text[], 'seed'),
  (15, 'empathy', 'en', 'التعاطف / المشاركة الوجدانية', 'The ability to understand and share the feelings of another', 'Good leaders show empathy toward their team members.', 'beginner', array['emotion', 'social']::text[], 'seed'),
  (16, 'ambivalent', 'en', 'متردد / ذو مشاعر متضاربة', 'Having mixed feelings or contradictory ideas about something', 'She felt ambivalent about leaving her hometown for the new job.', 'advanced', array['emotion', 'decision']::text[], 'seed'),
  (17, 'scrutinize', 'en', 'يتفحص / يمحص', 'To examine or inspect closely and thoroughly', 'The committee will scrutinize every detail of the proposal.', 'advanced', array['action', 'analysis']::text[], 'seed'),
  (18, 'lucid', 'en', 'واضح / مفهوم', 'Expressed clearly; easy to understand', 'His lucid explanation made a complex topic easy to grasp.', 'intermediate', array['language', 'clarity']::text[], 'seed'),
  (19, 'nostalgia', 'en', 'الحنين إلى الماضي', 'A sentimental longing for the past', 'The old song filled her with nostalgia for her school days.', 'beginner', array['emotion', 'memory']::text[], 'seed'),
  (20, 'perseverance', 'en', 'المثابرة / الإصرار', 'Continued effort to achieve something despite difficulty', 'His perseverance through years of failure eventually led to success.', 'beginner', array['character', 'strength']::text[], 'seed'),
  (21, 'verbose', 'en', 'مطول / كثير الكلام', 'Using more words than needed; long-winded', 'His verbose report could have been summarized in one page.', 'intermediate', array['language', 'communication']::text[], 'seed'),
  (22, 'altruistic', 'en', 'إيثاري / غير أناني', 'Showing selfless concern for the wellbeing of others', 'Her altruistic nature led her to donate most of her salary to charity.', 'advanced', array['character', 'social']::text[], 'seed'),
  (23, 'cynical', 'en', 'متشكك / سلبي', 'Believing that people are motivated purely by self-interest', 'He became cynical about politics after years of broken promises.', 'intermediate', array['attitude', 'thinking']::text[], 'seed'),
  (24, 'diligent', 'en', 'مجتهد / مثابر', 'Having or showing care in one''s work or duties', 'She was diligent in her studies and rarely missed a class.', 'beginner', array['character', 'work']::text[], 'seed'),
  (25, 'enigmatic', 'en', 'غامض / لغزي', 'Difficult to interpret or understand; mysterious', 'The enigmatic smile on the statue puzzled researchers for decades.', 'advanced', array['mystery', 'perception']::text[], 'seed'),
  (26, 'frugal', 'en', 'مقتصد / موفر', 'Sparing or economical with money or resources', 'Living a frugal lifestyle helped him save enough to retire early.', 'intermediate', array['lifestyle', 'money']::text[], 'seed'),
  (27, 'gregarious', 'en', 'اجتماعي / محب للتجمع', 'Fond of company; sociable', 'She was so gregarious that she made friends everywhere she went.', 'advanced', array['character', 'social']::text[], 'seed'),
  (28, 'haphazard', 'en', 'عشوائي / فوضوي', 'Lacking any obvious principle of organization', 'The files were arranged in a haphazard manner with no clear system.', 'intermediate', array['organization', 'behavior']::text[], 'seed'),
  (29, 'impartial', 'en', 'محايد / غير متحيز', 'Treating all rivals or disputants equally; unbiased', 'A judge must remain impartial throughout the entire trial.', 'intermediate', array['fairness', 'attitude']::text[], 'seed'),
  (30, 'jovial', 'en', 'مرح / بشوش', 'Cheerful and friendly; good-humored', 'His jovial personality made every team meeting enjoyable.', 'intermediate', array['emotion', 'character']::text[], 'seed'),
  (31, 'lethargic', 'en', 'خامل / كسول', 'Affected by lethargy; sluggish and apathetic', 'After the long flight, he felt too lethargic to unpack.', 'intermediate', array['feeling', 'energy']::text[], 'seed'),
  (32, 'mundane', 'en', 'رتيب / عادي', 'Lacking interest or excitement; dull and ordinary', 'Even mundane tasks like washing dishes can be meditative.', 'intermediate', array['lifestyle', 'feeling']::text[], 'seed'),
  (33, 'nonchalant', 'en', 'لامبالٍ / هادئ بشكل ملفت', 'Feeling or appearing casually calm and relaxed', 'He answered the tough question in a nonchalant tone that surprised everyone.', 'advanced', array['attitude', 'behavior']::text[], 'seed'),
  (34, 'obstinate', 'en', 'عنيد / متصلب', 'Stubbornly refusing to change one''s opinion or course of action', 'He was too obstinate to admit he had made a mistake.', 'intermediate', array['character', 'behavior']::text[], 'seed'),
  (35, 'pensive', 'en', 'مفكر / شارد الذهن', 'Engaged in deep or serious thought', 'She sat by the window in a pensive mood, staring at the rain.', 'intermediate', array['thinking', 'feeling']::text[], 'seed'),
  (36, 'quaint', 'en', 'طريف / ذو طابع قديم جميل', 'Attractively unusual or old-fashioned', 'They stayed in a quaint little inn at the edge of the village.', 'advanced', array['aesthetic', 'description']::text[], 'seed'),
  (37, 'redundant', 'en', 'زائد عن الحاجة / مكرر', 'Not or no longer needed; superfluous', 'Several steps in the process were redundant and wasted time.', 'intermediate', array['language', 'work']::text[], 'seed'),
  (38, 'stoic', 'en', 'رابط الجأش / متحمل', 'Enduring pain or hardship without showing feelings or complaining', 'She remained stoic throughout the difficult negotiation.', 'advanced', array['character', 'emotion']::text[], 'seed'),
  (39, 'transient', 'en', 'عابر / مؤقت', 'Lasting only for a short time; impermanent', 'Fame can be transient — here today and forgotten tomorrow.', 'advanced', array['time', 'philosophy']::text[], 'seed'),
  (40, 'whimsical', 'en', 'متقلب / خيالي بطريقة مرحة', 'Playfully quaint or fanciful, especially in an appealing way', 'The children loved the whimsical illustrations in the storybook.', 'advanced', array['aesthetic', 'character']::text[], 'seed'),
  (41, 'allocate', 'en', 'يُخصّص', 'To distribute resources for a particular purpose', 'The government should allocate more funding to public education.', 'intermediate', array['resources', 'planning']::text[], 'seed'),
  (42, 'consequence', 'en', 'نتيجة / عاقبة', 'A result or effect of an action or situation', 'Air pollution is a serious consequence of rapid industrial growth.', 'intermediate', array['cause', 'effect']::text[], 'seed'),
  (43, 'decline', 'en', 'انخفاض / يتراجع', 'To decrease in amount, quality, or importance', 'The report shows a steady decline in unemployment rates.', 'intermediate', array['change', 'trends']::text[], 'seed'),
  (44, 'factor', 'en', 'عامل / عنصر مؤثر', 'Something that influences a result or situation', 'Cost is an important factor when students choose a university.', 'intermediate', array['analysis', 'influence']::text[], 'seed'),
  (45, 'sustainable', 'en', 'مستدام', 'Able to continue without exhausting natural resources', 'Cities need sustainable transport systems to reduce pollution.', 'intermediate', array['environment', 'development']::text[], 'seed')
on conflict do nothing;

select setval(
  pg_get_serial_sequence('public.vocabulary', 'id'),
  greatest((select coalesce(max(id), 1) from public.vocabulary), 1),
  true
);

commit;
