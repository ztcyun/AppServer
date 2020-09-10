import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import Layout from "./Layout";
import { Loader } from "asc-web-components";

const CustomizationSettings = lazy(() =>
  import("./categories/common/customization")
);
const LanguageAndTimeZoneSettings = lazy(() =>
  import("./categories/common/language-and-time-zone")
);
const CustomTitles = lazy(() => import("./categories/common/custom-titles"));
const AccessRights = lazy(() => import("./categories/security/access-rights"));
const PeopleAccess = lazy(() => import("./categories/security/people-access"));
const PortalAdmins = lazy(() => import("./categories/security/portal-admins"));

//const WhiteLabel = lazy(() => import("./categories/common/whitelabel"));

const Settings = () => {
  const basePath = "/settings"  return (
    <Layout key="1">
      <Suspense
        fallback={<Loader className="pageLoader" type="rombs" size="40px" />}
      >
        <Switch>
          <Route
            exact
            path={[
              `${basePath}/common/customization`,
              `${basePath}/common`,
              basePath
            ]}
            component={CustomizationSettings}
          />
          <Route
            exact
            path={[`${basePath}/common/customization/language-and-time-zone`]}
            component={LanguageAndTimeZoneSettings}
          />
          <Route
            exact
            path={[`${basePath}/common/customization/custom-titles`]}
            component={CustomTitles}
          />
          <Route
            exact
            path={[`${basePath}/security/access-rights`, `${basePath}/security/accessrights/owner`]}
            component={AccessRights}
          />          <Route
            exact
            path={[`${basePath}/security/access-rights/portal-admins`]}
            component={PortalAdmins}
          />
          <Route
            exact
            path={[`${basePath}/security/access-rights/people-access`]}
            component={PeopleAccess}
          />
          <Redirect
            to={{
              pathname: "/error/404"
            }}
          />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default withRouter(Settings);
