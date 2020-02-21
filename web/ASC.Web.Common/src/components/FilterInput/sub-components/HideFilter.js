import React from "react";
import { Icons, DropDown, utils } from "asc-web-components";
import PropTypes from 'prop-types';
import { Caret, StyledHideFilterButton } from '../StyledFilterInput';

const { handleAnyClick } = utils.event;

class HideFilter extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.dropDownRef = React.createRef();
    this.state = {
      popoverOpen: this.props.open
    };
  }

  onClick = (state, e) => {
    if (!state && e && this.dropDownRef.current.contains(e.target)) {
      return;
    }
    if (!this.props.isDisabled) {
      this.setState({
        popoverOpen: state
      });
    }
  };

  handleClick = e => {
    this.state.popoverOpen &&
      !this.dropDownRef.current.firstElementChild.contains(e.target) &&
      this.onClick(false);
  };

  componentWillUnmount() {
    handleAnyClick(false, this.handleClick);
  }

  componentDidUpdate(prevState) {
    if (this.state.popoverOpen !== prevState.popoverOpen) {
      handleAnyClick(this.state.popoverOpen, this.handleClick);
    }
  }

  render() {
    //console.log("HideFilter render");
    return (
      <div
        className='styled-hide-filter'
        onClick={this.onClick.bind(this, !this.state.popoverOpen)}
        ref={this.ref}
      >
        <StyledHideFilterButton
          id="PopoverLegacy"
          isDisabled={this.props.isDisabled}
        >
          {this.props.count}
          <Caret isOpen={this.state.popoverOpen}>
            <Icons.ExpanderDownIcon
              size="scale"
              isfill={true}
              color="#A3A9AE"
            />
          </Caret>
        </StyledHideFilterButton>

        <div className='dropdown-style' ref={this.dropDownRef}>
          <DropDown
            className="drop-down"
            manualY="8px"
            open={this.state.popoverOpen}
            clickOutsideAction={this.handleClick}
          >
            {this.props.children}
          </DropDown>
        </div>
      </div>
    );
  }
}
HideFilter.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool,
  isDisabled: PropTypes.bool,
  count: PropTypes.number
}
export default HideFilter;
