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


const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalerrmsg, setModalMessage] = useState('');
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

  const handleSignUp = async () => {
    try {
      setLoading(true)
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      navigation.replace('List');
    } catch (error: any) {
      setModalMessage(error.message);
      setModalVisible(true);
    } finally {
      setLoading(false)
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Sign Up',
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        fontFamily: 'System',
      },
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Header text */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>{constantVariables.createAcc}</Text>
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

      {/* Password */}
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

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.button, !isValidForm && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={!isValidForm}>
        <Text style={styles.buttonText}>{constantVariables.signUpButton}</Text>
      </TouchableOpacity>

      {/* Navigation Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          {constantVariables.loginLink}
          <Text style={styles.linkHighlight}>
            {constantVariables.loginLinkHighlight}
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Modal for Invalid Credentials */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalerrmsg}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },

  header: {marginBottom: 30},
  subtitle: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    fontWeight: '500',
  },

  inputContainer: {marginBottom: 25},
  label: {fontSize: 15, fontWeight: '700', marginBottom: 6, color: '#333'},
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 17,
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
    fontWeight: '700',
    textAlign: 'center',
  },

  link: {textAlign: 'center', color: '#666', fontSize: 16},
  linkHighlight: {color: '#007bff', fontWeight: '600', fontSize: 16},

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
  modalText: {fontSize: 16, marginBottom: 15, fontWeight: '500', color: '#222'},
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {color: '#fff', fontWeight: '600'},
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;
