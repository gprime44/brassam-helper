INSERT INTO fermentables (id, name, type, color_ebc, yield_percentage, protein) VALUES (1, 'Pilsner', 'GRAIN', 3.0, 80.0, 11.5);
INSERT INTO fermentables (id, name, type, color_ebc, yield_percentage, protein) VALUES (2, 'Maris Otter', 'GRAIN', 6.0, 81.0, 10.5);
INSERT INTO fermentables (id, name, type, color_ebc, yield_percentage, protein) VALUES (3, 'Crystal 150', 'GRAIN', 150.0, 75.0, 12.0);

INSERT INTO hops (id, name, alpha_acid, origin) VALUES (1, 'Saaz', 3.5, 'Czech Republic');
INSERT INTO hops (id, name, alpha_acid, origin) VALUES (2, 'Cascade', 7.0, 'US');

INSERT INTO yeasts (id, name, attenuation_min, attenuation_max, type, alcohol_tolerance) VALUES (1, 'US-05', 78, 82, 'ALE', 11);
INSERT INTO yeasts (id, name, attenuation_min, attenuation_max, type, alcohol_tolerance) VALUES (2, 'S-04', 72, 76, 'ALE', 10);
