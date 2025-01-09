
CREATE TABLE refreshtokens (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiresAt TIMESTAMPTZ
);