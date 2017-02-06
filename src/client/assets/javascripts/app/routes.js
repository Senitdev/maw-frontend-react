import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import FriendsView from 'features/friends/components/FriendsView';
import NotFoundView from 'components/NotFound';

import DisplayManagementContainer from 'features/display-management/components/DisplayManagementContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={FriendsView} />
    <Route path="display-management" component={DisplayManagementContainer} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
