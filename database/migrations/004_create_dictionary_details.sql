-- RLC Migration 004
-- Dictionary Details Tables


CREATE TABLE rohingya_meanings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    hanifi_meaning TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE examples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    english_example TEXT NOT NULL,
    rohingya_example TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE synonyms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    synonym VARCHAR(255),

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE antonyms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    antonym VARCHAR(255),

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE related_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    related_word VARCHAR(255),

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE derived_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    derived_word VARCHAR(255),

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE word_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    word_form VARCHAR(255),

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);