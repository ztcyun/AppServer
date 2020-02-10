use onlyoffice;

CREATE USER 'dev'@'%' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON onlyoffice.* TO 'dev'@'%';