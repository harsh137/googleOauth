

import * as React from 'react';
import 'react-native-url-polyfill/auto';
import "react-native-get-random-values";
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <PaperProvider>
      <MainNavigator />
    </PaperProvider>
  );
}
