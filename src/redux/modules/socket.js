/* @flow */
import io from 'socket.io-client';

// ------------------------------------
// Constants
// ------------------------------------

export const CONNECTING = 'CONNECTING';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';
export const REGISTERING = 'REGISTERING';
export const CONNECTION_FAILED = 'CONNECTION_FAILED';
export const REGISTRATION_SUCCES = 'REGISTRATION_SUCCES';
export const REGISTRATION_SUCCES_NO_BUTTON = 'REGISTRATION_SUCCES_NO_BUTTON';
export const REGISTRATION_FAILED = 'REGISTRATION_FAILED';
export const RECEIVE_BUTTON_PRESS = 'RECEIVE_BUTTON_PRESS';

// ------------------------------------
// Actions
// ------------------------------------

function receiveButtonPress(id) {
  return {
    type: RECEIVE_BUTTON_PRESS,
    payload: id
  };
}

export function socketConnect(id) {
  return (dispatch) => {
    dispatch((() => ({type: CONNECTING}))());

    let socket = io.connect('http://p2o.pilotfish-demo-portal.eu:3001');

    socket.on('connection-response', (data) => {
      if (data.status === 'success') {
        dispatch((() => ({type: CONNECTION_SUCCESS}))());
        socket.emit('register', id);
        dispatch((() => ({type: REGISTERING}))());
      } else {
        dispatch((() => ({type: CONNECTION_FAILED}))());
      }
    });

    socket.on('register-response', (data) => {
      if (data.status === 'success') {
        if (data.button) {
          dispatch((() => ({type: REGISTRATION_SUCCES, payload: data.button}))());
        } else {
          dispatch((() => ({type: REGISTRATION_SUCCES_NO_BUTTON, payload: id}))());
        }
      } else {
        dispatch((() => ({type: REGISTRATION_FAILED}))());
      }
    });

    socket.on('button-press', (id) => {
      dispatch(receiveButtonPress(id));
    });
  };
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  connecting: false,
  connected: false,
  registering: false,
  registered: false,
  message: '',
  listeningTo: '',
  button: {}
};

export default function socketReducer(state = initialState, action) {
  switch (action.type) {
    case CONNECTING:
      return {
        ...state,
        connecting: true
      };
    case CONNECTION_SUCCESS:
      return {
        ...state,
        connecting: false,
        connected: true,
        message: 'connection established'
      };
    case CONNECTION_FAILED:
      return {
        ...state,
        connecting: false,
        message: 'connection failed'
      };
    case REGISTERING:
      return {
        ...state,
        registering: true
      };
    case REGISTRATION_SUCCES:
      return {
        ...state,
        registering: false,
        registered: true,
        listeningTo: action.payload.id,
        button: action.payload,
        message: 'registration successful'
      };
    case REGISTRATION_SUCCES_NO_BUTTON:
      return {
        ...state,
        registering: false,
        registered: true,
        listeningTo: action.payload,
        message: 'waiting for button press'
      };
    case RECEIVE_BUTTON_PRESS:
      let button = state.button;
      if (!button) {
        button = {
          id: action.payload,
          cache: 0,
          history: []
        };
      }
      button.history.push((new Date()).toString());
      button.cache += 1;

      return {
        ...state,
        button: {
          ...state.button,
          ...button
        }
      };

    default:
      return state;
  }
}

