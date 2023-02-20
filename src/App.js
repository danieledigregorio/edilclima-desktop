import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase from "firebase";
import {Router} from "./Router";
import {AuthProvider} from "./Auth";

if(!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyCX8kz8LisBPhnw9KYo4iojDB0nw8BuJdI",
        authDomain: "edilclima-did.firebaseapp.com",
        databaseURL: "https://edilclima-did-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "edilclima-did",
        storageBucket: "edilclima-did.appspot.com",
        messagingSenderId: "237718875664",
        appId: "1:237718875664:web:a49dd19c52d8074a76a495"
    })
}


export default function App() {

  return (
    <div>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </div>
  );
}
