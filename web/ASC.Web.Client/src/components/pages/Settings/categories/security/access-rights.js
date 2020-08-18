import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
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
    Loader,
    Icons,
    Heading
} from "asc-web-components";
import { PeopleSelector, history } from "asc-web-common";
import isEmpty from "lodash/isEmpty";

const StyledWrapper = styled.div`
    .portal-owner-description {
        margin-left: 16px;
        overflow: hidden;
    }

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

    .owner-content-wrapper{
        display:flex;
        margin-bottom: 30px;
        padding: 16px;
        background-color: #F8F9F9;
        border-radius: 12px;

        .avatar_wrapper {
            width: 88px;
            height: 88px;
            flex: none;
        }

        .portal-owner-heading{
            margin:0;
            margin-bottom: 4px;
        }

        .portal-owner-info{
            margin-bottom: 9px;
        }

        .group-wrapper{
            display:inline-block;
            margin-left: 3px;
        }
    }

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

const getFormattedDepartments = departments => {
    const formattedDepartments = departments.map((department, index) => {
        return (
            <span key={index}>
                <Link
                    href={getGroupLink(department)}
                    type="page"
                    fontSize='12px'
                >
                    {department.name}
                </Link>
                {departments.length - 1 !== index ? ", " : ""}
            </span>
        );
    });

    return formattedDepartments;
};

const getGroupLink = (department) => {
    return `/products/people/filter?group=${department.id}`
};

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

        const formattedDepartments = owner.department && getFormattedDepartments(owner.groups);

        return (
            <>
                {showLoader ? (
                    <Loader className="pageLoader" type="rombs" size='40px' />
                ) : (
                        <StyledWrapper>
                            <OwnerContainer>
                                <div className="owner-content-wrapper">
                                    <Link href={owner.profileUrl}>
                                        <Avatar
                                            className="avatar_wrapper"
                                            size="big"
                                            userName={owner.userName}
                                            source={owner.avatar}
                                            role="user"
                                        />
                                    </Link>

                                    <div className="portal-owner-description">
                                        <Heading className="portal-owner-heading" level={3} size="small" >
                                            {t('PortalOwner')}
                                        </Heading>
                                        <div className="portal-owner-info">
                                            <Link
                                                className="avatar_text"
                                                fontSize='13px'
                                                fontWeight={600}
                                                isBold={true}
                                                color="#316DAA"
                                                href={owner.profileUrl}
                                            >
                                                {owner.displayName}
                                            </Link>
                                            {owner.groups &&
                                                <div className="group-wrapper">
                                                    <Text as="span">(</Text>
                                                    {formattedDepartments}
                                                    <Text as="span">)</Text>
                                                </div>
                                            }
                                        </div>
                                        <Text className="PortalOwnerDescription" color="#555F65">
                                            {t('PortalOwnerDescription')}
                                        </Text>
                                    </div>
                                </div>

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
                                        {t('PortalAdmins')}
                                    </Link>
                                    <Icons.ArrowRightIcon size="small" isfill={true} color="#333333" />
                                </div>
                                <Text className="category-item-subheader" truncate={true}>8 employees (Test value)</Text>
                                <Text className="category-item-description">
                                    {t('PortalAdminsDescription')}
                                </Text>
                            </div>
                            <div className="category-item-wrapper">
                                <div className="category-item-heading">
                                    <Link
                                        className='inherit-title-link header'
                                        onClick={this.onClickLink}
                                        truncate={true}
                                        href="/settings/security/access-rights/people-access">
                                        {t('PeopleAccess')}
                                    </Link>
                                    <Icons.ArrowRightIcon size="small" isfill={true} color="#333333" />
                                </div>
                                <Text className="category-item-subheader" truncate={true}>12 employees (Test value)</Text>
                                <Text className="category-item-description">
                                    {t('PeopleAccessDescription')}
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
