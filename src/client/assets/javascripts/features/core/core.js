// @flow

import { createStructuredSelector } from 'reselect';

import { State } from 'models/core';

// Action Types

const COLLAPSE_SIDE_MENU = 'maw/core/COLLAPSE_SIDE_MENU';

// This will be used in our root reducer and selectors

export const NAME = 'core';

// Define the initial state for `core` module

const initialState: State = {
  collapsedSideMenu: !!localStorage.getItem('core.collapsedSideMenu')
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {

    case COLLAPSE_SIDE_MENU: {
      if (action.collapsed != state.collapsedSideMenu) {
        return Object.assign({}, state, {
          collapsedSideMenu: action.collapsed
        });
      }
      return state;
    }

    default:
      return state;
  }
}

// Action Creators

function collapseSideMenu(collapsed: boolean) {
  return (dispatch) => {
    // Garde l'état du menu en localStorage
    if (collapsed) {
      localStorage.setItem('core.collapsedSideMenu', '1');
    } else {
      localStorage.setItem('core.collapsedSideMenu', '');
    }
    dispatch({
      type: COLLAPSE_SIDE_MENU,
      collapsed
    });
  };
}

function toggleSideMenu() {
  return (dispatch, getState) => collapseSideMenu(!getState().collapsedSideMenu)(dispatch);
}

// Selectors

const core = (state) => state[NAME];

export const selector = createStructuredSelector({
  core
});

export const actionCreators = {
  collapseSideMenu,
  toggleSideMenu,
};
