cd web/ASC.Web.Common
yarn link -r ../../packages/asc-web-components
yarn install --immutable
yarn run build
cd ../../