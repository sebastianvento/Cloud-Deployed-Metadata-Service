-- Legacy metadata schema simulating on-prem relational system.
-- Contains intentionally inconsistent genre values to test ETL normalization.

CREATE TABLE videos (
id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
title VARCHAR (250) NOT NULL,
description TEXT,
release_year INT NOT NULL,
duration_minutes INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE (title, release_year)
);

CREATE TABLE genres (
id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name VARCHAR(250) NOT NULL);

CREATE TABLE video_genres (
video_id INTEGER NOT NULL,
genre_id INTEGER NOT NULL,
PRIMARY KEY (video_id, genre_id),
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

INSERT INTO genres (name) VALUES
('Romance'),
('romance'),
('Horror'),
('HORROR'),
('Documentary'),
(' Action '),
('Drama'),
('drama'),
('Sci-Fi'),
('SCI-FI');

INSERT INTO videos (title, description, release_year, duration_minutes) VALUES
('Deep Love', 'Romantic drama.', 2020, 102),
('Haunted Manor', 'Classic horror story.', 2020, 99),
('Galaxy Wars', 'Sci-fi saga.', 2021, 140),
('Stand Up Pro', 'Comedy special.', 2021, 88),
('The Unknown Case', 'Mystery thriller.', 2021, 115),
('Nature World', 'Wildlife documentary.', 2019, 90),
('Action Reloaded', 'Explosive action film.', 2019, 125),
('Silent Night', 'Holiday drama.', 2018, 105);

INSERT INTO video_genres (video_id, genre_id) VALUES

-- Deep Love
(1, 1),
(1, 7),

-- Haunted Manor
(2, 3),
(2, 4),

-- Galaxy Wars
(3, 9),
(3, 10),

-- Stand Up Pro
(4, 7),

-- The Unknown Case
(5, 7),
(5, 8),

-- Nature World
(6, 5),

-- Action Reloaded
(7, 6),

-- Silent Night
(8, 7);