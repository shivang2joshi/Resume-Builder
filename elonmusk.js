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
    var photourl = firebase.storage().ref(user.uid + "-" + template);
    photourl.getDownloadURL().then(function (url) {
        document.getElementById('photo').src = url;
        printf('photo loaded');
    });
    printf('uploaded');
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