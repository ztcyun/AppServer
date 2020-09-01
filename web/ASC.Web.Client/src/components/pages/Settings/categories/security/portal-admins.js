import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import {
    changeAdmins,
    getUpdateListAdmin,
    fetchPeople
} from "../../../../../store/settings/actions";
import {
    Text,
    Avatar,
    Row,
    RowContainer,
    Link,
    Paging,
    IconButton,
    toastr,
    RequestLoader,
    Loader,
    EmptyScreenContainer,
    Icons,
    SearchInput,
    SaveCancelButtons
} from "asc-web-components";
import { constants } from 'asc-web-common';
import { getUserRole } from "../../../../../store/settings/selectors";
import isEmpty from "lodash/isEmpty";
import { saveToSessionStorage, getFromSessionStorage } from '../../utils';

const { EmployeeActivationStatus, EmployeeStatus } = constants;

const getUserStatus = user => {
    if (user.status === EmployeeStatus.Active && user.activationStatus === EmployeeActivationStatus.Activated) {
        return "normal";
    }
    else if (user.status === EmployeeStatus.Active && user.activationStatus === EmployeeActivationStatus.Pending) {
        return "pending";
    }
    else if (user.status === EmployeeStatus.Disabled) {
        return "disabled";
    }
    else {
        return "unknown";
    }
};

const ToggleContentContainer = styled.div`
  .buttons_container {
    display: flex;
    @media (max-width: 1024px) {
      display: block;
    }
  }
  .toggle_content {
    margin-bottom: 24px;
  }

  .wrapper {
    margin-top: 16px;
  }

  .remove_icon {
    margin-left: 70px;
    @media (max-width: 576px) {
      margin-left: 0px;
    }
  }

  .people-admin_container {
    margin-right: 16px;
    position: relative;

    @media (max-width: 1024px) {
      margin-bottom: 8px;
    }
  }

  .full-admin_container {
    position: relative;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .nameAndStatus{
    display: flex;
    align-items: center;

    .statusIcon{
        margin-left:5px;
    }
  }

  .rowMainContainer{
      height:auto;
  }

  .userRole{
      text-transform:capitalize;
      font-size: 12px;
      color: #D0D5DA;
  }

  .row_content{
    justify-content: space-between;
    align-items: center;
  }

  .actionIconsWrapper{
      display:flex;
      align-items: center;

      .fullAccessWrapper{
        margin-right:20px;
        display: flex;
        align-items: center;

        .fullAccessIcon{
            margin-right: 4px;
        }
      }

      .hyphen{
            height:1px;
            width: 8px;
            background-color:#D0D5DA;
            margin-right: 20px;
        }

      .iconWrapper{
         display: inline-block; 
         margin-right: 32px;

         &:last-child{
            margin-right:0;
         }
      }
  }
`;

let adminsFromSessionStorage = null

class PortalAdmins extends Component {
    constructor(props) {
        super(props);

        if (sessionStorage.getItem("admins")) adminsFromSessionStorage = getFromSessionStorage("admins");

        this.state = {
            showSelector: false,
            showFullAdminSelector: false,
            isLoading: false,
            showLoader: true,
            selectedOptions: [],
            admins: adminsFromSessionStorage || {},
            hasChanged: false,
            showReminder: false
        };
    }

    componentDidMount() {
        const { admins, fetchPeople } = this.props;
        const { showReminder } = this.state;

        if ((adminsFromSessionStorage) && !showReminder) {
            this.setState({
                showReminder: true
            })
        }

        if (isEmpty(admins, true)) {
            const newFilter = this.onAdminsFilter();
            fetchPeople(newFilter)
                .catch(error => {
                    toastr.error(error);
                })
                .finally(() => {
                    this.setState({
                        showLoader: false
                    })

                    this.checkChanges()

                    if (!adminsFromSessionStorage && this.props.admins.length > 0) {
                        this.setState({
                            admins: this.props.admins
                        })
                    }
                });
        } else {
            if (!adminsFromSessionStorage && this.props.admins.length > 0) {
                this.setState({
                    admins: this.props.admins,
                    showLoader: false,
                })
            } else {
                this.setState({
                    admins: adminsFromSessionStorage || {},
                    showLoader: false,
                })
            }
        }
    }

