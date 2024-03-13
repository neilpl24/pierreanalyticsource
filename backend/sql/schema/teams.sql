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
