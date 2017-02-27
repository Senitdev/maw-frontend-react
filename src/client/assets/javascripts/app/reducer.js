import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import auth, { NAME as authName } from 'features/auth';
import core, { NAME as coreName } from 'features/core';
import displayManagement, { NAME as displayManagementName } from 'features/displayManagement';
import friends, { NAME as friendsName } from 'features/friends';

export default combineReducers({
  routing,
  [authName]: auth,
  [coreName]: core,
  [displayManagementName]: displayManagement,
  [friendsName]: friends
});
