FROM mysql:8.0.18

COPY dotnet_dump.sql /app/onlyoffice/dotnet_dump.sql

RUN mysql -e "CREATE DATABASE IF NOT EXISTS onlyoffice CHARACTER SET utf8 COLLATE 'utf8_general_ci'" && \
    mysql -D "onlyoffice" < /app/onlyoffice/dotnet_dump.sql && \
    mysql -D "onlyoffice" -e 'CREATE USER IF NOT EXISTS "onlyoffice_user"@"localhost" IDENTIFIED WITH mysql_native_password BY "onlyoffice_pass";' && \
    mysql -D "onlyoffice" -e 'GRANT ALL PRIVILEGES ON *.* TO 'onlyoffice_user'@'localhost';' && \
    mysql -D "onlyoffice" -e 'UPDATE core_user SET email = "paul.bannov@gmail.com";' && \
    mysql -D "onlyoffice" -e 'UPDATE core_usersecurity SET pwdhash = "vLFfghR5tNV3K9DKhmwArV+SbjWAcgZZzIDTnJ0JgCo=", pwdhashsha512 = "USubvPlB+ogq0Q1trcSupg==";' && \
    
    VOLUME /var/lib/mysql