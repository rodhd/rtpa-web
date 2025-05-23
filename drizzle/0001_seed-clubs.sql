-- Custom SQL migration file, put your code below! --
-- Custom SQL migration file, put you code below! --
INSERT INTO "clubs" ("name", "address", "website") VALUES
('Club A', '987 Mark St', 'http://example.com'),
('Club B', '654 Hickory Av', 'http://example.com'),
('Club C', '321 Maple Dr', 'http://example.com');

INSERT INTO "courts" ("name", "type", "surface", "location", "club_id") VALUES
('Court 1', 'tennis', 'clay', 'outdoor', 1),
('Court 2', 'tennis', 'clay', 'outdoor', 1),
('Court 3', 'paddel', 'hard', 'indoor', 1),
('Court 4', 'paddel', 'hard', 'indoor', 2),
('Court 5', 'tennis', 'grass', 'outdoor', 2),
('Court 6', 'tennis', 'grass', 'outdoor', 3),
('Court 7', 'paddel', 'hard', 'indoor', 3),
('Court 8', 'paddel', 'hard', 'indoor', 3);