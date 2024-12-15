import useReducer from "./userSlice";
import authReducer from "./authSlice";
import globalReducer from "./globalSlice";
import notificacionReducer from "./notificacionSlice";

const reducers = {
  global: globalReducer, // Reducer para manejar el estado del tema
  user: useReducer,
  auth: authReducer,
  notificacion: notificacionReducer,
  // Aquí agregarías otros reducers definidos manualmente
};

export default reducers; 