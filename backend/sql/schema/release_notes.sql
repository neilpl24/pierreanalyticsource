DROP TABLE IF EXISTS release_notes;
CREATE TABLE release_notes (
    release_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date DATETIME NOT NULL,
    author TEXT NOT NULL,
    note TEXT NOT NULL,
    github_link TEXT
);
