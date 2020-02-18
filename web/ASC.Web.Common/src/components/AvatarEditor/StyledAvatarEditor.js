import styled from 'styled-components';
import { utils }  from 'asc-web-components';

const { tablet } = utils.device;

const StyledModalDialog = styled.div`

.asc-avatar {
  display: block;
  @media ${tablet} {
      display: none
  }
}

.avatars-container {
  text-align: center;

    .custom-range {
        width: 100%;
        display: block
    }
    .avatar-container {
        display: inline-block;
        vertical-align: top;
        @media ${tablet} {
            display: none;
        }
    }
    .editor-container {
        display: inline-block;
        width: auto;
        padding: 0 30px;
        position: relative;
        @media ${tablet} {
            padding: 0;
        }
    }
}

.drop-zone-container {
  box-sizing: border-box;
    display: block;
    width: 100%;
    height: 300px;
    border: 1px dashed #ccc;
    text-align: center;
    padding: 10em 0;
    margin: 0 auto;
    p {
        margin: 0;
        cursor: default
    }
    .desktop {
        display: block;
    };
    .mobile {
        display: none;
    };
    @media ${tablet} {
        .desktop {
            display: none;
        };
        .mobile {
            display: block;
        };
    }

}

.close-button {

  cursor: pointer;
    position: absolute;
    right: 33px;
    top: 4px;
    width: 16px;
    height: 16px;

    &:before, &:after {
        position: absolute;
        left: 8px;
        content: ' ';
        height: 16px;
        width: 1px;
        background-color: #D8D8D8;
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
    @media ${tablet} {
        right: calc(50% - 147px);
    }
}

.error-message {
  text-align: center
}
`;

export default StyledModalDialog;