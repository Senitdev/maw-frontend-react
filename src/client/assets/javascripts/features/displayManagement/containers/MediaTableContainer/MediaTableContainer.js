/*
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as displayManagementActions, selector } from 'features/displayManagement';

import AgendaTable from '../../components/AgendaTable';
import FileTable from '../../components/FileTable';
import SceneTable from '../../components/SceneTable';
import ScreenTable from '../../components/ScreenTable';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class MediaTableContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayManagement: PropTypes.object.isRequired,
    mediaType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: []
    };
  }

  /**
   * Lorsque le composant va être affiché, les données sont récupérées du serveur.
   /
  componentWillMount() {
    this.props.actions.fetchMediaList(this.props.mediaType);
  }

  render() {

    switch (this.props.mediaType) {
      case 'agenda':
        return <AgendaTable dataSource={data} {...otherProps} />
      case 'file':
        return <FileTable dataSource={data} {...otherProps} />
      case 'Scene':
        return <SceneTable dataSource={data} {...otherProps} />
      case 'screen':
        return <ScreenTable dataSource={data} {...otherProps} />
    }
  }
}
*/
