%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-studio
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

#install studio
mkdir -p "%{buildroot}/var/www/studio/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/studio/server/"
cp -r %{_builddir}/common/studio/server/* "%{buildroot}/var/www/studio/server/"
cp -r %{_builddir}/common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

%clean

%files

%pre

%post

%preun

%postun

%changelog
