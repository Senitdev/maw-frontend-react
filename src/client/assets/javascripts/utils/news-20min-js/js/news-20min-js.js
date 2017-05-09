export function news20MinJs(containerDOM, lang = 'fr') {
  var url;

  switch (lang) {
    case 'fr':
      url = 'http://www.20min.ch/ro/screenplayer/?view=0&preview=true';
      break;
    case 'de':
      url = 'http://www.20min.ch/screenplayer/?view=0&preview=true';
      break;
    case 'it':
      url = 'http://iframetio.tio.ch/widget/iframe_news_tio.asp?tiobx_bgcolor=%23e4e4e4&tiobx_height=115&tiobx_fntcolor=%23565656';
      break;
  }

  containerDOM.innerHTML = "\
    <iframe style='width: 100%; height: 100%; class='screen-player-preview' name='creen-player-preview' frameBorder='0' scrolling='no'\
      src='" + url + "'></iframe>\
  ";
}
