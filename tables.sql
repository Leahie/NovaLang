
-- sql file yayyyyyy i love sql (help me, leah and danielle forced me, ayudame porfa)

----------------------------------------------------------------------------------------------------

-- table: account
-- max num of users: 1000

DROP TABLE IF EXISTS account;

CREATE TABLE account (
    account_id INTEGER PRIMARY KEY,
    account_user TEXT NOT NULL,
    account_pass TEXT NOT NULL
);

INSERT INTO account 
(account_id, account_user, account_pass)
VALUES
(0, "Admin", "Admin"),
(1, "Admin2", "Admin2");

----------------------------------------------------------------------------------------------------


-- table: level
-- max num of levels: 1000

DROP TABLE IF EXISTS level;

CREATE TABLE level (
    level_id INTEGER,
    level_accID INTEGER,
    level_author TEXT NOT NULL,
    level_text TEXT NOT NULL,
    level_status BOOLEAN
);

INSERT INTO level 
(level_id, level_accID, level_author, level_text, level_status)
VALUES
-- !DO -- @everyone --> guys pls help i have no idea how booleans in sql work, how do u insert true/false vals bruh helpplplpplp
(1000, 0, "Eiichiro Oda", "One Piece Ch. 967", TRUE),
(1001, 0, "Eiichiro Oda", "One Piece Ch. 1044", FALSE);
