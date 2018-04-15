DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
-- DROP products
CREATE TABLE products (
id 				INT(10) 		NOT 	NULL AUTO_INCREMENT,
product_name 	VARCHAR(30),
department_name VARCHAR(30), 
price			DECIMAL(10, 2),
stock_quantity	INT(10),
PRIMARY KEY (id)
);

INSERT INTO products 	(product_name, department_name, price, stock_quantity) VALUES
("Food Pills",	"Edibles",	2.00,		500),
("Akimichi Pills",	"Edibles",	8.00,		100),
("Hero Water",	"Edibles",	200.00,		50),
("Scroll of Sealing",	"Data",		5000.00,	2),
("Ninja Info Cards",	"Data",		2.00,		500),
("Forehead Protector", 	"Armor", 	30.00, 		120),
("Green Ninja Vest",	"Armor",	60.00, 		300),
("Blue Ninja Shirt",	"Armor",	30.00, 		600),
("Blue Ninja Pants",	"Armor",	30.00, 		600),
("Kunai Knives",	"Weapon", 	20.00, 		1500),
("Small Shuriken",	"Weapon", 	15.00, 		3000),
("Giant Shuriken",	"Weapon",	40.00, 		600),
("Makibishi Spykes",	"Weapon", 	3.00, 		8400),
("Exploding Notes",	"Weapon", 	2.00, 		12000),
("Senbon Needles",	"Weapon", 	1.00, 		30000),
("Smoke Bomb",	"Weapon",	5.00, 		900),
("Flash Bomb",	"Weapon",	5.00, 		600),
("Fist Sword",	"Weapon",	60.00,		10);

						
			
						
SELECT * FROM products;		

			

