#!/bin/bash

PRODUCT="onlyoffice";
BASE_DIR="/app/${PRODUCT}";
PARAMETERS="";

BUILD_URLS="http://0.0.0.0:${SERVICE_PORT:-5050}";
PATH_TO_CONF="${BASE_DIR}/config";
LOG_DIR="/var/log/onlyoffice";

BUILD_MYSQL_HOST="mysql"
BUILD_MYSQL_DATABASE="${PRODUCT}"
BUILD_MYSQL_USER="${PRODUCT}_user"
BUILD_MYSQL_PASSWORD="${PRODUCT}_pass"
BUILD_KAFKA_HOST="kafka"
BUILD_APP_DOTNET_ENV="test"
BUILD_APP_CORE_BASE_DOMAIN="localhost"
BUILD_APP_CORE_MACHINEKEY=""
BUILD_APP_SECRET_VALUE=""
BUILD_APP_SECRET_HEADER="AuthorizationJwt"
BUILD_APP_URL_PUBLIC="/ds-vpath/"
BUILD_APP_URL_INTERNAL="http://onlyoffice-document-server/"
BUILD_APP_URL_PORTAL="http://onlyoffice-community-server"
BUILD_APP_URL_CONVERTER="/ds-vpath/ConvertService.ashx"
BUILD_APP_FFMPEG_VALUE="ffmpeg"
BUILD_APP_FFMPEG_EXTS='"avi", "mpeg", "mpg", "wmv"'
BUILD_APP_VIEWED_MEDIA='".aac",".flac",".m4a",".mp3",".oga",".ogg",".wav",".f4v",".m4v",".mov",".mp4",".ogv",".webm",".avi"'
BUILD_STORAGE_ROOT="/app/onlyoffice/data/"

if [ -n "$1" ]; then
	DOTNET_RUN="${1}";
	shift
fi

if [ -n "$1" ]; then
	DOTNET_LOG_NAME="${1}";
	shift
fi

while [ "$1" != "" ]; do
	PARAMETERS="$PARAMETERS --${1}";
	shift
done

sed -i "s!Server=.*;Pooling=!Server=${MYSQL_HOST:-${BUILD_MYSQL_HOST}};Port=3306;Database=${MYSQL_DATABASE:-${BUILD_MYSQL_DATABASE}};User ID=${MYSQL_USER:-${BUILD_MYSQL_USER}};Password=${MYSQL_PASSWORD:-${BUILD_MYSQL_PASSWORD}};Pooling=!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"base-domain\".*,!\"base-domain\": \"${APP_CORE_BASE_DOMAIN:-${BUILD_APP_CORE_BASE_DOMAIN}}\",!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"machinekey\".*,!\"machinekey\": \"${APP_CORE_MACHINEKEY:-${BUILD_APP_CORE_MACHINEKEY}}\",!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"public\".*,!\"public\": \"${APP_URL_PUBLIC:-${BUILD_APP_URL_PUBLIC}}\",!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"internal\".*,!\"internal\": \"${APP_URL_INTERNAL:-${BUILD_APP_URL_INTERNAL}}\",!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"portal\".*,!\"portal\": \"${APP_URL_PORTAL:-${BUILD_APP_URL_PORTAL}}\",!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"converter\".*!\"converter\": \"${APP_URL_CONVERTER:-${BUILD_APP_URL_CONVERTER}}\"!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"viewed-media\".*!\"viewed-media\": \[${APP_VIEWED_MEDIA:-${BUILD_APP_VIEWED_MEDIA}}\]!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"exts\".*!\"exts\": \[ ${APP_FFMPEG_EXTS:-${BUILD_APP_FFMPEG_EXTS}} \]!g" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "0,/\"value\"/s!\"value\".*,!\"value\": \"${APP_SECRET_VALUE:-${BUILD_APP_SECRET_VALUE}}\",!" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
sed -i "s!\"header\".*!\"header\": \"${APP_SECRET_HEADER:-${BUILD_APP_SECRET_HEADER}}\"!" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json

sed -i "s!\"BootstrapServers\".*!\"BootstrapServers\": \"${KAFKA_HOST:-${BUILD_KAFKA_HOST}}\"!g" ${PATH_TO_CONF}/kafka.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json

#jq ".files.ffmpeg.value=\"${APP_FFMPEG_VALUE:-${BUILD_APP_FFMPEG_VALUE}}\"" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json > ${PATH_TO_CONF}/appsettings.build.app.json && mv ${PATH_TO_CONF}/appsettings.build.app.json ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
#jq --arg value ${APP_SECRET_VALUE:-${BUILD_APP_SECRET_VALUE}} -c '.files.docservice.secret.value=$value' ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json > ${PATH_TO_CONF}/appsettings.build.app.json && mv ${PATH_TO_CONF}/appsettings.build.app.json ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
#jq ".files.docservice.secret.value=\"${APP_SECRET_VALUE:-${BUILD_APP_SECRET_VALUE}}\"" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json > ${PATH_TO_CONF}/appsettings.build.app.json && mv ${PATH_TO_CONF}/appsettings.build.app.json ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json
#jq ".files.docservice.secret.header=\"${APP_SECRET_HEADER:-${BUILD_APP_SECRET_HEADER}}\"" ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json > ${PATH_TO_CONF}/appsettings.build.app.json && mv ${PATH_TO_CONF}/appsettings.build.app.json ${PATH_TO_CONF}/appsettings.${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}}.json

dotnet ${DOTNET_RUN} --urls=${APP_URLS:-${BUILD_URLS}} --ENVIRONMENT=${APP_DOTNET_ENV:-${BUILD_APP_DOTNET_ENV}} --'$STORAGE_ROOT'=${APP_STORAGE_ROOT:-${BUILD_STORAGE_ROOT}} --pathToConf=${PATH_TO_CONF} --log:dir=${LOG_DIR} --log:name=${DOTNET_LOG_NAME} ${PARAMETERS}