import React, { Component, PropTypes } from 'react';

import { Config } from 'app/config';

export class FileViewer extends Component {
  static propTypes = {
    displayControls: PropTypes.bool,
    file: PropTypes.object,
    videoControls: PropTypes.string,
  }

  state = {
    mod: 'null',
    viewer: <div>viewer n'est pas displonible pour ce type de fichier.</div>,
  }

  componentDidMount() {

    const { id, mimetype } = this.props.file;
    const fileUrl = Config.API + '/modules-static-files/Screens/' + id;

    if(mimetype) {
      if (mimetype.search('image') === 0) {
        this.setState({
          mod: `image`,
          viewer: <img width='380px' src={fileUrl} />,
        });
      } else if (mimetype.search('video') === 0) {
        if (this.props.displayControls)
          this.setState({
            mod: 'video',
            viewer: <video width='380px' ref={(r) => this.videoPlayer = r} src={fileUrl} controls />,
          });
        else
          this.setState({
            mod: 'video',
            viewer: <video width='380px' ref={(r) => this.videoPlayer = r} src={fileUrl} />,
          });
      }
    }
  }

  componentDidUpdate() {
    if (this.state.mod == 'video')
      if (this.props.videoControls == 'play')
        this.videoPlayer.play();
      else if (this.props.videoControls == 'pause')
        this.videoPlayer.pause();
      else if (!isNaN(this.props.videoControls))
        this.videoPlayer.currentTime = (parseInt(this.props.videoControls));
  }

  render() {
    return (this.state.viewer);
  }
}
