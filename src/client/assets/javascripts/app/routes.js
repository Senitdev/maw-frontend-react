import React from 'react';
import { Route, IndexRedirect, Redirect, IndexRoute } from 'react-router';

import App from './App';
import NotFoundView from 'components/NotFound';
import ManagementLayout from 'features/core/components/ManagementLayout';

import DisplayManagementContainer from 'features/displayManagement/components/DisplayManagementContainer';
import PlanningListContainer from 'features/displayManagement/components/PlanningListContainer';
import DisplayListContainer from 'features/displayManagement/components/DisplayListContainer';
import ImageListContainer from 'features/displayManagement/components/ImageListContainer';
import SceneListContainer from 'features/displayManagement/components/SceneListContainer';
import VideoListContainer from 'features/displayManagement/components/VideoListContainer';
import LoginContainer from 'features/auth/components/login/LoginContainer';
import RegisterContainer from 'features/auth/components/register/RegisterContainer';
import { ImageEditForm } from 'features/displayManagement/components/ImageListContainer';
import PlanningEditorContainer from 'features/displayManagement/components/PlanningEditorContainer';

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
        <IndexRedirect to="planning" />
        <Route path="image">
          <IndexRoute component={ImageListContainer} />
          <Route path=":idImage" component={ImageEditForm} />
        </Route>
        <Route path="video" component={VideoListContainer} />
        <Route path="scene" component={SceneListContainer} />
        <Route path="display" component={DisplayListContainer} />
        <Route path="planning">
          <IndexRoute component={PlanningListContainer} />
          <Route path=":idPlanning" component={PlanningEditorContainer} />
        </Route>

      </Route>

    </Route>

    <Route path="/404" component={NotFoundView} />
    <Redirect from="*" to="/404" />
  </Route>
);
