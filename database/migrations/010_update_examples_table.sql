-- ==========================================
-- 010 UPDATE EXAMPLES TABLE
-- ==========================================

ALTER TABLE examples
ADD CONSTRAINT fk_example_meaning
FOREIGN KEY (meaning_id)
REFERENCES dictionary_meanings(id)
ON DELETE CASCADE;

ALTER TABLE examples
DROP FOREIGN KEY fk_example_word;

ALTER TABLE examples
DROP COLUMN word_id;