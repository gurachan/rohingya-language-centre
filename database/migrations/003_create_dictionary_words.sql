 -- ==========================================
-- 003 DICTIONARY WORDS TABLE
-- Rohingya Language Centre (RLC) Version 1.0
-- ==========================================

CREATE TABLE dictionary_words (

    id INT AUTO_INCREMENT PRIMARY KEY,

    english_word VARCHAR(255) NOT NULL,

    ipa VARCHAR(255),

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


    category_id INT,

    created_by INT,


    status ENUM(
        'draft',
        'pending_review',
        'published',
        'archived'
    ) DEFAULT 'draft',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_dictionary_category

        FOREIGN KEY (category_id)

        REFERENCES categories(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE,


    CONSTRAINT fk_dictionary_creator

        FOREIGN KEY (created_by)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE

);