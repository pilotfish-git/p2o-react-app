import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import socket from './modules/socket';

export default combineReducers({
  router,
  socket
});
