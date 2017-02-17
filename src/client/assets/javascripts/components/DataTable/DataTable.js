import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Table, Input, Button, Row, Col, Tooltip, Dropdown, Menu, Icon } from 'antd';
import { Link } from 'react-router';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from 'features/displayManagement';

const mapStateToProps = (state) => {
  const { error } = state[displayManagementName];

  return { error };
};

@connect(mapStateToProps, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class DataTable extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    dataSource: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onDeleteSelection: PropTypes.func,
    onEdit: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    onRefresh: PropTypes.func,
    rowSelection: PropTypes.object,
    title: PropTypes.string,
  };

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
      return record;
    }).filter((record) => !!record);
  }

  render() {

    const data = !this.state.searchText ? this.props.dataSource : this.search();
    const columns = [
      ...this.props.columns,
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        fixed: 'right',
        width: 110,
        render: (text, record) => (
          <span>
            <Tooltip placement="left" title="Prévisualiser le média">
              <Button icon="eye" />
            </Tooltip>
            { this.props.onEdit &&
            <Tooltip placement="bottom" title="Modifier le média">
              { typeof this.props.onEdit == 'string' ?
                <Link to={this.props.onEdit + record.id}><Button icon="edit" /></Link> :
                <Button icon="edit" onClick={() => {this.props.onEdit(record.id);}} />
              }
            </Tooltip> }
            { this.props.onDelete &&
            <Tooltip placement="bottom" title="Supprimer le média">
              <Button icon="delete" onClick={() => {this.props.onDelete(record.id);}} />
            </Tooltip> }
          </span>
        )
      }
    ];
    const actionOnSelectedMenu = (
      <Menu>
        { this.props.onDeleteSelection &&
        <Menu.Item key="deleteSelected">
          <Tooltip placement="left" title="Supprime tout les éléments sélectionnés dans la liste"><Icon type="delete" /> Supprimer la sélection</Tooltip>
        </Menu.Item> }
        <Menu.Item key="editSelected">
          <Tooltip placement="left" title="Vers l'édition multiple"><Icon type="edit" /> Editer la sélection</Tooltip>
        </Menu.Item>
      </Menu>
    );
    var errors = [];
    for (let i=0; i<this.props.error.length; i++) {
      if(!this.props.error[i].confirmed)
        errors.push(<Alert message={"Une erreur est survenu: " + this.props.error[i].error}
                           description={this.props.error[i].message}
                           key={"errorId:"+i}
                           type="error"
                           closable
                           onClose={() => this.props.actions.errorConfirmed(i)} />);
    }

    return (
      <div>
        <Row>
          <Col offset={1} span={22}>
            {errors}
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <h1>{this.props.title}</h1>
            <hr />
          </Col>
        </Row>
        <Row style={{marginTop: '6px'}}>
          { this.props.onRefresh &&
          <Col offset={1} span={1}>
            <Tooltip placement="right" title="Rafraichir les données">
              <Button loading={this.props.loading} icon="reload" onClick={this.props.onRefresh} />
            </Tooltip>
          </Col> }
          <Col offset={5} span={6}>
            <Input
              placeholder="Recherche"
              value={this.state.searchText}
              onChange={this.onInputChange}
            />
          </Col>
          <Col offset={5} span={5}>
            <Dropdown overlay={actionOnSelectedMenu}>
              <Button>
                <Icon type="down" /> Actions sur la sélection
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row style={{paddingTop: '4px'}}>
          <Col offset={1} span={22}>
            <Table
              loading={this.props.loading}
              columns={columns}
              dataSource={data}
              rowKey={(data) => data.id}
              rowSelection={this.props.rowSelection} />
          </Col>
        </Row>
      </div>
    );
  }
}
