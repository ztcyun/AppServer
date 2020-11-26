%define __strip    /bin/true
Summary: AppServer
Name: onlyoffice-appserver-config
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

#install config
mkdir -p "%{buildroot}/app/onlyoffice/config/"
cp -r %{_builddir}/app/onlyoffice/config/* "%{buildroot}/app/onlyoffice/config/"

%clean


%files

%pre

%post

%preun

%postun

%changelog
