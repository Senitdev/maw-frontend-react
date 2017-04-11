import React, { Component, PropTypes } from 'react';
import { InputNumber, Row, Col } from 'antd';

export default class TimePicker extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    size: PropTypes.string,
    time: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = this.propsToState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.propsToState(nextProps));
  }

  propsToState = (nextProps) => {
    const t = nextProps.time % 604800;
    return {
      se: Math.floor(nextProps.time / 604800),
      j: Math.floor(t / 86400),
      h: Math.floor(t % 86400 / 3600),
      m: Math.floor(t % 86400 % 3600 / 60),
      s: nextProps.time % 60
    };
  }

  sendOnChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.s + this.state.m * 60 + this.state.h * 3600 + this.state.j * 86400 + this.state.se * 604800);
    }
  }

  onChangeInput = (value, type) => {
    this.setState({
      [type]: value,
    }, () => this.sendOnChange());
  }

  render() {

    const size = this.props.size ? this.props.size : '';

    return (
      <Row>
        <Col span={12}>
          Semaines :
        </Col>
        <Col span={12}>
          <InputNumber value={this.state.se} size={size} min={0} onChange={(v) => this.onChangeInput(v, "se")} />
        </Col>
        <Col span={12}>
          Jours :
        </Col>
        <Col span={12}>
          <InputNumber value={this.state.j} size={size} min={0} onChange={(v) => this.onChangeInput(v, "j")} />
        </Col>
        <Col span={12}>
          Heures :
        </Col>
        <Col span={12}>
          <InputNumber value={this.state.h} size={size} min={0} onChange={(v) => this.onChangeInput(v, "h")} />
        </Col>
        <Col span={12}>
          Minutes :
        </Col>
        <Col span={12}>
          <InputNumber value={this.state.m} size={size} min={0} max={60} onChange={(v) => this.onChangeInput(v, "m")} />
        </Col>
        <Col span={12}>
          Secondes :
        </Col>
        <Col span={12}>
          <InputNumber value={this.state.s} size={size} min={0} max={60} onChange={(v) => this.onChangeInput(v, "s")} />
        </Col>
      </Row>
    );
  }
}