    componentDidUpdate() {
        const { newAdmins } = this.props
        const { admins } = this.state

        if (newAdmins.length > 0) {
            this.filterNewAdmins(admins, newAdmins)

            const updatedAdmins = admins.concat(newAdmins)
            if (!this.compareObjects(updatedAdmins, admins)) {
                saveToSessionStorage("admins", updatedAdmins)
                this.setState({
                    admins: updatedAdmins
                })
            }
        }

        this.checkChanges()
    }

    onChangeAdmin = (userIds, isAdmin, productId) => {
        this.onLoading(true);
        const { changeAdmins } = this.props;
        const newFilter = this.onAdminsFilter();

        changeAdmins(userIds, productId, isAdmin, newFilter)
            .catch(error => {
                toastr.error("accessRights onChangeAdmin", error);
            })
            .finally(() => {
                this.onLoading(false);
            });
    };

    onChangePage = pageItem => {
        const { filter, getUpdateListAdmin } = this.props;

        const newFilter = filter.clone();
        newFilter.page = pageItem.key;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onChangePageSize = pageItem => {
        const { filter, getUpdateListAdmin } = this.props;

        const newFilter = filter.clone();
        newFilter.page = 0;
        newFilter.pageCount = pageItem.key;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onPrevClick = e => {
        const { filter, getUpdateListAdmin } = this.props;

        if (!filter.hasPrev()) {
            e.preventDefault();
            return;
        }
        const newFilter = filter.clone();
        newFilter.page--;
        this.onLoading(true);
        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onNextClick = e => {
        const { filter, getUpdateListAdmin } = this.props;

        if (!filter.hasNext()) {
            e.preventDefault();
            return;
        }
        const newFilter = filter.clone();
        newFilter.page++;
        this.onLoading(true);

        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onLoading = status => {
        this.setState({ isLoading: status });
    };

    onAdminsFilter = () => {
        const { filter } = this.props;

        const newFilter = filter.clone();
        newFilter.page = 0;
        newFilter.role = "admin";

        return newFilter;
    };

    onResetFilter = () => {
        const { getUpdateListAdmin, filter } = this.props;

        const newFilter = filter.clone(true);

        this.onLoading(true);
        getUpdateListAdmin(newFilter)
            .catch(res => console.log(res))
            .finally(() => this.onLoading(false));
    };

    onModuleIconClick = (userIds, moduleName, isAdmin) => {
        const { admins } = this.state

        if (admins.length < 1) return false
        let adminIndex = null;

        for (let i = 0; i < admins.length; i++) {
            if (admins[i].id === userIds[0]) {
                adminIndex = i
                break
            }
        }

        this.changeAdminRights(adminIndex, moduleName, isAdmin)
    }

    filterNewAdmins = (admins, newAdmins) => {
        admins.forEach(admin => {
            for (let t = 0; t < newAdmins.length; t++) {
                if (admin.id === newAdmins[t].id) {
                    newAdmins.splice(t, 1);
                    break;
                }
            }
        });
    }

    changeAdminRights = (adminIndex, moduleName, isAdmin) => {
        const admins = JSON.parse(JSON.stringify(this.state.admins))
        const listAdminModules = admins[adminIndex].listAdminModules;

        let newListAdminModules = this.createNewListAdminModules(isAdmin, listAdminModules, moduleName)
        newListAdminModules.sort();

        admins[adminIndex].listAdminModules = newListAdminModules;
        const newAdmins = [];

        for (const key in admins) {
            newAdmins.push(admins[key])
        }
        saveToSessionStorage("admins", newAdmins)
        this.setState({
            admins: newAdmins
        })

        this.checkChanges();
    }

    createNewListAdminModules = (isAdmin, listAdminModules, moduleName) => {

        let newListAdminModules = listAdminModules ? listAdminModules.slice() : [];

        if (!isAdmin) {
            newListAdminModules.push(moduleName);
        } else {
            newListAdminModules = listAdminModules.filter((module) => {
                return module !== moduleName
            })
        }
        return newListAdminModules
    }

    onSaveButtonClick = () => {
        let changedAdmins = this.createChangedAdminsList();
        this.acceptChanges(changedAdmins)
    }

    onCancelClick = () => {
        saveToSessionStorage("admins", "")
        adminsFromSessionStorage = ""

        this.setState({
            admins: this.props.admins,
            showReminder: false,
            hasChanged: false
        })
    }

    acceptChanges = (changedAdmins) => {
        for (let i = 0; i < changedAdmins.length; i++) {
            const adminBeforeChanges = this.getAdminById(this.props.admins, changedAdmins[i].id);

            let changedAdminModules = adminBeforeChanges
                ? this.getChangedAdminModules(adminBeforeChanges, changedAdmins[i])
                : changedAdmins[i].listAdminModules && changedAdmins[i].listAdminModules.slice();

            if (changedAdminModules && changedAdminModules.length > 0) {
                changedAdminModules.forEach(moduleName => {
                    const currentModule = this.props.modules.find(module => module.title.toLowerCase() === moduleName.toLowerCase());
                    if (currentModule) this.onChangeAdmin([changedAdmins[i].id], this.isModuleAdmin(changedAdmins[i], moduleName), currentModule.id)
                });
            }

            this.onCancelClick()
        }
    }

    getChangedAdminModules = (adminBeforeChanges, admin) => {
        const modulesListBeforeChanges = adminBeforeChanges.listAdminModules ? adminBeforeChanges.listAdminModules.slice() : []
        const modulesList = admin.listAdminModules ? admin.listAdminModules.slice() : [];
        let newListAdminModules = [];

        newListAdminModules = modulesList.filter((module) => {
            let hasModule = false

            for (let i = 0; i < modulesListBeforeChanges.length; i++) {
                if (modulesListBeforeChanges[i] === module) {
                    hasModule = true
                    modulesListBeforeChanges.splice(i, 1)
                    break
                }
            }

            return !hasModule
        })

        if (modulesListBeforeChanges.length > 0) {
            newListAdminModules = newListAdminModules.concat(modulesListBeforeChanges).sort()
        }

        return newListAdminModules

    }

    createChangedAdminsList = () => {

        const { admins } = this.state
        let changedAdmins = [];

        for (let i = 0; i < admins.length; i++) {
            const adminBeforeChanges = this.getAdminById(this.props.admins, admins[i].id)

            if (!this.compareObjects(admins[i], adminBeforeChanges)) {
                changedAdmins.push(admins[i])
            }
        }

        if (changedAdmins) return changedAdmins
    }

    getAdminById = (admins, id) => {
        let currentAdmin

        admins.findIndex((admin) => {
            for (let key in admin) {
                if (key === "id" && admin[key] === id) {
                    currentAdmin = JSON.parse(JSON.stringify(admin))
                    return true
                }
            }
            return false
        })

        if (currentAdmin) return currentAdmin
    }

    pageItems = () => {
        const { t, filter } = this.props;
        if (filter.total < filter.pageCount) return [];
        const totalPages = Math.ceil(filter.total / filter.pageCount);
        return [...Array(totalPages).keys()].map(item => {
            return {
                key: item,
                label: t("PageOfTotalPage", { page: item + 1, totalPage: totalPages })
            };
        });
    };

    countItems = () => [
        { key: 25, label: this.props.t("CountPerPage", { count: 25 }) },
        { key: 50, label: this.props.t("CountPerPage", { count: 50 }) },
        { key: 100, label: this.props.t("CountPerPage", { count: 100 }) }
    ];

    selectedPageItem = () => {
        const { filter, t } = this.props;
        const pageItems = this.pageItems();

        const emptyPageSelection = {
            key: 0,
            label: t("PageOfTotalPage", { page: 1, totalPage: 1 })
        };

        return pageItems.find(x => x.key === filter.page) || emptyPageSelection;
    };

    selectedCountItem = () => {
        const { filter, t } = this.props;

        const emptyCountSelection = {
            key: 0,
            label: t("CountPerPage", { count: 25 })
        };

        const countItems = this.countItems();

        return (
            countItems.find(x => x.key === filter.pageCount) || emptyCountSelection
        );
    };

    isModuleAdmin = (user, moduleName) => {
        let isModuleAdmin = false;

        if (!user.listAdminModules) return false

        for (let i = 0; i < user.listAdminModules.length; i++) {
            if (user.listAdminModules[i] === moduleName) {
                isModuleAdmin = true
                break
            }
        }

        return isModuleAdmin;
    }

    checkChanges = () => {
        if (sessionStorage.getItem("admins")) adminsFromSessionStorage = getFromSessionStorage("admins")
        let hasChanged = adminsFromSessionStorage && !this.compareObjects(adminsFromSessionStorage, this.props.admins);

        if (hasChanged !== this.state.hasChanged) {
            this.setState({
                hasChanged: hasChanged,
            })
        }
    }

    compareObjects = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2)
    }

    render() {
        const { t } = this.props;
        const { isLoading, showLoader, admins, hasChanged, showReminder } = this.state;

        return (
            <>
                {showLoader ? (
                    <Loader className="pageLoader" type="rombs" size="40px" />
                ) : (
                        <>
                            <RequestLoader
                                visible={isLoading}
                                zIndex={256}
                                loaderSize="16px"
                                loaderColor={"#999"}
                                label={`${t("LoadingProcessing")} ${t("LoadingDescription")}`}
                                fontSize="12px"
                                fontColor={"#999"}
                                className="page_loader"
                            />

                            <ToggleContentContainer>
                                <SearchInput
                                    className="filter_container"
                                    placeholder="Search added employees"
                                />

                                {admins.length > 0 ? (
                                    <>
                                        <div className="wrapper">
                                            <RowContainer useReactWindow={false}>
                                                {admins.map(user => {
                                                    const element = (
                                                        <Avatar
                                                            size="small"
                                                            role={getUserRole(user)}
                                                            userName={user.displayName}
                                                            source={user.avatar}
                                                        />
                                                    );
                                                    const nameColor =
                                                        getUserStatus(user) === 'pending' ? "#A3A9AE" : "#333333";

                                                    return (
                                                        <Row
                                                            key={user.id}
                                                            status={user.status}
                                                            data={user}
                                                            element={element}
                                                            checkbox={true}
                                                            checked={false}
                                                            contextButtonSpacerWidth={"0px"}
                                                        >
                                                            <div>
                                                                <div className="nameAndStatus">
                                                                    <Link
                                                                        isTextOverflow={true}
                                                                        type="page"
                                                                        title={user.displayName}
                                                                        isBold={true}
                                                                        fontSize="15px"
                                                                        color={nameColor}
                                                                        href={user.profileUrl}
                                                                    >
                                                                        {user.displayName}
                                                                    </Link>
                                                                    {getUserStatus(user) === 'pending' && <Icons.SendClockIcon className="statusIcon" size='small' isfill={true} color='#3B72A7' />}
                                                                    {getUserStatus(user) === 'disabled' && <Icons.CatalogSpamIcon className="statusIcon" size='small' isfill={true} color='#3B72A7' />}
                                                                </div>
                                                                <div>
                                                                    <Text truncate={true} className="userRole">{getUserRole(user)}</Text>
                                                                </div>
                                                            </div>
                                                            <div className="actionIconsWrapper">
                                                                <div className="fullAccessWrapper">
                                                                    <IconButton
                                                                        iconName="ActionsFullAccessIcon"
                                                                        isClickable={false}
                                                                        className="fullAccessIcon"
                                                                        size="medium"
                                                                        isFill={true}
                                                                        color={getUserRole(user) === "owner" ? '#316DAA' : '#D0D5DA'}
                                                                    />
                                                                    <Text color={getUserRole(user) === "owner" ? '#316DAA' : '#D0D5DA'} font-size="11px" fontWeight={700}>Full access</Text>
                                                                </div>
                                                                <div className="hyphen"></div>
                                                                <div>
                                                                    <div className="iconWrapper">
                                                                        <IconButton
                                                                            iconName="ActionsDocumentsSettingsIcon"
                                                                            size={14}
                                                                            color={
                                                                                getUserRole(user) === "owner"
                                                                                    ? '#7A95B0'
                                                                                    : this.isModuleAdmin(user, 'documents') ? '#316DAA' : '#D0D5DA'
                                                                            }
                                                                            isfill={true}
                                                                            isClickable={false}
                                                                            onClick={getUserRole(user) !== "owner" && this.onModuleIconClick.bind(this, [user.id], "documents", this.isModuleAdmin(user, 'documents'))}
                                                                        />
                                                                    </div>
                                                                    <div className="iconWrapper">
                                                                        <IconButton
                                                                            iconName="MainMenuPeopleIcon"
                                                                            size={16}
                                                                            color={
                                                                                getUserRole(user) === "owner"
                                                                                    ? '#7A95B0'
                                                                                    : this.isModuleAdmin(user, 'people') ? '#316DAA' : '#D0D5DA'
                                                                            }
                                                                            isfill={true}
                                                                            isClickable={false}
                                                                            onClick={getUserRole(user) !== "owner" && this.onModuleIconClick.bind(this, [user.id], "people", this.isModuleAdmin(user, 'people'))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Row>
                                                    );
                                                })}
                                            </RowContainer>
                                        </div>
                                        {hasChanged &&
                                            <SaveCancelButtons
                                                onSaveClick={this.onSaveButtonClick}
                                                onCancelClick={this.onCancelClick}
                                                showReminder={showReminder}
                                                reminderTest={t('YouHaveUnsavedChanges')}
                                                saveButtonLabel={t('SaveButton')}
                                                cancelButtonLabel={t('CancelButton')}
                                            />
                                        }
                                    </>
                                ) : (
                                        <EmptyScreenContainer
                                            imageSrc="products/people/images/empty_screen_filter.png"
                                            imageAlt="Empty Screen Filter image"
                                            headerText={t("NotFoundTitle")}
                                            descriptionText={t("NotFoundDescription")}
                                            buttons={
                                                <>
                                                    <Icons.CrossIcon
                                                        size="small"
                                                        style={{ marginRight: "4px" }}
                                                    />
                                                    <Link
                                                        type="action"
                                                        isHovered={true}
                                                        onClick={this.onResetFilter}
                                                    >
                                                        {t("ClearButton")}
                                                    </Link>
                                                </>
                                            }
                                        />
                                    )}
                            </ToggleContentContainer>
                        </>
                    )}
            </>
        );
    }
}

function mapStateToProps(state) {
    const { admins, newAdmins, owner, filter } = state.settings.security.accessRight;
    const { user: me } = state.auth;
    const groupsCaption = state.auth.settings.customNames.groupsCaption;

    return {
        admins,
        newAdmins,
        productId: state.auth.modules[0].id,
        modules: state.auth.modules,
        owner,
        filter,
        me,
        groupsCaption
    };
}

PortalAdmins.defaultProps = {
    admins: [],
    productId: "",
    owner: {}
};

PortalAdmins.propTypes = {
    admins: PropTypes.arrayOf(PropTypes.object),
    productId: PropTypes.string,
    owner: PropTypes.object
};

export default connect(mapStateToProps, {
    changeAdmins,
    fetchPeople,
    getUpdateListAdmin
})(withTranslation()(PortalAdmins));
