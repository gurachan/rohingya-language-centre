CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'owner',
        'super_admin',
        'dictionary_manager',
        'dictionary_editor',
        'translator',
        'reviewer',
        'audio_editor',
        'image_editor',
        'registered_user',
        'guest'
    ) DEFAULT 'registered_user',

    status ENUM(
        'active',
        'inactive',
        'blocked'
    ) DEFAULT 'active',

    last_login DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);