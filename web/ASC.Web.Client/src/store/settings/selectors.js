import { find, filter } from "lodash";
import { constants } from 'asc-web-common';
const { EmployeeActivationStatus, EmployeeStatus } = constants;
export const getUserRole = user => {
  if (user.isOwner) return "owner";
  else if (user.isAdmin) return "admin";
  else if (
    user.listAdminModules !== undefined &&
    user.listAdminModules.includes("people")
  )
    return "admin";
  else if (user.isVisitor) return "guest";
  else return "user";
};

export function getSelectedUser(selection, userId) {
  return find(selection, function (obj) {
    return obj.id === userId;
  });
};

export function isUserSelected(selection, userId) {
  return getSelectedUser(selection, userId) !== undefined;
};

export function skipUser(selection, userId) {
  return filter(selection, function (obj) {
    return obj.id !== userId;
  });
};

export function combineAdmins(admins, newAdmins) {

  admins.forEach(admin => {
    for (let i = 0; i < newAdmins.length; i++) {
      if (admin.id === newAdmins[i].id) {
        newAdmins.splice(i, 1);
        break;
      }
    }
  });

  return admins.concat(newAdmins)
}

export function removeAdmins(admins, ids) {
  return (admins.filter(admin => {
    let isDeletedAdmin = false

    for (let i = 0; i < ids.length; i++) {
      if (admin.id === ids[i]) {
        isDeletedAdmin = true
        break
      }
    }

    return !isDeletedAdmin
  }))
}

export function getUsersBySelected(users, selected) {
  let newSelection = [];
  users.forEach(user => {
    const checked = getUserChecked(user, selected);

    if (checked)
      newSelection.push(user);
  });

  return newSelection;
};

const getUserChecked = (user, selected) => {
  const status = getUserStatus(user);
  switch (selected) {
    case "all":
      return true;
    case "active":
      return status === "normal";
    case "disabled":
      return status === "disabled";
    case "invited":
      return status === "pending";
    default:
      return false;
  }
};

export const getUserStatus = user => {
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
