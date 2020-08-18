import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import i18n from "../../i18n";
import { I18nextProvider, withTranslation } from "react-i18next";
import styled from "styled-components";
import {
    getPortalOwner
} from "../../../../../store/settings/actions";
import {
    Text,
    Avatar,
    Link,
    toastr,
    Button,
    RequestLoader,
    Loader,
    Icons
} from "asc-web-components";
import { PeopleSelector } from "asc-web-common";
import isEmpty from "lodash/isEmpty";

const StyledWrapper = styled.div`
  .category-item-wrapper{
      margin-bottom:40px;

      .category-item-heading{
         display:flex;
         align-items: center;
         margin-bottom: 5px;
      }

      .category-item-subheader{
         font-size: 13px;
         font-weight: 600;
         margin-bottom: 5px;
      }

      .category-item-description{
         color: #555F65;
         font-size: 12px;
         max-width: 1024px;
      }

      .inherit-title-link{
         margin-right: 7px;
         font-size:19px;
         font-weight: 600;
      }

      .link-text{
         margin:0;
      }
   }
`;

const OwnerContainer = styled.div`
    margin-bottom:50px;

    .link_style {
        margin-right: 16px;
    }
    .text-body_wrapper {
        margin-bottom: 16px;
    }
    .advanced-selector {
        position: relative;
    }
    .text-body_inline {
        display: inline-flex;
    }
    .button_offset {
        margin-right: 16px;
    }
`;

const AvatarContainer = styled.div`
  display: flex;
  width: 330px;
  height: 120px;
  margin-right: 130px;
  margin-bottom: 24px;
  padding: 8px;
  border: 1px solid lightgrey;

  .avatar_wrapper {
    width: 100px;
    height: 100px;
  }

  .avatar_body {
    margin-left: 24px;
    max-width: 190px;
    word-wrap: break-word;
    overflow: hidden;
  }
`;

class AccessRights extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            showSelector: false,
            showLoader: true,
            selectedOwner: null
        };
    }

    componentDidMount() {
        const {
            owner,
            getPortalOwner,
            ownerId
        } = this.props;

        if (isEmpty(owner, true)) {
            getPortalOwner(ownerId)
                .catch(error => {
                    toastr.error(error);
                })
                .finally(() => this.setState({ showLoader: false }));
        }
        this.setState({ showLoader: false });
    }

    onChangeOwner = () => {
        const { t, owner } = this.props;
        toastr.success(t("DnsChangeMsg", { email: owner.email }));
    };

    onLoading = status => this.setState({ isLoading: status });

    onShowSelector = status => {
        this.setState({
            showSelector: status
        });
    };

    onCancelSelector = () => {
        this.onShowSelector(false);
    }

    onSelect = items => {
        this.onShowSelector(false);
        this.setState({ selectedOwner: items[0] });
    };

    onClickLink = (e) => {
        e.preventDefault();
        const { history } = this.props;
        history.push(e.target.pathname);
    }

    render() {
        const { t, owner, me, groupsCaption } = this.props;
        const {
            isLoading,
            showLoader,
            showSelector,
            selectedOwner
        } = this.state;

        return (
            <>
                {showLoader ? (
                    <Loader className="pageLoader" type="rombs" size='40px' />
                ) : (
                        <StyledWrapper>
                            <OwnerContainer>
                                <RequestLoader
                                    visible={isLoading}
                                    zIndex={256}
                                    loaderSize='16px'
                                    loaderColor={"#999"}
                                    label={`${t("LoadingProcessing")} ${t("LoadingDescription")}`}
                                    fontSize='12px'
                                    fontColor={"#999"}
                                    className="page_loader"
                                />

                                <AvatarContainer>
                                    <Avatar
                                        className="avatar_wrapper"
                                        size="big"
                                        role="owner"
                                        userName={owner.userName}
                                        source={owner.avatar}
                                    />
                                    <div className="avatar_body">
                                        <Text
                                            className="avatar_text"
                                            fontSize='16px'
                                            isBold={true}
                                        >
                                            {owner.displayName}
                                        </Text>
                                        {owner.groups &&
                                            owner.groups.map(group => (
                                                <Link
                                                    fontSize='12px'
                                                    key={group.id}
                                                    href={owner.profileUrl}
                                                >
                                                    {group.name}
                                                </Link>
                                            ))}
                                    </div>
                                </AvatarContainer>

                                <Link
                                    className="link_style"
                                    isHovered={true}
                                    onClick={this.onShowSelector.bind(this, !showSelector)}
                                >
                                    {selectedOwner ? selectedOwner.label : t("ChooseOwner")}
                                </Link>

                                <Button
                                    className="button_offset"
                                    size="medium"
                                    primary={true}
                                    label={t('AccessRightsChangeOwnerButtonText')}
                                    isDisabled={!isLoading ? selectedOwner === null : false}
                                    onClick={this.onChangeOwner}
                                />
                                <Text
                                    className="text-body_inline"
                                    fontSize='12px'
                                    color="#A3A9AE"
                                >
                                    {t("AccessRightsChangeOwnerConfirmText")}
                                </Text>

                                <div className="advanced-selector">
                                    <PeopleSelector
                                        isOpen={showSelector}
                                        size={"compact"}
                                        onSelect={this.onSelect}
                                        onCancel={this.onCancelSelector}
                                        defaultOption={me}
                                        defaultOptionLabel={t('MeLabel')}
                                        groupsCaption={groupsCaption}
                                    />
                                </div>
                            </OwnerContainer>
                            <div className="category-item-wrapper">
                                <div className="category-item-heading">
                                    <Link
                                        className='inherit-title-link header'
                                        onClick={this.onClickLink}
                                        truncate={true}
                                        href="/settings/security/access-rights/portal-admins">
                                        {t('')}Portal admins
                                </Link>
                                    <Icons.ArrowRightIcon size="small" isfill={true} color="#333333" />
                                </div>
                                <Text className="category-item-subheader" truncate={true}>8 employees (Test value)</Text>
                                <Text className="category-item-description">
                                    Have the same access rights as the portal owner, except the right to: change portal owner; deactivate or delete portal.
                                {t('')}
                                </Text>
                            </div>
                            <div className="category-item-wrapper">
                                <div className="category-item-heading">
                                    <Link
                                        className='inherit-title-link header'
                                        onClick={this.onClickLink}
                                        truncate={true}
                                        href="/settings/security/access-rights/people-access">
                                        {t('')}People access
                                </Link>
                                    <Icons.ArrowRightIcon size="small" isfill={true} color="#333333" />
                                </div>
                                <Text className="category-item-subheader" truncate={true}>12 employees (Test value)</Text>
                                <Text className="category-item-description">
                                    The People module will be visible in the main portal menu to all employees added to the list. The functionality of the module will correspond to the employee's status.
                                {t('')}
                                </Text>
                            </div>
                        </StyledWrapper>
                    )}
            </>
        );
    }
}

function mapStateToProps(state) {
    const { owner } = state.settings.security.accessRight;
    const { user: me } = state.auth;
    const groupsCaption = state.auth.settings.customNames.groupsCaption;

    return {
        ownerId: state.auth.settings.ownerId,
        owner,
        me,
        groupsCaption
    };
}

AccessRights.defaultProps = {
    owner: {}
};

AccessRights.propTypes = {
    owner: PropTypes.object
};

export default connect(mapStateToProps, { getPortalOwner })(
    withTranslation()(AccessRights)
);
