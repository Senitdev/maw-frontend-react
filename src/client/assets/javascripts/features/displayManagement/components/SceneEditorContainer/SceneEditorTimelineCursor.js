import React, { Component, PropTypes } from 'react';
import Rnd from 'react-rnd';

export default class SceneEditorTimelineCursor extends Component {

  static propTypes = {
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
        zIndex={130}
        initial={{
          x: 0,
          y: 0,
          width: 5,
          height: this.props.height,
        }}
        moveGrid={[this.props.editorDurationWidth / (this.props.scaling/100), 1]}
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
        onDragStop={() => this.rnd.updateZIndex(130)}
      />
    );
  }
}
