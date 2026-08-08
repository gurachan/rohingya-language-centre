-- RLC Migration 006
-- Corpus System Tables


CREATE TABLE corpus_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(255),
    document_type VARCHAR(100),
    language VARCHAR(50) NOT NULL,
    file_path VARCHAR(500),
    uploaded_by INT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (uploaded_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);


CREATE TABLE corpus_texts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    english_text TEXT,
    hanifi_text TEXT NOT NULL,
    page_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id)
    REFERENCES corpus_documents(id)
    ON DELETE CASCADE
);