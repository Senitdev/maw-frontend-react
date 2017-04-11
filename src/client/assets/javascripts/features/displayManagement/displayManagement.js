// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';
import omit from 'lodash/omit';
import { State } from 'models/displayManagement';

import { NotificationGenerator } from 'features/core/components/NotificationGenerator';
import { Config } from 'app/config';

import './displayManagement.scss';

export const NAME = 'displayManagement';

// Action types

const MEDIA_LIST_REQUEST = 'maw/displayManagement/MEDIA_LIST_REQUEST';
const MEDIA_LIST_SUCCESS = 'maw/displayManagement/MEDIA_LIST_SUCCESS';
const MEDIA_LIST_FAILURE = 'maw/displayManagement/MEDIA_LIST_FAILURE';

const MEDIA_DETAILS_REQUEST = 'maw/displayManagement/MEDIA_DETAILS_REQUEST';
const MEDIA_DETAILS_SUCCESS = 'maw/displayManagement/MEDIA_DETAILS_SUCCESS';
const MEDIA_DETAILS_FAILURE = 'maw/displayManagement/MEDIA_DETAILS_FAILURE';

const CREATE_MEDIA_REQUEST = 'maw/displayManagement/CREATE_MEDIA_REQUEST';
const CREATE_MEDIA_SUCCESS = 'maw/displayManagement/CREATE_MEDIA_SUCCESS';
const CREATE_MEDIA_FAILURE = 'maw/displayManagement/CREATE_MEDIA_FAILURE';

const PATCH_MEDIA_REQUEST = 'maw/displayManagement/PATCH_MEDIA_REQUEST';
const PATCH_MEDIA_SUCCESS = 'maw/displayManagement/PATCH_MEDIA_SUCCESS';
const PATCH_MEDIA_FAILURE = 'maw/displayManagement/PATCH_MEDIA_FAILURE';

const DELETE_MEDIA_REQUEST = 'maw/displayManagement/DELETE_MEDIA_REQUEST';
const DELETE_MEDIA_SUCCESS = 'maw/displayManagement/DELETE_MEDIA_SUCCESS';
const DELETE_MEDIA_FAILURE = 'maw/displayManagement/DELETE_MEDIA_FAILURE';

const MEDIA_RELATION_REQUEST = 'maw/displayManagement/MEDIA_RELATION_REQUEST';
const MEDIA_RELATION_SUCCESS = 'maw/displayManagement/MEDIA_RELATION_SUCCESS';
const MEDIA_RELATION_FAILURE = 'maw/displayManagement/MEDIA_RELATION_FAILURE';

const CREATE_RELATION_REQUEST = 'maw/displayManagement/CREATE_RELATION_REQUEST';
const CREATE_RELATION_SUCCESS = 'maw/displayManagement/CREATE_RELATION_SUCCESS';
const CREATE_RELATION_FAILURE = 'maw/displayManagement/CREATE_RELATION_FAILURE';

const PATCH_RELATION_REQUEST = 'maw/displayManagement/PATCH_RELATION_REQUEST';
const PATCH_RELATION_SUCCESS = 'maw/displayManagement/PATCH_RELATION_SUCCESS';
const PATCH_RELATION_FAILURE = 'maw/displayManagement/PATCH_RELATION_FAILURE';

const DELETE_RELATION_REQUEST = 'maw/displayManagement/DELETE_RELATION_REQUEST';
const DELETE_RELATION_SUCCESS = 'maw/displayManagement/DELETE_RELATION_SUCCESS';
const DELETE_RELATION_FAILURE = 'maw/displayManagement/DELETE_RELATION_FAILURE';

const ADD_FILE = 'maw/displayManagement/ADD_FILE';

// Action creators
function attachScreenToAgenda(screen, relation) {
  return (dispatch) => new Promise(
    (resolve, reject) => {
      if (screen.relationsWithGuests[0])
        dispatch(deleteRelation(screen.relationsWithGuests[0]))
        .then(() => dispatch(createRelation(relation)))
        .then(() => resolve())
        .catch(() => reject());
      else
        dispatch(createRelation(relation));
    }
  );
}

function claimScreen(id, name) {
  const url = 'entities/1/modules/3/feats/claim-global-screen';

  return (dispatch) => new Promise((resolve, reject) => {
    fetch(Config.API + url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id, name: name})
    }).then(
      (response) => {
        if(!response.ok) {
          reject(response);
        }
        dispatch(fetchMediaList('screen'));
      }
    ).then(() => resolve());
  });
}

