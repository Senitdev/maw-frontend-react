// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import { State } from 'models/displayManagement';

import './displayManagement.scss';

export const NAME = 'displayManagement';

// Action types

const REQUEST_MEDIA = 'maw/displayManagement/REQUEST_MEDIA';
const RECEIVE_MEDIA = 'maw/displayManagement/RECEIVE_MEDIA';
const INVALIDATE_MEDIA = 'maw/displayManagement/INVALIDATE_MEDIA';
const DELETE_MEDIA_SUCESS = 'maw/displayManagement/DELETE_MEDIA_SUCESS';
const DELETE_MEDIA_QUERY = 'maw/displayManagement/DELETE_MEDIA_QUERY';
const ERROR_CONFIRMED = 'maw/displayManagement/ERROR_CONFIRMED';
const ERROR_RAISED = 'maw/displayManagement/ERROR_RAISED';

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
  let url;
  if (type == 'image' || type == 'video')
    url = 'entities/1/modules/1/files/' + type + '?' + $.param({
      'withExtendedMedia': true
    });
  else
    url = 'entities/1/modules/1/medias/' + type + '?' + $.param({
      'withExtendedMedia': true
    });
  return (dispatch) => {
    dispatch(requestMedia(type));
    return fetch('http://localhost:3001/' + url)
      .then((response) => {
        if (response.status >= 400)
          errorHandler(response.status)(dispatch);
        return response.json();
      }).then((mediaList) => {
        dispatch(receiveMedia(type, mediaList));
      }).catch((error) => errorHandler(error)(dispatch));
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
      .catch((error) => errorHandler(error)(dispatch));
  };
}

function errorHandler(error) {
  if(error >= 400) {
    return (dispatch) => dispatch(errorRaised(error, "L'action n'a pas pu être exécuter par le serveur. Vous pouvez essayer de vider le cache de votre navigateur et le redémarrer si le problème persiste."));
  } else {
    return (dispatch) => dispatch(errorRaised(error, "Les serveurs sont inatteignables. Veuillez réessayer ultérieurement."));
  }
}

function errorRaised(error, message) {
  return {
    type: ERROR_RAISED,
    payload: { error, message }
  };
}

function errorConfirmed(errorId) {
  console.log(errorId);
  return {
    type: ERROR_CONFIRMED,
    payload: { errorId }
  };
}

export const actionCreators = {
  errorConfirmed,
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
    scene: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
    display: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
    planning: {
      isFetching: false,
      didInvalidate: true,
      items: []
    },
  },
  error: [],
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {

  if (!action.payload) {
    return state;
  }

  switch (action.type) {

    case ERROR_RAISED:
      return {
        ...state,
        error: [
          ...state.error,
          {
            id: state.error.length,
            error: action.payload.error,
            message: action.payload.message,
            time: Date.now(),
            confirmed: false
          }
        ]
      };

    case ERROR_CONFIRMED:
      return {
        ...state,
        error: state.error.map((error) => {
                            if (error.id === action.payload.errorId)
                              return { ...error, confirmed: true };
                            else
                              return {...error};
                          })
      };

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
