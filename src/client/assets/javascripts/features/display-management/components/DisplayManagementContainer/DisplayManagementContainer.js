import { Component, PropTypes } from 'react';

export default class DisplayManagementContainer extends Component {

  render() {
    return (
      this.props.children
    );
  }
}

DisplayManagementContainer.propTypes = {
  children: PropTypes.element.isRequired
};
