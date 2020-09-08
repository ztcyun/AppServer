import styled from "styled-components";
import { utils } from "asc-web-components";

const tablet = utils.device.tablet;

const ModalDialogContainer = styled.div`
  .modal-dialog-aside-footer {
    @media (max-width: 1024px) {
      width: 90%;
    }
  }
  .modal-dialog-button {
    @media (max-width: 1024px) {
      width: 100%;
    }
  }
  .field-body {
    margin-top: 16px;
  }
`;

export default ModalDialogContainer;
