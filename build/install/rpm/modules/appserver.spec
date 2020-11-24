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

%install
# add defualt user and group for no-root run
mkdir -p %{buildroot}%{_localstatedir}/log/onlyoffice && \
mkdir -p %{buildroot}/app/onlyoffice/data && \
mkdir -p %{buildroot}%{_localstatedir}/www/services/backup && \
groupadd -g 1001 appuser && \
useradd -r -u 1001 -g appuser appuser && \
chown appuser:appuser %{buildroot}/app/onlyoffice -R && \
chown appuser:appuser %{buildroot}%{_localstatedir}/log -R  && \
chown appuser:appuser %{buildroot}%{_localstatedir}/www -R 

%build

%clean

%files

%pre

%post

%preun

%postun

%changelog
