use ctms;

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Fighting Latte', 'Fighting Latte Description', 5.83, 0.22, 'Espresso', 'Here are some instructions for the Fighting Latte Recipe');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('House Coffee', 'House Description', 3.83, 0.12, 'Coffee', 'Here are some instructions for the House Coffee');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Crazy Train', 'Crazy Train Description', 3.83, 0.22, 'Espresso', 'Here are some instructions for the Crazy Train');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Latte', 'Latte Description', 4.83, 0.41, 'Espresso', 'Here are some instructions for the Latte');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Mocha', 'Mocha Description', 6.03, 0.29, 'Espresso', 'Here are some instructions for the Mocha');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('White Mocha', 'White Mocha Description', 6.03, 0.29, 'Espresso', 'Here are some instructions for the White Mocha');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Creme Brulee\'', 'Creme Brulee\' Description', 4.00, 0.90, 'Espresso', 'Here are some instructions for the Creme Brulee\'');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Almond N\' Joy Latte', 'Almond N\' Joy Latte Description', 4.10, 0.90, 'Espresso', 'Here are some instructions for the Almond N\' Joy Latte');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Beach Day Latte', 'Beach Day Latte Description', 4.50, 0.40, 'Espresso', 'Here are some instructions for the Beach Day Latte');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Americano', 'Americano Description', 2.70, 0.30, 'Espresso', 'Here are some instructions for the Americano');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Cuban', 'Cuban Description', 3.40, 0.90, 'Espresso', 'Here are some instructions for the Cuban');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Bahama Lemonade', 'Bahama Lemonade', 3.49, 0.40, 'Beverage', 'Here are some instructions for the Bahama Lemonade');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Mexican Mocha', 'Mexican Description', 6.33, 0.22, 'Espresso', 'Here are some instructions for the Mexican Mocha');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Black Diamond Mocha', 'Black Diamond Mocha Description', 6.03, 0.11, 'Espresso', 'Here are some instructions for the Black Diamond Mocha');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Hot Chocolate', 'Hot Chocolate Description', 2.03, 0.08, 'Beverage', 'Here are some instructions for Hot Chocolate');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Hot Tea', 'Hot Tea', 1.33, 0.10, 'Tea', 'Here are some instructions for Hot Tea');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Chai Tea', 'Hot Tea', 2.33, 0.10, 'Tea', 'Here are some instructions for Chai Tea');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Bottled Water', 'Bottled Water', 1.00, 0.10, 'Water', 'Here are some instructions for Bottled Water');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Bottled Water', 'Bottled Water', 1.00, 0.10, 'Water', 'Here are some instructions for Bottled Water');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Biscotti', 'Biscotti Description', 1.06, 0.10, 'Food Item', 'Here are some instructions for Biscotti');

insert into menu_item(name, description, price, cost, type, recipeInstructions)
values('Vanilla Scope', 'Vanilla Scope Description', 2.36, 0.30, 'Food Item', 'Here are some instructions for Vanilla Scope');

insert into store(launchDate, storeName, streetAddr1, streetAddr2, city, state, zipcode)
values('2017-01-01', 'Riverwalk', '625 Carson Street', '','Cincinnati', 'OH', '45202');

insert into store(launchDate, storeName, streetAddr1, streetAddr2, city, state, zipcode)
values('2017-09-01', 'Marketplace', '3351 Park Avenue', '', 'Youngsville', 'NM', '87064');

insert into store(launchDate, storeName, streetAddr1, streetAddr2, city, state, zipcode)
values('2018-04-11', 'Boardwalk', '2527 Union Street', '', 'Seattle', 'WA', '98109');

SET SQL_SAFE_UPDATES = 0;

/*** Insert Sales Data ***/

DELIMITER $$
DROP PROCEDURE IF EXISTS seed_sales_with_menu_item $$
DROP PROCEDURE IF EXISTS update_popularity_on_new_sale $$

