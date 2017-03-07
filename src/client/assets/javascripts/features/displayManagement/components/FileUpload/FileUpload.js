import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Upload } from 'antd';
import { NotificationGenerator } from 'features/core/components/NotificationGenerator';

import { actionCreators as displayManagementActions } from 'features/displayManagement';
import { Config } from 'app/config';

import './FileUpload.scss';

@connect(null, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}), null, { withRef: true })
export default class FileUpload extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      fileList: [], // La liste des fichiers affichés pas le composant Upload
    };
  }

  /**
   * Ouvre la fenêtre de sélection du fichier à uploader.
   * Cette fonction simule un clique sur le bouton caché dans le composant Upload de Ant.
   */
  open() {
    this.virtualButton.click();
  }

  /**
   * Callback lorsque le status de l'upload change.
   * Seuls les fichiers en cours d'upload sont gardés dans la liste.
   * Des notifications sont générées lors des échecs ou succès des uploads.
   */
  onChange = (info) => {
    const { fileList, 'file': { status } } = info;

    switch (status) {
      case 'uploading':
        // Garde la liste dans l'état
        this.setState({ fileList });
        break;

      case 'done':
        // Notifie du succès
        NotificationGenerator.raise(`"${info.file.name}" ajouté.`, null, 'success');
        // Ajoute le fichier dans le store
        this.props.actions.addFile(info.file.response.data);
        // Retire le fichier de la liste
        this.setState({
          fileList: fileList.filter((file) => file != info.file)
        });
        break;

      case 'error':
        // Notifie de l'erreur
        NotificationGenerator.raise(`"${info.file.name}" n'a pas pu être envoyé.`, null, 'error');
        // Retire le fichier de la liste
        this.setState({
          fileList: fileList.filter((file) => file != info.file)
        });
        break;
    }
  }

  render() {
    return (
      <div className="maw-file-upload">
        <Upload
          name="file"
          action={Config.API + '/entities/1/modules/3/files'}
          data={{return: 1}}
          accept="video/*,image/*"
          showFileList={this.state.fileList.length > 0}
          fileList={this.state.fileList}
          onChange={this.onChange}>
          <button ref={(ref) => this.virtualButton = ref} style={{display: 'none'}} />
        </Upload>
      </div>
    );
  }
}
