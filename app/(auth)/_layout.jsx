import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1ef4d7',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="LogIn"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="SignUp"
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name="ForgotPass"
        options={{
          title: 'Forgot Password',
        }}
      />
      <Stack.Screen
        name="ResetPass"
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
}
