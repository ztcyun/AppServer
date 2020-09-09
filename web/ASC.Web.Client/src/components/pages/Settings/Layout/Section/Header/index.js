import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { withRouter } from "react-router";
import { Headline, PeopleSelector, api } from 'asc-web-common';
import { IconButton, utils, GroupButtonsMenu, HelpButton, Text, Heading, Icons } from "asc-web-components";
import { withTranslation } from 'react-i18next';
import { getKeyByLink, settingsTree, getTKeyByKey, checkPropertyByLink } from '../../../utils';
import { addAdmins, removeAdmins, setSelected } from "../../../../../../store/settings/actions";

const { tablet, desktop } = utils.device;

const HeaderContainer = styled.div`
  position: relative;
    display: flex;
    align-items: center;
    max-width: calc(100vw - 32px);

    .add-button{
      margin-left: 15px;
      cursor: pointer;
    }

    .help-icon{
      margin-left: 12px;
    }

    .arrow-button {
      margin-right: 16px;

      @media ${tablet} {
        padding: 8px 0 8px 8px;
        margin-left: -8px;
      }
    }
`;

const StyledContainer = styled.div`
  @media ${desktop} {
    ${props =>
    props.isHeaderVisible &&
    css`
        width: calc(100% + 76px);
      `}
  }

  .group-button-menu-container {
    margin: 0 -16px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    padding-bottom: 56px;

    @media ${tablet} {
      & > div:first-child {
        ${props =>
    props.isArticlePinned &&
    css`
            width: calc(100% - 240px);
          `}
        position: absolute;
        top: 56px;
        z-index: 180;
      }
    }

    @media ${desktop} {
      margin: 0 -24px;
    }
  }
`

const StyledTooltip = styled.div`

  width: 288px;

  .tooltipHeading{
    margin:0;
  }

  .line{
    margin-top: 10px;
    margin-bottom:10px;
    height:1px;
    width:100%;
    background-color: #ECEEF1;
  }
  .tooltipIcon{
    margin-right:8px;
    width: 16px;

    &.doc{
      width: 14px;
      margin-right:10px;
    }
  }
  .infoItem{
    display: flex;
    align-items: baseline;
    margin-bottom: 10px;

    &:last-child{
      margin-bottom: 0;
    }

    p{
      flex-basis: calc(100% - 16px);
    }
  }
`

class SectionHeaderContent extends React.Component {

  constructor(props) {
    super(props);

    const { match, location, t } = props;
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
      showAddButton: header === "PortalAdmins",
      isHeaderVisible: false,
      isHeaderIndeterminate: false,
      isHeaderChecked: false,
      disableRemove: true
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
    prevState.showAddButton !== showAddButton && !showAddButton && this.onClose()
    header !== this.state.header && this.setState({ header });
    isCategoryOrHeader !== this.state.isCategoryOrHeader && this.setState({ isCategoryOrHeader });
    if (this.props.selection !== prevProps.selection) this.renderGroupButtonMenu();
  }

  compareObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  removeAdmins = () => {
    const { selection, removeAdmins } = this.props
    const adminsId = selection.map(admin => {
      if (!admin.isOwner) return admin.id
    })

    if (adminsId.length > 0) removeAdmins(adminsId)
    this.onClose()
  }

  onSelectorSelect = () => {
    this.props.setSelected("all");
  };

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
    const { addAdmins } = this.props

    if (selectedUsers.length < 1) return false

    this.getNewAdminsByKeys(
      selectedUsers.map(user => user.key),
    ).then(admins => {
      addAdmins(admins)
    })

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

  async getNewAdminsByKeys(adminKeys) {
    let newAdmins = [];

    for (const key of adminKeys) {
      let newAdmin = await api.people.getUserById(key)
      newAdmins.push(newAdmin)
    }

    return newAdmins
  }

  renderGroupButtonMenu = () => {
    const { admins, newAdmins, selection, selected, setSelected } = this.props;
    const currentAdmins = newAdmins && newAdmins.length > 0
      ? newAdmins
      : admins

    const headerVisible = selection.length > 0;
    const headerIndeterminate =
      headerVisible && selection.length > 0 && selection.length < currentAdmins.length;
    const headerChecked = headerVisible && selection.length === currentAdmins.length;

    let newState = {};
    let disableRemove = true

    if (selection.length > 0) {
      selection.forEach(admin => {
        if (!admin.isOwner) disableRemove = false
      });
    }

    if (disableRemove !== this.state.disableRemove) this.setState({ disableRemove })

    if (headerVisible || selected === "close") {
      newState.isHeaderVisible = headerVisible;
      if (selected === "close") {
        setSelected("none");
      }
    }

    newState.isHeaderIndeterminate = headerIndeterminate;
    newState.isHeaderChecked = headerChecked;

    this.setState(newState);
  };

