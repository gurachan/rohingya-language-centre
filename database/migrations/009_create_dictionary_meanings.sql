-- ==========================================
-- 009 DICTIONARY MEANINGS TABLE
-- ==========================================

CREATE TABLE dictionary_meanings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    meaning_order INT DEFAULT 1,

    part_of_speech ENUM(
        'noun',
        'verb',
        'adjective',
        'adverb',
        'pronoun',
        'preposition',
        'conjunction',
        'interjection',
        'phrase',
        'idiom',
        'abbreviation',
        'other'
    ) NOT NULL,

    english_definition TEXT NOT NULL,

    hanifi_meaning TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_dictionary_meanings_word
    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);