import React, { PropTypes } from 'react';
import AppHeader from 'features/core/components/AppHeader';
import Helmet from "react-helmet";

import './App.scss';
import logo from 'images/LogoMAW.png';
import 'styles/timePicker.scss';

const App = (props) => (
  <div id="App">
    <Helmet
      link={[
          {rel: "shortcut icon", href: logo}
      ]}
    />
    <AppHeader />
    {props.children}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
