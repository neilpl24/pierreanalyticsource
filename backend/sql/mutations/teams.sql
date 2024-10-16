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


INSERT INTO teams (team_name, location, name, team_abbr, division, conference, primary_color, secondary_color)
VALUES
('Anaheim Ducks', 'Anaheim', 'Ducks', 'ANA', 'Pacific', 'Western', '#B9975B', '#000000'),
('Utah Hockey Club', 'Utah', 'Hockey Club', 'UTA', 'Central', 'Western', '#6CADE5', '#000000'),
('Boston Bruins', 'Boston', 'Bruins', 'BOS', 'Atlantic', 'Eastern', '#FFB81C', '#000000'),
('Buffalo Sabres', 'Buffalo', 'Sabres', 'BUF', 'Atlantic', 'Eastern', '#002654', '#FDBB30'),
('Calgary Flames', 'Calgary', 'Flames', 'CGY', 'Pacific', 'Western', '#C8102E', '#F1BE48'),
('Carolina Hurricanes', 'Raleigh', 'Hurricanes', 'CAR', 'Metropolitan', 'Eastern', '#CC0000', '#000000'),
('Chicago Blackhawks', 'Chicago', 'Blackhawks', 'CHI', 'Central', 'Western', '#CF0A2C', '#000000'),
('Colorado Avalanche', 'Denver', 'Avalanche', 'COL', 'Central', 'Western', '#6F263D', '#236192'),
('Columbus Blue Jackets', 'Columbus', 'Blue Jackets', 'CBJ', 'Metropolitan', 'Eastern', '#002654', '#CE1126'),
('Dallas Stars', 'Dallas', 'Stars', 'DAL', 'Central', 'Western', '#00843D', '#000000'),
('Detroit Red Wings', 'Detroit', 'Red Wings', 'DET', 'Atlantic', 'Eastern', '#CE1126', '#FFFFFF'),
('Edmonton Oilers', 'Edmonton', 'Oilers', 'EDM', 'Pacific', 'Western', '#FF4C00', '#003876'),
('Florida Panthers', 'Sunrise', 'Panthers', 'FLA', 'Atlantic', 'Eastern', '#041E42', '#C8102E'),
('Los Angeles Kings', 'Los Angeles', 'Kings', 'LAK', 'Pacific', 'Western', '#A2AAAD', '#000000'),
('Minnesota Wild', 'Saint Paul', 'Wild', 'MIN', 'Central', 'Western', '#154734', '#DDCBA4'),
('Montreal Canadiens', 'Montreal', 'Canadiens', 'MTL', 'Atlantic', 'Eastern', '#AF1E2D', '#192168'),
('Nashville Predators', 'Nashville', 'Predators', 'NSH', 'Central', 'Western', '#FFB81C', '#041E42'),
('New Jersey Devils', 'Newark', 'Devils', 'NJD', 'Metropolitan', 'Eastern', '#CE1126', '#000000'),
('New York Islanders', 'Uniondale', 'Islanders', 'NYI', 'Metropolitan', 'Eastern', '#00539B', '#F47D30'),
('New York Rangers', 'New York', 'Rangers', 'NYR', 'Metropolitan', 'Eastern', '#0033A0', '#CE1126'),
('Ottawa Senators', 'Ottawa', 'Senators', 'OTT', 'Atlantic', 'Eastern', '#E31837', '#C69214'),
('Philadelphia Flyers', 'Philadelphia', 'Flyers', 'PHI', 'Metropolitan', 'Eastern', '#F74902', '#000000'),
('Pittsburgh Penguins', 'Pittsburgh', 'Penguins', 'PIT', 'Metropolitan', 'Eastern', '#FCB514', '#000000'),
('San Jose Sharks', 'San Jose', 'Sharks', 'SJS', 'Pacific', 'Western', '#006D75', '#EA7200'),
('Seattle Kraken', 'Seattle', 'Kraken', 'SEA', 'Pacific', 'Western', '#001628', '#99D9D9'),
('St. Louis Blues', 'St. Louis', 'Blues', 'STL', 'Central', 'Western', '#002F87', '#FFD100'),
('Tampa Bay Lightning', 'Tampa', 'Lightning', 'TBL', 'Atlantic', 'Eastern', '#00205B', '#FFFFFF'),
('Toronto Maple Leafs', 'Toronto', 'Maple Leafs', 'TOR', 'Atlantic', 'Eastern', '#00205B', '#FFFFFF'),
('Vancouver Canucks', 'Vancouver', 'Canucks', 'VAN', 'Pacific', 'Western', '#00205B', '#00843D'),
('Vegas Golden Knights', 'Paradise', 'Golden Knights', 'VGK', 'Pacific', 'Western', '#B4975A', '#333F42'),
('Washington Capitals', 'Washington', 'Capitals', 'WSH', 'Metropolitan', 'Eastern', '#041E42', '#C8102E'),
('Winnipeg Jets', 'Winnipeg', 'Jets', 'WPG', 'Central', 'Western', '#041E42', '#004C97');