function createMediaRequest() {
  return {
    type: CREATE_MEDIA_REQUEST,
    payload: { }
  };
}
function createMediaSuccess(media) {
  return {
    type: CREATE_MEDIA_SUCCESS,
    payload: { media }
  };
}
function createMediaFailure(error) {
  return {
    type: CREATE_MEDIA_FAILURE,
    payload: { error }
  };
}

//Prend un media et détermine si cette dernière existe sur le serveur ou pas.
//Si n'existe pas, crée un media, puis fetch les détails et retourne le media.
function createMedia(media) {
  const url = Config.API + 'entities/1/modules/3/medias';

  return (dispatch) =>
    new Promise((resolve, reject) => {
      if(media.id < 0) {
        dispatch(createMediaRequest());
        fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...normalizeObjectForServer(media), return: 1})
        }).then(
          (response) => {
            if(!response.ok) {
              throw response;
            }
            return response.json();
          }
        ).then((json) => {
            //dispatch(createMediaSuccess(json.data));
            resolve(json.data);
          }
        ).catch((error) => {
          //dispatch(createMediaFailure(error));
          reject(error);
        });
      } else {
        resolve(media);
      }
    });
}

function deleteRelationRequest(id) {
  return {
    type: DELETE_RELATION_REQUEST,
    payload: { id }
  };
}
function deleteRelationSuccess(id) {
  return {
    type: DELETE_RELATION_SUCCESS,
    payload: { id }
  };
}
function deleteRelationFailure(id, error) {
  return {
    type: DELETE_RELATION_FAILURE,
    payload: { id, error }
  };
}

function deleteRelation(id) {
  const url = Config.API + 'entities/1/modules/3/media-media/';

  return (dispatch) => {
    dispatch(deleteRelationRequest(id));

    return fetch(url + id, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      dispatch(deleteRelationSuccess(id));
    })
    .catch((error) => {
      dispatch(deleteRelationFailure(id, error));
    });
  };
}

function camelToSnake(s) {
  return s.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}
function snakeToCamel(s) {
  return s.replace(/(_\w)/g, function(m){return m[1].toUpperCase();});
}
function normalizeObjectForServer(object) {
  var objectForServer = {};
  for (let key in object)
    objectForServer[camelToSnake(key)] = object[key];
  return objectForServer;
}
function normalizeObjectForClient(objectFromServer) {
  var object = {};
  for (let key in objectFromServer)
    object[snakeToCamel(key)] = objectFromServer[key];
  return object;
}
function createRelationRequest() {
  return {
    type: CREATE_RELATION_REQUEST,
    payload: { }
  };
}
function createRelationSuccess(relation) {
  return {
    type: CREATE_RELATION_SUCCESS,
    payload: { relation }
  };
}
function createRelationFailure(error) {
  return {
    type: CREATE_RELATION_FAILURE,
    payload: { error }
  };
}

function createRelation(relation) {

  const relationForServer = normalizeObjectForServer(relation);
  const url = Config.API + 'entities/1/modules/3/media-media';

  return (dispatch) => {
    dispatch(createRelationRequest());

    return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...relationForServer, return: 1})
    })
    .then((response) => {
      if (!response.ok) {
        let error = new Error('create fail');
        error.response = response;
        throw error;
      }
      return response.json();
    }).then((response) => {
      relation.id = response.data.id;
      dispatch(createRelationSuccess(normalizeObjectForClient(response.data)));
      return response.data;
    })
    .catch((error) => dispatch(createRelationFailure(error)));
  };
}

function patchRelationRequest() {
  return {
    type: PATCH_RELATION_REQUEST,
    payload: { }
  };
}
function patchRelationSuccess(relation) {
  return {
    type: PATCH_RELATION_SUCCESS,
    payload: { relation }
  };
}
function patchRelationFailure(id, error) {
  return {
    type: PATCH_RELATION_FAILURE,
    payload: { id, error }
  };
}

function patchRelation(relation) {

  const relationForServer = normalizeObjectForServer(relation);
  const url = Config.API + 'entities/1/modules/3/media-media/' + relation.id;

  return (dispatch) => {
    dispatch(patchRelationRequest());
    return fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...relationForServer, return: 1})
    })
    .then((response) => {
      if (!response.ok) {
        let error = new Error('patch fail');
        error.response = response;
        throw error;
      }
      return response.json();
    }).then((response) => {
      dispatch(patchRelationSuccess(normalizeObjectForClient(response.data)));
      return response.data;
    })
    .catch((error) => dispatch(patchRelationFailure(relation.id, error)));
  };
}

