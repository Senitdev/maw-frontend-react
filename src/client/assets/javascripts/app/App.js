import React, { PropTypes } from 'react';
import AppHeader from 'features/core/components/AppHeader';

import './App.scss';

const App = (props) => (
  <div id="App">
    <AppHeader />
    {props.children}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
