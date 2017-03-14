import React, { Component, PropTypes } from 'react';
import { Form, Switch, InputNumber, Row, Col, Radio } from 'antd';

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
          <Col span={12}>
            <h3>Position :</h3>
          </Col>
          <Col span={12}>
            <h3>Dimension :</h3>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="x"
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
              )} %
            </Form.Item>
          </Col>
          <Col offset={6} span={6}>
            <Form.Item
              {...formItemLayout}
              label="largeur"
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
              )} %
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="y"
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
              )} %
            </Form.Item>
          </Col>
          <Col offset={6} span={6}>
            <Form.Item
              {...formItemLayout}
              label="hauteur"
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
              )} %
            </Form.Item>
          </Col>
        </Row>
        {/*
        <Row>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="Intégrant x"
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
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="Intégrant y"
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
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="Intégrant largeur"
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
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="Intégrant hauteur"
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
        */}
        <Row>
          <Col span="24">
            <h3>Temps :</h3>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              {...formItemLayout}
              label="Démarre à "
              hasFeedback
            >
              {getFieldDecorator('startTimeOffset', {
                rules: [{
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <InputNumber step={0.001}/>
              )} secondes
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              hasFeedback >
            <Radio.Group onChange={this.props.changeDuration} value={this.props.mediaData.duration.value >= 0 ? 1 : 2}>
              <Radio value={1}>
                S'affiche pendant :

                {getFieldDecorator('duration', {
                  rules: [{
                    type: 'number', message: 'Veuillez rentrer un nombre valide!',
                  }, {
                    required: true, message: 'Veuillez rentrer un nombre!',
                  }]
                })(
                   <InputNumber style={{marginLeft: '3px'}} disabled={this.props.mediaData.duration.value < 0} step={0.001} />
                )}
                secondes</Radio><br />
              <Radio value={2}><span>S'affiche éternellement</span></Radio>
            </Radio.Group>
           </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
});

export default SceneEditorForm;
