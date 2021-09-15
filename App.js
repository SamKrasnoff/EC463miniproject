import React, { useState, useEffect, Component } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Alert} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the functions you need from the SDKs you need

import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr5LAGU37xcRb9vQWtssUmngNJvFDQ5SA",
  authDomain: "caloriecounter-b0801.firebaseapp.com",
  projectId: "caloriecounter-b0801",
  storageBucket: "caloriecounter-b0801.appspot.com",
  messagingSenderId: "573225939012",
  appId: "1:573225939012:web:aada8da8e57e4be5a14c11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Stack = createNativeStackNavigator();

function getNutrientData(food, servings){
  console.log(food+" "+servings )
  fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=iYmuUNNJMdfEN5WjPqaK70FjNxHASolNr9r7T278&query=${food}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(function(resp) { return resp.json(); })
      .then(function(nutrients){
        if(nutrients.foods[0].foodNutrients[3].unitName === "KCAL"){
          alert(`By eating ${food} with ${servings} servings, you will consume ${nutrients.foods[0].foodNutrients[3].value*servings} calories.`)
        }
      })
}

function EnterFoodScreen(){
  const [textInputValue, setTextInputValue] = React.useState({
    food: '',
    servings: null
  });
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={input => setTextInputValue({food: input, servings: textInputValue.servings })}
          value={textInputValue.food}
          placeholder="Enter the food you are planning to eat"
          underlineColorAndroid={'black'}
        />
        <TextInput
          onChangeText={input => setTextInputValue({food: textInputValue.food, servings: input})}
          value={textInputValue.servings}
          placeholder="Enter the number of servings"
          keyboardType={'number-pad'}
          underlineColorAndroid={'black'}
        />
        <Button 
          onPress={() =>getNutrientData(textInputValue.food, textInputValue.servings)}
          title="Submit">
        </Button>
      </View>
    );
  }

  function HomeScreen({navigation}){
    return (
      <View style={styles.container}>
        <Text>Would you like to enter your food or scan its barcode?</Text>
        <Button title="Enter Manually"  onPress={() => navigation.navigate('Type')}></Button>
        <Button title="Scan Barcode"  onPress={() => navigation.navigate('Scan')}></Button>
      </View>
    )
  }

  export default function App() {
    return(
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanFoodScreen} />
        <Stack.Screen name="Type" component={EnterFoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    ) 
  }

  function ScanFoodScreen(){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [servingsValue, setServingsValue] = React.useState();

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      fetch(`https://api.upcdatabase.org/product/${data}?apikey=67E7EB17801D3A0AA05DF78A30007F6F`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(function(response) { return response.json(); })
      .then(function(json) {
        fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=iYmuUNNJMdfEN5WjPqaK70FjNxHASolNr9r7T278&${json.description}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(function(resp) { return resp.json(); })
        .then(function(nutrients){
          let servings = Alert.prompt("Enter number of servings")
          if(nutrients.foods[0].foodNutrients[3].unitName === "KCAL"){
            console.log("MADE IT")
            //alert(`By eating ${food} with ${servings} servings, you will consume ${nutrients.foods[0].foodNutrients[3].value*servings} calories.`)
          }
        })
      })
    };

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}  
        <TextInput
          onChangeText={input => setServingsValue(input)}
          value={servingsValue}
          placeholder="Enter the number of servings"
          keyboardType={'number-pad'}
          underlineColorAndroid={'black'}
        />
        <Button 
          // onPress={() =>getNutrientData(textInputValue.food, textInputValue.servings)}
          title="Submit">
        </Button>
      </View>
    ); 
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
