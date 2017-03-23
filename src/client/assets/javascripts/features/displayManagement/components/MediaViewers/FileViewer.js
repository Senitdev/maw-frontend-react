import React, { Component, PropTypes } from 'react';

import { Config } from 'app/config';

export class FileViewer extends Component {
  static propTypes = {
    displayControls: PropTypes.bool,
    file: PropTypes.object,
    height: PropTypes.string,
    videoControls: PropTypes.string,
    width: PropTypes.string,
  }

  state = {
    mod: 'null',
    viewer: <div>viewer n'est pas displonible pour ce type de fichier.</div>,
  }

  componentDidMount() {
    const { id, mimetype } = this.props.file;
    const fileUrl = Config.API + '/modules-static-files/Screens/tenants/1/original/' + id;

    const sizes = {
      width: this.props.width ? this.props.width : '380px',
      height: this.props.height ? this.props.height : 'auto',
    };

    if(mimetype) {
      if (mimetype.search('image') === 0) {
        this.setState({
          mod: `image`,
          viewer: <img {...sizes} src={fileUrl} />,
        });
      } else if (mimetype.search('video') === 0) {
        if (this.props.displayControls)
          this.setState({
            mod: 'video',
            viewer: <video {...sizes} ref={(r) => this.videoPlayer = r} src={fileUrl} controls />,
          });
        else
          this.setState({
            mod: 'video',
            viewer: <video {...sizes} ref={(r) => this.videoPlayer = r} src={fileUrl} loop muted preload />,
          });
      }
    }
  }

  componentDidUpdate() {
    if (this.state.mod == 'video')
      if (this.props.videoControls == 'play' && this.videoPlayer.paused) {
        this.videoPlayer.play();
      }
      else if (this.props.videoControls == 'pause' && !this.videoPlayer.paused)
        this.videoPlayer.pause();
      else if (!isNaN(this.props.videoControls)) { //si controls est un nombre
        this.videoPlayer.currentTime = parseInt(this.props.videoControls) / 1000;
      }
  }

  render() {
    return (this.state.viewer);
  }
}
