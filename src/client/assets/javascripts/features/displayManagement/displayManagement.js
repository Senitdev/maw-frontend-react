// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';

import { State } from 'models/displayManagement';

export const NAME = 'displayManagement';

// Action types

const REQUEST_MEDIA = 'maw/displayManagement/REQUEST_MEDIA';
const RECEIVE_MEDIA = 'maw/displayManagement/RECEIVE_MEDIA';
const INVALIDATE_MEDIA = 'maw/displayManagement/INVALIDATE_MEDIA';
const DELETE_MEDIA_SUCESS = 'maw/displayManagement/DELETE_MEDIA_SUCESS';
const DELETE_MEDIA_QUERY = 'maw/displayManagement/DELETE_MEDIA_QUERY';
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

/* TODO Actuellement, on rappele fetchMedia après un delete, on devrait simplement
   supprimer le media supprimé de la liste des médias. Mais j'ai pas réussi a flitrer correctement
   la liste dans le reducer de l'action DELETE_MEDIA_SUCESS*/
function deleteMediaSucess(type, id) {
  return (dispatch) => {
    dispatch(fetchMedia(type));
  };
}

function deleteMediaQuery(type) {
  return {
    type: DELETE_MEDIA_QUERY,
    payload: { type }
  };
}

function deleteMedia(type, id) {
  return (dispatch) => {
    dispatch(deleteMediaQuery(type));
    return fetch('http://localhost:3001/' + 'medias/' + id, {
      method: 'DELETE'
    }).then(() => dispatch(deleteMediaSucess(type, id)))
      .catch((error) => console.log("ERROR: " + error));
  };
}

export const actionCreators = {
  deleteMedia,
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
    display: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
  },
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {
  /*function filterObj(obj, id) {
    var newObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if(obj[key].id !== id) {
          newObj[key] = obj[id];
        }
      }
    }
    return newObj;
  }*/

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

    case DELETE_MEDIA_QUERY:
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

    /* TODO À corriger. Voirs l'action DELETE_MEDIA_SUCESS pour plus d'info */
    case DELETE_MEDIA_SUCESS:
      return {
        ...state,
        mediaById: {
          ...state.mediaById
        },
        mediaByType: {
          ...state.mediaByType,
          [action.payload.type]: {
            ...state.mediaByType[action.payload.type],
            isFetching: false,
            didInvalidate: false,
            items: [
              ...state.mediaByType[action.payload.type].items.filter((id) => id !== action.payload.id)
            ]
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
