import React, { Component, PropTypes } from 'react';
import Rnd from 'react-rnd';
import { Row, Col } from 'antd';

export default class SceneEditorCursor extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    cursorWidth: PropTypes.number.isRequired,
    editorDurationWidth: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onDragStop: PropTypes.func.isRequired,
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
        onDrag={(event, ui) => {
          const newStart = Math.round(ui.position.left / this.props.editorDurationWidth * this.props.scaling);

          this.props.onDragStop(newStart);
        }}
      />
    );
  }
}