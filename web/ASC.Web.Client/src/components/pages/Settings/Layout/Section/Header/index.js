import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router";
import { Headline, PeopleSelector } from 'asc-web-common';
import { IconButton, utils } from "asc-web-components";
import { withTranslation } from 'react-i18next';
import { getKeyByLink, settingsTree, getTKeyByKey, checkPropertyByLink, getFromSessionStorage } from '../../../utils';
import {
  getNewAdminsByKeys
} from "../../../../../../store/settings/actions";

const { tablet } = utils.device;

const HeaderContainer = styled.div`
  position: relative;
    display: flex;
    align-items: center;
    max-width: calc(100vw - 32px);

    .add-button{
      margin-left: 15px;
      cursor: pointer;
    }

    .arrow-button {
      margin-right: 16px;

      @media ${tablet} {
        padding: 8px 0 8px 8px;
        margin-left: -8px;
      }
    }
`;

class SectionHeaderContent extends React.Component {

  constructor(props) {
    super(props);

    const { match, location } = props;
    const fullSettingsUrl = match.url;
    const locationPathname = location.pathname;

    const fullSettingsUrlLength = fullSettingsUrl.length;

    const resultPath = locationPathname.slice(fullSettingsUrlLength + 1);
    const arrayOfParams = resultPath.split('/');

    const key = getKeyByLink(arrayOfParams, settingsTree);
    const header = getTKeyByKey(key, settingsTree);
    const isCategory = checkPropertyByLink(arrayOfParams, settingsTree, "isCategory");
    const isHeader = checkPropertyByLink(arrayOfParams, settingsTree, "isHeader");
    this.state = {
      header,
      isCategoryOrHeader: isCategory || isHeader,
      showSelector: false,
      showAddButton: header === "PortalAdmins"
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const arrayOfParams = this.getArrayOfParams()

    const key = getKeyByLink(arrayOfParams, settingsTree);
    const header = getTKeyByKey(key, settingsTree);
    const isCategory = checkPropertyByLink(arrayOfParams, settingsTree, "isCategory");
    const isHeader = checkPropertyByLink(arrayOfParams, settingsTree, "isHeader");
    const isCategoryOrHeader = isCategory || isHeader;
    const showAddButton = header === "PortalAdmins"

    prevState.showAddButton !== showAddButton && this.setState({ showAddButton })
    header !== this.state.header && this.setState({ header });
    isCategoryOrHeader !== this.state.isCategoryOrHeader && this.setState({ isCategoryOrHeader });
  }

  compareObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  onBackToParent = () => {
    let newArrayOfParams = this.getArrayOfParams();
    newArrayOfParams.splice(-1, 1);
    const newPath = "/settings/" + newArrayOfParams.join("/");
    this.props.history.push(newPath);
  }

  onPlusButtonClick = () => {
    this.onShowGroupSelector();
  }

  getArrayOfParams = () => {
    const { match, location } = this.props;
    const fullSettingsUrl = match.url;
    const locationPathname = location.pathname;


    const fullSettingsUrlLength = fullSettingsUrl.length;
    const resultPath = locationPathname.slice(fullSettingsUrlLength + 1);
    const arrayOfParams = resultPath.split('/');
    return arrayOfParams;
  }

  onSelect = selectedUsers => {

    const { getNewAdminsByKeys } = this.props
    const currentAdmins = (sessionStorage.getItem("admins") && getFromSessionStorage("admins").length) > 0
      ? getFromSessionStorage("admins")
      : this.props.admins

    if (!currentAdmins || selectedUsers.length < 1) return false

    this.filterSelectedUsers(selectedUsers, currentAdmins)

    getNewAdminsByKeys(
      selectedUsers.map(user => user.key),
    );

    this.onShowGroupSelector();
  };

  filterSelectedUsers = (selectedUsers, currentAdmins) => {

    currentAdmins.forEach(admin => {
      for (let t = 0; t < selectedUsers.length; t++) {
        if (admin.id === selectedUsers[t].key) {
          selectedUsers.splice(t, 1);
          break;
        }
      }
    });
  }

  onShowGroupSelector = () => {
    this.setState({
      showSelector: !this.state.showSelector
    });
  };

  render() {
    const { t, groupsCaption, me } = this.props;
    const { header, isCategoryOrHeader, showSelector, showAddButton } = this.state;
    const arrayOfParams = this.getArrayOfParams();

    return (
      <HeaderContainer>
        {!isCategoryOrHeader && arrayOfParams[0] && (
          <IconButton
            iconName="ArrowPathIcon"
            size="17"
            color="#A3A9AE"
            hoverColor="#657077"
            isFill={true}
            onClick={this.onBackToParent}
            className="arrow-button"
          />
        )}
        <Headline type='content' truncate={true}>
          {t(header)}
        </Headline>
        {showAddButton &&
          <>
            <IconButton
              color="#657077"
              className="add-button"
              size={17}
              iconName="PlusIcon"
              isFill={false}
              onClick={this.onPlusButtonClick}
            />
            <PeopleSelector
              id="people-admin-selector"
              isOpen={showSelector}
              isMultiSelect={true}
              role="user"
              onSelect={this.onSelect}
              onCancel={this.onCancelSelector}
              defaultOption={me}
              defaultOptionLabel={t("MeLabel")}
              groupsCaption={groupsCaption}
            />
          </>
        }
      </HeaderContainer>
    );
  }
};

function mapStateToProps(state) {
  const { user: me } = state.auth;
  const { admins } = state.settings.security.accessRight;
  const groupsCaption = state.auth.settings.customNames.groupsCaption;

  return {
    me,
    groupsCaption,
    admins
  };
}

export default connect(mapStateToProps, { getNewAdminsByKeys })(withRouter(withTranslation()(SectionHeaderContent)));
