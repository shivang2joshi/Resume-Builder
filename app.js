
firebase.auth().onAuthStateChanged(function (user) {
    // caution! this will run constantly!
    // i tried putting redirection here it is conatantly redirecting
    if (user) {
        //signed in
        document.getElementById('user-photo').src=user.photoURL;
        document.getElementById('user-name').innerHTML=user.displayName;     
        console.log("1");
    } else {
        //not signed in
    }
});

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.location = "templates.html";
        
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
};

function logout() {
    firebase.auth().signOut()
        .then(function () {
            window.location = "index.html";
        });
}