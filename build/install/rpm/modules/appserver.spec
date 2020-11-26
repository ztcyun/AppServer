%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver
Version: 0.0.0
Release: 0
Group: Applications/Internet
URL: http://onlyoffice.com
Vendor: Ascensio System SIA
Packager: Ascensio System SIA <support@onlyoffice.com>
BuildArch: x86_64
AutoReq: no
AutoProv: no
License: OtherLicense
%description

%prep

%build

git clone https://github.com/ONLYOFFICE/AppServer.git %{_builddir}/app/onlyoffice/src/ && \
cd %{_builddir}/app/onlyoffice/src/ && \
git checkout develop && \
git pull

cd %{_builddir}/app/onlyoffice/src/ && \
yarn install --cwd web/ASC.Web.Components --frozen-lockfile > build/ASC.Web.Components.log && \
yarn pack --cwd web/ASC.Web.Components
	
cd %{_builddir}/app/onlyoffice/src/ && \
component=$(ls web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
yarn remove asc-web-components --cwd web/ASC.Web.Common --peer && \
yarn add file:../../$component --cwd web/ASC.Web.Common --cache-folder ../../yarn --peer && \
yarn install --cwd web/ASC.Web.Common --frozen-lockfile > build/ASC.Web.Common.log && \
yarn pack --cwd web/ASC.Web.Common

cd %{_builddir}/app/onlyoffice/src/ && \
npm build:storybook --prefix web/ASC.Web.Components && \
mkdir -p %{_builddir}/var/www/story/ && \
cp -Rf web/ASC.Web.Components/storybook-static/* %{_builddir}/var/www/story/

cd %{_builddir}/app/onlyoffice/src/ && \
component=$(ls web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
common=$(ls web/ASC.Web.Common/asc-web-common-v1.*.tgz) && \
yarn remove asc-web-components asc-web-common --cwd web/ASC.Web.Client && \
yarn add ../../$component --cwd web/ASC.Web.Client --cache-folder ../../yarn && \
yarn add ../../$common --cwd web/ASC.Web.Client --cache-folder ../../yarn && \
yarn install --cwd web/ASC.Web.Client --frozen-lockfile || (cd web/ASC.Web.Client && npm i && cd ../../) && \
npm run-script build --prefix web/ASC.Web.Client && \
rm -rf %{_builddir}/var/www/studio/client/* && \
mkdir -p %{_builddir}/var/www/studio/client && \
cp -rf web/ASC.Web.Client/build/* %{_builddir}/var/www/studio/client

cd %{_builddir}/app/onlyoffice/src/ && \
component=$(ls  web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
common=$(ls web/ASC.Web.Common/asc-web-common-v1.*.tgz) && \
yarn remove asc-web-components asc-web-common --cwd products/ASC.Files/Client && \
yarn add ../../../$component --cwd products/ASC.Files/Client --cache-folder ../../../yarn && \
yarn add ../../../$common --cwd products/ASC.Files/Client --cache-folder ../../../yarn && \
yarn install --cwd products/ASC.Files/Client --frozen-lockfile || (cd products/ASC.Files/Client && \
npm i && cd ../../../) && \
npm run-script build --prefix products/ASC.Files/Client && \
mkdir -p %{_builddir}/var/www/products/ASC.Files/client && \
cp -Rf products/ASC.Files/Client/build/* %{_builddir}/var/www/products/ASC.Files/client && \
mkdir -p %{_builddir}/var/www/products/ASC.Files/client/products/files

cd %{_builddir}/app/onlyoffice/src/ && \
component=$(ls  web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
common=$(ls web/ASC.Web.Common/asc-web-common-v1.*.tgz) && \
yarn remove asc-web-components asc-web-common --cwd products/ASC.People/Client && \
yarn add ../../../$component --cwd products/ASC.People/Client --cache-folder ../../../yarn && \
yarn add ../../../$common --cwd products/ASC.People/Client --cache-folder ../../../yarn && \
yarn install --cwd products/ASC.People/Client --frozen-lockfile || (cd products/ASC.People/Client && \
npm i && cd ../../../) && \
npm run-script build --prefix products/ASC.People/Client && \
mkdir -p %{_builddir}/var/www/products/ASC.People/client && \
cp -Rf products/ASC.People/Client/build/* %{_builddir}/var/www/products/ASC.People/client && \
mkdir -p %{_builddir}/var/www/products/ASC.People/client/products/people

cd %{_builddir}/app/onlyoffice/src/ && \
rm -f %{_builddir}/etc/nginx/conf.d/* && \
mkdir -p %{_builddir}/var/www/public/ && \
cp -f public/* %{_builddir}/var/www/public/ && \
mkdir -p %{_builddir}/app/onlyoffice/config/ && \
cp -rf config/* %{_builddir}/app/onlyoffice/config/ && \
mkdir -p %{_builddir}/etc/nginx/conf.d/ && \
cp -f config/nginx/onlyoffice*.conf %{_builddir}/etc/nginx/conf.d/ && \
mkdir -p %{_builddir}/etc/nginx/includes/ && \
cp -f config/nginx/includes/onlyoffice*.conf %{_builddir}/etc/nginx/includes/ && \
sed -e 's/#//' -i %{_builddir}/etc/nginx/conf.d/onlyoffice.conf && \
dotnet restore ASC.Web.sln --configfile .nuget/NuGet.Config && \
dotnet build -r linux-x64 ASC.Web.sln && \
cd products/ASC.People/Server && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/products/ASC.People/server && \
cd ../../../ && \
cd products/ASC.Files/Server && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/products/ASC.Files/server && \
cp -avrf DocStore %{_builddir}/var/www/products/ASC.Files/server/ && \
cd ../../../ && \
cd products/ASC.Files/Service && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/products/ASC.Files/service && \
cd ../../../ && \
cd web/ASC.Web.Api && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/studio/api && \
cd ../../ && \
cd web/ASC.Web.Studio && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/studio/server && \
cd ../../ && \
cd common/services/ASC.Data.Backup && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/services/backup && \
cd ../../../ && \
cd common/services/ASC.Notify && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/services/notify && \
cd ../../../ && \
cd common/services/ASC.ApiSystem && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/services/apisystem && \
cd ../../../ && \
cd common/services/ASC.Thumbnails.Svc && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/services/thumb/service && \
cd ../../../ && \
yarn install --cwd common/ASC.Thumbnails --frozen-lockfile && \
mkdir -p %{_builddir}/var/www/services/thumb/client && \
cp -Rf common/ASC.Thumbnails/* %{_builddir}/var/www/services/thumb/client && \
cd common/services/ASC.UrlShortener.Svc && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/services/urlshortener/service && \
cd ../../../ && \
yarn install --cwd common/ASC.UrlShortener --frozen-lockfile && \
mkdir -p %{_builddir}/var/www/services/urlshortener/client && cp -Rf common/ASC.UrlShortener/* %{_builddir}/var/www/services/urlshortener/client && \
cd common/services/ASC.Studio.Notify && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/services/studio.notify

%install
# add defualt user and group for no-root run
mkdir -p %{buildroot}%{_localstatedir}/log/onlyoffice && \
mkdir -p %{buildroot}/app/onlyoffice/data && \
mkdir -p %{buildroot}%{_localstatedir}/www/services/backup && \
groupadd -g 1001 appuser && \
useradd -r -u 1001 -g appuser appuser && \
chown appuser:appuser %{buildroot}/app/onlyoffice -R && \
chown appuser:appuser %{buildroot}%{_localstatedir}/log -R  && \
chown appuser:appuser %{buildroot}%{_localstatedir}/www -R 

%clean

%files

%pre

%post

%preun

%postun

%changelog
