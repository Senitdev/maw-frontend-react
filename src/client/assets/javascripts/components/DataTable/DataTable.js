import React, { Component } from 'react';
import { Table, Input, Button, Row, Col, Tooltip } from 'antd';

export default class DataTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      data: this.props.dataSource
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource) {
      this.setState({ data: nextProps.dataSource });
    }
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  search() {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');

    return this.props.dataSource.map((record) => {
      const match = record.name.match(reg);
      if (!match) {
        return null;
      }
      return {
        ...record,
        name: (
          <span>
            {record.name.split(reg).map((text, i) => (
              i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
            ))}
          </span>
        )
      };
    }).filter(record => !!record);
  }

  render() {

    const data = !this.state.searchText ? this.props.dataSource : this.search();

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            <h1>{this.props.title}</h1>
            <hr />
          </Col>
        </Row>
        <Row style={{marginTop: '6px'}}>
          <Col offset={1} span={1}>
            <Tooltip placement="right" title="Rafraichir les données">
              <Button loading={this.props.loading} icon="reload" onClick={this.props.onRefresh} />
            </Tooltip>
          </Col>
          <Col>

          </Col>
          <Col offset={18} span={3}>
            <Input
              placeholder="Recherche"
              value={this.state.searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
          </Col>
        </Row>
        <Row style={{paddingTop: '4px'}}>
          <Col offset={1} span={22}>
            <Table
              loading={this.props.loading}
              columns={this.props.columns}
              dataSource={data}
              rowKey={data => data.id}
              rowSelection={this.props.rowSelection} />
          </Col>
        </Row>
      </div>
    );
  }
}
