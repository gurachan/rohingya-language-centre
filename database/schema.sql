-- ==========================================
-- Rohingya Language Centre (RLC)
-- Database Schema
-- Version 1.0
-- ==========================================

USE railway;
-- ==========================================
-- 001 USERS TABLE
-- ==========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
    'admin',
    'reviewer',
    'translator',
    'contributor',
    'registered_user'
) DEFAULT 'registered_user',
    status VARCHAR(50) DEFAULT 'active',

    last_login TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
-- ==========================================
-- 002 CATEGORIES TABLE
-- ==========================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
-- ==========================================
-- 003 DICTIONARY WORDS TABLE
-- ==========================================

CREATE TABLE dictionary_words (

    id INT AUTO_INCREMENT PRIMARY KEY,

    english_word VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
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
-- ==========================================
-- 004 ROHINGYA MEANINGS TABLE
-- ==========================================

CREATE TABLE rohingya_meanings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,
    script VARCHAR(100) DEFAULT 'Hanifi Rohingya',

    direction ENUM(
       'rtl',
       'ltr'
) DEFAULT 'rtl',
    hanifi_meaning TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_meaning_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 005 EXAMPLES TABLE
-- ==========================================

CREATE TABLE examples (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    english_example TEXT NOT NULL,

    hanifi_example TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_example_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 006 SYNONYMS TABLE
-- ==========================================

CREATE TABLE synonyms (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    synonym VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_synonym_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 007 ANTONYMS TABLE
-- ==========================================

CREATE TABLE antonyms (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    antonym VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_antonym_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 008 RELATED WORDS TABLE
-- ==========================================

CREATE TABLE related_words (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    related_word VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_related_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 009 DERIVED WORDS TABLE
-- ==========================================

CREATE TABLE derived_words (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    derived_word VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_derived_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 010 WORD FORMS TABLE
-- ==========================================

CREATE TABLE word_forms (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    word_form VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_word_form_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 011 IMAGES TABLE
-- ==========================================

CREATE TABLE images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    image_path VARCHAR(500) NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_image_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 012 AUDIO TABLE
-- ==========================================

CREATE TABLE audio (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    language ENUM(
        'english',
        'rohingya'
    ) NOT NULL,

    audio_path VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_audio_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 013 CORPUS DOCUMENTS TABLE
-- ==========================================

CREATE TABLE corpus_documents (

    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(500) NOT NULL,

    description TEXT,

    document_type VARCHAR(100),

    language ENUM(
        'rohingya',
        'english',
        'mixed'
    ) DEFAULT 'rohingya',

    file_path VARCHAR(500),

    uploaded_by INT,

    status ENUM(
        'draft',
        'review',
        'approved',
        'archived'
    ) DEFAULT 'draft',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_corpus_document_user

        FOREIGN KEY (uploaded_by)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE
);
-- ==========================================
-- 014 CORPUS SENTENCES TABLE
-- ==========================================

CREATE TABLE corpus_sentences (

    id INT AUTO_INCREMENT PRIMARY KEY,

    document_id INT NOT NULL,

    sentence_text TEXT NOT NULL,

    language ENUM(
        'rohingya',
        'english',
        'mixed'
    ) DEFAULT 'rohingya',

    translated_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_sentence_document

        FOREIGN KEY (document_id)

        REFERENCES corpus_documents(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 015 CORPUS CONTRIBUTORS TABLE
-- ==========================================

CREATE TABLE corpus_contributors (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    contribution_type VARCHAR(100),

    language ENUM(
        'rohingya',
        'english',
        'mixed'
    ) DEFAULT 'rohingya',

    user_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_contributor_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE
);
-- ==========================================
-- 016 REPORTS TABLE
-- ==========================================

CREATE TABLE reports (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    word_id INT,

    report_type ENUM(
        'translation_error',
        'definition_error',
        'example_error',
        'audio_error',
        'image_error',
        'other'
    ) NOT NULL,

    description TEXT NOT NULL,

    status ENUM(
        'pending',
        'reviewing',
        'resolved',
        'rejected'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_report_user

        FOREIGN KEY (user_id)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE,


    CONSTRAINT fk_report_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE
);
-- ==========================================
-- 017 REVIEWS TABLE
-- ==========================================

CREATE TABLE reviews (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    reviewer_id INT,

    review_status ENUM(
        'pending',
        'approved',
        'rejected'
    ) DEFAULT 'pending',

    comments TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_review_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,


    CONSTRAINT fk_review_reviewer

        FOREIGN KEY (reviewer_id)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE
);
-- ==========================================
-- 018 WORD HISTORY TABLE
-- ==========================================

CREATE TABLE word_history (

    id INT AUTO_INCREMENT PRIMARY KEY,

    word_id INT NOT NULL,

    changed_by INT,

    old_content TEXT,

    new_content TEXT,

    change_note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_history_word

        FOREIGN KEY (word_id)

        REFERENCES dictionary_words(id)

        ON DELETE CASCADE

        ON UPDATE CASCADE,


    CONSTRAINT fk_history_user

        FOREIGN KEY (changed_by)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE
);
-- ==========================================
-- 019 SETTINGS TABLE
-- ==========================================

CREATE TABLE settings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    setting_key VARCHAR(255) UNIQUE NOT NULL,

    setting_value TEXT,

    description TEXT,

    updated_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_setting_user

        FOREIGN KEY (updated_by)

        REFERENCES users(id)

        ON DELETE SET NULL

        ON UPDATE CASCADE
);