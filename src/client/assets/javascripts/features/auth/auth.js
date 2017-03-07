// @flow

import { createStructuredSelector } from 'reselect';
import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

import { Config } from 'app/config';
import { State } from 'models/auth';

// This will be used in our root reducer and selectors

export const NAME = 'auth';

// Action Types

const LOGIN_REQUEST = 'maw/auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'maw/auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'maw/auth/LOGIN_FAILURE';

const LOGOUT = 'maw/auth/LOGOUT';

const REGISTER_REQUEST = 'maw/auth/REGISTER_REQUEST';
const REGISTER_SUCCESS = 'maw/auth/REGISTER_SUCCESS';
const REGISTER_FAILURE = 'maw/auth/REGISTER_FAILURE';

// Retourne l'ID de l'utilisateur s'il est authentifié. 0 dans le cas contraire.
function getUserId() {
  // TODO: Vérification dans le cookie de session
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) {
    return 0;
  }
  return userId;
}

// Action Creators

function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

function loginSuccess(userId, email, rememberMe) {

  if (rememberMe) {
    localStorage.setItem('auth.remember', email);
  }
  else {
    localStorage.removeItem('auth.remember');
  }

  return {
    type: LOGIN_SUCCESS,
    payload: userId
  };
}

function loginFailure(error) {

  let messages = [];

  if (error instanceof Response) {
    if (error.status == 400 || error.status == 404) {
      messages.push('Mauvaise addresse e-mail ou mot de passe.');
    }
  }
  else {
    messages.push('Vérifiez que vous êtes bien connecté à internet.');
  }

  return {
    type: LOGIN_FAILURE,
    error: true,
    payload: messages
  };
}

function login(email, password, rememberMe) {
  return (dispatch) => {
    dispatch(loginRequest());

    return fetch(Config.API + 'feats/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      // Pas nécessaire quand on utilisera le cookie de session //
      localStorage.setItem('userId', 1);
      ////////////////////////////////////////////////////////////
      dispatch(loginSuccess(getUserId(), email, rememberMe));
    })
    .catch((error) => {
      dispatch(loginFailure(error));
    });
  };
}

function logout() {
  return (dispatch) => {
    localStorage.removeItem('userId');
    dispatch({
      type: LOGOUT
    });
    browserHistory.push('/login');
  };
}

function registerRequest() {
  return {
    type: REGISTER_REQUEST
  };
}

function registerSuccess() {
  return {
    type: REGISTER_SUCCESS
  };
}

function registerFailure(error) {
  return {
    type: REGISTER_FAILURE,
    error: true,
    payload: error
  };
}

function register(email, password) {
  return (dispatch) => {
    dispatch(registerRequest());

    return fetch(Config.API + 'users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    })
    .then((response) => {
      if (response.code == 200) {
        dispatch(registerSuccess());
      }
      else {
        let error = new Error(response.statusText);
        error.response = response;
        dispatch(registerFailure(error));
      }
    })
    .catch((error) => {
      dispatch(registerFailure(error));
    });
  };
}

// Define the initial state for `auth` module

const userId = getUserId();

const initialState: State = {
  loggedIn: (userId > 0),
  userId,
  isLoggingIn: false,
  loginErrors: [],
  isRegistering: false,
  registerErrors: [],
};

// Reducer

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {

    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginErrors: []
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        userId: action.payload,
        isLoggingIn: false,
      };

    case LOGIN_FAILURE:
    return {
      ...state,
      isLoggingIn: false,
      loginErrors: action.payload
    };

    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        userId: 0
      };

    case REGISTER_REQUEST:
      return {
        ...state,
        isRegistering: true,
        registerErrors: []
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isRegistering: false,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        isRegistering: false,
        //registerErrors: action.payload
      };

    default:
      return state;
  }
}

// Selectors

const auth = (state) => state[NAME];

export const selector = createStructuredSelector({
  auth
});

export const actionCreators = {
  login,
  logout,
  register,
};