CREATE PROCEDURE `seed_sales_with_menu_item`()
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
    DECLARE menu_item_id int DEFAULT 0;
    DECLARE menu_item_price float DEFAULT 0;
    DECLARE menu_item_cost float DEFAULT 0;
    DECLARE COUNTER int;
	DECLARE i int;
	DECLARE menu_item_curs CURSOR for (select id, price, cost from menu_item);
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
    SET SQL_SAFE_UPDATES = 0;
    SET COUNTER = 1;
	OPEN menu_item_curs;
	menu_loop: LOOP
    FETCH menu_item_curs INTO menu_item_id, menu_item_price, menu_item_cost;
		IF finished = 1 THEN 
			LEAVE menu_loop;
		END IF;
		
        SET i=1;
		myloop: LOOP
			IF i=COUNTER then
					LEAVE myloop;
			END IF;
            insert into sale(saleDate, menuItemId, storeId, salePrice, saleCost, transactionId)
				values(FROM_UNIXTIME(
        UNIX_TIMESTAMP(CONCAT(CONCAT(DATE_SUB(curdate(), INTERVAL 1 YEAR), ' '), curtime())) + FLOOR(0 + (RAND() * 63072000))
    ), menu_item_id, RAND()*(3-1)+1, menu_item_price, menu_item_cost, RAND()*(99999999-1000)+1000);
             SET i=i+1;
		END LOOP myloop;

	SET COUNTER = COUNTER + 1;
    END LOOP menu_loop;
	CLOSE menu_item_curs;
END$$

CREATE PROCEDURE `update_popularity_on_new_sale`()
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
	DECLARE row_popularity_percent double DEFAULT 0;
    DECLARE row_menu_id int DEFAULT 0;
    DECLARE row_qtySold int DEFAULT 0;
    DECLARE counter int;

	DECLARE menu_sale_mapping_cursor CURSOR FOR (
	SELECT sale.menuItemId, (COUNT(*)/ (select COUNT(*) from sale)) Popularity, Count(*) qtySold from sale
    inner join menu_item
    ON sale.menuItemId = menu_item.id
    group by sale.menuItemId
    order by Popularity DESC
    );
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
     
    SET SQL_SAFE_UPDATES = 0;
    update menu_item set popularity = null;
    
    
    SET counter = 1;
    OPEN menu_sale_mapping_cursor;
	menu_sale_mapping_loop: LOOP
		FETCH menu_sale_mapping_cursor INTO row_menu_id, row_popularity_percent, row_qtySold;
		IF finished = 1 THEN 
			LEAVE menu_sale_mapping_loop;
		END IF;
		-- build email list
          
		  ### call debug_msg(TRUE, row_menu_id);
		  ### call debug_msg(TRUE, row_popularity_percent);
		
        update menu_item set popularity = counter where id = row_menu_id;
        update menu_item set qtySold = row_qtySold where id = row_menu_id;

		SET counter = counter + 1;
	END LOOP menu_sale_mapping_loop;
	CLOSE menu_sale_mapping_cursor;
    
END$$

DELIMITER ;

call seed_sales_with_menu_item();

insert into sale(saleDate, menuItemId, storeId, salePrice, saleCost, transactionId)
	values(FROM_UNIXTIME(
        UNIX_TIMESTAMP(CONCAT(CONCAT(DATE_SUB(curdate(), INTERVAL 1 YEAR), ' '), curtime())) + FLOOR(0 + (RAND() * 63072000))
    ), 8, RAND()*(3-1)+1, 3.83, 1.11, RAND()*(99999999-1000)+1000);
    
/*** Insert Review Data ***/
insert into campaign_event(campaignDate) values(FROM_UNIXTIME(
        UNIX_TIMESTAMP(CONCAT(CONCAT(DATE_SUB(curdate(), INTERVAL 1 YEAR), ' '), curtime())) + FLOOR(0 + (RAND() * 63072000))
    ));

DELIMITER $$
DROP PROCEDURE IF EXISTS seed_reviews_with_menu_item $$
DROP PROCEDURE IF EXISTS update_reviewRank_on_new_review $$

CREATE PROCEDURE `seed_reviews_with_menu_item`()
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
    DECLARE menu_item_id int DEFAULT 0;
    DECLARE COUNTER int;
	DECLARE i int;
	DECLARE menu_item_curs CURSOR for (select id from menu_item ORDER BY ID DESC);
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
    SET SQL_SAFE_UPDATES = 0;
    SET COUNTER = 1;
	OPEN menu_item_curs;
	menu_loop: LOOP
    FETCH menu_item_curs INTO menu_item_id;
		IF finished = 1 THEN 
			LEAVE menu_loop;
		END IF;
		
        SET i=1;
		myloop: LOOP
			IF i=COUNTER then
					LEAVE myloop;
			END IF;
            insert into review(reviewDate, campaignEventId, menuItemId, rating)
				values(FROM_UNIXTIME(
        UNIX_TIMESTAMP(CONCAT(CONCAT(DATE_SUB(curdate(), INTERVAL 1 YEAR), ' '), curtime())) + FLOOR(0 + (RAND() * 63072000))
    ), 1, menu_item_id, RAND()*(9.9-8.0)+8.0);
             SET i=i+1;
		END LOOP myloop;

	SET COUNTER = COUNTER + 1;
    END LOOP menu_loop;
	CLOSE menu_item_curs;
