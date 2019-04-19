function AddSkill3() {
    var skillset = document.getElementById('skillset');
    var skill = document.getElementById('inputskill').value;

    skillset.innerHTML += '<span class="skill">' + skill + '</span>';
}

function Addinterest3() {
    var interestset = document.getElementById('interestset');
    var interest = document.getElementById('inputinterest').value;

    interestset.innerHTML += '<span class="interest">' + interest + '</span>';
}

var workexperienceformat =
    '<div class="row"><div class="row side-design-2"><h4 id="position-name" class="w-100" contenteditable="true" onclick="selectAll()"><b>Role at the Company</b></h4><h5 id="company" contenteditable="true" onclick="selectAll()">Company Name</h5><div class="space-between text-12"><span id="work-time" class="color-1" contenteditable="true" onclick="selectAll()"><i>06/2002-Present</i></span><span id="work-location" class="color-1" contenteditable="true" onclick="selectAll()"><i>Company Location</i></span></div></div><div class="pl-75  text-12"><span class="color-1"><i>Accomplishments</i></span><ul class="accomplishments" contenteditable="true" onclick="selectAll()"><li>List of accomplishments here...</li></ul></div></div>';

function addWork() {
    var lastrowindex = document.getElementById('work-experience').rows.length - 1;
    var newrow = document.getElementById('work-experience').insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.innerHTML = workexperienceformat;
}

function removeWork() {
    var workexp = document.getElementById('work-experience');
    var lastrowindex = workexp.rows.length - 2;
    workexp.deleteRow(lastrowindex);

}

function loadfile(event) {
    document.getElementById('photo').src =
        URL.createObjectURL(event.target.files[0]);
}

function SaveandLoad() {
    var user = firebase.auth().currentUser,
        template = document.getElementById('template-name').innerText;
    var photo = document.getElementById('inputphoto').files[0];
    firebase.storage().ref().child(user.uid + "-" + template).put(photo);
    setTimeout(() => {
        var photourl = firebase.storage().ref(user.uid + "-" + template);
        photourl.getDownloadURL().then(function (url) {
            document.getElementById('photo').src = url;
            printf('photo loaded');
        });
    }, 1000);
    printf('uploaded');
}

function SavetoDatabase() {
    var template = document.getElementById('template-name').innerHTML;
    //--------------------------
    var name = document.getElementById('name').innerHTML;
    var yourposition = document.getElementById('your-position').innerHTML;
    var about = document.getElementById('about').innerHTML;
    //
    var emailaddr = document.getElementById('e-mail').innerHTML;
    var phone = document.getElementById('phone').innerHTML;
    var location = document.getElementById('location').innerHTML;
    var twitter = document.getElementById('twitter-handle').innerHTML;
    //
    //---------------------------

    var tablerows = document.getElementById('work-experience').rows;
    var workdata = [];
    var i;
    for (i = 0; i < tablerows.length - 1; i++) {
        workdata.push(tablerows[i].cells[0].innerHTML);
    }

    var skills = document.getElementById('skillset').innerHTML;
    var achievements = document.getElementById('achievements').innerHTML;
    var interests = document.getElementById('interestset').innerHTML;

    var resumeDetails = {
        name: name,
        position: yourposition,
        about: about,
        email: emailaddr,
        phone: phone,
        location: location,
        twitter: twitter,
        work: workdata,
        skillset: skills,
        achievements: achievements,
        interest: interests
    };

    firebase.database().ref("users/" + user.uid)
        .child(template)
        .set(resumeDetails)
        .then(function () {
            document.getElementById('save-message-div').style.display = 'block';
            setTimeout(function () {
                document.getElementById('save-message-div').style.opacity = 0;
            }, 2500);
            setTimeout(function () {
                document.getElementById('save-message-div').style.display = 'none';
                document.getElementById('save-message-div').style.opacity = 1;
            }, 2500 + 800);
        });
    return "save successful";
}

