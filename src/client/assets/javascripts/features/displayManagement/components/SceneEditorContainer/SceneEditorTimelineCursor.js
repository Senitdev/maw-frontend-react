import React, { Component, PropTypes } from 'react';
import Rnd from 'react-rnd';

export default class SceneEditorTimelineCursor extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    cursorWidth: PropTypes.number.isRequired,
    editorDurationWidth: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onDrag: PropTypes.func.isRequired,
    scaling: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    this.rnd.updatePosition({
      x: nextProps.x,
    });
  }

  rnd;

  render() {

    return (
      <Rnd
        ref={(c) => { this.rnd = c; }}
        initial={{
          x: 0,
          y: 0,
          width: this.props.cursorWidth,
          height: this.props.height,
        }}
        moveGrid={[this.props.editorDurationWidth / (this.props.scaling/100), 1]}
        style={{backgroundColor: this.props.backgroundColor}}
        className="editor-cursor-element"
        isResizable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        bounds={'parent'}
        moveAxis="x"
        onDrag={(event, ui) => this.props.onDrag(ui.position.left)}
      />
    );
  }
}
