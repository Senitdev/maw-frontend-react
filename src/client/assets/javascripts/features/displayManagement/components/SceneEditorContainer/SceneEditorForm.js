import React, { Component, PropTypes } from 'react';
import { Form, Collapse, InputNumber, Radio } from 'antd';

const SceneEditorForm = Form.create({

  onFieldsChange(props, changedFields) {
    for (const key of Object.keys(changedFields)) {
    //  changedFields[key].value = parseInt(changedFields[key].value);
    }
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
        ...props.mediaData.duration,
        value: props.mediaData.duration.value / 1000
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
        ...props.mediaData.startTimeOffset,
        value: props.mediaData.startTimeOffset.value / 1000
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

    const numberValidation = {
      rules: [{
        transform: (value) => parseInt(value),
        min: 0,
        max: 100,
        type: 'number', message: 'Veuillez rentrer un nombre valide!',
      }, {
        required: true, message: 'Veuillez rentrer un nombre!',
      }]
    };

    return (
      <Form id="scene-editor-form" onSubmit={this.handleSubmit}>
        <Collapse defaultActiveKey={['1', '2', '3']} bordered={false}>
          <Collapse.Panel header={<h3>Positions</h3>} key="1">
            <Form.Item
              label="x"
              hasFeedback
            >
              {getFieldDecorator('boxLeft', numberValidation)(
                <input type="number" min={0} max={100} />
              )} %
            </Form.Item>
            <Form.Item
              label="y"
              hasFeedback
            >
              {getFieldDecorator('boxTop', numberValidation)(
                <input type="number" min={0} max={100} />
              )} %
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header={<h3>Dimensions</h3>} key="2">
            <Form.Item
              label="largeur"
              hasFeedback
            >
              {getFieldDecorator('boxWidth', numberValidation)(
                <input type="number" min={0} max={100} />
              )} %
            </Form.Item>
            <Form.Item
              label="hauteur"
              hasFeedback
            >
              {getFieldDecorator('boxHeight', numberValidation)(
                <input type="number" min={0} max={100} />
              )} %
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header={<h3>Temps</h3>} key="3">
            <Form.Item
              label="Démarre à "
              hasFeedback
            >
              {getFieldDecorator('startTimeOffset', {
                rules: [{
                  transform: (value) => parseFloat(value),
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <input type="number" min={0} step={0.001} />
              )} s
            </Form.Item>
            <Form.Item
              hasFeedback >
            <Radio.Group onChange={this.props.changeDuration} value={this.props.mediaData.duration.value >= 0 ? 1 : 2}>
              <Radio value={1}>
                Pendant :

                {getFieldDecorator('duration', {
                  rules: [{
                    transform: (value) => parseFloat(value),
                    type: 'number', message: 'Veuillez rentrer un nombre valide!',
                  }, {
                    required: true, message: 'Veuillez rentrer un nombre!',
                  }]
                })(
                  <input type="number" min={0.001} style={{margin: '0 3px 0 3px'}} disabled={this.props.mediaData.duration.value <= 0} step={0.001} />
                )}
                s</Radio>
            </Radio.Group>
           </Form.Item>
          </Collapse.Panel>
        </Collapse>
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
      </Form>
    );
  }
});

export default SceneEditorForm;
