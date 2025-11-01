# AuthContext - User Authentication

The AuthContext provides a centralized authentication system for the VTour app using Supabase Auth.

## Features

- **Email/Password Authentication**: Sign up, sign in, and sign out
- **Password Management**: Reset and update passwords
- **Session Management**: Automatic token refresh and session persistence
- **User Profile**: Update user metadata
- **Account Management**: Delete user accounts
- **Email Verification**: Resend verification emails
- **Automatic Token Refresh**: Handles app state changes seamlessly

## Usage

### 1. Import the AuthProvider

Wrap your app with the `AuthProvider` in `app/_layout.tsx`:

```jsx
import { AuthProvider } from '@/AuthContext/UserAuth';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use the useAuth Hook

Import and use the `useAuth` hook in any component:

```jsx
import { useAuth } from '@/AuthContext/UserAuth';

function MyComponent() {
  const { user, session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {user ? (
        <Button title="Sign Out" onPress={signOut} />
      ) : (
        <Button title="Sign In" onPress={() => signIn(email, password)} />
      )}
    </View>
  );
}
```

## Available Properties and Methods

### Properties

- `user`: Current user object (null if not logged in)
- `session`: Current session object
- `loading`: Boolean indicating if auth state is being checked
- `initialLoading`: Boolean indicating initial app load

### Methods

#### Authentication

- `signIn(email, password)`: Sign in with email and password
  - Returns: `{ data, error }`
  
- `signUp(email, password, metadata?)`: Create a new user account
  - Returns: `{ data, error }`
  
- `signOut()`: Sign out the current user
  - Returns: `{ error }`

#### Password Management

- `resetPassword(email)`: Send password reset email
  - Returns: `{ error }`
  
- `updatePassword(newPassword)`: Update user password
  - Returns: `{ error }`

#### User Profile

- `updateUser(metadata)`: Update user metadata
  - Returns: `{ data, error }`
  
- `getUser()`: Get current user
  - Returns: `{ user, error }`

#### Account Management

- `deleteAccount()`: Delete user account (requires admin privileges)
  - Returns: `{ error }`

#### Session Management

- `refreshSession()`: Manually refresh the current session
  - Returns: `{ data, error }`
  
- `isAuthenticated()`: Check if user is authenticated
  - Returns: `boolean`

#### Email Verification

- `resendEmailVerification()`: Resend email verification
  - Returns: `{ error }`

## Examples

### Sign In

```jsx
const { signIn } = useAuth();

const handleSignIn = async () => {
  const { data, error } = await signIn('user@example.com', 'password123');
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    // Successfully signed in
    router.push('/home');
  }
};
```

### Sign Up

```jsx
const { signUp } = useAuth();

const handleSignUp = async () => {
  const { data, error } = await signUp(
    'user@example.com',
    'password123',
    {
      full_name: 'John Doe'
    }
  );
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Success', 'Account created!');
  }
};
```

### Reset Password

```jsx
const { resetPassword } = useAuth();

const handleResetPassword = async () => {
  const { error } = await resetPassword('user@example.com');
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Success', 'Password reset email sent!');
  }
};
```

### Update User Profile

```jsx
const { updateUser } = useAuth();

const handleUpdateProfile = async () => {
  const { data, error } = await updateUser({
    full_name: 'Jane Doe',
    phone: '+1234567890'
  });
  
  if (error) {
    Alert.alert('Error', error.message);
  } else {
    Alert.alert('Success', 'Profile updated!');
  }
};
```

## Error Handling

All methods return an object with an `error` property. Check for errors and handle them appropriately:

```jsx
const { signIn } = useAuth();

const result = await signIn(email, password);

if (result.error) {
  console.error('Sign in failed:', result.error.message);
  // Handle error (show alert, log, etc.)
} else {
  // Handle success
  console.log('Signed in successfully');
}
```

## Loading States

Use the `loading` property to show loading indicators:

```jsx
const { loading, user } = useAuth();

if (loading) {
  return <ActivityIndicator size="large" />;
}

return <Text>{user ? `Welcome, ${user.email}` : 'Please sign in'}</Text>;
```

## Security Notes

- All authentication is handled securely by Supabase
- Passwords are never stored locally
- Tokens are automatically refreshed
- Session is persisted using AsyncStorage
- The context automatically handles app state changes
- All sensitive data should be stored in environment variables

## Integration with Supabase

The AuthContext uses the Supabase client configured in `utils/supabase.js`. Make sure your `.env` file contains:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

See the main README for more setup instructions.

