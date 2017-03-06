import React, { Component, PropTypes } from 'react';

export class FileViewer extends Component {
  static propTypes = {
    file: PropTypes.object
  }

  render() {
    const { id, mimetype } = this.props.file;

    const fileUrl = 'http://192.168.201.68/backend-global/modules-static-files/Screens/' + id;

    var viewer = "viewer n'est pas displonible pour ce type de fichier: " + mimetype;

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