END$$    

DROP PROCEDURE IF EXISTS update_reviewRank_on_new_review $$

CREATE PROCEDURE `update_reviewRank_on_new_review`()
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
	DECLARE row_review_percent double DEFAULT 0;
    DECLARE row_menu_id int DEFAULT 0;
    DECLARE counter int;

	DECLARE menu_review_mapping_cursor CURSOR FOR (
	SELECT  menuItemId, Avg(rating) Average from review
    inner join menu_item
    ON review.menuItemId = menu_item.id
    group by menuItemId
    order by Average DESC
    );
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;
     
    SET SQL_SAFE_UPDATES = 0;
    update menu_item set reviewRank = null;
    
    
    SET counter = 1;
    OPEN menu_review_mapping_cursor;
	menu_review_mapping_loop: LOOP
		FETCH menu_review_mapping_cursor INTO row_menu_id, row_review_percent;
		IF finished = 1 THEN 
			LEAVE menu_review_mapping_loop;
		END IF;
		-- build email list
          
		  ### call debug_msg(TRUE, row_menu_id);
		  ### call debug_msg(TRUE, row_review_percent);
		
        update menu_item set reviewRank = counter where id = row_menu_id;
        update menu_item set averageReviewRating = row_review_percent where id = row_menu_id;

		SET counter = counter + 1;
	END LOOP menu_review_mapping_loop;
	CLOSE menu_review_mapping_cursor;
    
END$$

DELIMITER ;
SET SQL_SAFE_UPDATES = 0;

CALL seed_reviews_with_menu_item();


insert into review(reviewDate, campaignEventId, menuItemId, rating)
	values(FROM_UNIXTIME(
        UNIX_TIMESTAMP(CONCAT(CONCAT(DATE_SUB(curdate(), INTERVAL 1 YEAR), ' '), curtime())) + FLOOR(0 + (RAND() * 63072000))
    ), 1, 8, 9.4);
                
insert into measurement_unit(name, measurementUnitType) values('Pinch', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Dash', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Teaspoon', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Tablespoon', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Fluid Oz', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Cup', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Pint', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Quart', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Gallon', 'Volume');
insert into measurement_unit(name, measurementUnitType) values('Shot', 'Volume');   
insert into measurement_unit(name, measurementUnitType) values('lb.', 'Weight');   
insert into measurement_unit(name, measurementUnitType) values('oz', 'Weight');   

DELIMITER $$
DROP PROCEDURE IF EXISTS insertIngredientWithType $$

CREATE PROCEDURE `insertIngredientWithType`(ingredientName varchar(200), isNut boolean)
BEGIN
	DECLARE refId int DEFAULT 0;
    SET refId = (SELECT ingredientTypeId FROM ingredient_type ORDER BY ingredientTypeId DESC LIMIT 1);
		insert into ingredient(ingredientName, isNut, ingredientTypeId, estCostPerOz) values(ingredientName, isNut, refId, RAND()*(0.20-0.01)+0.01);

    END$$    
DELIMITER ;

insert into ingredient_type(name) values('Seasoning');
CALL insertIngredientWithType('Salt', false);
CALL insertIngredientWithType('Pepper', false);
CALL insertIngredientWithType('Ground Red Pepper', false);
CALL insertIngredientWithType('Green Chile Pepper, Sliced', false);

insert into ingredient_type(name) values('Spice');
CALL insertIngredientWithType('Ginger', false);
CALL insertIngredientWithType('Pumpkin Pie Spice', false);
CALL insertIngredientWithType('Cinnamon', false);
CALL insertIngredientWithType('Ground Cinnamon', false);
CALL insertIngredientWithType('Ground Cloves', false);

insert into ingredient_type(name) values('Dairy');
CALL insertIngredientWithType('2% Milk', false);
CALL insertIngredientWithType('2% Whole Milk', false);
CALL insertIngredientWithType('Skim Milk', false);
CALL insertIngredientWithType('Gelato', false);
CALL insertIngredientWithType('Vanilla Ice Cream', false);
CALL insertIngredientWithType('Eggnog', false);
CALL insertIngredientWithType('Whipped Cream', false);

insert into ingredient_type(name) values('Oil');
CALL insertIngredientWithType('Vegetable Oil', false);
CALL insertIngredientWithType('Coconut Oil', false);

insert into ingredient_type(name) values('Sugar');
CALL insertIngredientWithType('Brown Sugar', false);
CALL insertIngredientWithType('Cane Sugar', false);
CALL insertIngredientWithType('White Sugar', false);