function LoadfromDatabase() {
    var template = document.getElementById('template-name').innerHTML;
    //retrieve data    
    var ref = firebase.database().ref("users/" + user.uid + "/" + template);

    ref.on("value", function (snapshot) {
        document.getElementById('name')
            .innerHTML = snapshot.child('name').val();
        document.getElementById('your-position')
            .innerHTML = snapshot.child('position').val();
        document.getElementById('about')
            .innerHTML = snapshot.child('about').val();
        //    
        document.getElementById('e-mail')
            .innerHTML = snapshot.child('email').val();
        document.getElementById('phone')
            .innerHTML = snapshot.child('phone').val();
        document.getElementById('location')
            .innerHTML = snapshot.child('location').val();
        document.getElementById('twitter-handle')
            .innerHTML = snapshot.child('twitter').val();
        //-------------------------------
        var work = snapshot.child('work').val();
        var rows = document.getElementById('work-experience').rows;
        for (var i = 0; i < rows.length - 1; i++) {
            rows[i].cells[0].innerHTML = work[i];
        }
        //
        document.getElementById('skillset')
            .innerHTML = snapshot.child('skillset').val();
        document.getElementById('achievements')
            .innerHTML = snapshot.child('achievements').val();
        document.getElementById('interestset')
            .innerHTML = snapshot.child('interest').val();
    }, function (error){
        window.alert("Error : " + error.code);
    });


}


(function () {
    var
        form = $('#resume'),
        cache_width = form.width(),
        a4width = 210, //in mm
        a4height = 297,
        a4 = [595, 842]; // for a4 size paper width and height in pixels  

    $('#download-doc').on('click', function () {
        $('body').scrollTop(0);
        previewResume();
        createPDF();
    });
    //create pdf  
    function createPDF() {
        var doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
        });

        getCanvas(form).then(function (canvas) {
            var
                img = canvas.toDataURL("image/png"),
                height = 0.264583 * canvas.height;

            doc.addImage(img, 'JPEG', 0, 0, a4width, a4height);
            //doc.addPage();

            form.width(cache_width);
            doc.save(document.getElementById('name').innerText);
            previewResume();
        });

    }

    // create canvas object  
    function getCanvas(page) {
        page.width((a4[0] * 1.8) - 80).css('max-width', 'none');
        //page.height((a4[1] * 1.3333) - 80).css('max-height','none');
        return html2canvas(page, {
            imageTimeout: 2000,
            removeContainer: true,
        });
    }

}());
/* 
 * jQuery helper plugin for examples and tests 
 */
(function ($) {
    $.fn.html2canvas = function (options) {
        var date = new Date(),
            $message = null,
            timeoutTimer = false,
            timer = date.getTime();
        html2canvas.logging = options && options.logging;
        html2canvas.Preload(this[0], $.extend({
            complete: function (images) {
                var queue = html2canvas.Parse(this[0], images, options),
                    $canvas = $(html2canvas.Renderer(queue, options)),
                    finishTime = new Date();

                $canvas.css({
                    position: 'absolute',
                    left: 0,
                    top: 0
                }).appendTo(document.body);
                $canvas.siblings().toggle();

                $(window).click(function () {
                    if (!$canvas.is(':visible')) {
                        $canvas.toggle().siblings().toggle();
                        throwMessage("Canvas Render visible");
                    } else {
                        $canvas.siblings().toggle();
                        $canvas.toggle();
                        throwMessage("Canvas Render hidden");
                    }
                });
                throwMessage('Screenshot created in ' + ((finishTime.getTime() -
                    timer) / 1000) + " seconds<br />", 4000);
            }
        }, options));

        function throwMessage(msg, duration) {
            window.clearTimeout(timeoutTimer);
            timeoutTimer = window.setTimeout(function () {
                $message.fadeOut(function () {
                    $message.remove();
                });
            }, duration || 2000);
            if ($message)
                $message.remove();
            $message = $('<div ></div>').html(msg).css({
                margin: 0,
                padding: 10,
                background: "#000",
                opacity: 0.7,
                position: "fixed",
                top: 10,
                right: 10,
                fontFamily: 'Tahoma',
                color: '#fff',
                fontSize: 12,
                borderRadius: 12,
                width: 'auto',
                height: 'auto',
                textAlign: 'center',
                textDecoration: 'none'
            }).hide().fadeIn().appendTo('body');
        }
    };
})(jQuery);