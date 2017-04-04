import React, { Component, PropTypes } from 'react';
import { Form, Collapse, Radio } from 'antd';

const SceneEditorForm = Form.create({

  onFieldsChange(props, changedFields) {
    const key = Object.keys(changedFields)[0];
    props.onChange({
      [key]: Number(changedFields[key].value),
    });
  },

  mapPropsToFields(props) {
    return {
      boxHeight: {value: props.mediaData.boxHeight},
      boxLeft: {value: props.mediaData.boxLeft},
      boxTop: {value: props.mediaData.boxTop},
      boxWidth: {value: props.mediaData.boxWidth},
      duration: {value: props.mediaData.duration},
      guestHeight: {value: props.mediaData.guestHeight},
      guestLeft: {value: props.mediaData.guestLeft},
      guestTop: {value: props.mediaData.guestTop},
      guestWidth: {value: props.mediaData.guestWidth},
      startTimeOffset: {value: props.mediaData.startTimeOffset},
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
                  type: 'number', message: 'Veuillez rentrer un nombre valide!',
                }, {
                  required: true, message: 'Veuillez rentrer un nombre!',
                }]
              })(
                <input type="number" min={0} />
              )} ms
            </Form.Item>
            <Form.Item
              hasFeedback >
            <Radio.Group onChange={this.props.changeDuration} value={this.props.mediaData.duration >= 0 ? 1 : 2}>
              <Radio value={1}>
                Pendant :

                {getFieldDecorator('duration', {
                  rules: [{
                    type: 'number', message: 'Veuillez rentrer un nombre valide!',
                  }, {
                    required: true, message: 'Veuillez rentrer un nombre!',
                  }]
                })(
                  <input type="number" min={1} style={{margin: '0 3px 0 3px'}} disabled={this.props.mediaData.duration <= 0} />
                )}
                ms</Radio>
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
