import React, { Component, PropTypes } from 'react';
import { Modal } from 'antd';

import TitleBar from '../TitleBar';
import MediaTable from '../MediaTable';
import { FileViewer } from '../MediaViewers/FileViewer';
import FileUpload from './FileUpload';

import './FileTable.scss';

export default class FileTable extends Component {

  static propTypes = {
    onNameEdit: PropTypes.func,
  };

  static ColumnModel = {
    resolution: {
      title: 'Résolution',
      key: 'resolution',
      render: (text, file) => `${file.width}x${file.height} (px)`,
    },
    weight: {
      title: 'Poid',
      key: 'weight',
      sorter: (a, b) => b.weight - a.weight,
      render: (text, file) => `${file.weight} (Ko)`
    },
    mimetype: {
      title: 'mimetype',
      dataIndex: 'mimetype',
      key: 'mimetype',
      sorter: (a, b) => b.mimetype.localeCompare(a.mimetype),
    }
  };

  constructor(props) {
    super(props);

    this.state = ({
      previewIsVisible: false,
      previewWidth: 0,
      previewFile: null
    });
  }

  openFileUpload = () => {
    this.fileUpload.open();
  }

  openPreview = (file) => {
    const maxPreviewWidth = 768;
    const maxPreviewHeight = 432;

    // Calcul la largeur de la preview en fonction des dimensions du fichier et des dimensions maximales
    const widthRatio = file.width / maxPreviewWidth;
    const heightRatio = file.height / maxPreviewHeight;
    const largerRatio = widthRatio > heightRatio ? widthRatio : heightRatio;
    const previewWidth = largerRatio > 1 ? file.width / largerRatio : file.width;

    this.setState({
      previewIsVisible: true,
      previewWidth,
      previewFile: file
    });
  }

  closePreview = () => {
    this.setState({
      previewIsVisible: false
    });
  }

  removePreviewFile = () => {
    this.setState({
      previewFile: null
    });
  }

  render() {

    const columns = [
      MediaTable.ColumnModel.id,
      MediaTable.ColumnModel.name(this.props.onNameEdit),
      FileTable.ColumnModel.resolution,
      FileTable.ColumnModel.weight,
      FileTable.ColumnModel.mimetype,
      MediaTable.ColumnModel.ratio,
      MediaTable.ColumnModel.createdAt,
    ];
    const { previewIsVisible, previewWidth, previewFile } = this.state;

    return (
      <div>
        <TitleBar title="Fichiers" />
        <FileUpload ref={(ref) => this.fileUpload = ref ? ref.getWrappedInstance() : null} />
        <MediaTable columns={columns} onAdd={this.openFileUpload} onPreview={this.openPreview} {...this.props} />
        <Modal
          visible={previewIsVisible}
          key={Date.now()}
          title={previewFile ? previewFile.name : null}
          footer={null}
          onCancel={this.closePreview}
          afterClose={this.removePreviewFile}
          width={previewWidth}>
          { previewFile && <FileViewer file={previewFile} width="auto" displayControls /> }
        </Modal>
      </div>
    );
  }
}
