-- RLC Migration 007
-- Reports System Table


CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,
    word_id INT,

    report_type VARCHAR(100) NOT NULL,

    description TEXT NOT NULL,

    status VARCHAR(50) DEFAULT 'pending',

    reviewed_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,


    FOREIGN KEY (word_id)
    REFERENCES dictionary_words(id)
    ON DELETE CASCADE,


    FOREIGN KEY (reviewed_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);