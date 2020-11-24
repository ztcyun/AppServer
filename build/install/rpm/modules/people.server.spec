%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-people.server
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

dotnet restore ASC.Web.sln --configfile .nuget/NuGet.Config && \
dotnet build -r linux-x64 ASC.Web.sln && \
cd products/ASC.People/Server && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/products/ASC.People/server && \
cd ../../../ && \
cd products/ASC.Files/Server && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/var/www/products/ASC.Files/server && \
cp -avrf DocStore %{_builddir}/var/www/products/ASC.Files/server/


%install

#install people.server
mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
### cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/var/www/products/ASC.People/server/* "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/var/www/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"### 

%clean

%files

%pre

%post

%preun

%postun

%changelog
