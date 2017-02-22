import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import { Form, Checkbox, Layout, Button, InputNumber, Row, Col } from 'antd';

import './SceneEditorContainer.scss';

import { MediaTypes } from 'models/displayManagement';

@connect((state) => {
  const { mediaById, mediaByType } = state[displayManagementName];

  return {
    mediaByType,
    mediaById
  };

}, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class SceneEditorContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaByType: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      medias: [],
      mediaSelected: -1
    };
  }

  componentWillMount() {
    for (let key of Object.keys(MediaTypes)) {
      if (this.props.mediaByType[MediaTypes[key].key].items.length == 0)
        this.props.actions.fetchMedia(MediaTypes[key].key);
    }
  }

  componentDidMount() {
    $("#scene-editor-list").droppable({
      drop: (event, ui) => {
        this.setState({
          medias: this.state.medias.concat([ui.draggable.attr("id")])
        });
      }
    });
  }

  selecteMediaInScene = (id) => {
    this.setState({
      mediaSelected: id
    });
  }

  removeMediaInScene = (id) => {
    var newMedias = this.state.medias;
    newMedias.splice(id, 1);

    var newMediaSelected = this.state.mediaSelected;
    if (id == this.state.mediaSelected)
      newMediaSelected = -1;
    else if (id < this.state.mediaSelected) {
      newMediaSelected--;
    }

    this.setState({
      medias: newMedias,
      mediaSelected: newMediaSelected
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  render() {
    var mediaListLi = [];
    for (var i = 0; i < this.state.medias.length; i++) {
      let idTemp = i;
      var className = idTemp == this.state.mediaSelected ? 'selected' : '';
      mediaListLi.push(
        <li key={idTemp} className={className}>
          <a onClick={() => this.selecteMediaInScene(idTemp)}>{this.props.mediaById[this.state.medias[idTemp]].name}</a>
          <Button type="danger" icon="delete" size="small" onClick={() => this.removeMediaInScene(idTemp)} />
        </li>
      );
    }

    const RegistrationForm = Form.create()(React.createClass({
      handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
      render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        };
        return (
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="box_left"
                  hasFeedback
                >
                  {getFieldDecorator('box_left', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="box_top"
                  hasFeedback
                >
                  {getFieldDecorator('box_top', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="box_width"
                  hasFeedback
                >
                  {getFieldDecorator('box_width', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="box_height"
                  hasFeedback
                >
                  {getFieldDecorator('box_height', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="guest_left"
                  hasFeedback
                >
                  {getFieldDecorator('guest_left', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="guest_top"
                  hasFeedback
                >
                  {getFieldDecorator('guest_top', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="guest_width"
                  hasFeedback
                >
                  {getFieldDecorator('guest_width', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  {...formItemLayout}
                  label="guest_height"
                  hasFeedback
                >
                  {getFieldDecorator('guest_height', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <Form.Item
                  {...formItemLayout}
                  label="start_time_offset"
                  hasFeedback
                >
                  {getFieldDecorator('start_time_offset', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                    <InputNumber />
                  )}
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  {...formItemLayout}
                  label="duration"
                  hasFeedback
                >
                  <Checkbox />
                  {getFieldDecorator('duration', {
                    rules: [{
                      type: 'number', message: 'Veuillez rentrer un nombre valide!',
                    }, {
                      required: true, message: 'Veuillez rentrer un nombre!',
                    }],
                  })(
                     <InputNumber />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{float: 'right'}}>
              <Button type="primary" htmlType="submit" size="large">Sauvegarder</Button>
            </Form.Item>
          </Form>
        );
      },
    }));

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Layout>
            <Layout.Sider id="scene-editor-list">
              <h3>Médias dans la scène</h3>
              <ul>
                {mediaListLi}
              </ul>
            </Layout.Sider>
            <Layout.Content>
              { this.state.mediaSelected >= 0 &&
                <RegistrationForm />
              }
            </Layout.Content>
          </Layout>
        </Layout.Content>
      </Layout>
    );
  }
}
