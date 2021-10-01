DELIMITER $$

DROP TRIGGER IF EXISTS review_added $$

CREATE TRIGGER review_added AFTER INSERT ON review FOR EACH ROW
BEGIN
       CALL update_reviewRank_on_new_review;
       
       END$$

DELIMITER ;