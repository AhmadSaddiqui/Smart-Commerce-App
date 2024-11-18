import React from 'react';
import AppNavigator from './src/navigations/AppNavigator';
import { store, persistor } from './src/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

LogBox.ignoreAllLogs()
const App = () => {

  return (
    <StripeProvider
      publishableKey="pk_test_51PvAAaG2QCQK4aFPcPyotlu0petOw5mHCwlWI9tmEEHXcGThZaE3h0OxAXHsJ5tKDKDDO6vxBWBORNir85fEAvqL004fwRkq99"
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </StripeProvider>

  );
};

export default App;