//Prend des relations provenant d'un formulaire de scene pour le mettre en forme, prêt à être transmit au action.
function normalizeRelationsFromSceneEditor(patchedOrCreatedRelations, sceneId) {
  var normalizedRelations = {};
  Object.keys(patchedOrCreatedRelations).forEach((key) => {
    normalizedRelations[key] = {
      ...patchedOrCreatedRelations[key],
      hostMediaId: sceneId
    };
  });
  return normalizedRelations;
}
//Prend des relations provenant d'un formulaire d'agenda pour le mettre en forme, prêt à être transmit au action.
function normalizeRelationsFromAgendaEditor(patchedOrCreatedRelations, agendaId) {
  var normalizedRelations = {};

  for (let key in patchedOrCreatedRelations) { //Pour chaque relation à MàJ ou crée...
    normalizedRelations[key] = {};

    if (patchedOrCreatedRelations.hasOwnProperty(key)) {
      let relation = patchedOrCreatedRelations[key]; //Etrait la relation
      normalizedRelations[key]['id'] = relation['idRelation'];
      if (normalizedRelations[key]['id'] < 0) { //Si on a affaire à une création, on doit renseigner hostMedia et guestMedia
        normalizedRelations[key]['hostMediaId'] = agendaId;
        normalizedRelations[key]['guestMediaId'] = parseInt(relation['id']);
      }
      normalizedRelations[key]['duration'] = relation['duration'];
      normalizedRelations[key]['startTimeOffset'] = relation['startTimeOffset'];
      normalizedRelations[key]['repetitionDelay'] = relation['repetitionDelay'];
      normalizedRelations[key]['endTimeOffset'] = relation['endTimeOffset'];
      normalizedRelations[key]['boxLeft'] = 0;
      normalizedRelations[key]['boxTop'] = 0;
      normalizedRelations[key]['boxWidth'] = 100;
      normalizedRelations[key]['boxHeight'] = 100;
      normalizedRelations[key]['guestLeft'] = 0;
      normalizedRelations[key]['guestTop'] = 0;
      normalizedRelations[key]['guestWidth'] = 100;
      normalizedRelations[key]['guestHeight'] = 100;
      normalizedRelations[key]['zIndex'] = 0;
    }
  }

  return normalizedRelations;
}

//Retourne l'id du média crée/patché sous forme de promise
function featPatchOrCreateFromEditor(deletedRelations, patchedOrCreatedRelations, media) {
  const mediaForServer = {
    id: media.id,
    name: media.name,
    ratioNumerator: media.ratioNumerator,
    ratioDenominator: media.ratioDenominator,
    duration: media.duration,
    type: media.type,
  };

  return (dispatch) => new Promise((resolve, reject) =>
    new Promise((resolve, reject) => {
      if (media.id >= 0) {
        dispatch(patchMedia(mediaForServer))
        .then((mediaBis) => resolve(mediaBis));
      } else {
        dispatch(createMedia(mediaForServer))
        .then((mediaBis) => resolve(mediaBis));
      }
    })
    .then((mediaBis) => {
      var allPromise = [];
      var normalizedRelationsFromEditor;
      if (media.type == 'scene')
        normalizedRelationsFromEditor = normalizeRelationsFromSceneEditor(patchedOrCreatedRelations, mediaBis.id);
      else if (media.type == 'agenda')
        normalizedRelationsFromEditor = normalizeRelationsFromAgendaEditor(patchedOrCreatedRelations, mediaBis.id);
      else {
        NotificationGenerator.raise('Erreur', 'Un problème à été rencontré durant la sauvegarde. Vérifiez votre connection internet et réessayer.', 'error');
        throw 'error in featPatchOrCreateFromEditor(): wrong type of media.';
      }
      //supprime les relations a suprimer.
      deletedRelations.forEach((deletedRelation) => {
        allPromise.push(dispatch(deleteRelation(deletedRelation)));
      });

      //Patch ou crée les relations.
      for (let key in normalizedRelationsFromEditor) {
        if (normalizedRelationsFromEditor[key].id > -1) {
          allPromise.push(dispatch(patchRelation(normalizedRelationsFromEditor[key])));
        } else {
          allPromise.push(dispatch(createRelation(normalizedRelationsFromEditor[key])));
        }
      }

      Promise.all(allPromise).then(() => {
        NotificationGenerator.raise('Succès', 'La sauvegarde a été effectuée.', 'success');
        resolve(mediaBis.id);
      });
    })
    .catch(() => {
      NotificationGenerator.raise('Erreur', 'Un problème à été rencontré durant la sauvegarde. Vérifiez votre connection internet et réessayer.', 'error');
      reject(error);
    })
  );
}

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
  const url = Config.API + 'entities/1/modules/3/';

  return (dispatch) => {
    dispatch(patchMediaRequest(media.id));
    return fetch(url + 'medias/' + media.id, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...normalizeObjectForServer(media), return: 1})
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json().then((json) => json.data);
    })
    .then((data) => {
      dispatch(patchMediaSuccess({
        ...normalize.media(data)
      }));
      return data;
    })
    .catch(() => {
      dispatch(patchMediaFailure(media.id));
    });
  };
}

