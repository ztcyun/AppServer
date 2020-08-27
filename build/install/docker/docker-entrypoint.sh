#!/bin/bash

DOTNET_RUN=$1
DOTNET_LOG_NAME=$2

sed -i "s|Server=.*;Pooling=|Server=$MYSQL_HOST;Port=3306;Database=$MYSQL_DATABASE;User ID=$MYSQL_USER;Password=$MYSQL_PASSWORD;Pooling=|g" /app/onlyoffice/config/appsettings.test.json
sed -i "s|Server=.*;Pooling=|Server=$MYSQL_HOST;Port=3306;Database=$MYSQL_DATABASE;User ID=$MYSQL_USER;Password=$MYSQL_PASSWORD;Pooling=|g" /app/onlyoffice/config/appsettings.json
sed -i "s|localhost|$KAFKA_HOST|g" /app/onlyoffice/config/kafka.test.json

dotnet $DOTNET_RUN --urls=http://0.0.0.0:5050 --pathToConf=/app/onlyoffice/config/ --ENVIRONMENT=$DOTNET_ENV --$STORAGE_ROOT=/app/onlyoffice/data/ --log:dir=/var/log/onlyoffice --log:name=$DOTNET_LOG_NAME