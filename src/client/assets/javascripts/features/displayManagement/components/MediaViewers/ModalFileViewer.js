import React, { Component, PropTypes } from 'react';
import { Tooltip, Modal, Button } from 'antd';

import { FileViewer } from './FileViewer';

export class ModalFileViewer extends Component {

  static propTypes = {
    file: PropTypes.object
  }

  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <span>
        <Tooltip title="Prévisualiser" placement="bottom" mouseEnterDelay={0.6}>
          <Button icon='eye' onClick={this.showModal} />
        </Tooltip>
        <Modal title={name}
               key='modalViewer'
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               width='400px'
               footer={null} >
          {this.state.visible ?
          <FileViewer
            file={this.props.file}
            displayControls
          /> : null}
        </Modal>
      </span>
    );
  }
}
