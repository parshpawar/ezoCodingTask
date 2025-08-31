import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import { constantVariables } from '../constants/Constants';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError(constantVariables.emailError);
    } else {
      setEmailError('');
    }

    if (password && !validatePassword(password)) {
      setPasswordError(constantVariables.passwordError);
    } else {
      setPasswordError('');
    }

    setIsValidForm(validateEmail(email) && validatePassword(password));
  }, [email, password]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      navigation.replace('List');
    } catch (error: any) {
      setPassword('');
      setPasswordError('');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Login',
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        fontFamily: 'System',
      },
      headerTitleAlign: 'left',
      headerLeft: () => null,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>{constantVariables.subtitle}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{constantVariables.emailLabel}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.error}>{emailError ? emailError : ' '}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{constantVariables.passwordLabel}</Text>
        <TextInput
          style={[styles.input, {color: '#000'}]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          keyboardType="default"
        />
        <Text style={styles.error}>{passwordError ? passwordError : ' '}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValidForm && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isValidForm}>
        <Text style={styles.buttonText}>{constantVariables.loginButton}</Text>
      </TouchableOpacity>

      {/* SignUp Link */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>
          {constantVariables.signUpLink}
          <Text style={styles.linkHighlight}>
            {constantVariables.signUpLinkHighlight}
          </Text>
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{constantVariables.modalText}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>
                {constantVariables.modalButton}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const commonFont = {
  fontFamily: 'System',
  color: '#222',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  header: {marginBottom: 30},
  subtitle: {
    ...commonFont,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },

  inputContainer: {marginBottom: 20},
  label: {fontSize: 15, fontWeight: '700', marginBottom: 6, color: '#333'},
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 17, // bigger input text
    fontWeight: '500',
    color: '#000',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {backgroundColor: '#a0c4ff'},
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700', // bold button text
    textAlign: 'center',
  },
  link: {textAlign: 'center', ...commonFont, color: '#666', fontSize: 14},
  linkHighlight: {color: '#007bff', fontWeight: '600', fontSize: 14},

  error: {
    marginTop: 5,
    fontSize: 13,
    color: '#ff6666',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBox: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {...commonFont, fontSize: 16, marginBottom: 15, fontWeight: '500'},
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {color: '#fff', fontWeight: '600', ...commonFont},
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
