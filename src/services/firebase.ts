import firebase from 'firebase/app';

// É necessário importar cada serviço que queira utilizar do Firebase
// Importando a autenticação e o banco de dados
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Inicia a aplicação.
firebase.initializeApp(firebaseConfig);

// Declaração de variáveis a serem utilizadas na aplicação.
export const auth = firebase.auth()
export const database = firebase.database()