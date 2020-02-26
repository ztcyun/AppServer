import React from "react";
import PropTypes from "prop-types";
import {
  toastr,
  Button,
  Link,
  Text
} from "asc-web-components";
import { withTranslation, Trans } from "react-i18next";
import i18n from "./i18n";
import { ModalDialog, api, utils } from "asc-web-common";
const { sendInstructionsToChangePassword } = api.people;
const { changeLanguage } = utils;

class ChangePasswordDialogComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      isRequestRunning: false
    };

    changeLanguage(i18n);
  }
  onSendPasswordChangeInstructions = () => {
    const { email, onClose } = this.props;
    this.setState({ isRequestRunning: true }, () => {
      sendInstructionsToChangePassword(email)
        .then((res) => {
          toastr.success(res);
        })
        .catch((error) => toastr.error(error))
        .finally(() => {
          this.setState({ isRequestRunning: false }, () => onClose());
        });
    })

  }


  render() {
    console.log("ChangePasswordDialog render");
    const { t, visible, email, onClose } = this.props;
    const { isRequestRunning } = this.state;

    return (
      <ModalDialog
        visible={visible}
        onClose={onClose}
        headerContent={t('PasswordChangeTitle')}
        bodyContent={
          <Text fontSize='13px'>
            <Trans i18nKey="MessageSendPasswordChangeInstructionsOnEmail" i18n={i18n}>
              Send the password change instructions to the
              <Link type="page" href={`mailto:${email}`} noHover color='#316DAA' title={email}>
                {{ email }}
              </Link>
              email address
          </Trans>
          </Text>

        }
        footerContent={
          <Button
            key="SendBtn"
            label={t('SendButton')}
            size="medium"
            primary={true}
            onClick={this.onSendPasswordChangeInstructions}
            isLoading={isRequestRunning}
          />
        }
      />
    );
  }
}

const ChangePasswordDialogTranslated = withTranslation()(ChangePasswordDialogComponent);

const ChangePasswordDialog = props => (
  <ChangePasswordDialogTranslated i18n={i18n} {...props} />
);

ChangePasswordDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

export default ChangePasswordDialog;
