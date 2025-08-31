// src/screens/ListScreen.tsx
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {constantVariables} from '../constants/Constants';

type UserItem = {
  login: {uuid: string};
  name: {title: string; first: string; last: string};
  dob: {age: number};
  phone: string;
  email: string;
  location: {city: string; country: string};
  picture: {large: string};
};

const ListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [logoutModal, setLogoutModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'User List',
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        fontFamily: 'System',
      },
      headerTitleAlign: 'left',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setLogoutModal(true)}
          style={{marginRight: 15}}>
          <Text style={{color: '#007bff', fontWeight: '600', fontSize: 16}}>
            {constantVariables.LOGOUT_TEXT}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function getUserData() {
    fetch(constantVariables.API_URL)
      .then(res => res.json())
      .then(data => {
        setUserData(data.results);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setLogoutModal(false);
      navigation.replace('Login');
    } catch (error) {}
  };

  useEffect(() => {
    getUserData();
  }, []);

  const renderItem = ({item}: {item: UserItem}) => (
    <View style={styles.card}>
      <Image source={{uri: item.picture.large}} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.name.title} {item.name.first} {item.name.last}
        </Text>
        <Text style={styles.detail}>Age: {item.dob.age}</Text>
        <Text style={styles.detail}>Phone: {item.phone}</Text>
        <Text style={styles.detail}>Email: {item.email}</Text>
        <Text style={styles.detail}>
          Location: {item.location.city}, {item.location.country}
        </Text>
      </View>
    </View>
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={userData}
        ListEmptyComponent={() => {
          return loading ? (
            <ActivityIndicator size="large" color="#007bff"  style={{marginTop:'10%'}}/>
          ) : (
            <View>
              <Text>No Records Found</Text>
            </View>
          );
        }}
        renderItem={renderItem}
        keyExtractor={item => item.login.uuid}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor="#007bff"
          />
        }
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModal}
        onRequestClose={() => setLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{constantVariables.MODAL_TEXT}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModal(false)}>
                <Text style={styles.cancelText}>
                  {constantVariables.CANCEL_TEXT}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}>
                <Text style={styles.confirmText}>
                  {constantVariables.CONFIRM_TEXT}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
    color: '#222',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBox: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {backgroundColor: '#eee'},
  confirmButton: {backgroundColor: '#007bff'},
  cancelText: {color: '#333', fontWeight: '600'},
  confirmText: {color: '#fff', fontWeight: '600'},
});

export default ListScreen;
