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

insert into store(launchDate, storeName)
values('2017-01-01', 'Riverwalk');

DELETE FROM SALE;
SET SQL_SAFE_UPDATES = 0;

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
            insert into sale(saleDate, menuItemId, storeId, salePrice, saleCost)
				values('2021-10-03', menu_item_id, 1, menu_item_price, menu_item_cost);
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
    
    SET SQL_SAFE_UPDATES = 1;
END$$

DELIMITER ;

call seed_sales_with_menu_item();

insert into sale(saleDate, menuItemId, storeId, salePrice, saleCost)
	values('2021-10-03', 8, 1, 3.83, 1.11);


