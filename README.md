# p2o-react-app

This is a very basic React / Redux app that connects to the Pilotfish P2O server, and can be used as a boilerplate to
create your own.

The Pilotfish P2O server uses a web socket connection to be able to notify clients realtime on 'button presses'.
To setup the web socket connection, this project uses the [socket.io](http://socket.io/) library.

The Pilotfish websocket endpoint runs at `http://p2o.pilotfish-demo-portal.eu:3001`. You can connect to this endpoint with:

```javascript
let socket = io.connect('http://pilotfish-demo-portal.eu:3001');
```

The Pilotfish websocket API is pretty simple. When having connected you will be able to listen
for the following responses:

```javascript
socket.on('connection-response', (data) => {
  if (data.status === 'success') {
    dispatch((() => ({type: CONNECTION_SUCCESS}))());
    socket.emit('register', id);
    dispatch((() => ({type: REGISTERING}))());
  } else {
    dispatch((() => ({type: CONNECTION_FAILED}))());
  }
});
```

After you connect to the server, the server will respond with `connection response`.
The data from the response contains a `status` property, that can be `success` or `failed`. if the `data.status`
property is `success`, you need to emit a `register` message, with the button id as payload.

```javascript
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
```

After emitting the `register` message, the server will respond with `register-response` with the following in its payload:
*   `status` (string): will be either `success` or `failed`
*   `button` (object, optional): if a button object is send, it means there is already a button registered on the server
with this id. The button object will contain the following properties:
    *   `id` (string)
    *   `count` (int) The amount of clicks that happened when client was offline.
    *   `history` (array) An array of max 20 ISO dates that represent last clicks of this button.

```javascript
socket.on('button-press', (id) => {
  dispatch(receiveButtonPress(id));
});
```

When a button is pressed when connected, the server will emit `button-press` with the `id` of the button as payload.

If you want to use a dummy button to test your app go to [http://pilotfish-demo-portal.eu/button](http://pilotfish-demo-portal.eu/button)
