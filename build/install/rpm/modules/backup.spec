%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-backup
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

#install backup
mkdir -p "%{buildroot}/var/www/services/backup/"
mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/backup/* "%{buildroot}/var/www/services/backup/"
cp -r %{_builddir}/common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
