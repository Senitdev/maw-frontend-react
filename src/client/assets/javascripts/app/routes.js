import React from 'react';
import { Route, IndexRedirect, Redirect, IndexRoute } from 'react-router';

import App from './App';
import NotFoundView from 'components/NotFound';
import ManagementLayout from 'features/core/components/ManagementLayout';

import DisplayManagementContainer from 'features/displayManagement/components/DisplayManagementContainer';
import MediaLibraryContainer from 'features/displayManagement/components/MediaLibraryContainer';
import DisplayListContainer from 'features/displayManagement/components/DisplayListContainer';
import ImageListContainer from 'features/displayManagement/components/ImageListContainer';
import VideoListContainer from 'features/displayManagement/components/VideoListContainer';
import LoginContainer from 'features/auth/components/login/LoginContainer';
import RegisterContainer from 'features/auth/components/register/RegisterContainer';
import { ImageEditForm } from 'features/displayManagement/components/ImageListContainer';

// Temporaire
const PlanningList = () => <div>Planning list</div>;

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
        <IndexRedirect to="image" />
        <Route component={MediaLibraryContainer}>
          <Route path="image">
            <IndexRoute component={ImageListContainer} />
            <Route path=":idImage" component={ImageEditForm} />
          </Route>
          <Route path="video" component={VideoListContainer} />
        </Route>
        <Route path="display" component={DisplayListContainer} />
        <Route path="planning" component={PlanningList} />
      </Route>

    </Route>

    <Route path="/404" component={NotFoundView} />
    <Redirect from="*" to="/404" />
  </Route>
);
