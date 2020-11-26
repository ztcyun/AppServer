%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-studio.notify
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

#install studio.notify
mkdir -p "%{buildroot}/var/www/services/studio.notify/"
mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
### cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/services/studio.notify/"
cp -r %{_builddir}/var/www/services/studio.notify/* "%{buildroot}/var/www/services/studio.notify/"
cp -r %{_builddir}/var/www/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/var/www/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
