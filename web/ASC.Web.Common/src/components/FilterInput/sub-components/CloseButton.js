import React from "react";
import { IconButton } from 'asc-web-components';
import PropTypes from 'prop-types';

const CloseButton = props => {
  //console.log("CloseButton render");
  return (
    <div className={`styled-close-button ${props.className}`}>
      <IconButton
        color={"#A3A9AE"}
        hoverColor={"#A3A9AE"}
        clickColor={"#A3A9AE"}
        size={10}
        iconName={'CrossIcon'}
        isFill={true}
        isDisabled={props.isDisabled}
        onClick={!props.isDisabled ? props.onClick : undefined}
      />
    </div>
  );
};
CloseButton.propTypes = {
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
}
export default CloseButton