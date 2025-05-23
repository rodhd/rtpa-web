-- Custom SQL migration file, put you code below! --
INSERT INTO "clubs" ("name", "address", "website") VALUES
('Club D', '987 Mark St', 'http://example.com'),
('Club E', '654 Hickory Av', 'http://example.com');

INSERT INTO "courts" ("name", "type", "surface", "location", "club_id") VALUES
('Court 1', 'tennis', 'clay', 'outdoor', 4),
('Court 2', 'tennis', 'clay', 'outdoor', 4),
('Court 3', 'paddel', 'hard', 'indoor', 4),
('Court 4', 'paddel', 'hard', 'indoor', 4),
('Court 5', 'tennis', 'grass', 'outdoor', 5),
('Court 6', 'tennis', 'grass', 'outdoor', 5),
('Court 7', 'paddel', 'hard', 'indoor', 5),
('Court 8', 'paddel', 'hard', 'indoor', 5);