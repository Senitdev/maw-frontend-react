// @flow

import { createStructuredSelector } from 'reselect';

import { State } from 'models/core';

// Action Types

const COLLAPSE_SIDE_MENU = 'maw/core/COLLAPSE_SIDE_MENU';
const TOGGLE_SIDE_MENU = 'maw/core/COLLAPSE_SIDE_MENU';

// This will be used in our root reducer and selectors

export const NAME = 'core';

// Define the initial state for `core` module

const initialState: State = {
  collapsedSideMenu: false,
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

    case TOGGLE_SIDE_MENU:
      return {
        ...state,
        collapsedSideMenu: !state.collapsedSideMenu
      };

    default:
      return state;
  }
}

// Action Creators

function collapseSideMenu(collapsed: boolean) {
  return {
    type: COLLAPSE_SIDE_MENU,
    collapsed
  };
}

function toggleSideMenu() {
  return { type: TOGGLE_SIDE_MENU };
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
