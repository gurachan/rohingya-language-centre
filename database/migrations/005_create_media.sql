-- RLC Migration 005
-- Media Tables


CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);


CREATE TABLE audio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    audio_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE
);