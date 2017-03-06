import React, { Component, PropTypes } from 'react';
import { Form, Checkbox, InputNumber, Row, Col } from 'antd';

const SceneEditorForm = Form.create({

  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {
      boxHeight: {
        ...props.mediaData.boxHeight
      },
      boxLeft: {
        ...props.mediaData.boxLeft
      },
      boxTop: {
        ...props.mediaData.boxTop
      },
      boxWidth: {
        ...props.mediaData.boxWidth
      },
      duration: {
        ...props.mediaData.duration
      },
      guestHeight: {
        ...props.mediaData.guestHeight
      },
      guestLeft: {
        ...props.mediaData.guestLeft
      },
      guestTop: {
        ...props.mediaData.guestTop
      },
      guestWidth: {
        ...props.mediaData.guestWidth
      },
      startTimeOffset: {
        ...props.mediaData.startTimeOffset
      },
    };
  },
})(
class SceneEditorForm extends Component {

  static propTypes = {
    changeDuration: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    mediaData: PropTypes.object.isRequired,
  }

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
              label="x %"
              hasFeedback
            >
              {getFieldDecorator('boxLeft', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber min={0} max={100} />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="y %"
              hasFeedback
            >
              {getFieldDecorator('boxTop', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber min={0} max={100} />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="largeur %"
              hasFeedback
            >
              {getFieldDecorator('boxWidth', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber min={0} max={100} />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="hauteur %"
              hasFeedback
            >
              {getFieldDecorator('boxHeight', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber min={0} max={100} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="guestLeft"
              hasFeedback
            >
              {getFieldDecorator('guestLeft', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="guestTop"
              hasFeedback
            >
              {getFieldDecorator('guestTop', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="guestWidth"
              hasFeedback
            >
              {getFieldDecorator('guestWidth', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber />
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...formItemLayout}
              label="guestHeight"
              hasFeedback
            >
              {getFieldDecorator('guestHeight', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
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
              label="Décalage en seconde"
              hasFeedback
            >
              {getFieldDecorator('startTimeOffset', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber />
              )}
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item
              {...formItemLayout}
              label="Durée"
              hasFeedback
            >
              <Checkbox checked={this.props.mediaData.duration.value >= 0} onChange={this.props.changeDuration} />
              {getFieldDecorator('duration', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                  }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                  }]
              })(
                <InputNumber disabled={this.props.mediaData.duration.value < 0} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
});

export default SceneEditorForm;