function mediaListRequest(type) {
  return {
    type: MEDIA_LIST_REQUEST,
    payload: { type }
  };
}

function mediaRelationRequest(idMedia) {
  return {
    type: MEDIA_RELATION_REQUEST,
    payload: { idMedia }
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
    lastPull: new Date(screen.last_pull)
  }),
  relation: (relation) => ({
    id: relation.id,
    hostMediaId: relation.host_media_id,
    guestMediaId: relation.guest_media_id,
    boxLeft: relation.box_left,
    boxTop: relation.box_top,
    boxWidth: relation.box_width,
    boxHeight: relation.box_height,
    guestLeft: relation.guest_left,
    guestTop: relation.guest_top,
    guestWidth: relation.guest_width,
    guestHeight: relation.guest_height,
    startTimeOffset: relation.start_time_offset,
    duration: relation.duration,
    endTimeOffset: relation.end_time_offset,
    repetitionDelay: relation.repetition_delay,
    zIndex: relation.z_index
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
  const url = Config.API + 'entities/1/modules/3/';

  return (dispatch) => {
    dispatch(mediaDetailsRequest(id, type));
    let promiseArray = [];

    promiseArray.push(
      fetch(url + 'feats/media-inclusion-tree', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
      })
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

function mediaRelationSuccess(mediaRelation) {
  return {
    type: MEDIA_RELATION_SUCCESS,
    payload: {
      mediaRelation
    }
  };
}

function mediaRelationFailure(error) {
  return {
    type: MEDIA_RELATION_FAILURE,
    error: true,
    payload: {
      error
    }
  };
}

function fetchMediaList(type) {
  const url = Config.API + 'entities/1/modules/3/';

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

        // TODO
        mediaById = {
          ...mediaById,
          5: {
            id: 5,
            name: "Horloge",
            ratioNumerator: 16,
            ratioDenominator: 9,
            type: "clock",
            version: 0,
            createdAt: "2017-03-24 20:19:00",
            updatedAt: "2017-03-28 13:03:05",
            relationsWithHosts: [],
            relationsWithGuests: [],
            duration: 0,
            mimetype: 'clock'
          }
        };

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
  const url = Config.API + 'entities/1/modules/3/';

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
      dispatch(deleteMediaFailure(id, error));
    });
  };
}

function fetchMediaRelation(idMedia) {
  const url = Config.API + 'entities/1/modules/3/media-media/' + idMedia;

  return (dispatch) => {

    dispatch(mediaRelationRequest(idMedia));
    return fetch(url)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          let error = new Error('mediaList fetch fail');
          error.response = response;
          throw error;
        }
        return response.json().then((json) => json.data);
      })
      .then((data) => {
        //console.log(data);

        dispatch(mediaRelationSuccess(data));
        return data;
      })
      .catch((error) => dispatch(mediaRelationFailure(error)));
  };
}

function addFile(data) {
  const payload = {
    file: {
      ...normalize.media(data.media),
      ...normalize.file(data)
    }
  };
  return {
    type: ADD_FILE,
    payload
  };
}