insert into ingredient_type(name) values('Espresso');
CALL insertIngredientWithType('Dark Roast Espresso', false);

insert into ingredient_type(name) values('Coffee');
CALL insertIngredientWithType('Instant Coffee Granules', false);

insert into ingredient_type(name) values('Extract');
CALL insertIngredientWithType('Vanilla Extract', false);

insert into ingredient_type(name) values('Powder');
CALL insertIngredientWithType('Cocoa Powder', false);
CALL insertIngredientWithType('Chocolate Powder', false);
CALL insertIngredientWithType('Unsweetened Cocoa Powder', false);
CALL insertIngredientWithType('Peanut Powder', false);

insert into ingredient_type(name) values('Sweetener');
CALL insertIngredientWithType('Honey', false);

insert into ingredient_type(name) values('Syrup');
CALL insertIngredientWithType('Chocolate Syrup', false);
CALL insertIngredientWithType('Peppermint Flavored Syrup', false);
CALL insertIngredientWithType('Vanilla Flavored Syrup', false);
CALL insertIngredientWithType('Raspberry Flavored Syrup', false);
CALL insertIngredientWithType('Molasses', false);

insert into ingredient_type(name) values('Fruit');
CALL insertIngredientWithType('Banana', false);

insert into ingredient_type(name) values('Seed');
CALL insertIngredientWithType('Almond', true);
CALL insertIngredientWithType('Tree Nut', true);
CALL insertIngredientWithType('Ground Nutmeg', true);
CALL insertIngredientWithType('Red Raspberries', false);

insert into ingredient_type(name) values('Chocolate');
CALL insertIngredientWithType('Cocoa', false);
CALL insertIngredientWithType('Semisweet Chocolate Chips', false);

    UPDATE ingredient SET density = 1.202 where ingredientId = 1;

    UPDATE ingredient SET density = 0.49 where ingredientId = 2;
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 3;
    
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 4;
    
    
    UPDATE ingredient SET density = 0.57 where ingredientId = 5;
    
    
    UPDATE ingredient SET density = 0.38345114 where ingredientId = 6;
    
    
    UPDATE ingredient SET density = 0.56 where ingredientId = 7;
    
    
    UPDATE ingredient SET density = 0.56 where ingredientId = 8;
    
    
    UPDATE ingredient SET density = 0.44 where ingredientId = 9;
    
    
    UPDATE ingredient SET density = 1.04 where ingredientId = 10;
    
    
    UPDATE ingredient SET density = 1.029 where ingredientId = 11;
    

    UPDATE ingredient SET density = 1.02 where ingredientId = 12;
    
    
    UPDATE ingredient SET density = 0.61 where ingredientId = 13;
    
 
     UPDATE ingredient SET density = 0.77 where ingredientId = 14;
    
   
     UPDATE ingredient SET density = 1.07 where ingredientId = 15;
    
    
      UPDATE ingredient SET density = 0.25 where ingredientId = 16;
       
    
	UPDATE ingredient SET density = 0.92 where ingredientId = 17;
       
    
	UPDATE ingredient SET density = 0.92 where ingredientId = 18;
       
    
    UPDATE ingredient SET density = 0.93 where ingredientId = 19;
       
    
    UPDATE ingredient SET density = 0.81 where ingredientId = 20;
          
    
    UPDATE ingredient SET density = 0.85 where ingredientId = 21;
          
    
    UPDATE ingredient SET density = 0.41 where ingredientId = 22;
          
    
    UPDATE ingredient SET density = 0.22 where ingredientId = 23;
          
    
    UPDATE ingredient SET density = 0.88 where ingredientId = 24;
         
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 25;
        
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 26;
       
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 27;
         
    
    UPDATE ingredient SET density = 0.41 where ingredientId = 28;
          
    
    UPDATE ingredient SET density = 1.43 where ingredientId = 29;
       
 
     UPDATE ingredient SET density = 1.15 where ingredientId = 30;
       
   
    UPDATE ingredient SET density = 1.15 where ingredientId = 31;
       
    
    UPDATE ingredient SET density = 1.15 where ingredientId = 32;
       
    
    UPDATE ingredient SET density = 1.15 where ingredientId = 33;
       
    
    UPDATE ingredient SET density = 1.42 where ingredientId = 34;
       
    
    UPDATE ingredient SET density = 0.95 where ingredientId = 35;
       

    UPDATE ingredient SET density = 0.62 where ingredientId = 36;
       

    UPDATE ingredient SET density = 0.62 where ingredientId = 37;
       

    UPDATE ingredient SET density = 0.47 where ingredientId = 38;
       

    UPDATE ingredient SET density = 0.52 where ingredientId = 39;
    
    
    UPDATE ingredient SET density = 0.36 where ingredientId = 40;
	
	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.31
		WHERE measurementUnitId = 1;
	
	UPDATE measurement_unit
		SET mlLitersConversionFactor = 1.62
		WHERE measurementUnitId = 2;
	
	
	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.202884
		WHERE measurementUnitId = 3;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.067628
		WHERE measurementUnitId = 4;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.033814
		WHERE measurementUnitId = 5;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.00422675
		WHERE measurementUnitId = 6;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.00211338
		WHERE measurementUnitId = 7;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.00105669
		WHERE measurementUnitId = 8;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.000264172
		WHERE measurementUnitId = 9;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.0225427
		WHERE measurementUnitId = 10;	
		
	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.002204622622
		WHERE measurementUnitId = 11;	

	UPDATE measurement_unit
		SET mlLitersConversionFactor = 0.035273961952
		WHERE measurementUnitId = 12;	

