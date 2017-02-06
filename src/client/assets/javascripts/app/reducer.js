import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import friends, { NAME as friendsName } from 'features/friends';
import core, { NAME as coreName } from 'features/core';

export default combineReducers({
  routing,
  [coreName]: core,
  [friendsName]: friends
});
