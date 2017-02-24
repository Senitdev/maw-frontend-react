import React, { Component, PropTypes } from 'react';
import { Tooltip, Modal, Button } from 'antd';

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
    const { name, id, mimetype } = this.props.file;

    const fileUrl = 'http://192.168.201.68/backend-global/modules-static-files/Screens/' + id;

    var viewer = "viewer n'est pas displonible pour ce type de fichier: " + mimetype;

    if(mimetype) {
      if (mimetype.search('image') === 0) {
        viewer = <img width='380px' src={fileUrl} />;
      }
    }

    return (
      <span>
        <Tooltip placement="left" title="Prévisualiser le média">
          <Button icon='eye' onClick={this.showModal} />
        </Tooltip>
        <Modal title={name}
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               width='400px'
               okText='fermer'
               cancelText='_'>
          {viewer}
        </Modal>
      </span>
    );
  }
}
