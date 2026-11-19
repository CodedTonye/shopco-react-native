import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import { hydrateAuth } from './src/store/authSlice';
import Navigation from './src/navigation';

function Root() {
  const dispatch = useDispatch();
  const hydrated = useSelector((s) => s.auth.hydrated);

  // Restore a saved sign-in (AsyncStorage is async, so it can't be read at store creation).
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Navigation />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Root />
      </SafeAreaProvider>
    </Provider>
  );
}
