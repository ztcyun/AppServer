import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  toastr,
  ModalDialog,
  Button,
  Text,
  EmailInput,
  FieldContainer
} from "asc-web-components";
import { withTranslation } from "react-i18next";
import i18n from "./i18n";
import ModalDialogContainer from '../ModalDialogContainer';
import { api } from "asc-web-common";
const { sendInstructionsToChangeEmail } = api.people;

class ChangeEmailDialogComponent extends React.Component {
  constructor(props) {
    super(props);

    const { email, language } = props;

    this.state = {
      isEmailValid: true,
      isRequestRunning: false,
      email,
      hasError: false,
      errorMessage: '',
      emailErrors: []
    };

    i18n.changeLanguage(language);
  }

  componentDidMount() {
    window.addEventListener("keyup", this.onKeyPress);
  }

  componentDidUpdate(prevProps) {
    const { email } = this.props;
    if (prevProps.email !== email) {
      this.setState({ email });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onKeyPress);
  }

  onValidateEmailInput = validateObj => this.setState({ isEmailValid: validateObj.isValid, emailErrors: validateObj.errors });

  onChangeEmailInput = e => {
    const { hasError } = this.state;
    const email = e.target.value;
    hasError && this.setState({ hasError: false });
    this.setState({ email });
  };

  onSendEmailChangeInstructions = () => {
    this.setState({ isRequestRunning: true }, function () {
      sendInstructionsToChangeEmail(this.props.id, this.state.email)
        .then((res) => {
          toastr.success(res);
        })
        .catch((error) => toastr.error(error))
        .finally(() => {
          this.props.onClose();
          this.setState({ isRequestRunning: false });
        });
    })
  };

  onValidateEmail = () => {
    const { isEmailValid, email, emailErrors } = this.state;
    const { t } = this.props;
    if (isEmailValid) {
      const sameEmailError = email.toLowerCase() === this.props.email.toLowerCase();
      if (sameEmailError) {
        this.setState({ errorMessage: t('SameEmail'), hasError: true });
      }
      else {
        this.setState({ errorMessage: '', hasError: false });
        this.onSendEmailChangeInstructions();
      }
    }
    else {
      const translatedErrors = emailErrors.map((errorKey => t(errorKey)));
      const errorMessage = translatedErrors[0];
      this.setState({ errorMessage, hasError: true });
    }
  };

  onKeyPress = event => {
    if (event.key === "Enter") {
      this.onValidateEmail();
    }
  };


  render() {
    console.log("ChangeEmailDialog render");
    const { t, visible, onClose } = this.props;
    const { isRequestRunning, email, errorMessage, hasError } = this.state;

    return (
      <ModalDialogContainer>
        <ModalDialog
          visible={visible}
          onClose={onClose}
          headerContent={t('EmailChangeTitle')}
          bodyContent={
            <>
              <FieldContainer
                isVertical
                labelText={t('EnterEmail')}
                errorMessage={errorMessage}
                hasError={hasError}
              >
                <EmailInput
                  id="new-email"
                  scale={true}
                  isAutoFocussed={true}
                  value={email}
                  onChange={this.onChangeEmailInput}
                  onValidateInput={this.onValidateEmailInput}
                  onKeyUp={this.onKeyPress}
                  hasError={hasError}
                />
              </FieldContainer>
              <Text
                className='text-dialog'
              >
                {t('EmailActivationDescription')}
              </Text>
            </>
          }
          footerContent={
            <Button
              key="SendBtn"
              label={t('SendButton')}
              size="medium"
              primary={true}
              onClick={this.onValidateEmail}
              isLoading={isRequestRunning}
            />
          }
        />
      </ModalDialogContainer>
    );
  }
}

const ChangeEmailDialogTranslated = withTranslation()(ChangeEmailDialogComponent);

const ChangeEmailDialog = props => (
  <ChangeEmailDialogTranslated i18n={i18n} {...props} />
);

ChangeEmailDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.auth.user.cultureName,
  };
}

export default connect(mapStateToProps, {})(withRouter(ChangeEmailDialog));
