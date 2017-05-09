import React, { Component, PropTypes } from 'react';

import { Config } from 'app/config';

import 'javascripts/utils/clock-js/css/clock-js.css';
import { clockJs } from 'javascripts/utils/clock-js/js/clock-js';
import { news20MinJs } from 'javascripts/utils/news-20min-js/js/news-20min-js';
import { meteoJs } from 'javascripts/utils/meteo-js/js/meteo-js';

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
    viewer: <div style={{backgroundColor: 'black', width: '100%', height: '100%'}}>viewer n'est pas displonible pour ce type de fichier.</div>,
  }

  componentDidMount() {
    const { id, mimetype } = this.props.file;
    const fileUrl = Config.API + 'modules-static-files/Screens/tenants/1/original/' + id;

    const sizes = {
      width: this.props.width ? this.props.width : '380px',
      height: this.props.height ? this.props.height : 'auto',
    };

    if (mimetype) {
      if (mimetype.search('image') === 0) {
        this.setState({
          mod: `image`,
          viewer: <img {...sizes} src={fileUrl} />,
        });
      } else if (mimetype.search('clock') === 0) {
        var containerClock;
        this.setState({
          mod: `clock`,
          viewer: <div ref={(r) => containerClock = r} style={{width: '100%', height: '100%'}} />
        }, () => {
          clockJs(containerClock);
        });
      } else if (mimetype.search('meteo') === 0) {
        var containerMeteo;
        this.setState({
          mod: `meteo`,
          viewer: <div ref={(r) => containerMeteo = r} style={{width: '100%', height: '100%'}} />
        }, () => {
          meteoJs(containerMeteo, 'geneve', 0);
        });
      } else if (mimetype.search('news') === 0) {
        var containerNews;
        this.setState({
          mod: `news`,
          viewer: <div style={{width: '100%', height: '100%', position: 'relative'}}>
                    <div ref={(r) => containerNews = r} style={{width: '100%', height: '100%'}} />
                    <div style={{top: '0', left: '0', width: '100%', height: '100%', position: 'absolute'}} />
                  </div>
        }, () => {
          news20MinJs(containerNews, 'de');
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
