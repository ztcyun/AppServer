import React from "react";
import PropTypes from "prop-types";
import { Text } from 'asc-web-components';
import StyledEmptyScreenContainer, { EmptyContentImage } from './StyledEmptyScreenContainer';

const EmptyScreenContainer = props => {
  const { imageSrc, imageAlt, headerText, descriptionText, buttons } = props;
  return (

    <StyledEmptyScreenContainer {...props}>

      <EmptyContentImage imageSrc={imageSrc} imageAlt={imageAlt} className="ec-image" />

      {headerText && (
        <Text as="span" color="#333333" fontSize='24px' className="ec-header">{headerText}</Text>
      )}

      {descriptionText && (
        <Text as="span" color="#737373" fontSize='14px' className="ec-desc">{descriptionText}</Text>
      )}

      {buttons && (
        <div className="ec-buttons">
          {buttons}
        </div>
      )}

    </StyledEmptyScreenContainer>
  );
};

EmptyScreenContainer.propTypes = {
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  headerText: PropTypes.string,
  descriptionText: PropTypes.string,
  buttons: PropTypes.any,
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default EmptyScreenContainer;
