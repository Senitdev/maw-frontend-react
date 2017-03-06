import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Icon, Menu } from 'antd';
const { Item, SubMenu } = Menu;

import './SideMenu.scss';

@withRouter
export default class SideMenu extends Component {

  static propTypes = {
    collapsed: PropTypes.bool,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.state = {
      openKeys: [],
      selectedKeys: [],
    };
  }

  /**
   * Lorsque le menu s'est affiché, définit les "openKeys" et la "selectedKeys" en fonction de
   * "pathname" (la route) et de si le menu est "collapsed" ou non.
   */
  componentDidMount() {
    const keys = this.findKeys(this.props.location.pathname);

    this.setState({
      selectedKeys: keys.selectedKeys,
      openKeys: this.props.collapsed ? [] : keys.openKeys
    });
  }

  /**
   * Si la route (pathname) change, adapte la "selectedKeys".
   * Si le menu change de format (collapsed), adapte les "openKeys".
   */
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;

    if (pathname != this.props.location.pathname || nextProps.collapsed != this.props.collapsed) {
      const keys = this.findKeys(pathname);

      this.setState({
        selectedKeys: keys.selectedKeys,
        openKeys: nextProps.collapsed ? [] : keys.openKeys
      });
    }
  }

  /**
   * Cherche dans le menu la "selectedKeys" et les "openKeys".
   */
  findKeys(pathname) {

    // Utilise une fonction récursive pour récupérer les "keys" dans le menu
    let keys = (function findOpenKeysRec(menuNode) {

      // Si le noeud est un item avec le prop "isRouterLink" valant "true"
      if (menuNode.props && menuNode.props.isRouterLink) {
        // Si le chemin du lien correspond à la route (pathname), la "key" de
        // l'item est retournée en tant que "selectedKeys"
        const linkPathReg = new RegExp('^' + (menuNode.props.to || menuNode.key));
        if (pathname.match(linkPathReg)) {
          return {
            selectedKeys: [ menuNode.key ],
            openKeys: []
          };
        }
      }
      // Sinon, si le noeud a des enfants
      else if (menuNode.props && menuNode.props.children) {
        const children = menuNode.props.children instanceof Array ? menuNode.props.children : [ menuNode.props.children ];

        // Explore les enfants en appelant récursivement cette fonction
        for (let child of children) {
          let keys = findOpenKeysRec(child);

          // Si des clés sont remontées de la branche enfant, l'item sélectionné a donc été trouvé dans celle-ci
          if (keys) {
            // Ajoute la key du noeud courant (s'il y en a une) aux openKeys et les retourne
            if (menuNode.key) {
              keys.openKeys = [ menuNode.key, ...keys.openKeys ];
            }
            return keys;
          }
        }
      }
      // Si rien n'a été trouvé, retourne null
      return null;

    })(this.menu);

    return keys ? keys : { selectedKeys: [], openKeys: [] };
  }

  /**
   * Callback déclenché par une ouverture / fermeture d'un sous-menu.
   * Stoque les "openKeys" dans l'état local.
   */
  onOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  }

  /**
   * Callback déclenché par un clic sur un item du menu.
   * Si l'item a le prop "to" définit, sa valeur est utilisée pour la navigation, sinon c'est sa "key".
   */
  onCLick = (target) => {
    if (target.item.props.isRouterLink) {
      this.props.router.push(target.item.props.to || target.key);
    }
  }

  render() {

    return (
      <Menu
        id="SideMenu"
        ref={(ref) => this.menu = ref}
        mode={this.props.collapsed ? 'vertical' : 'inline'}
        className={this.props.collapsed ? 'collapsed' : ''}
        openKeys={this.state.openKeys}
        selectedKeys={this.state.selectedKeys}
        onOpenChange={this.onOpenChange}
        onClick={this.onCLick}>

        { /*
        <Item key="/dashboard" isRouterLink>
          <Icon type="windows" /><span className="hidden-if-collapsed">Dashboard</span>
        </Item>
        */ }
        <SubMenu
          key="display-management"
          title={<span><Icon type="video-camera" /><span className="hidden-if-collapsed">Afficheurs</span></span>}>

          <SubMenu key="display-management-media-library" title={<span><Icon type='file' />Médiathèque</span>}>

            <Item key="/display-management/file" isRouterLink>
              <Icon type="picture" />Fichiers
            </Item>

            <Item key="/display-management/scene" isRouterLink>
              <Icon type="appstore-o" />Scènes
            </Item>

          </SubMenu>

          <Item key="/display-management/screen" isRouterLink>
            <Icon type="desktop" />Écrans
          </Item>

          <Item key="/display-management/agenda" isRouterLink>
            <Icon type="calendar" />Agendas
          </Item>

        </SubMenu>

      </Menu>
    );
  }
}
