// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';

import { State } from 'models/displayManagement';
import { NotificationGenerator } from 'features/core/components/NotificationGenerator';

import './displayManagement.scss';

export const NAME = 'displayManagement';
const API = 'http://auth.maw.com/backend-global/';
// Action types

const MEDIA_LIST_REQUEST = 'maw/displayManagement/MEDIA_LIST_REQUEST';
const MEDIA_LIST_SUCCESS = 'maw/displayManagement/MEDIA_LIST_SUCCESS';
const MEDIA_LIST_FAILURE = 'maw/displayManagement/MEDIA_LIST_FAILURE';

const MEDIA_DETAILS_REQUEST = 'maw/displayManagement/MEDIA_DETAILS_REQUEST';
const MEDIA_DETAILS_SUCCESS = 'maw/displayManagement/MEDIA_DETAILS_SUCCESS';
const MEDIA_DETAILS_FAILURE = 'maw/displayManagement/MEDIA_DETAILS_FAILURE';

const PATCH_MEDIA_REQUEST = 'maw/displayManagement/PATCH_MEDIA_REQUEST';
const PATCH_MEDIA_SUCCESS = 'maw/displayManagement/PATCH_MEDIA_SUCCESS';
const PATCH_MEDIA_FAILURE = 'maw/displayManagement/PATCH_MEDIA_FAILURE';

const DELETE_MEDIA_REQUEST = 'maw/displayManagement/DELETE_MEDIA_REQUEST';
const DELETE_MEDIA_SUCCESS = 'maw/displayManagement/DELETE_MEDIA_SUCCESS';
const DELETE_MEDIA_FAILURE = 'maw/displayManagement/DELETE_MEDIA_FAILURE';

// Action creators


function patchMediaRequest(id) {
  return {
    type: PATCH_MEDIA_REQUEST,
    payload: { id }
  };
}
function patchMediaSuccess(media) {
  NotificationGenerator.raise('média mis à jour', 'Le média \"' + media.name + '\" à été édité.', 'success');
  return {
    type: PATCH_MEDIA_SUCCESS,
    payload: { media }
  };
}
function patchMediaFailure(id) {
  NotificationGenerator.raise('Une erreur s\'est produit lors de la mise à jour du média.', 'Veuillez vérifier votre connection internet, recharger la page et réessayer', 'error');
  return {
    type: PATCH_MEDIA_FAILURE,
    payload: { id }
  };
}
function patchMedia(media) {
  let url = API + 'entities/1/modules/3/';

  return (dispatch) => {
    dispatch(patchMediaRequest(media.id));
    return fetch(url + 'medias/' + media.id + '?return=1&Media=' + JSON.stringify({Media: media}) + '&name=' + media.name, {
      method: 'PATCH',
      header: {'content-type': 'application/json'}
    })
    .then((response) => {
      if (!response.ok) {
        let error = new Error('patch fail');
        error.response = response;
        throw error;
      }
      response.json().then(
        (response) => dispatch(patchMediaSuccess(response.data))
      );
    })
    .catch((media) => patchMediaFailure(media.id));
  };
}

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
    relationsWithHosts: [],
    relationsWithGuests: [],
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
  relation: (relation) => ({
    id: relation.id,
    hostMediaId: relation.host_media_id,
    guestMediaId: relation.guest_media_id,
    boxLeft: relation.box_left,
    boxTop: relation.box_top,
    boxwidth: relation.box_width,
    boxHeight: relation.box_height,
    guestLeft: relation.guest_left,
    guestTop: relation.guest_top,
    guestWidth: relation.guest_width,
    guestHeight: relation.guest_height,
    startTimeOffset: relation.start_time_offset,
    duration: relation.duration
  })
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
  NotificationGenerator.raise('Une erreur s\'est produit lors de la récupération des données', 'Veuillez vérifier votre connection internet, recharger la page et réessayer', 'error');
  return {
    type: MEDIA_LIST_FAILURE,
    error: true,
    payload: {
      type,
      error
    }
  };
}

function mediaDetailsRequest(id, type) {
  return {
    type: MEDIA_DETAILS_REQUEST,
    payload: {
      id,
      type
    }
  };
}

function mediaDetailsSuccess(mediaById, relationsById) {
  return {
    type: MEDIA_DETAILS_SUCCESS,
    payload: {
      mediaById,
      relationsById
    }
  };
}

function mediaDetailsFailure(error) {
  return {
    type: MEDIA_DETAILS_FAILURE,
    payload: {
      error
    }
  };
}

