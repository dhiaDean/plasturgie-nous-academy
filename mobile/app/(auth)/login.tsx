// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { AuthRequest } from '../services/api.types'; // Adjust path if needed

// Reusing theme colors (adapt if needed)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Light background
    },
    formContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b', // Dark text
        marginBottom: 32, // Increased margin
        textAlign: 'center',
    },
    // Style for error message shown above the form
    formErrorText: {
        color: '#dc2626', // Red
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16, // Space below error message
    },
    inputContainer: {
        marginBottom: 20, // Increased margin
    },
    label: {
        fontSize: 14, // Slightly smaller label
        marginBottom: 8,
        fontWeight: '500',
        color: '#334155', // Darker gray label
    },
    input: {
        backgroundColor: '#ffffff', // White input
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#cbd5e1', // Lighter border
        fontSize: 16, // Ensure font size is appropriate
        color: '#1e293b',
    },
    inputError: { // Style to apply to input on error (optional)
        borderColor: '#dc2626', // Red border
    },
    button: {
        backgroundColor: '#2563eb', // Accent blue
        borderRadius: 8,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        flexDirection: 'row', // To align text and activity indicator
    },
    buttonDisabled: {
         backgroundColor: '#93c5fd', // Lighter blue when disabled
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginLeft: 10,
    },
    linksContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    link: {
        color: '#2563eb', // Accent blue
        fontSize: 14,
        marginVertical: 8,
    },
});


export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  // State specifically for displaying login error messages near the form
  const [loginError, setLoginError] = useState<string | null>(null);

  const { performLogin, isLoading } = useAuth();

  const handleLogin = async () => {
    setLoginError(null); // Clear previous form errors on new attempt

    if (!usernameOrEmail || !password) {
      // Keep using Alert for simple missing field validation
      Alert.alert('Saisie requise', 'Veuillez saisir votre nom d\'utilisateur/email et mot de passe.');
      return;
    }

    const credentials: AuthRequest = {
      username: usernameOrEmail,
      password: password,
    };

    try {
        console.log('Tentative de connexion avec :', credentials.username);
        await performLogin(credentials);
        console.log('Connexion réussie, navigation...');
        // Navigate after successful login (handled by performLogin -> login -> RootLayoutNav effect)
        // No explicit navigation needed here if RootLayoutNav handles it
        // router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Échec de la connexion :', error);
      let message = 'Échec de la connexion. Veuillez réessayer plus tard.'; // Default generic error

      // Check if it's a specific 'Unauthorized' error (wrong credentials)
      if (error?.response?.status === 401) {
        message = 'Nom d\'utilisateur ou mot de passe incorrect.'; // Specific message for bad credentials
        // Set the specific error message to display near the form
        setLoginError(message);
        // Optionally, don't show an Alert for this common case, the inline message is enough
      } else {
        // For other errors (network, server error, etc.), extract message or use default
        message = error?.response?.data?.message || error?.message || message;
        // Show a popup Alert for unexpected errors
        Alert.alert('Échec de la connexion', message);
        // Optionally also set the localError state if you want to display these too
        // setLoginError(message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Connexion</Text>

        {/* Display login error message right below the title */}
        {loginError && (
          <Text style={styles.formErrorText}>{loginError}</Text>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom </Text>
          <TextInput
            // Apply error style to input border if loginError exists (optional)
            style={[styles.input, loginError ? styles.inputError : null]}
            placeholder="Saisissez votre nom "
            value={usernameOrEmail}
            // Clear error when user starts typing again
            onChangeText={(text) => { setUsernameOrEmail(text); setLoginError(null); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="username"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            // Apply error style to input border if loginError exists (optional)
            style={[styles.input, loginError ? styles.inputError : null]}
            placeholder="Saisissez votre mot de passe"
            value={password}
             // Clear error when user starts typing again
            onChangeText={(text) => { setPassword(text); setLoginError(null); }}
            secureTextEntry
            autoComplete="current-password"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
          {isLoading && (
            <ActivityIndicator size="small" color="#ffffff" style={styles.loadingIndicator} />
          )}
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} disabled={isLoading}>
            <Text style={styles.link}>Vous n'avez pas de compte ? S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} disabled={isLoading}>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}