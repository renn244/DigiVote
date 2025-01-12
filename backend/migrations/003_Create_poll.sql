-- this will determine if the voting is single choice 
-- single choice: per party
-- multiple choice: per person despite the party
CREATE TYPE vote_type 
AS ENUM ('single', 'multiple');

CREATE TABLE POLL (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    branch VARCHAR(255) NOT NULL,
    -- add a conection with the admins within that branch or something    

    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
    
    vote_type vote_type NOT NULL DEFAULT 'multiple'
);

-- every poll will have a party and a candidate
-- in order to have candidate they must be in a party
CREATE TABLE  PARTIES (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    banner VARCHAR(255), -- will represent the photo of the party

    poll_id INT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES POLL(id) ON DELETE CASCADE,

    UNIQUE(name, poll_id), -- a party can only be in a poll once

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE POSITIONS (
    id SERIAL PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    description TEXT,

    poll_id INT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES POLL(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE CANDIDATES (
    id SERIAL PRIMARY KEY,
    photo VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    party_id INT NOT NULL, -- candidate must be in a party
    FOREIGN KEY (party_id) REFERENCES PARTIES(id) ON DELETE CASCADE,

    position_id INT NOT NULL, -- candidate must have a position that is available in the poll
    FOREIGN KEY (position_id) REFERENCES POSITIONS(id) ON DELETE CASCADE,

    UNIQUE(party_id, position_id), -- a candidate can only have one position in a party
    UNIQUE(name, party_id), -- a candidate can only be in a party once

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DO LATER:
-- Indexes for better performance
CREATE INDEX idx_parties_poll_id ON PARTIES(poll_id);
CREATE INDEX idx_positions_poll_id ON POSITIONS(poll_id);
CREATE INDEX idx_candidates_party_id ON CANDIDATES(party_id);
CREATE INDEX idx_candidates_position_id ON CANDIDATES(position_id);