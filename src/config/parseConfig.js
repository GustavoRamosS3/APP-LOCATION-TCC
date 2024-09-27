import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';

Parse.setAsyncStorage(AsyncStorage);

Parse.initialize('D0JelCevSHnoJabXo0Vrz5p46CkQK6wIyE9wurKq', 'xehEDwOdrdiz0mQiwPxr7ts7csjXuEdf20CiTpHw');
Parse.serverURL = 'https://parseapi.back4app.com';

export default Parse;