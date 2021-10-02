DELIMITER $$

DROP TRIGGER IF EXISTS sale_added $$

CREATE TRIGGER sale_added AFTER INSERT ON sale FOR EACH ROW
BEGIN
       CALL update_popularity_on_new_sale;
       
       END$$

DELIMITER ;