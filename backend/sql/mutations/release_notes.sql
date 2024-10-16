-- Release Notes Table (located in the team database because I didn't know where else to put it)
INSERT INTO release_notes (title, date, author, note, github_link)
VALUES
('Leaderboard', '2024-09-25 20:06:07', 'Bennett Summy', 'Updated leaderboard tab to include goalie and team data. Improved site responsiveness with quicker filters, and less data requests.', 'https://github.com/neilpl24/pierreanalyticsource/pull/44'),
('Landing Page', '2024-09-26 14:12:59', 'Bennett Summy', 'Created a new landing page to display release notes, and links to twitter/X feeds.', 'https://github.com/neilpl24/pierreanalyticsource/pull/50'),
('Gamescore', '2024-09-12 09:08:00', 'Neil Pierre-Louis', 'Built a gamescore metric, and created the accompanying D3.js chart.', 'https://github.com/neilpl24/pierreanalyticsource/pull/45'),
('Dark Mode', '2024-10-14 09:08:00', 'Neil Pierre-Louis', 'Added a dark mode toggle + small bug fixes', 'https://github.com/neilpl24/pierreanalyticsource/pull/52'),
('Landing Page', '2024-10-16 09:08:00', 'Bennett Summy', 'Moved dark mode toggle to the landing page to improve the mobile nav.', 'https://github.com/neilpl24/pierreanalyticsource/pull/53');
