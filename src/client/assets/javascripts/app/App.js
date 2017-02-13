import React, { PropTypes } from 'react';
import { Layout, Menu, Dropdown, Button, Icon } from 'antd';
import { Col } from 'antd';
import { Link } from 'react-router';
const { Header } = Layout;

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/login">Logout <Icon type="logout" /></Link>
    </Menu.Item>
  </Menu>
);

const App = (props) => (
  <Layout style={{height:'100%'}}>
    <Header style={{backgroundColor: '#eee'}}>
      <Col span={23}>My Access Web</Col>
      <Col span={1}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button type="primary" shape="circle" icon="user" size="large" />
        </Dropdown>
      </Col>
    </Header>
    {props.children}
  </Layout>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