/* Set 'oz' as default for all ingredients */
UPDATE ingredient SET measurementUnitId = 12;
/* Set measurement to "gallon" where name is like milk*/
UPDATE ingredient SET measurementUnitId = 9 WHERE ingredientName like '%milk%';
	
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(7, 1, 222);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(8, 1, 333);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(3, 1, 2534);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(1, 1, 1453);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(2, 1, 2021);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(4, 1, 4000);
INSERT INTO store_ingredient(ingredientId, storeId, ml)
values(1, 2, 400);

INSERT INTO employee(firstName, lastName) VALUES('Dreda', 'Bernard');
INSERT INTO employee(firstName, lastName) VALUES('Alysia', 'Allsopp');
INSERT INTO employee(firstName, lastName) VALUES('Becca', 'Peyton');
INSERT INTO employee(firstName, lastName) VALUES('Brigham', 'Strickland');
INSERT INTO employee(firstName, lastName) VALUES('Roxana', 'Walterson');
INSERT INTO employee(firstName, lastName) VALUES('Nolan', 'Park');
INSERT INTO employee(firstName, lastName) VALUES('Genie', 'Marlowe');
INSERT INTO employee(firstName, lastName) VALUES('Dorine', 'Martel');
INSERT INTO employee(firstName, lastName) VALUES('Ross', 'Henderson');
INSERT INTO employee(firstName, lastName) VALUES('Sylvia', 'Todd');
INSERT INTO employee(firstName, lastName) VALUES('Troy', 'Grant');
INSERT INTO employee(firstName, lastName) VALUES('Josefina', 'Sanders');
INSERT INTO employee(firstName, lastName) VALUES('Rufus', 'Morgan');
INSERT INTO employee(firstName, lastName) VALUES('Taylor', 'Walton');
INSERT INTO employee(firstName, lastName) VALUES('Adam', 'Padilla');
INSERT INTO employee(firstName, lastName) VALUES('Laurie', 'Watkins');
INSERT INTO employee(firstName, lastName) VALUES('Stuart', 'Santos');
INSERT INTO employee(firstName, lastName) VALUES('Lionel', 'Pope');
INSERT INTO employee(firstName, lastName) VALUES('Sandy', 'Nichols');
INSERT INTO employee(firstName, lastName) VALUES('Dora', 'Lewis');

INSERT INTO store_employee(storeId, employeeId)
SELECT 1 AS storeId, employeeId from employee WHERE employeeId BETWEEN 0 AND 7;

INSERT INTO store_employee(storeId, employeeId)
SELECT 2 AS storeId, employeeId from employee WHERE employeeId BETWEEN 8 AND 13;

INSERT INTO store_employee(storeId, employeeId)
SELECT 3 AS storeId, employeeId from employee WHERE employeeId BETWEEN 14 AND 20;

DELIMITER $$
DROP PROCEDURE IF EXISTS seed_service_survey $$
CREATE PROCEDURE `seed_service_survey`()
BEGIN
	DECLARE COUNT INTEGER DEFAULT 0;
    
	SET COUNT=0;
		myloop: LOOP
			IF COUNT=300 THEN LEAVE myloop;
			END IF;	
            
			INSERT INTO service_survey(storeId, rating, likelyToRecommend, employeeId)
				VALUES (RAND()*(3-1)+1, RAND()*(9.9-4.0)+4.0, ROUND(RAND()), RAND()*(20-1)+1);
                
			SET COUNT=COUNT+1;
		END LOOP myloop;

END$$

CALL seed_service_survey();

	
SET SQL_SAFE_UPDATES = 1;

