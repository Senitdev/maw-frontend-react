import React from 'react';
import { Route, IndexRedirect, Redirect, IndexRoute } from 'react-router';

import App from './App';
import NotFoundView from 'components/NotFound';
import ManagementLayout from 'features/core/components/ManagementLayout';

import DisplayManagementContainer from 'features/displayManagement/components/DisplayManagementContainer';
import LoginContainer from 'features/auth/components/login/LoginContainer';
import RegisterContainer from 'features/auth/components/register/RegisterContainer';
import AgendaEditorContainer from 'features/displayManagement/components/AgendaEditorContainer';
import SceneEditorContainer from 'features/displayManagement/components/SceneEditorContainer';

import { AgendaTableContainer, FileTableContainer, SceneTableContainer, ScreenTableContainer } from 'features/displayManagement/containers';
import { inTablePage } from 'features/displayManagement/pages/TablePage';

export default function getRoutes(store) {

  function redirectIfAlreadyLoggedIn(nextState, replace) {
    if (store.getState().auth.loggedIn) {
      replace('/');
    }
  }

  function redirectIfNotLoggedIn(nextState, replace) {
    if (! store.getState().auth.loggedIn) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  return (
    <Route component={App}>

      {/* Routes accessible lorsque l'utilisateur n'est PAS authentifié */}
      <Route onEnter={redirectIfAlreadyLoggedIn}>
        <Route path="/login" component={LoginContainer} />
        <Route path="/register" component={RegisterContainer} />
      </Route>

      {/* Routes accessible lorsque l'utilisateur EST authentifié */}
      <Route path="/" component={ManagementLayout} onEnter={redirectIfNotLoggedIn}>
        <IndexRedirect to="display-management" />

        <Route path="display-management" component={DisplayManagementContainer}>
          <IndexRedirect to="agenda" />

          <Route path="file" component={inTablePage(FileTableContainer)} />

          <Route path="scene">
            <IndexRoute component={inTablePage(SceneTableContainer)} />
            <Route path=":idScene" component={SceneEditorContainer} />
          </Route>

          <Route path="screen" component={inTablePage(ScreenTableContainer)} />

          <Route path="agenda">
            <IndexRoute component={inTablePage(AgendaTableContainer)} />
            <Route path=":idAgenda" component={AgendaEditorContainer} />
          </Route>

        </Route>
      </Route>

      <Route path="/404" component={NotFoundView} />
      <Redirect from="*" to="/404" />
    </Route>
  );
}
