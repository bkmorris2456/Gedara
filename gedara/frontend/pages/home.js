import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Template from '../pages/template';
import Card from '../components/card';
import { Provider as PaperProvider, Text, Surface } from 'react-native-paper';
import { theme } from '../theme';
import { auth, db } from '../../config';
import { 
  collection, 
  getDocs, 
} from 'firebase/firestore';

export default function Home({ navigation }) {

  const { colors } = theme;
  const [homes, setHomes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchHomes = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userHomesRef = collection(db, 'users', user.uid, 'properties');
        const querySnapshot = await getDocs(userHomesRef);
        const homesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHomes(homesList);
      } catch (error) {
        console.error('Error fetching homes: ', error);
      }
    }
  };

  // Fetch user homes and their data
  useEffect(() => {
    fetchHomes();
  }, []);

  
  const addHome = async(newHome) => {
    setHomes((prevHomes) => [...prevHomes, newHome]);
  };

  return (
    <Template navigation={navigation} onHomeAdded={fetchHomes}>

      <View style={[styles.container, { backgroundColor: colors.primary }]}>

        <Text style={[styles.headers]}>My Properties</Text>

        <ScrollView style={[styles.properties]} horizontal={true} showsHorizontalScrollIndicator={false}>
          {homes.map((home) => (
            <Card key={home.id} width={180} height={125} style={{ marginRight: 10 }}>
              <Text style={styles.general_text}>{home.homeName}</Text>
            </Card>
          ))}
        </ScrollView>

        <Text style={[styles.headers]}>Recently Added</Text>

        <ScrollView style={styles.recent} horizontal={false} showsVerticalScrollIndicator={false}>

        </ScrollView>

        <Text style={[styles.headers]}>Inventory Value</Text>

        <View style={styles.summaries}>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Items</Text>
          </Card>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Rooms</Text>
          </Card>
          <Card width={120} height={100} style={{ marginRight: 10 }}>
            <Text style={styles.general_text}>Total Value</Text>
          </Card>
        </View>

      </View>

    </Template>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  headers: { 
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
   }, // Default text color
  properties: {
    marginTop: 5,
    flexGrow: 1,
    maxHeight: 125, // Limit height for the properties section
  },
  recent: {
    marginVertical: 5,
    flexGrow: 1,
    maxHeight: 325, // Limit height for the recent properties section
    overflow: 'hidden', // Hide overflow to prevent scrollbars
  },
  summaries: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  general_text: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  }

});