function fetchMediaDetails(id, type) {
  const url = API + 'entities/1/modules/3/';

  return (dispatch) => {
    dispatch(mediaDetailsRequest(id, type));
    let promiseArray = [];

    promiseArray.push(
      fetch(url + 'feats/media-inclusion-tree?id=' + id)
        .then((response) => {
          if (!response.ok) {
            let error = new Error('mediaDetails fetch fail');
            error.response = response;
            throw error;
          }
          return response.json().then((json) => json.data);
        })
    );

    if (type == 'screen' || type == 'file') {
      promiseArray.push(
        fetch(url + type + 's/' + id)
          .then((response) => {
            if (!response.ok) {
              let error = new Error('mediaDetails fetch fail');
              error.response = response;
              throw error;
            }
            return response.json().then((json) => json.data);
          })
      );
    }

    return Promise.all(promiseArray)
      .then((data) => {
        const [inclusionTree, typeDetails] = data;

        // Tableau de media provenant de l'arbre en objet indexé par id
        let mediaById = {};
        for (let id in inclusionTree.medias) {
          mediaById[Number(id)] = normalize.media(inclusionTree.medias[id]);
        }

        if (typeDetails) {
          Object.assign(mediaById[typeDetails.media_id], normalize[type](typeDetails));
        }

        // Relations
        let relationsById = {};
        for (let id in inclusionTree.relations) {
          const relation = normalize.relation(inclusionTree.relations[id]);
          relationsById[relation.id] = relation;
          mediaById[relation.hostMediaId].relationsWithGuests.push(relation.id);
          mediaById[relation.guestMediaId].relationsWithHosts.push(relation.id);
        }

        dispatch(mediaDetailsSuccess(mediaById, relationsById));
      })
      .catch((error) => dispatch(mediaDetailsFailure(type, error)));
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

    Promise.all(promiseArray)
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

function deleteMediaSuccess(id) {
  NotificationGenerator.raise('Le média à été correctement supprimé.', '', 'success');
  return {
    type: DELETE_MEDIA_SUCCESS,
    payload: { id }
  };
}

function deleteMediaRequest(id) {
  return {
    type: DELETE_MEDIA_REQUEST,
    payload: { id }
  };
}

function deleteMediaFailure(id/*, error*/) {
  NotificationGenerator.raise('Une erreur s\'est produit lors de la suppression.', 'Veuillez vérifier votre connection internet, recharger la page et réessayer', 'error');
  return (dispatch) => {
    dispatch({
      type: DELETE_MEDIA_FAILURE,
      error: true,
      payload: { id }
    });
    /* TODO: afficher une notification
    if (error instanceof Response) {

    }
    else {

    }
    */
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
      if (!response.ok) {
        throw response;
      }
      dispatch(deleteMediaSuccess(id));
    })
    .catch((error) => {
      console.log(error);
      dispatch(deleteMediaFailure(id, error));
    });
  };
}

export const actionCreators = {
  deleteMedia,
  fetchMediaList,
  fetchMediaDetails,
  patchMedia,
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
  isDeleting: {},
  isPatching: {},
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {

  switch (action.type) {

    case PATCH_MEDIA_REQUEST:
      return {
        ...state,
        isPatching: {
          ...state.isPatching,
          [action.payload.id]: true,
        },
      };

    case PATCH_MEDIA_SUCCESS:
      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          [action.payload.media.id]: {
            ...state.mediaById[action.payload.media.id],
            ...action.payload.media
          }
        },
        isPatching: {
          ...state.isPatching,
          [action.payload.media.id]: false,
        },
      };

    case PATCH_MEDIA_FAILURE:
      return {
        ...state,
        isPatching: {
          ...state.isPatching,
          [action.payload.id]: false,
        },
      };

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

    case MEDIA_DETAILS_REQUEST:
      return {
        ...state,
        isFetchingDetails: true,
        detailsFetchError: {}
      };

    case MEDIA_DETAILS_SUCCESS: {
      let mediaById = { ...state.mediaById };
      for (let id in action.payload.mediaById) {
        if (mediaById[id]) {
          Object.assign(mediaById, {
            [id]: {
              ...state.mediaById[id],
              ...action.payload.mediaById[id]
            }
          });
        } else {
          mediaById[id] = { ...action.payload.mediaById[id] };
        }
      }

      return {
        ...state,
        mediaById,
        relationsById: {
          ...state.relationsById,
          ...action.payload.relationsById,
        },
        isFetchingDetails: false,
      };
    }

    case MEDIA_DETAILS_FAILURE:
      return {
        ...state,
        isFetchingDetails: false,
        detailsFetchError: action.payload.error
      };

    case DELETE_MEDIA_REQUEST: {
      return {
        ...state,
        isDeleting: {
          ...state.isDeleting,
          [action.payload.id]: true
        }
      };
    }

    case DELETE_MEDIA_SUCCESS: {
      const { type } = state.mediaById[action.payload.id];
      return {
        ...state,
        [type]: {
          ...state[type],
          items: state[type].items.filter((id) => id != action.payload.id)
        },
        isDeleting: {
          ...state.isDeleting,
          [action.payload.id]: false
        }
      };
    }

    case DELETE_MEDIA_FAILURE:
      return {
        ...state,
        isDeleting: {
          ...state.isDeleting,
          [action.payload.id]: false
        }
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
