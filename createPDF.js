/*<script src="https://code.jquery.com/jquery-1.12.4.min.js"
        integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js"></script>
    <script src="createPDF.js"></script>*/
(function () {
    
    var
        form = $('#resume'),
        page1 = $('#resume-page-1'),
        page2 = $('#resume-page-2'),
        cache_width1 = page1.width(),
        cache_height1 = page1.height(),
        cache_width2 = page2.width(),
        cache_height2 = page2.height(),
        a4width = 210, //in mm
        a4height = 297,
        a4 = [595, 842]; // for a4 size paper width and height in pixels  

    $('#download-doc').on('click', function () {
        if (!checkFields()) {
            window.alert('you can not have Empty fields printed');
            return;
        }
        var emailid = document.getElementById('e-mail').innerText;
        if (!ValidateEmail(emailid)) {
            window.alert('Invalid Email!');
            return;
        }
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

        getCanvas(page1).then(function (canvas) {
            var
                img = canvas.toDataURL("image/png"),
                height = 0.264583 * canvas.height;
            if(height<a4height){
                doc.addImage(img, 'JPEG', 2, 7, a4width, height);
            }
            else{
                doc.addImage(img, 'JPEG', 2, 7, a4width, a4height-10);    
            }
            doc.addPage();


            getCanvas(page2).then(function (canvas) {
                var
                    img = canvas.toDataURL("image/png"),
                    height = 0.264583 * canvas.height;
                //px to mm coversion
                //canvas height is in px.
                if(height<a4height){
                    doc.addImage(img, 'JPEG', 2, 7, a4width, height);
                }
                else{
                    doc.addImage(img, 'JPEG', 2, 7, a4width, a4height-10);    
                }
                doc.save(document.getElementById('stud-name').innerText);

                page1.width(cache_width1);
                page2.width(cache_width2);
                previewResume();
            });

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