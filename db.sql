CREATE DATABASE usersData;
USE usersData;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL, 
    names VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL
);

