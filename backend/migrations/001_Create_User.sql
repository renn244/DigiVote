CREATE TYPE roles 
AS ENUM ('admin', 'user');

CREATE TYPE education_level
AS ENUM ('senior_highschool', 'tertiary');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role roles NOT NULL DEFAULT 'user',
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    profile VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- student information
    education_level education_level NOT NULL,
    student_id VARCHAR(255) NOT NULL UNIQUE,
    year_level VARCHAR(10) NOT NULL,
    course     VARCHAR(10) NOT NULL, -- course or department or strand

    branch VARCHAR(255) NOT NULL,
);

CREATE TABLE emailVerify (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(255) NOT NULL
);

CREATE TABLE userplaceholder (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    
    -- student information
    education_level VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL UNIQUE,
    year_level VARCHAR(10) NOT NULL,
    course     VARCHAR(10) NOT NULL, -- course or department or strand

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES emailVerify(email) 
        ON DELETE CASCADE
);

CREATE TABLE passwordCode (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(255) NOT NULL
);