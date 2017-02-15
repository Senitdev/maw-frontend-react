import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Input, Form, Button, Row, Col } from 'antd';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import './ImageList.scss';

class EditFormClass extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="edit-form" onSubmit={this.handleSubmit}>
        <Form.Item
          label="Nom">
           {getFieldDecorator('name', {
             initialValue: this.props.name,
             rules: [{required: true, message: 'Veuillez entrer un nom!'}],
           })(
             <Input />
           )}
         </Form.Item>
         <Form.Item>
           <Button type="primary" htmlType="submit" size="large">Modifier</Button>
         </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  const { mediaById, mediaByType } = state[displayManagementName];
  const { isFetching } = mediaByType['image'];

  return {
    isFetching,
    mediaById
  };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class ImageEditForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    mediaById: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (Object.getOwnPropertyNames(this.props.mediaById).length == 0)
      this.props.actions.fetchMedia('image');
  }


  render() {
    const EditForm = Form.create()(EditFormClass);

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>Image : {this.props.mediaById[this.props.params.idImage] ? this.props.mediaById[this.props.params.idImage].name : ''}</h1>
            {this.props.isFetching &&
              <Icon icon="reload" /> }
            <hr />
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <EditForm name={this.props.mediaById[this.props.params.idImage] ? this.props.mediaById[this.props.params.idImage].name : ''} />
          </Col>
        </Row>
      </div>
    );
  }

}