export const actionCreators = {
  attachScreenToAgenda,
  deleteMedia,
  deleteRelation,
  fetchMediaList,
  fetchMediaDetails,
  patchMedia,
  fetchMediaRelation,
  featPatchOrCreateFromEditor,
  claimScreen,
  addFile,
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

    //TODO case DELETE_RELATION_REQUEST
    //TODO case DELETE_RELATION_FAILURE
    //TODO case PATCH_RELATION_REQUEST
    //TODO case PATCH_RELATION_FAILURE
    //TODO case CREATE_RELATION_REQUEST
    //TODO case CREATE_RELATION_FAILURE

    case CREATE_MEDIA_SUCCESS: {
      const newMedia = action.payload.media;
      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          [newMedia.id]: {
            ...newMedia,
            relationsWithGuests: [],
            relationsWithHosts: []
          }
        },
        [newMedia.type]: {
          ...state[newMedia.type],
          items: state[newMedia.type].items.concat(newMedia.id)
        }
      };
    }

    case CREATE_RELATION_SUCCESS: {
      var newRelationsWithGuests = (state.mediaById[action.payload.relation.hostMediaId].relationsWithGuests).slice();
      newRelationsWithGuests.push(action.payload.relation.id);
      var newRelationsWithHosts = (state.mediaById[action.payload.relation.guestMediaId].relationsWithHosts).slice();
      newRelationsWithHosts.push(action.payload.relation.id);
      return {
        ...state,
        relationsById: {
          ...state.relationsById,
          [action.payload.relation.id]: action.payload.relation,
        },
        mediaById: {
          ...state.mediaById,
          [action.payload.relation.hostMediaId]: {
            ...state.mediaById[action.payload.relation.hostMediaId],
            relationsWithGuests: newRelationsWithGuests
          },
          [action.payload.relation.guestMediaId]: {
            ...state.mediaById[action.payload.relation.guestMediaId],
            relationsWithHosts: newRelationsWithHosts
          }
        }
      };
    }

    case PATCH_RELATION_SUCCESS: {
      return {
        ...state,
        relationsById: {
          ...state.relationsById,
          [action.payload.relation.id]: {
            ...state.relationsById[action.payload.relation.id],
            ...action.payload.relation,
          }
        }
      };
    }

    case DELETE_RELATION_SUCCESS: {
      let { id } = action.payload;
      let hostId = state.mediaById[state.relationsById[id].hostMediaId].id;
      let guestId = state.mediaById[state.relationsById[id].guestMediaId].id;

      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          [hostId]: {
            ...state.mediaById[hostId],
            relationsWithGuests: state.mediaById[hostId].relationsWithGuests.filter((relationId) => id != relationId)
          },
          [guestId]: {
            ...state.mediaById[guestId],
            relationsWithHosts: state.mediaById[guestId].relationsWithHosts.filter((relationId) => id != relationId)
          }
        },
        relationsById: omit(state.relationsById, id)
      };
    }

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

    case MEDIA_LIST_SUCCESS: {
      const mediaById = {
        ...state.mediaById,
        ...Object.keys(action.payload.mediaById).reduce((acc, id) => ({
          ...acc,
          [id]: {
            ...action.payload.mediaById[id],
            relationsWithHosts: state.mediaById[id] ? state.mediaById[id].relationsWithHosts : [],
            relationsWithGuests: state.mediaById[id] ? state.mediaById[id].relationsWithGuests : [],
          }
        }), {})
      };
      return {
        ...state,
        mediaById,
        [action.payload.type]: {
          ...state[action.payload.type],
          isFetching: false,
          items: Object.keys(action.payload.mediaById).map((id) => Number(id))
        }
      };
    }

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

      // TODO Ceci pour contourner un bug qui fait que le serveur nouos retourne Null parfoit pour des valeurs à zero.
      // Il faudra supprimer ça et dévercer action.payload.relationsById directement dans state.relationsById
      var relationsNormalized = {
        ...action.payload.relationsById
      };
      for (let key in action.payload.relationsById)
        for (let subKey in action.payload.relationsById[key])
          if (action.payload.relationsById[key][subKey] == null)
            relationsNormalized[key][subKey] = 0;

      return {
        ...state,
        mediaById,
        relationsById: {
          ...state.relationsById,
          ...relationsNormalized,
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

    case MEDIA_RELATION_REQUEST:
      return {
        ...state
      };

    case MEDIA_RELATION_SUCCESS:
      return {
        ...state,
        mediaById: {
          ...state.relationsById,
          ...action.payload.mediaRelation
        },
      };

    case MEDIA_RELATION_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error
      };

    case ADD_FILE:
      return {
        ...state,
        mediaById: {
          ...state.mediaById,
          [action.payload.file.id]: action.payload.file
        },
        file: {
          ...state.file,
          items: [...state.file.items, action.payload.file.id]
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
