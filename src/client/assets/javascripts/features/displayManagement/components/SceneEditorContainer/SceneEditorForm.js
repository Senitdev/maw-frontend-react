import React, { Component, PropTypes } from 'react';
import { Form, Checkbox, Button, InputNumber, Row, Col } from 'antd';

export class SceneEditorForm extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    mediaData: PropTypes.object.isRequired,
    validateFields: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isDuration: this.props.mediaData.duration >= 0,
    };
  }

  changeDuration = (e) => {
    if (e.target.checked) {
      this.props.mediaData.duration = 0;
      this.setState({
        isDuration: true,
      });
    } else {
      this.props.mediaData.duration = -1;
      this.setState({
        isDuration: false,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(this.props.validateFields);
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
              label="box_left"
              hasFeedback
            >
              {getFieldDecorator('box_left', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }],
                initialValue: this.props.mediaData.boxLeft,
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
                initialValue: this.props.mediaData.boxTop,
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
                initialValue: this.props.mediaData.boxWidth,
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
                initialValue: this.props.mediaData.boxHeight,
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
                initialValue: this.props.mediaData.guestLeft,
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
                initialValue: this.props.mediaData.guestTop,
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
                initialValue: this.props.mediaData.guestWidth,
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
                initialValue: this.props.mediaData.guestHeight,
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
                initialValue: this.props.mediaData.startTimeOffset,
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
              <Checkbox defaultChecked={this.state.isDuration} onChange={this.changeDuration} />
              {getFieldDecorator('duration', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                  }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                  }],
                initialValue: this.state.isDuration ? this.props.mediaData.duration : -1,
              })(
                <InputNumber disabled={!this.state.isDuration} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{float: 'right'}}>
          <Button type="primary" htmlType="submit" size="large">Sauvegarder</Button>
        </Form.Item>
      </Form>
    );
  }
}
