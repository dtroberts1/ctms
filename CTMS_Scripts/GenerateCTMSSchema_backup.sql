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
  `campaignId` INT NOT NULL,
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
  `ingredientId` INT NOT NULL,
  `ingredientName` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`ingredientId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`partner`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`partner` ;

CREATE TABLE IF NOT EXISTS `ctms`.`partner` (
  `partnerId` INT NOT NULL,
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
    REFERENCES `ctms`.`partner` (`partnerId`),
  CONSTRAINT `ingredient_partner_ibfk_2`
    FOREIGN KEY (`ingredientId`)
    REFERENCES `ctms`.`ingredient` (`ingredientId`))
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
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 29
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`menu_item_ingredient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`menu_item_ingredient` ;

CREATE TABLE IF NOT EXISTS `ctms`.`menu_item_ingredient` (
  `menuItemId` INT NULL DEFAULT NULL,
  `ingredientId` INT NULL DEFAULT NULL,
  INDEX `menuItemId` (`menuItemId` ASC) VISIBLE,
  INDEX `ingredientId` (`ingredientId` ASC) VISIBLE,
  CONSTRAINT `menu_item_ingredient_ibfk_1`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`),
  CONSTRAINT `menu_item_ingredient_ibfk_2`
    FOREIGN KEY (`ingredientId`)
    REFERENCES `ctms`.`ingredient` (`ingredientId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`review` ;

CREATE TABLE IF NOT EXISTS `ctms`.`review` (
  `reviewId` INT NOT NULL,
  `reviewDate` DATETIME NULL DEFAULT NULL,
  `campaignEventId` INT NULL DEFAULT NULL,
  `menuItemId` INT NULL DEFAULT NULL,
  `rating` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`reviewId`),
  INDEX `campaignEventId` (`campaignEventId` ASC) VISIBLE,
  INDEX `menuItemId` (`menuItemId` ASC) VISIBLE,
  CONSTRAINT `review_ibfk_1`
    FOREIGN KEY (`campaignEventId`)
    REFERENCES `ctms`.`campaign_event` (`campaignId`),
  CONSTRAINT `review_ibfk_2`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `ctms`.`store`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ctms`.`store` ;

CREATE TABLE IF NOT EXISTS `ctms`.`store` (
  `storeId` INT NOT NULL,
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
  `saleId` INT NOT NULL,
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
    REFERENCES `ctms`.`store` (`storeId`),
  CONSTRAINT `sale_ibfk_2`
    FOREIGN KEY (`menuItemId`)
    REFERENCES `ctms`.`menu_item` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
