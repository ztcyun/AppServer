import React from 'react'
import PropTypes from 'prop-types'
import { Text } from "asc-web-components";
import StyledBadge, { StyledInner } from './StyledBadge';

const Badge = props => {
  //console.log("Badge render");

  const onClick = e => {
    if (!props.onClick) return;

    e.preventDefault();
    e.stopPropagation();
    props.onClick(e);
  };

  const {
    backgroundColor,
    borderRadius,
    color,
    fontSize,
    fontWeight,
    maxWidth,
    padding,
  } = props;

  return (
    <StyledBadge
      {...props}
      onClick={onClick}
    >
      <StyledInner
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        maxWidth={maxWidth}
        padding={padding}
      >
        <Text
          color={color}
          fontSize={fontSize}
          fontWeight={fontWeight}
        >
          {props.label}
        </Text>
      </StyledInner>
    </StyledBadge>
  );
};

Badge.propTypes = {
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.number,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.string,
  onClick: PropTypes.func,
  padding: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

Badge.defaultProps = {
  backgroundColor: '#ED7309',
  borderRadius: '11px',
  color: '#FFFFFF',
  fontSize: "11px",
  fontWeight: 800,
  label: 0,
  maxWidth: '50px',
  padding: '0 5px',
}

export default Badge;