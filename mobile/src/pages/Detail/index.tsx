import React,{useState,useEffect} from 'react'
import {Text,Image,View,StyleSheet,TouchableOpacity,SafeAreaView} from 'react-native'
import Constants from 'expo-constants'
import {Feather as Icon,FontAwesome} from '@expo/vector-icons'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
const Detail = () => {
    const navigation = useNavigation()
    function handleNavigateBack(){
        navigation.goBack();
    }
    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34Cb79"/>
            </TouchableOpacity>
            <Image style={styles.pointImage} source={{uri:'https://a.cdn-hotels.com/gdcs/production50/d932/f3b0f4a2-7ed5-4fb3-b245-c094389a55e4.jpg'}}/>
            <Text style={styles.pointName}>Mercado do João</Text>
            <Text style={styles.pointItems}>Lampadas, oleo de cozinha</Text>
            <View style={styles.address}>
             <Text style={styles.addressTitle}>endereço</Text>
             <Text style={styles.addressContent}>rio do sul/SC</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={() => {}}>
                <FontAwesome name="whatsapp" size={20} color="#FFF"/>
                <Text style={styles.buttonText}>whatsapp</Text>
            </RectButton>
            <RectButton style={styles.button} onPress={() => {}}>
                <Icon name="mail" size={20} color="#fff"/>
                <Text style={styles.buttonText}>email</Text>
            </RectButton>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20+Constants.statusBarHeight,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

export default Detail