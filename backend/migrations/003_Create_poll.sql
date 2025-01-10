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

CREATE TABLE  PARTIES (

);

CREATE TABLE CANDIDATES (

);
-- maybe add like course eligable