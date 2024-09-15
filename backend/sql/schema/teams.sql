DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    location TEXT,
    name TEXT,
    team_abbr TEXT,
    division TEXT,
    conference TEXT,
    primary_color TEXT,
    secondary_color TEXT
);

DROP TABLE IF EXISTS release_notes;
CREATE TABLE release_notes (
    release_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date DATETIME NOT NULL,
    author TEXT NOT NULL,
    note TEXT NOT NULL,
    github_link TEXT
);
