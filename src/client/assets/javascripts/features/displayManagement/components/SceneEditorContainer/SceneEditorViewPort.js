import React, { Component, PropTypes } from 'react';
import Rnd from 'react-rnd';
import { FileViewer } from '../MediaViewers/FileViewer';

export default class SceneEditorViewPort extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    editorHeight: PropTypes.number.isRequired,
    editorWidth: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    media: PropTypes.object.isRequired,
    mediaControls: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onDragStop: PropTypes.func.isRequired,
    onResizeStop: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    zIndex: PropTypes.number.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    this.rnd.updatePosition({
      x: nextProps.x,
      y: nextProps.y,
    });
    this.rnd.updateSize({
      width: nextProps.width,
      height: nextProps.height
    });
    this.rnd.updateZIndex(nextProps.zIndex);
  }

  rnd;
  haveDrag = false;

  render() {

    return (
      <Rnd
        style={{backgroundColor: this.props.backgroundColor}}
        ref={(c) => { this.rnd = c; }}
        initial={{
          x: this.props.x,
          y: this.props.y,
          width: this.props.width,
          height: this.props.height,
        }}
        resizeGrid={[this.props.editorWidth / 100, this.props.editorHeight / 100]}
        moveGrid={[this.props.editorWidth / 100, this.props.editorHeight / 100]}
        className="editor-position"
        minWidth={1}
        minHeight={1}
        bounds={'parent'}
        moveAxis="both"
        isResizable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
        zIndex={this.props.zIndex}
        onClick={this.props.onClick}
        onResize={(direction, styleSize, clientSize) => {
          const newHeight = Math.round(clientSize.height / this.props.editorHeight * 100);
          const newWidth = Math.round(clientSize.width / this.props.editorWidth * 100);

          this.props.onResizeStop(newHeight, newWidth);
        }}
        onDragStart={() => {
          this.haveDrag = false;
        }}
        onDrag={() => {
          this.haveDrag = true;
        }}
        onDragStop={(event, ui) => {
          if (this.haveDrag) {
            const newX = Math.round(ui.position.left / this.props.editorWidth * 100);
            const newY = Math.round(ui.position.top / this.props.editorHeight * 100);

            this.props.onDragStop(newX, newY);
          }
        }}
      >
        <FileViewer
          file={this.props.media}
          videoControls={this.props.mediaControls}
          width='100%'
          height='100%' />
      </Rnd>
    );
  }
}
