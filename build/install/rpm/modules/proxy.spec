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
