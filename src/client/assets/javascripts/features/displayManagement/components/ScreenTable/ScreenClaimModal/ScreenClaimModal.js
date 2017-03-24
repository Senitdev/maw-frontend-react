import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input, Modal } from 'antd';

import { actionCreators as displayManagementActions } from 'features/displayManagement';

@connect(null, (dispatch) => ({
  claimScreen: (code, name) => dispatch(displayManagementActions.claimScreen(code, name))
}))
export default class ScreenClaimModal extends Component {

  static propTypes = {
    claimScreen: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onClaimSuccess: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmLoading: false,
      nameValue: '',
      codeValue: '',
      textFieldCode: '',
      textFieldName: '',
      confirmText: '',
    };
  }

  handleChangeNameValue = (value) => {
    this.setState({
      nameValue: value.target.value
    });
  }

  handleChangeCodeValue = (value) => {
    this.setState({
      codeValue: value.target.value
    });
  }

  handleSubmit = () => {
    if (!(this.state.codeValue.length > 0)) {
      this.setState({
        textFieldCode: 'Obligatoire',
        textFieldName: 'Optionel',
        confirmText: `Veuillez entrer le code d'identification de votre télévisieur.`
      });
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    this.props.claimScreen(this.state.codeValue, this.state.nameValue)
    .then(() => {
      this.setState({
        confirmLoading: false,
        nameValue: '',
        codeValue: '',
        textFieldCode: '',
        textFieldName: '',
        confirmText: '',
      });
      this.props.onClaimSuccess();
    })
    .catch((error) => {
      if(error.status == 404) {
        this.setState({
          confirmLoading: false,
          confirmText: `Le code entré n'est pas reconnu. Vérifier qu'il n'y ai pas d'erreur de saisi.`,
        });
      } else if (error.status == 400) {
        this.setState({
          confirmLoading: false,
          confirmText: `Cet écran est déjà associé à un autre compte. si vous en êtes le propriétaire, veuillez réinitialiser l'écran.`,
        });
      } else {
        this.setState({
          confirmLoading: false,
          confirmText: `Une erreur est survenu, veuillez vérifier votre connection à internet et réessayer.`,
        });
      }
    });
  }

  render() {
    return (
      <Modal
        title="Entrer le code à chiffre affiché par le téléviseur."
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.onCancel}>
        Code d'identification du téléviseur
        <Input
          addonBefore={this.state.textFieldCode}
          value={this.state.codeValue}
          onChange={this.handleChangeCodeValue}
          onPressEnter={this.handleSubmit}
        />
        Nom donné au téléviseur
        <Input
          addonBefore={this.state.textFieldName}
          value={this.state.nameValue}
          onChange={this.handleChangeNameValue}
          onPressEnter={this.handleSubmit}
        />
        <div style={{color: 'red'}}>{this.state.confirmText}</div>
      </Modal>
    );
  }
}
