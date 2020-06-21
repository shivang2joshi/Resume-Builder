// Initialize Firebase
var config = {
    apiKey: "AIzaSyDECYRkmOiwqIsmw3MJxf0XAxk0ljf4sGo",
    authDomain: "resume-db-1403c.firebaseapp.com",
    databaseURL: "https://resume-db-1403c.firebaseio.com",
    projectId: "resume-db-1403c",
    storageBucket: "resume-db-1403c.appspot.com",
    messagingSenderId: "578628846812"
};
firebase.initializeApp(config);
var currentUser;
setTimeout(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        // calling other window in here will run abruptly
        if (user) {
            //'printf(user);
            //signed in
            currentUser = user;
            if (document.getElementById('user-photo')) { //to be sure we have such element on this page.
                document.getElementById('user-photo').src = user.photoURL;
            }
            if (document.getElementById('user-name')) {
                document.getElementById('user-name').innerHTML = user.displayName;
            }
            if (document.getElementById('user-id')) {
                document.getElementById('user-id').innerHTML = user.email;
            }
            console.log("runs one time");
        } else {
            //not signed in
            printf('not signed in');
            currentUser = null;
            
            if (window.location.pathname !== '/index.html')
                window.location = "./index.html";
        }
    });
}, 800);