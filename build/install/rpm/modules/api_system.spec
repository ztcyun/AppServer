%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-api_system
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

%install
#install api_system
mkdir -p "%{buildroot}/var/www/services/apisystem/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/services/apisystem/"
cp -r %{_builddir}/common/apisystem/* "%{buildroot}/var/www/services/apisystem/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
