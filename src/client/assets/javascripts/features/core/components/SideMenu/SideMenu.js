import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Icon, Menu } from 'antd';
const { Item, SubMenu } = Menu;

import './SideMenu.scss';

function getItemLinkPath(item) {
  return item.props.isRouterLink ?
    item.props.to != null ? item.props.to : (item.key || item.props.eventKey)
    :
    null;
}

@withRouter
export default class SideMenu extends Component {

  static propTypes = {
    collapsed: PropTypes.bool,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      openKeys: [],
      selectedItem: {
        linkPath: null,
        key: null,
        keyPath: [],
      },
    };
  }

  /**
   * Lorsque le menu s'affiche, cherche l'item sélectionné en fonction de la
   * route courante (pathname) et définit les "openKeys" en fonction de si le
   * menu est "collapsed" ou non.
   */
  componentDidMount() {
    const selectedItem = this.findSelectedItem(this.props.location.pathname);

    this.setState({
      selectedItem,
      openKeys: this.props.collapsed ? [] : selectedItem.keyPath
    });
  }

  /**
   * Si le menu change de format (collapsed), adapte les "openKeys".
   * Si la route change, cherche le "selectedItem".
   */
  componentWillReceiveProps(nextProps) {

    if (nextProps.collapsed != this.props.collapsed) {
      // Si le menu devient "collapsed", retire les open keys
      if (nextProps.collapsed) {
        this.setState({ openKeys: [] });
      }
      // S'il devient non "collapsed", ajoute la "keyPath" de l'item sélectionné comme "openKeys"
      else {
        this.setState((prevState) => ({
          openKeys: [...prevState.selectedItem.keyPath]
        }));
      }
    }

    const nextPathname = nextProps.location.pathname;

    // Si la route change et qu'elle ne correspond plus à celle de l'item sélectionné,
    // cherche le nouvel item correspondant
    if (nextPathname != this.state.selectedItem.linkPath) {
      const selectedItem = this.findSelectedItem(nextPathname);

      this.setState((prevState) => ({
        selectedItem,
        openKeys: [...prevState.openKeys, ...selectedItem.keyPath].filter((elem, pos, arr) => arr.indexOf(elem) == pos)
      }));
    }
  }

  /**
   * Ne met à jour le menu que si l'item sélectionné, les "openKeys" ou "collapsed" ont changé.
   */
  shouldComponentUpdate(nextProps, nextState) {

    // Test "collapsed" et "selectedItem"
    if (nextProps.collapsed != this.props.collapsed ||
        nextState.selectedItem.linkPath != this.state.selectedItem.linkPath)
    {
      return true;
    }
    // Test les "openKeys"
    if (nextState.openKeys.length == this.state.openKeys.length) {
      for (let i = 0; i < nextState.openKeys.length; i++) {
        if (nextState.openKeys[i] != this.state.openKeys[i]) {
          return true;
        }
      }
    } else {
      return true;
    }
    // Aucun changement
    return false;
  }

  /**
   * Cherche dans le menu l'item correspondant à la route (pathname).
   */
  findSelectedItem(pathname) {
    // Utilise une fonction récursive pour trouver l'item
    let selectedItem = (function findSelectedItemRec(menuNode) {

      // Si le noeud est un item avec le prop "isRouterLink" valant "true"
      if (menuNode.props && menuNode.props.isRouterLink) {
        // Si le chemin du lien correspond à la route (pathname), l'item est trouvé
        const linkPath = getItemLinkPath(menuNode);
        if (pathname.match(new RegExp('^' + linkPath))) {
          return {
            linkPath,
            key: menuNode.key,
            keyPath: []
          };
        }
      }
      // Sinon, si le noeud a des enfants,
      else if (menuNode.props && menuNode.props.children) {
        const children = menuNode.props.children instanceof Array ? menuNode.props.children : [ menuNode.props.children ];

        // Explore les enfants en appelant récursivement cette fonction
        for (let child of children) {
          let selectedItem = findSelectedItemRec(child);

          // Si l'item sélectionné est remonté de la branche enfant
          if (selectedItem) {
            // Ajoute la key du noeud courant (s'il y en a une) au "keyPath" de l'item sélectionné
            if (menuNode.key) {
              selectedItem.keyPath.push(menuNode.key);
            }
            // Remonte l'item sélectionné
            return selectedItem;
          }
        }
      }
      // Si rien n'a été trouvé, retourne null
      return null;

    })(this.menu);

    return selectedItem ? selectedItem : { linkPath: null, key: null, keyPath: [] };
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
   * Callback déclenché par un clic sur un item du menu. Si l'item a le prop
   * "isRouterLink" valant "true", il est considéré comme un lien de router et
   * un changement de page est effectué.
   */
  onCLick = (target) => {
    const linkPath = getItemLinkPath(target.item);
    this.setState({
      selectedItem: {
        linkPath,
        key: target.key,
        keyPath: target.keyPath,
      }
    }, () => this.props.router.push(this.state.selectedItem.linkPath));
  }

  render() {
    return (
      <Menu
        id="SideMenu"
        ref={(ref) => this.menu = ref}
        mode={this.props.collapsed ? 'vertical' : 'inline'}
        className={this.props.collapsed ? 'collapsed' : ''}
        openKeys={this.state.openKeys}
        selectedKeys={[this.state.selectedItem.key]}
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

          {/*<Menu.ItemGroup key="mediatheque" title="Médias">*/}

            <Item key="/display-management/file" isRouterLink>
              <Icon type="picture" />Fichiers
            </Item>

            <Item key="/display-management/scene" isRouterLink>
              <Icon type="appstore-o" />Scènes
            </Item>

          {/*</Menu.ItemGroup>*/}

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
