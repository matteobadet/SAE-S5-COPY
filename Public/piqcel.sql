create schema piqcel;
use piqcel;
DROP TABLE IF EXISTS `user`; 

CREATE TABLE IF NOT EXISTS `user` ( 

  `id` int NOT NULL AUTO_INCREMENT, 

  `firstName` varchar(50) NOT NULL, 

  `lastName` varchar(50) NOT NULL, 

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4; 

 

DROP TABLE IF EXISTS `account`; 

CREATE TABLE IF NOT EXISTS `account` ( 

  `id` int NOT NULL AUTO_INCREMENT, 

  `email` varchar(50) NOT NULL, 

  `pseudo` varchar(50) NOT NULL, 

  `hash` varchar(255) NOT NULL, 

  `salt` int NOT NULL, 

  `user_id` int NOT NULL DEFAULT '0', 

  PRIMARY KEY (`id`), 

 FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE 

) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4; 

 

 

DROP TABLE IF EXISTS `session`; 

CREATE TABLE IF NOT EXISTS `session` ( 

  `id` int NOT NULL AUTO_INCREMENT, 

  `token` varchar(256) NOT NULL, 

  `creationDate` int NOT NULL, 

  `account_id` int NOT NULL, 

  PRIMARY KEY (`id`), 

  KEY `account_id` (`account_id`), 

  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE 

) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4; 