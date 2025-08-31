import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import ListScreen from './src/screens/ListScreen';
import SignUpScreen from './src/screens/SignupScreen';
import auth from '@react-native-firebase/auth';



const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setInitialRoute('List');   
      } else {
        setInitialRoute('Login');
      }
    });

    return unsubscribe;
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="List" component={ListScreen} />
         <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
