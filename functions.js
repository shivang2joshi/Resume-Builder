function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.location = "templates.html";

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        window.alert(errorMessage);
    });
};

function logout() {
    firebase.auth().signOut()
        .then(function () {
            window.location = "index.html";
        });
}

function selectAll(){
    document.execCommand('selectAll',true,"replace this");
}

function printResume() {
    //document represent respective resume template
    
    var printdocument = document.getElementById('resume').innerHTML;
    var originalDocument = document.body.innerHTML;

    //order matter here
    document.getElementById('resume').classList.remove('my-resume-page');
    document.body.innerHTML=printdocument;
    //
    
    //$(document).ready();
    //img isn't ready and its printing already
    //so set timeout and wait for image to load
    //.5s would be sufficient
    setTimeout(function(){
        window.print();
        document.body.innerHTML = originalDocument;
    },500);    
}

function previewResume() {
    var addbtns = document.getElementsByClassName("addButton");
    var rmbtns = document.getElementsByClassName("removeButton");
    var i;
    if (isPreviewClicked) {
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'none';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'none';
        }
        document.getElementById("preview-doc").innerHTML = "Edit";
        isPreviewClicked = false; //now edit option should be available
    } else {
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'inline';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'inline';
        }
        document.getElementById("preview-doc").innerHTML = "Preview";
        isPreviewClicked = true; //now Preview option should be available
    }
};

function loadResume() {

    var template = document.getElementById('template-name').innerHTML;
    //retrieve data    
    var ref = firebase.database().ref("users/" + user.uid + "/" + template);

    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        var tablerows;
        var i, j;

        //Heading
        document.getElementById('stud-name')
            .innerHTML = snapshot.child('name').val();
        document.getElementById('e-mail')
            .innerHTML = snapshot.child('email').val();
        document.getElementById('dob')
            .innerHTML = snapshot.child('dob').val();
        document.getElementById('address')
            .innerHTML = snapshot.child('address').val();
        //Education
        tablerows = document.getElementById('education-table').rows;
        var edu_tabledata = snapshot.child('education').val();
        for (i = 2; i < tablerows.length - 1; i++) {
            for (j = 0; j < 4; j++)
                tablerows[i].cells[j].innerHTML = edu_tabledata[i - 2][j];
            //console.log(i);
        }
        //skills
        /*tablerows = document.getElementById('skills-table').rows;
        var skills_tabledata = snapshot.child('skills');
        for (i = 2; i < tablerows.length - 1; i++) {
            skills_tabledata[i - 2] = [];
            var rowcells = tablerows[i].cells;
            skills_tabledata[i - 2][0] = rowcells[1];
        }*/

        console.log("user data loaded");
    }, function (error) {
        console.log("Error: " + error.code);
    });

}

function saveResume() {
    //Heading
    var template = document.getElementById('template-name').innerHTML;
    var studentname = document.getElementById('stud-name').innerHTML;
    var emailaddr = document.getElementById('e-mail').innerHTML;
    var dob = document.getElementById('dob').innerHTML;
    var address = document.getElementById('address').innerHTML;
    var tablerows;
    var i, j;
    //Education
    tablerows = document.getElementById('education-table').rows;
    var edu_tabledata = [];
    for (i = 2; i < tablerows.length - 1; i++) {
        edu_tabledata[i - 2] = [];
        var rowcells = tablerows[i].cells;
        for (j = 0; j < 4; j++)
            edu_tabledata[i - 2][j] = rowcells[j].innerHTML;
        //console.log(i);
    }
    //console.log(edu_tabledata);
    //Skills
    tablerows = document.getElementById('skills-table').rows;
    var skills_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        skills_tabledata.push(tablerows[i].cells[1].innerHTML);
    }
    //console.log(skills_tabledata);
    //Internships
    tablerows = document.getElementById('internships-table').rows;
    var internships_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        internships_tabledata[i - 1] = [];
        for (j = 0; j < 3; j++) {
            internships_tabledata[i - 1][j] = tablerows[i].cells[j].innerHTML;
        }
        //console.log(i);
    }
    //Projects
    tablerows = document.getElementById('projects-table').rows;
    var projects_tabledata = [];
    for (i = 1; i < tablerows.length - 1; i++) {
        projects_tabledata[i - 1] = [];
        for (j = 0; j < 3; j++) {
            projects_tabledata[i - 1][j] = tablerows[i].cells[j].innerHTML;
        }
    }
    //positions
    var ul = document.getElementById('positions-list')
    var ul_items = ul.getElementsByTagName('li');
    var positions_list = [];
    for (i = 0; i < ul_items.length; i++) {
        positions_list[i] = ul_items[i].innerHTML;
    }
    //hobbies
    ul = document.getElementById('hobbies-list')
    ul_items = ul.getElementsByTagName('li');
    var hobbies_list = [];
    for (i = 0; i < ul_items.length; i++) {
        hobbies_list[i] = ul_items[i].innerHTML;
    }
    //achievments
    var awards_list = document.getElementById('awards-list').innerHTML; 



    //make resume dictionary map
    var resumeDetails = {
        name: studentname,
        email: emailaddr,
        dob: dob,
        address: address,
        education: edu_tabledata,
        skills: skills_tabledata,
        internships: internships_tabledata,
        projects: projects_tabledata,
        positions: positions_list,
        hobbies: hobbies_list,
        awards: awards_list
    };

    //add uid into user_uid_list
    //for flattening the tree so that for finding user
    //we do not have to load all users data.
    //firebase.database().ref("user_uid_list").push(user.uid);
    //firebase.database().ref().child("text").push("somevalue");
    
    //add resume to dictionary
    firebase.database().ref("users/" + user.uid)
        .child(template)
        .set(resumeDetails)
        .then(function () {
            window.alert("Data Saved");
        });


}