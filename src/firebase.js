import firebase from 'firebase/app';
import 'firebase/database';
import config from './assets/data/firebase-config.json';

firebase.initializeApp(config);

export const database = firebase.database().ref('icons/');
