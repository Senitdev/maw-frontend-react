import React, { PropTypes } from 'react';
import { Layout } from 'antd';
const { Header } = Layout;

const App = (props) => (
  <Layout style={{height:'100%'}}>
    <Header>My Access Web</Header>
    {props.children}
  </Layout>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
