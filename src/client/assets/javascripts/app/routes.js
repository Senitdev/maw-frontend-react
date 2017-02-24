import React from 'react';
import { Route, IndexRedirect, Redirect, IndexRoute } from 'react-router';

import App from './App';
import NotFoundView from 'components/NotFound';
import ManagementLayout from 'features/core/components/ManagementLayout';

import DisplayManagementContainer from 'features/displayManagement/components/DisplayManagementContainer';
import AgendaListContainer from 'features/displayManagement/components/AgendaListContainer';
import ScreenListContainer from 'features/displayManagement/components/ScreenListContainer';
import SceneListContainer from 'features/displayManagement/components/SceneListContainer';
import FileListContainer from 'features/displayManagement/components/FileListContainer';
import LoginContainer from 'features/auth/components/login/LoginContainer';
import RegisterContainer from 'features/auth/components/register/RegisterContainer';
import AgendaEditorContainer from 'features/displayManagement/components/AgendaEditorContainer';
import SceneEditorContainer from 'features/displayManagement/components/SceneEditorContainer';

export default (
  <Route component={App}>

    {/* Routes accessible lorsque l'utilisateur n'est PAS authentifié */}
    <Route onEnter={() => {/* redirectToDashboard if auth */}}>
      <Route path="/login" component={LoginContainer} />
      <Route path="/register" component={RegisterContainer} />
    </Route>

    {/* Routes accessible lorsque l'utilisateur EST authentifié */}
    <Route path="/" component={ManagementLayout} onEnter={() => {/* redirectToLogin if not auth */}}>

      <IndexRedirect to="display-management" />

      <Route path="display-management" component={DisplayManagementContainer}>
        <IndexRedirect to="agenda" />
        <Route path="file" component={FileListContainer} />
        <Route path="scene">
          <IndexRoute component={SceneListContainer} />
          <Route path=":idScene" component={SceneEditorContainer} />
        </Route>
        <Route path="screen" component={ScreenListContainer} />
        <Route path="agenda">
          <IndexRoute component={AgendaListContainer} />
          <Route path=":idAgenda" component={AgendaEditorContainer} />
        </Route>

      </Route>

    </Route>

    <Route path="/404" component={NotFoundView} />
    <Redirect from="*" to="/404" />
  </Route>
);
