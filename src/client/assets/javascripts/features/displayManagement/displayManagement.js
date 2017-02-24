// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';

import { State } from 'models/displayManagement';

import './displayManagement.scss';

export const NAME = 'displayManagement';
const API = 'http://192.168.201.68/backend-global/';
// Action types

const MEDIA_LIST_REQUEST = 'maw/displayManagement/MEDIA_LIST_REQUEST';
const MEDIA_LIST_SUCCESS = 'maw/displayManagement/MEDIA_LIST_SUCCESS';
const MEDIA_LIST_FAILURE = 'maw/displayManagement/MEDIA_LIST_FAILURE';

const MEDIA_DETAILS_REQUEST = 'maw/displayManagement/MEDIA_DETAILS_REQUEST';
const MEDIA_DETAILS_SUCCESS = 'maw/displayManagement/MEDIA_DETAILS_SUCCESS';
const MEDIA_DETAILS_FAILURE = 'maw/displayManagement/MEDIA_DETAILS_FAILURE';

const DELETE_MEDIA_REQUEST = 'maw/displayManagement/DELETE_MEDIA_REQUEST';
const DELETE_MEDIA_SUCESS = 'maw/displayManagement/DELETE_MEDIA_SUCESS';
const DELETE_MEDIA_FAILURE = 'maw/displayManagement/DELETE_MEDIA_FAILURE';

// Action creators

function mediaListRequest(type) {
  return {
    type: MEDIA_LIST_REQUEST,
    payload: { type }
  };
}

/**
 * Transforme un objet provenant du serveur en objet stoquer dans l'état redux.
 **/
const normalize = {
  media: (media) => ({
    id: media.id,
    name: media.name,
    ratioNumerator: media.ratio_numerator,
    ratioDenominator: media.ratio_denominator,
    type: media.type,
    version: media.version,
    createdAt: media.created_at,
    updatedAt: media.updated_at,
    duration: media.duration
  }),
  file: (file) => ({
    width: file.width,
    height: file.height,
    weight: file.weight,
    mimetype: file.mimetype
  }),
  screen: (screen) => ({
    distantVersion: screen.distant_version,
    lastPull: screen.last_pull
  }),
};

function mediaListSuccess(type, mediaById) {
  return {
    type: MEDIA_LIST_SUCCESS,
    payload: {
      type,
      mediaById
    }
  };
}
function mediaListFailure(type, error) {
  return {
    type: MEDIA_LIST_FAILURE,
    error: true,
    payload: {
      type,
      error
    }
  };
}

function fetchMediaList(type) {
  const url = API + 'entities/1/modules/3/';

  return (dispatch, getState) => {
    if (getState()[NAME][type].isFetching) {
      return;
    }

    dispatch(mediaListRequest(type));
    let promiseArray = [];

    promiseArray.push(
      fetch(url + 'medias?typeIn[]=' + type)
        .then((response) => {
          if (response.status < 200 || response.status >= 300) {
            let error = new Error('mediaList fetch fail');
            error.response = response;
            throw error;
          }
          return response.json().then((json) => json.data);
        })
    );

    if (type == 'screen' || type == 'file') {
      promiseArray.push(
        fetch(url + type + 's')
          .then((response) => {
            if (response.status < 200 || response.status >= 300) {
              let error = new Error('mediaList fetch fail');
              error.response = response;
              throw error;
            }
            return response.json().then((json) => json.data);
          })
      );
    }

    return Promise.all(promiseArray)
      .then((data) => {
        const [mediaList, dataList] = data;

        // Transforme le tableau de media réceptionné en objet indexé par id
        let mediaById = mediaList.reduce((mediaById, media) => {
          mediaById[media.id] = normalize.media(media);
          return mediaById;
        }, {});

        if (dataList) {
          for (let i = 0; i < dataList.length; i++) {
            Object.assign(mediaById[dataList[i].media_id], normalize[type](dataList[i]));
          }
        }

        dispatch(mediaListSuccess(type, mediaById));
      })
      .catch((error) => dispatch(mediaListFailure(type, error)));
  };
}

function deleteMediaSucess(id) {
  return {
    type: DELETE_MEDIA_SUCESS,
    payload: { id }
  };
}

function deleteMediaRequest(id) {
  return {
    type: DELETE_MEDIA_REQUEST,
    payload: { id }
  };
}

function deleteMediaFailure(error) {
  return {
    type: DELETE_MEDIA_FAILURE,
    error: true,
    payload: error
  };
}

function deleteMedia(id) {
  let url = API + 'entities/1/modules/3/';

  return (dispatch) => {
    dispatch(deleteMediaRequest(id));
    return fetch(url + 'medias/' + id, {
      method: 'DELETE'
    })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        let error = new Error('delete fail');
        error.response = response;
        throw error;
      }
      dispatch(deleteMediaSucess(id));
    })
    .catch(deleteMediaFailure);
  };
}

export const actionCreators = {
  deleteMedia,
  fetchMediaList,
};

// State initial

const initialState: State = {
  mediaById: {},
  relationsById: {},
  agenda: {
    isFetching: false,
    fetchError: null,
    items: []
  },
  scene: {
    isFetching: false,
    fetchError: null,
    items: []
  },
  screen: {
    isFetching: false,
    fetchError: null,
    items: []
  },
  file: {
    isFetching: false,
    fetchError: null,
    items: []
  },
  deleteError: null
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {

  switch (action.type) {

    case MEDIA_LIST_REQUEST:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          isFetching: true
        }
      };

    case MEDIA_LIST_SUCCESS:
      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          ...action.payload.mediaById
        },
        [action.payload.type]: {
          ...state[action.payload.type],
          isFetching: false,
          items: Object.keys(action.payload.mediaById).map((id) => Number(id))
        }
      };

    case MEDIA_LIST_FAILURE:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          isFetching: false,
          fetchError: action.payload.error
        }
      };

    case DELETE_MEDIA_REQUEST: {
      const { type } = state.mediaById[action.payload.id];
      return {
        ...state,
        [type]: {
          ...state[type],
          isFetching: true,
        },
        deleteError: null
      };
    }

    case DELETE_MEDIA_SUCESS: {
      const { type } = state.mediaById[action.payload.id];
      return {
        ...state,
        [type]: {
          ...state[type],
          items: state[type].items.filter((id) => id != action.payload.id)
        }
      };
    }

    case DELETE_MEDIA_FAILURE:
      return {
        ...state,
        deleteError: action.payload
      };

    default:
      return state;
  }
}

// Selector
const displayManagement = (state) => state[NAME];

export const selector = createStructuredSelector({
  displayManagement
});
