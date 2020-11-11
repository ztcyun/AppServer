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
rm -rf "%{buildroot}"

%build

%install
BIN_DIR=%{buildroot}%{_bindir}					#/usr/bin
DATA_DIR=%{buildroot}%{_localstatedir}/lib				#/var/lib
CONF_DIR=%{buildroot}%{_sysconfdir}					#/etc
HOME_DIR=%{buildroot}%{_localstatedir}/www				#/var/www
LIB_DIR=%{buildroot}%{_libdir}					#/usr/lib64
LOG_DIR=%{buildroot}%{_localstatedir}/log				#/var/log

#install config
mkdir -p "%{buildroot}/app/onlyoffice/config/"
cp -r %{_builddir}/common/config/* "%{buildroot}/app/onlyoffice/config/"
echo "1"

# add defualt user and group for no-root run
mkdir -p $LOG_DIR/onlyoffice && \
mkdir -p /app/onlyoffice/data && \
mkdir -p $HOME_DIR/services/backup && \
groupadd -g 1001 appuser && \
useradd -r -u 1001 -g appuser appuser && \
chown appuser:appuser /app/onlyoffice -R && \
chown appuser:appuser $LOG_DIR -R  && \
chown appuser:appuser $HOME_DIR -R 

#install backup
mkdir -p "%{buildroot}/var/www/services/backup/"
mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/backup/* "%{buildroot}/var/www/services/backup/"
cp -r %{_builddir}/common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

#install api
mkdir -p "%{buildroot}/var/www/studio/api"
### mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
### mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/studio/api"
cp -r %{_builddir}/common/studio/api/* "%{buildroot}/var/www/studio/api"
### cp -r %{_builddir}/../../../common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
### cp -r %{_builddir}/../../../common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

#install api_system
mkdir -p "%{buildroot}/var/www/services/apisystem/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/services/apisystem/"
cp -r %{_builddir}/common/apisystem/* "%{buildroot}/var/www/services/apisystem/"

#install urlshortener
mkdir -p "%{buildroot}/services/urlshortener/service/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/services/urlshortener/service/"
cp -r %{_builddir}/common/urlshortener/* "%{buildroot}/services/urlshortener/service/"

#install studio.notify
mkdir -p "%{buildroot}/var/www/services/studio.notify/"
### mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
### mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/services/studio.notify/"
cp -r %{_builddir}/common/studio.notify/* "%{buildroot}/var/www/services/studio.notify/"
### cp -r %{_builddir}/../../../common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
### cp -r %{_builddir}/../../../common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

#install notify
mkdir -p "%{buildroot}/var/www/services/notify/"
### mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
### mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/services/notify/"
cp -r %{_builddir}/common/notify/* "%{buildroot}/var/www/services/notify/"
### cp -r %{_builddir}/../../../common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
### cp -r %{_builddir}/../../../common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

#install people.server
### mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
### mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/products/ASC.People/server/"
cp -r %{_builddir}/common/products/ASC.People/server/* "%{buildroot}/var/www/products/ASC.People/server/"
### cp -r %{_builddir}/../../../common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"### 

#install files
### mkdir -p "%{buildroot}/var/www/products/ASC.People/server/"
### mkdir -p "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/products/ASC.Files/server/"
cp -r %{_builddir}/common/products/ASC.Files/server/* "%{buildroot}/var/www/products/ASC.Files/server/"
### cp -r %{_builddir}/../../../common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"

#install files_services
mkdir -p "%{buildroot}/var/www/products/ASC.Files/service/"
### cp -r %{_builddir}/../../../common/docker-entrypoint.sh "%{buildroot}/var/www/products/ASC.Files/server/"### 
cp -r %{_builddir}/common/products/ASC.Files/service/* "%{buildroot}/var/www/products/ASC.Files/service/"

#install studio
mkdir -p "%{buildroot}/var/www/studio/server/"
cp -r %{_builddir}/common/docker-entrypoint.sh "%{buildroot}/var/www/studio/server/"
cp -r %{_builddir}/common/studio/server/* "%{buildroot}/var/www/studio/server/"
### cp -r %{_builddir}/../../../common/products/ASC.People/server/ASC.People.dll "%{buildroot}/var/www/products/ASC.People/server/"
### cp -r %{_builddir}/../../../common/products/ASC.Files/server/ASC.Files*.dll "%{buildroot}/var/www/products/ASC.Files/server/"

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
cp -r %{_builddir}/common/nginx/conf.d/* "%{buildroot}/etc/nginx/conf.d"
cp -r %{_builddir}/common/nginx/includes/* "%{buildroot}/etc/nginx/includes"
cp -r %{_builddir}/common/nginx/story/* "%{buildroot}/var/www/story/"
cp -r %{_builddir}/common/products/ASC.People/client/* "%{buildroot}/var/www/products/ASC.People/client/"
cp -r %{_builddir}/common/products/ASC.Files/client/* "%{buildroot}/var/www/products/ASC.Files/client/"
cp -r %{_builddir}/common/nginx/public/* "%{buildroot}/var/www/public/" 					##? 
cp -r %{_builddir}/common/studio/client/* "%{buildroot}/var/www/studio/client/"
cp -r %{_builddir}/common/nginx/templates/upstream.conf.template "%{buildroot}/etc/nginx/templates/"

%clean
rm -rf "%{buildroot}"

%files

%pre

%post

%preun

%postun

%changelog
