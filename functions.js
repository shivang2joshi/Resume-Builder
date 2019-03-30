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

function selectAll() {
    document.execCommand('selectAll', true, "replace this");
}

function printResume() {
    //document represent respective resume template

    var printdocument = document.getElementById('resume').innerHTML;
    var originalDocument = document.body.innerHTML;

    //order matter here
    document.getElementById('resume').classList.remove('my-resume-page');
    document.body.innerHTML = printdocument;
    var addbtns = document.getElementsByClassName('addButton');
    var rmbtns = document.getElementsByClassName('removeButton');
    var i;
    for (i = 0; i < addbtns.length; i++)
        addbtns[i].style.display = 'none';
    for (i = 0; i < rmbtns.length; i++)
        rmbtns[i].style.display = 'none';
    //

    //$(document).ready();
    //img isn't ready and its printing already
    //so set timeout and wait for image to load
    //.5s would be sufficient
    setTimeout(function () {
        window.print();
        document.body.innerHTML = originalDocument;
    }, 500);
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
            .innerHTML = "" + snapshot.child('name').val();
        document.getElementById('e-mail')
            .innerHTML = "" + snapshot.child('email').val();
        document.getElementById('dob')
            .innerHTML = "" + snapshot.child('dob').val();
        document.getElementById('address')
            .innerHTML = "" + snapshot.child('address').val();

        //Education
        tablerows = document.getElementById('education-table').rows;
        var edu_tabledata = snapshot.child('education').val();
        var rowstobeupdated = edu_tabledata.length;
        while (rowstobeupdated - (tablerows.length - 3) > 0) {
            addEducation();
            tablerows = document.getElementById('education-table').rows;
        } //addextra rows bcoz database has more rows then html table
        while ((tablerows.length - 3) - rowstobeupdated > 0) {
            removeRow('education-table');
            tablerows = document.getElementById('education-table').rows;
        } //remove rows bcoz default html has more rows then database
        for (i = 0; i < rowstobeupdated; i++) { //update rows
            for (j = 0; j < 4; j++)
                tablerows[i + 2].cells[j].innerHTML = edu_tabledata[i][j];
            //console.log(i);
        }

        //skills
        tablerows = document.getElementById('skills-table').rows;
        var skills_tabledata = snapshot.child('skills').val();
        rowstobeupdated = skills_tabledata.length;
        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addSkills();
            tablerows = document.getElementById('skills-table').rows;
        } //when database has more rows
        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('skills-table');
            tablerows = document.getElementById('skills-table').rows;
        } //when defalt html page got more rows
        for (i = 0; i < rowstobeupdated; i++) {
            tablerows[i + 1].cells[1].innerHTML = skills_tabledata[i];
        }

        //Internships
        tablerows = document.getElementById('internships-table').rows;
        var internships_tabledata = snapshot.child('internships').val();
        rowstobeupdated = internships_tabledata.length;
        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addInternships();
            tablerows = document.getElementById('internships-table').rows;
        }
        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('internships-table');
            tablerows = document.getElementById('internships-table').rows;
        }
        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i + 1].cells[j].innerHTML = internships_tabledata[i][j];
            }
        }

        //Projects
        tablerows = document.getElementById('projects-table').rows;
        var projects_tabledata = snapshot.child('projects').val();
        rowstobeupdated = projects_tabledata.length;
        while (rowstobeupdated - (tablerows.length - 2) > 0) {
            addProjects();
            tablerows = document.getElementById('projects-table').rows;
        }
        while ((tablerows.length - 2) - rowstobeupdated > 0) {
            removeRow('projects-table');
            tablerows = document.getElementById('internships-table').rows;
        }
        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i + 1].cells[j].innerHTML = projects_tabledata[i][j];
            }
        }

        //positions
        document.getElementById('positions-list')
            .innerHTML = snapshot.child('positions').val();
        //hobbies
        document.getElementById('hobbies-list')
            .innerHTML = snapshot.child('hobbies').val();
        //positions
        document.getElementById('awards-list')
            .innerHTML = snapshot.child('awards').val();

            console.log("user data loaded from latest saved database");
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
    //console.log(tablerows.length);
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
    var positions_list = ul.innerHTML;
    //hobbies
    ul = document.getElementById('hobbies-list')
    var hobbies_list = ul.innerHTML;
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

var newCellPlaceholder = 'Click to select';

//resume addButtons utility
function addEducation() {
    var lastrowindex = document.getElementById('education-table').rows.length - 1;
    var newrow = document.getElementById('education-table').insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>' + newCellPlaceholder + '</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.setAttribute('class', 'text-center');
    cell.innerHTML = newCellPlaceholder;
    // -1 is for appending at last
    //console.log('added education');
}

function addSkills() {
    var skilltable = document.getElementById('skills-table');
    var lastrowindex = skilltable.rows.length - 1;
    var newrow = skilltable.insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>Technical Electives</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;
    console.log('added Skill');
    //console.log('added skills');    
}

function addInternships() {
    var internshipstable = document.getElementById('internships-table');
    var lastrowindex = internshipstable.rows.length - 1;
    var newrow = internshipstable.insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>' + newCellPlaceholder + '</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p><p><i>' + newCellPlaceholder + '</i></p>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p><p>' + newCellPlaceholder + '</p>';
}

function addProjects() {
    var projectstable = document.getElementById('projects-table');
    var lastrowindex = projectstable.rows.length - 1;
    var newrow = projectstable.insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p><b>' + newCellPlaceholder + '</b></p><p><i>' + newCellPlaceholder + '</i></p>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('class', 'text-right');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<p>' + newCellPlaceholder + '</p><p>' + newCellPlaceholder + '</p>';

}

function addAchievements() {
    document.getElementById('awards-table').style.display = 'inline';
    setTimeout(function () {
        document.getElementById('awards-table').style.opacity = 1;
    }, 1);
    document.getElementById('ach-btn').classList.add('invisible');
}

//resume removeButtons utility
function removeRow(tableid) {
    console.log(tableid);
    var lastrowindex = document.getElementById(tableid).rows.length - 1;
    document.getElementById(tableid).deleteRow(lastrowindex - 1);
}

function removeAchievements() {
    document.getElementById('awards-table').style.opacity = 0;
    setTimeout(function () {
        document.getElementById('ach-btn').classList.remove('invisible');
        document.getElementById('awards-table').style.display = 'none';
    }, 600);
}

/* 
 * jQuery helper plugin for examples and tests 
 */
(function ($) {
    
})(jQuery);