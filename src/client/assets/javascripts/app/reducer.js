import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import friends, { NAME as friendsName } from 'features/friends';
import core, { NAME as coreName } from 'features/core';
import displayManagement, { NAME as displayManagementName } from 'features/displayManagement';

export default combineReducers({
  routing,
  [coreName]: core,
  [displayManagementName]: displayManagement,
  [friendsName]: friends
});
