import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';

import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

class App extends Component {
  state = {
    isLoading: true,
    contacts: []
  }

  loadContacts = async() => {
    const permission = await Permissions.askAsync(
      Permissions.CONTACTS
    )

    if(permission.status !== 'granted') {
      return;
    } else {
      const {data} = await Contacts.getContactsAsync({
        fields:[Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails]
      })
      this.setState((prevState) => (
        { contacts: data,
          tempContacts: data,
          isLoading: false
        }
        ));
    }
  }

  renderItem = ({item}) => (
    <View style={{minHeight:70, padding: 5, alignItems: 'center'}}>
      <Text style={{color: '#0a122a', fontSize: 22}}>
        {item.firstName}{' '}{item.lastName ? item.lastName : null}
      </Text>
      <Text style={{color: 'white', fontSize: 18}}>
        {item.phoneNumbers ? item.phoneNumbers[0].number : 'No Number Saved'}
      </Text>
    </View>
  );

  searchContacts = (val) => {
    const filteredContacts = this.state.tempContacts.filter(
      contact => {
        let contactLowerCase = (contact.firstName+' '+contact.lastName).toLowerCase();

        let searchTermLowercase = val.toLowerCase();

        return contactLowerCase.indexOf(searchTermLowercase) > -1
      }
    )

    this.setState({ contacts: filteredContacts })
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadContacts();
  }

  render() {
    return (
        <View style={{
            flex: 1,
            backgroundColor: "#92ad94"
        }}>
        <SafeAreaView style={{backgroundColor: "#92ad94", marginBottom: 30}}>
            <TextInput
                placeholder="Search"
                placeholderTextColor="white"
                style={{
                  marginTop: 50,
                  marginLeft: 60,
                  width: '70%',
                  backgroundColor: '#dce2c8',
                  height: 40,
                  fontSize: 25,
                  padding: 5,
                  textAlign: 'center',
                  color: 'white',
                  borderRadius: 5
                  }}
                onChangeText={(value) => this.searchContacts(value)}
              />
        </SafeAreaView>
        <View
          style={{
          flex: 1,
          backgroundColor: '#92ad94'
          }}>
          {this.state.isLoading
            ? (
              <View
                  style={{
                  ...StyleSheet.absoluteFill,
                  alignItems: 'center',
                  justifyContent: 'center'
              }}>
                <ActivityIndicator size="large" color="#bad555"/>
            </View> ) : null }
          </View>

          <FlatList 
            keyExtractor={(item, index) => index.toString()}
              data={this.state.contacts}
              renderItem={this.renderItem}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center'
                  }}>
                  <Text style={{color: '#0a122a', fontSize: 30}}>No contacts found</Text> 
                </View>
              )} />
        </View>
    )
  }
}


export default App;