%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-urlshortener
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

dotnet restore ASC.Web.sln --configfile .nuget/NuGet.Config && \
dotnet build -r linux-x64 ASC.Web.sln && \
cd common/services/ASC.UrlShortener.Svc && \
dotnet -d publish --no-build --self-contained -r linux-x64 -o %{_builddir}/services/urlshortener/service

%install

#install urlshortener
mkdir -p "%{buildroot}/services/urlshortener/service/"
### cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/services/urlshortener/service/"
cp -r %{_builddir}/services/urlshortener/urlshortener/* "%{buildroot}/services/urlshortener/service/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
