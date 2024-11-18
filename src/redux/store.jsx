// import { configureStore } from '@reduxjs/toolkit';
// import cartReducer from './CartSlice';

// const store = configureStore({
//   reducer: {
//     cart: cartReducer,
//   },
// });

// export default store;


import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other reducers if any
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Add middleware and enhancers as needed
});

const persistor = persistStore(store);

export { store, persistor };
