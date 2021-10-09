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
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`ingredient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`ingredient` ;

CREATE TABLE IF NOT EXISTS `ctms`.`ingredient` (
  `ingredientId` INT NOT NULL AUTO_INCREMENT,
  `ingredientName` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`ingredientId`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
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
-- Table `ctms`.`measurement_unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`measurement_unit` ;

CREATE TABLE IF NOT EXISTS `ctms`.`measurement_unit` (
  `measurementUnitId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`measurementUnitId`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
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
AUTO_INCREMENT = 8
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
AUTO_INCREMENT = 77
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
AUTO_INCREMENT = 45
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
