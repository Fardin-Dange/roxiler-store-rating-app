```sql
CREATE DATABASE IF NOT EXISTS store_rating_platform;

USE store_rating_platform;

-- =====================================
-- USERS TABLE
-- =====================================

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) DEFAULT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    role ENUM('user','admin','store_owner') DEFAULT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY email (email)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- STORE TABLE
-- =====================================

CREATE TABLE store (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address VARCHAR(100) DEFAULT NULL,
    owner_id INT DEFAULT NULL,

    PRIMARY KEY (id),
    KEY owner_id (owner_id),

    CONSTRAINT store_ibfk_1
    FOREIGN KEY (owner_id)
    REFERENCES users(id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- =====================================
-- RATING TABLE
-- =====================================

CREATE TABLE rating (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    store_id INT DEFAULT NULL,
    ratings INT DEFAULT NULL,

    PRIMARY KEY (id),

    UNIQUE KEY unique_user_store (user_id, store_id),

    KEY store_id (store_id),

    CONSTRAINT rating_ibfk_1
    FOREIGN KEY (user_id)
    REFERENCES users(id),

    CONSTRAINT rating_ibfk_2
    FOREIGN KEY (store_id)
    REFERENCES store(id),

    CONSTRAINT chk_rating
    CHECK (ratings BETWEEN 1 AND 5)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
```
