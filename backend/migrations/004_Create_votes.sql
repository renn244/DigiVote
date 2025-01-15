
-- this is where the poll is going to be connected
CREATE TABLE VOTES (
    id SERIAL PRIMARY KEY,

    poll_id INT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES POLL(id) ON DELETE CASCADE,

    user_id INT NOT NULL, -- to identify the user that voted
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,

    UNIQUE(poll_id, user_id), -- a user can only vote once in a poll

    created_at TIMESTAMPTZ DEFAULT NOW(), -- this is the time the person voted
);

-- this is the individual vote for all the candidate that is 
-- going to be connected to the cadidatesvoted
CREATE TABLE CANDIDATESVOTED (
    id SERIAL PRIMARY KEY,

    vote_id INT NOT NULL,
    FOREIGN KEY (vote_id) REFERENCES VOTES(id) ON DELETE CASCADE,

    candidate_id INT NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES CANDIDATES(id) ON DELETE CASCADE,

    UNIQUE (vote_id, candidate_id), -- a user can only vote for a candidate once
);