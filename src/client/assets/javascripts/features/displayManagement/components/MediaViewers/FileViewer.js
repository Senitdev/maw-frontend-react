import React, { Component, PropTypes } from 'react';

import { Config } from 'app/config';

export class FileViewer extends Component {
  static propTypes = {
    file: PropTypes.object
  }

  render() {
    const { id, mimetype } = this.props.file;

    const fileUrl = Config.API + '/modules-static-files/Screens/' + id;

    var viewer = <div>viewer n'est pas displonible pour ce type de fichier: {mimetype}</div>;

    if(mimetype) {
      if (mimetype.search('image') === 0) {
        viewer = <img width='380px' src={fileUrl} />;
      } else if (mimetype.search('video') === 0) {
        viewer = <video width='380px' controls src='https://www.w3schools.com/html/mov_bbb.mp4' />;
      }
    }
    return (viewer);
  }
}
