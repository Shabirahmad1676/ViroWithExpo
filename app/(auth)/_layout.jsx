import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="LogIn"
        options={{
          headerShown: true,
          title: 'Login',
          headerStyle: {
            backgroundColor: '#1ef4d7',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SignUp"
        options={{
          headerShown: true,
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#1ef4d7',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ForgotPass"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPass"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
