USE rlc_database;

INSERT INTO users
(
    full_name,
    email,
    password_hash,
    role,
    status
)
VALUES
(
    'Project Owner',
    'owner@rlc.org',
    '$2b$10$abcdefghijklmnopqrstuv',
    'owner',
    'active'
);