import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React from 'react';

export default function TabOneScreen() {
  const [data,setdata] = React.useState<any>(undefined);
  React.useEffect(() => {
    const getAPiData = async () => {
      let result = await fetch('http://localhost:5178/api/games');
        let data = await result.json();
        setdata(data);
        console.log(data);
    };
    getAPiData();
  }, []);

  return (    
    <View style={styles.container}>      
      {data && (     
          <Text style={styles.title}>{data.message}</Text>        
      )}
      <Text style={styles.title}>{data.message}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  text: {
    fontSize: 10,       
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
