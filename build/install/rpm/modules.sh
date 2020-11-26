#!/bin/bash
PWD=$(pwd)
MODULARITY_DIR="$PWD/modules"

rpmbuild -ba $MODULARITY_DIR/appserver.spec
rpmbuild -ba $MODULARITY_DIR/api.spec
rpmbuild -ba $MODULARITY_DIR/api_system.spec
rpmbuild -ba $MODULARITY_DIR/backup.spec
rpmbuild -ba $MODULARITY_DIR/files.spec
rpmbuild -ba $MODULARITY_DIR/files_services.spec
rpmbuild -ba $MODULARITY_DIR/notify.spec
rpmbuild -ba $MODULARITY_DIR/people.server.spec
rpmbuild -ba $MODULARITY_DIR/studio.notify.spec
rpmbuild -ba $MODULARITY_DIR/studio.spec
rpmbuild -ba $MODULARITY_DIR/urlshortener.spec
