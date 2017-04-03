import React, { Component, PropTypes } from 'react';

export default class SceneEditorTimelineDurationMarque extends Component {

  static propTypes = {
    editorDurationWidth: PropTypes.number.isRequired,
    scaling: PropTypes.number.isRequired,
    sceneDuration: PropTypes.number.isRequired,
  }

  /* évite de render à chaque mise à jours de l'interval quand la scène est en lécture.
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.sceneDuration == nextProps.sceneDuration
        && this.props.editorDurationWidth == nextProps.editorDurationWidth
        && this.props.scaling == nextProps.scaling)
      return false;
    else
      return true;
  }

  render() {
    const x = 2+Math.round((this.props.sceneDuration) / this.props.scaling * this.props.editorDurationWidth);
    return (
      <div style={{position: 'absolute', backgroundColor: 'red', height: '10px', width: '1px', left: x}} />
    );
  }
}
