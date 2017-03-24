import React, { Component, PropTypes } from 'react';

import './TitleBar.scss';

export default class TitleBar extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props;

    return (
      <div className="maw-title-bar">
        {title && <h1>{this.props.title}</h1>}
        {children}
        <hr />
      </div>
    );
  }
}
