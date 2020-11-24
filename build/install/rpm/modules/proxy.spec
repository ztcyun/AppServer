%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-proxy
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
npm build --prefix web/ASC.Web.Client && \
rm -rf %{_builddir}/var/www/studio/client/* && \
mkdir -p %{_builddir}/var/www/studio/client && \
cp -rf web/ASC.Web.Client/build/* %{_builddir}/var/www/studio/client

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

%install

#install nginx
### rm -rf /usr/share/nginx/html/*  # Remove default nginx website
# copy artefacts and config values for nginx
mkdir -p "%{buildroot}/etc/nginx/includes"
mkdir -p "%{buildroot}/etc/nginx/templates/"
mkdir -p "%{buildroot}/etc/nginx/conf.d/"
mkdir -p "%{buildroot}/var/www/story/"
mkdir -p "%{buildroot}/var/www/products/ASC.People/client/"
mkdir -p "%{buildroot}/var/www/products/ASC.Files/client/"
mkdir -p "%{buildroot}/var/www/public/"
mkdir -p "%{buildroot}/var/www/studio/client"
cp -r %{_builddir}/etc/nginx/conf.d/* "%{buildroot}/etc/nginx/conf.d"
cp -r %{_builddir}/etc/nginx/includes/* "%{buildroot}/etc/nginx/includes"
cp -r %{_builddir}/var/www/story/* "%{buildroot}/var/www/story/"
cp -r %{_builddir}/var/www/products/ASC.People/client/* "%{buildroot}/var/www/products/ASC.People/client/"
cp -r %{_builddir}/var/www/products/ASC.Files/client/* "%{buildroot}/var/www/products/ASC.Files/client/"
cp -r %{_builddir}/var/www/public/* "%{buildroot}/var/www/public/"
cp -r %{_builddir}/var/www/studio/client/* "%{buildroot}/var/www/studio/client/"
cp -r %{_builddir}/etc/nginx/templates/upstream.conf.template "%{buildroot}/etc/nginx/templates/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