  onShowGroupSelector = () => {
    this.setState({
      showSelector: !this.state.showSelector
    });
  };

  onClose = () => {
    const { setSelected } = this.props;
    setSelected("none");
    this.setState({ isHeaderVisible: false });
  };

  onCheck = checked => {
    this.props.setSelected(checked ? "all" : "none");
  }

  onCancelSelector = () => {
    this.onShowGroupSelector();
  }

  render() {
    const { t, groupsCaption, me } = this.props;
    const { disableRemove } = this.state
    const { header, isCategoryOrHeader, showSelector, showAddButton, isHeaderVisible, isHeaderChecked, isHeaderIndeterminate } = this.state;
    const arrayOfParams = this.getArrayOfParams();
    const tooltipInfo = (
      <StyledTooltip>
        <Heading className="tooltipHeading" size="medium" level={3}>Access rights settings</Heading>
        <div className="line"></div>
        <div className="infoItem">
          <IconButton
            className="tooltipIcon"
            iconName="OwnerSettingsIcon"
            isClickable={false}
            color="#333333"
            size="medium"
            isFill={true}
          />
          <Text as="p" fontSize="13px" color="#333333">
            Have the same access rights as the portal owner, except the right to: change portal owner; deactivate or delete portal.
          </Text>
        </div>
        <div className="infoItem">
          <IconButton
            className="tooltipIcon doc"
            iconName="ActionsDocumentsSettingsIcon"
            isClickable={false}
            color="#333333"
            size="medium"
            isFill={true}
          />
          <Text as="p" fontSize="13px" color="#333333">
            Documents administrators can: do the same as a user; link Dropbox, Box and other accounts in the 'Common Documents' section; set up access rights to the documents and folders in the 'Common Documents' section.
          </Text>
        </div>
        <div className="infoItem">
          <IconButton
            className="tooltipIcon"
            iconName="MainMenuPeopleIcon"
            isClickable={false}
            color="#333333"
            size="medium"
            isFill={true}
          />
          <Text as="p" fontSize="13px" color="#333333">
            People administrators can: do the same as a user; create profiles and groups; import profiles; invite users.
          </Text>
        </div>

      </StyledTooltip>
    );

    const menuItems = [
      {
        label: t("Select all"),
        isDropdown: true,
        isSeparator: true,
        isSelect: true,
        fontWeight: "bold",
        onSelect: this.onSelectorSelect
      },
      {
        label: t("Remove"),
        disabled: disableRemove,
        onClick: this.removeAdmins
      }
    ];

    return (
      <StyledContainer isHeaderVisible={isHeaderVisible}>

        {isHeaderVisible ? (
          <div className="group-button-menu-container">
            <GroupButtonsMenu
              checked={isHeaderChecked}
              isIndeterminate={isHeaderIndeterminate}
              onChange={this.onCheck}
              menuItems={menuItems}
              visible={isHeaderVisible}
              moreLabel={t("More")}
              closeTitle={t("CloseButton")}
              onClose={this.onClose}
              selected={menuItems[0].label}
            />
          </div>
        ) : (
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
                  <HelpButton
                    place="bottom"
                    offsetTop={0}
                    offsetRight={0}
                    offsetBottom={0}
                    offsetLeft={0}
                    iconName="NewInfoIcon"
                    color="#A3A9AE"
                    size={17}
                    tooltipContent={tooltipInfo}
                  />
                </>
              }
            </HeaderContainer>
          )}
      </StyledContainer>
    );
  }
};

function mapStateToProps(state) {
  const { user: me } = state.auth;
  const { admins, selection, selected, newAdmins } = state.settings.security.accessRight;
  const groupsCaption = state.auth.settings.customNames.groupsCaption;

  return {
    me,
    groupsCaption,
    admins,
    newAdmins,
    selection,
    selected
  };
}

export default connect(mapStateToProps, { addAdmins, setSelected, removeAdmins })(withRouter(withTranslation()(SectionHeaderContent)));
