// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';

import { State } from 'models/displayManagement';

export const NAME = 'displayManagement';

// Action types

const REQUEST_MEDIA = 'maw/displayManagement/REQUEST_MEDIA';
const RECEIVE_MEDIA = 'maw/displayManagement/RECEIVE_MEDIA';
const INVALIDATE_MEDIA = 'maw/displayManagement/INVALIDATE_MEDIA';

// Action creators

function requestMedia(type) {
  return {
    type: REQUEST_MEDIA,
    payload: { type }
  };
}

function receiveMedia(type, media) {
  // Transforme le tableau de media réceptionné en objet indexé par id
  const mediaById = media.reduce((mediaById, media) => {
    mediaById[media.id] = media;
    return mediaById;
  }, {});

  return {
    type: RECEIVE_MEDIA,
    payload: {
      type,
      mediaById
    }
  };
}

function invalidateMedia(type) {
  return {
    type: INVALIDATE_MEDIA,
    payload: { type }
  };
}

function fetchMedia(type) {
  return (dispatch) => {
    dispatch(requestMedia(type));
    return fetch('http://localhost:3001/' + 'entities/1/modules/1/medias/' + type)
      .then((response) => response.json())
      .then((mediaList) => dispatch(receiveMedia(type, mediaList)));
  };
}

export const actionCreators = {
  invalidateMedia,
  fetchMedia
};

// State initial

const initialState: State = {
  mediaById: {},
  mediaByType: {
    image: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
    video: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
  },
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {

  if (!action.payload || !state.mediaByType[action.payload.type]) {
    return state;
  }

  switch (action.type) {

    case REQUEST_MEDIA:
     return {
       ...state,
       mediaByType: {
         ...state.mediaByType,
         [action.payload.type]: {
           ...state.mediaByType[action.payload.type],
           isFetching: true,
           didInvalidate: false
         }
       }
     };

    case INVALIDATE_MEDIA:
      return {
        ...state,
        mediaByType: {
          ...state.mediaByType,
          [action.payload.type]: {
            ...state.mediaByType[action.payload.type],
            didInvalidate: true
          }
        }
      };

    case RECEIVE_MEDIA:
      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          ...action.payload.mediaById
        },
        mediaByType: {
          ...state.mediaByType,
          [action.payload.type]: {
            ...state.mediaByType[action.payload.type],
            isFetching: false,
            didInvalidate: false,
            items: Object.keys(action.payload.mediaById)
          }
        }
      };

    default:
      return state;
  }
}

// Selectors

const displayManagement = (state) => state[NAME];

export const selector = createStructuredSelector({
  displayManagement
});
