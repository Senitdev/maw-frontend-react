import React, { Component, PropTypes } from 'react';

export default class SceneEditorDurationMarque extends Component {

  static propTypes = {
    x: PropTypes.number.isRequired,
  }

  render() {

    return (
      <div style={{position: 'absolute', backgroundColor: 'red', height: '10px', width: '1px', left: this.props.x}} />
    );
  }
}
