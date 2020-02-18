import styled from 'styled-components';

const StyledBadge = styled.div`
  display: ${props => (props.label.length > 0 || props.label != '0') ? 'inline-block' : 'none'};
  border: 1px solid transparent;
  border-radius: ${props => props.borderRadius};
  width: fit-content;
  padding: 2px;
  line-height: 0.8;
  cursor: pointer;
  overflow: hidden;

  :hover {
    border-color: ${props => props.backgroundColor};
  }
`;

export const StyledInner = styled.div`
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.borderRadius};
  padding: ${props => props.padding};
  max-width: ${props => props.maxWidth};
  text-align: center;
  user-select: none;
  line-height: 1.5;
`;

export default StyledBadge;