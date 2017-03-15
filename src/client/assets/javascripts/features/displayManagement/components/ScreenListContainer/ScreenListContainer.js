import React, { Component, PropTypes } from 'react';
import { Icon, Input, Col, Modal, Row, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaTableContainer from '../MediaTableContainer';
import { AgendaSelectorContainer } from './AgendaSelectorContainer';

import './ScreenListContainer.scss';
import { actionCreators as displayManagementActions } from '../../';

@connect(undefined, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class ScreenListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  state = {
    confirmLoading: false,
    visible: false,
    nameValue: '',
    codeValue: '',
    textFieldCode: '',
    textFieldName: '',
    confirmText: '',
  }

  componentWillMount() {
    this.props.actions.fetchMediaList('agenda');
  }

  onAdd = () => {
    this.setState({
      visible: true,
    });
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

  handleAdd = () => {
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
    this.props.actions.claimScreen(this.state.codeValue, this.state.nameValue)
    .then(() => {
      this.setState({
        confirmLoading: false,
        visible: false,
        nameValue: '',
        codeValue: '',
        textFieldCode: '',
        textFieldName: '',
        confirmText: '',
      });

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

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onEdit = (id) => {
    // TODO: Callback bouton "Modifier écran"
    console.log(`Modifier écran ${id} cliqué`);
  }

  render() {

    const maxTimeWithoutPull = 1000 * 60 * 5;

    function statusColumnRender(screen) {
      if (Date.now() - screen.lastPull.getTime() > maxTimeWithoutPull) {
        return (
          <Tooltip title="Écran déconnecté" mouseEnterDelay={0.5}>
            <div className="ant-alert-error"><Icon type="laptop" /></div>
          </Tooltip>
        );
      }
      return (
        <Tooltip title="Écran connecté" mouseEnterDelay={0.5}>
          <div className="ant-alert-success"><Icon type="laptop" /></div>
        </Tooltip>
      );
    }

    const columns = [
      {
        title: 'Status',
        key: 'status',
        className: 'screen-status',
        render: statusColumnRender
      },
      {
        title: 'Agenda',
        key: 'agenda',
        className: 'agenda',
        render: (screen) => (<AgendaSelectorContainer screen={screen}/>)
      }
    ];

    return (
      <div>
        <Modal title="Entrer le code à chiffre affiché par le téléviseur."
          visible={this.state.visible}
          onOk={this.handleAdd}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          Code d'identification du téléviseur
          <Input
            addonBefore={this.state.textFieldCode}
            value={this.state.codeValue}
            onChange={this.handleChangeCodeValue}
            onPressEnter={this.handleAdd}
          />
          Nom donné au téléviseur
          <Input
            addonBefore={this.state.textFieldName}
            value={this.state.nameValue}
            onChange={this.handleChangeNameValue}
            onPressEnter={this.handleAdd}
          />
          <div style={{color: 'red'}}>{this.state.confirmText}</div>
        </Modal>
        <Row>
          <Col offset={1} span={22}>
            <h1>Écrans</h1>
            <hr style={{marginBottom: '4px'}} />
            <MediaTableContainer
              mediaType="screen"
              columns={columns}
              onAdd={this.onAdd}
              onEdit={this.onEdit} />
          </Col>
        </Row>
      </div>
    );
  }
}
