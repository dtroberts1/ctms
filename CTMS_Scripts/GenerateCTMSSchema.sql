-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema ctms
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ctms` ;

-- -----------------------------------------------------
-- Schema ctms
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ctms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `ctms` ;

-- -----------------------------------------------------
-- Table `ctms`.`campaign_event`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`campaign_event` ;

CREATE TABLE IF NOT EXISTS `ctms`.`campaign_event` (
  `campaignId` INT NOT NULL AUTO_INCREMENT,
  `campaignDate` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`campaignId`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`ingredient_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`ingredient_type` ;

CREATE TABLE IF NOT EXISTS `ctms`.`ingredient_type` (
  `ingredientTypeId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`ingredientTypeId`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`measurement_unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`measurement_unit` ;

CREATE TABLE IF NOT EXISTS `ctms`.`measurement_unit` (
  `measurementUnitId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `measurementUnitType` VARCHAR(30) NULL DEFAULT NULL,
  `mlLitersConversionFactor` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`measurementUnitId`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`ingredient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`ingredient` ;

CREATE TABLE IF NOT EXISTS `ctms`.`ingredient` (
  `ingredientId` INT NOT NULL AUTO_INCREMENT,
  `ingredientName` VARCHAR(200) NULL DEFAULT NULL,
  `UPC` VARCHAR(13) NULL DEFAULT NULL,
  `isNut` TINYINT(1) NULL DEFAULT NULL,
  `ingredientTypeId` INT NULL DEFAULT NULL,
  `measurementUnitId` INT NULL DEFAULT NULL,
  `density` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`ingredientId`),
  INDEX `ingredientTypeId` (`ingredientTypeId` ASC) VISIBLE,
  INDEX `measurementUnitId` (`measurementUnitId` ASC) VISIBLE,
  CONSTRAINT `ingredient_ibfk_1`
    FOREIGN KEY (`ingredientTypeId`)
    REFERENCES `ctms`.`ingredient_type` (`ingredientTypeId`),
  CONSTRAINT `ingredient_ibfk_2`
    FOREIGN KEY (`measurementUnitId`)
    REFERENCES `ctms`.`measurement_unit` (`measurementUnitId`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`partner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`partner` ;

CREATE TABLE IF NOT EXISTS `ctms`.`partner` (
  `partnerId` INT NOT NULL AUTO_INCREMENT,
  `partnerName` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`partnerId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`ingredient_partner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`ingredient_partner` ;

CREATE TABLE IF NOT EXISTS `ctms`.`ingredient_partner` (
  `partnerId` INT NULL DEFAULT NULL,
  `ingredientId` INT NULL DEFAULT NULL,
  `cost` FLOAT NULL DEFAULT NULL,
  INDEX `partnerId` (`partnerId` ASC) VISIBLE,
  INDEX `ingredientId` (`ingredientId` ASC) VISIBLE,
  CONSTRAINT `ingredient_partner_ibfk_1`
    FOREIGN KEY (`partnerId`)
    REFERENCES `ctms`.`partner` (`partnerId`)
    ON DELETE CASCADE,
  CONSTRAINT `ingredient_partner_ibfk_2`
    FOREIGN KEY (`ingredientId`)
    REFERENCES `ctms`.`ingredient` (`ingredientId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`menu_item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`menu_item` ;

CREATE TABLE IF NOT EXISTS `ctms`.`menu_item` (
  `name` VARCHAR(40) NULL DEFAULT NULL,
  `description` VARCHAR(260) NULL DEFAULT NULL,
  `price` DECIMAL(5,2) NULL DEFAULT NULL,
  `cost` DECIMAL(5,2) NULL DEFAULT NULL,
  `popularity` TINYINT NULL DEFAULT NULL,
  `reviewRank` TINYINT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(50) NULL DEFAULT NULL,
  `averageReviewRating` FLOAT NULL DEFAULT NULL,
  `qtySold` INT NULL DEFAULT NULL,
  `recipeInstructions` VARCHAR(280) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`menu_item_ingredient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`menu_item_ingredient` ;

CREATE TABLE IF NOT EXISTS `ctms`.`menu_item_ingredient` (
  `menuItemId` INT NULL DEFAULT NULL,
  `ingredientId` INT NULL DEFAULT NULL,
  `measurementUnitId` INT NULL DEFAULT NULL,
  `ingredientQty` INT NULL DEFAULT NULL,
  INDEX `menuItemId` (`menuItemId` ASC) VISIBLE,
  INDEX `ingredientId` (`ingredientId` ASC) VISIBLE,
  INDEX `measurementUnitId` (`measurementUnitId` ASC) VISIBLE,
  CONSTRAINT `menu_item_ingredient_ibfk_1`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `menu_item_ingredient_ibfk_2`
    FOREIGN KEY (`ingredientId`)
    REFERENCES `ctms`.`ingredient` (`ingredientId`)
    ON DELETE CASCADE,
  CONSTRAINT `menu_item_ingredient_ibfk_3`
    FOREIGN KEY (`measurementUnitId`)
    REFERENCES `ctms`.`measurement_unit` (`measurementUnitId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`ml_conversion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`ml_conversion` ;

CREATE TABLE IF NOT EXISTS `ctms`.`ml_conversion` (
  `measurementUnitId` INT NULL DEFAULT NULL,
  `conversionFactor` DOUBLE NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`review` ;

CREATE TABLE IF NOT EXISTS `ctms`.`review` (
  `reviewId` INT NOT NULL AUTO_INCREMENT,
  `reviewDate` DATETIME NULL DEFAULT NULL,
  `campaignEventId` INT NULL DEFAULT NULL,
  `menuItemId` INT NULL DEFAULT NULL,
  `rating` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`reviewId`),
  INDEX `campaignEventId` (`campaignEventId` ASC) VISIBLE,
  INDEX `menuItemId` (`menuItemId` ASC) VISIBLE,
  CONSTRAINT `review_ibfk_2`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_3`
    FOREIGN KEY (`campaignEventId`)
    REFERENCES `ctms`.`campaign_event` (`campaignId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`store`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`store` ;

CREATE TABLE IF NOT EXISTS `ctms`.`store` (
  `storeId` INT NOT NULL AUTO_INCREMENT,
  `launchDate` DATETIME NULL DEFAULT NULL,
  `storeName` VARCHAR(90) NULL DEFAULT NULL,
  PRIMARY KEY (`storeId`))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`sale`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`sale` ;

CREATE TABLE IF NOT EXISTS `ctms`.`sale` (
  `saleId` INT NOT NULL AUTO_INCREMENT,
  `saleDate` DATETIME NULL DEFAULT NULL,
  `menuItemId` INT NULL DEFAULT NULL,
  `storeId` INT NULL DEFAULT NULL,
  `salePrice` DECIMAL(5,2) NULL DEFAULT NULL,
  `saleCost` DECIMAL(5,2) NULL DEFAULT NULL,
  `transactionId` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`saleId`),
  INDEX `storeId` (`storeId` ASC) VISIBLE,
  INDEX `menuItemId` (`menuItemId` ASC) VISIBLE,
  CONSTRAINT `sale_ibfk_1`
    FOREIGN KEY (`storeId`)
    REFERENCES `ctms`.`store` (`storeId`)
    ON DELETE CASCADE,
  CONSTRAINT `sale_ibfk_2`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`store_ingredient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`store_ingredient` ;

CREATE TABLE IF NOT EXISTS `ctms`.`store_ingredient` (
  `ingredientId` INT NULL DEFAULT NULL,
  `storeId` INT NULL DEFAULT NULL,
  `mL` INT NULL DEFAULT NULL,
  `ingredientQty` INT NULL DEFAULT NULL,
  UNIQUE INDEX `ingredientId` (`ingredientId` ASC, `storeId` ASC) VISIBLE,
  INDEX `storeId` (`storeId` ASC) VISIBLE,
  CONSTRAINT `store_ingredient_ibfk_1`
    FOREIGN KEY (`ingredientId`)
    REFERENCES `ctms`.`ingredient` (`ingredientId`),
  CONSTRAINT `store_ingredient_ibfk_2`
    FOREIGN KEY (`storeId`)
    REFERENCES `ctms`.`store` (`storeId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `ctms` ;

-- -----------------------------------------------------
-- procedure debug_msg
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`debug_msg`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `debug_msg`(enabled INTEGER, msg VARCHAR(255))
BEGIN
  IF enabled THEN
    select concat('** ', msg) AS '** DEBUG:';
  END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insertIngredientWithType
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`insertIngredientWithType`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertIngredientWithType`(ingredientName varchar(200), isNut boolean)
BEGIN
	DECLARE refId int DEFAULT 0;
    SET refId = (SELECT ingredientTypeId FROM ingredient_type ORDER BY ingredientTypeId DESC LIMIT 1);
		insert into ingredient(ingredientName, isNut, ingredientTypeId) values(ingredientName, isNut, refId);

    END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure seed_reviews_with_menu_item
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`seed_reviews_with_menu_item`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `seed_reviews_with_menu_item`()
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

DELIMITER ;

-- -----------------------------------------------------
-- procedure seed_sales_with_menu_item
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`seed_sales_with_menu_item`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `seed_sales_with_menu_item`()
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

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_popularity_on_new_sale
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`update_popularity_on_new_sale`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_popularity_on_new_sale`()
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

-- -----------------------------------------------------
-- procedure update_reviewRank_on_new_review
-- -----------------------------------------------------

USE `ctms`;
DROP procedure IF EXISTS `ctms`.`update_reviewRank_on_new_review`;

DELIMITER $$
USE `ctms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_reviewRank_on_new_review`()
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
    
    SET SQL_SAFE_UPDATES = 1;
END$$

DELIMITER ;
USE `ctms`;

DELIMITER $$

USE `ctms`$$
DROP TRIGGER IF EXISTS `ctms`.`review_added` $$
USE `ctms`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `ctms`.`review_added`
AFTER INSERT ON `ctms`.`review`
FOR EACH ROW
BEGIN
       CALL update_reviewRank_on_new_review;
       
       END$$


USE `ctms`$$
DROP TRIGGER IF EXISTS `ctms`.`sale_added` $$
USE `ctms`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `ctms`.`sale_added`
AFTER INSERT ON `ctms`.`sale`
FOR EACH ROW
BEGIN
       CALL update_popularity_on_new_sale;
       
       END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
