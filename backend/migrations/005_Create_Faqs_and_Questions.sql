
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,

    branch VARCHAR(255) NOT NULL, -- i don't know if this is needed here
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,

    question TEXT NOT NULL,

    asked_by_id INT,
    asked_by FOREIGN KEY (asked_by_id) REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,

    answer TEXT NOT NULL,

    answered_by_id INT,
    answered_by REFERENCES (answered_by_id) REFERENCES users(id) ON DELETE,

    created_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,

    question_id INT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES answers(id) ON DELETE CASCADe,

    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);