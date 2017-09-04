jQuery(document).ready(function ($) {


    //store DOM elements
    var imageWrapper = $(".cd-images-list"),
        imagesList = imageWrapper.children("li"),
        contentWrapper = $(".cd-content-block"),
        contentList = contentWrapper.children("ul").eq(0).children("li"),
        blockNavigation = $(".block-navigation"),
        blockNavigationNext = blockNavigation.find(".cd-next"),
        blockNavigationPrev = blockNavigation.find(".cd-prev"),
        //used to check if the animation is running
        animating = false;

    //on mobile - open a single project content when selecting a project image
    imageWrapper.on("click",
        "a",
        function (event) {
            event.preventDefault();
            var device = mq();

            (device === "mobile") && updateBlock(imagesList.index($(this).parent("li")), "mobile");
        });

    //on mobile - close visible project when clicking the .cd-close btn
    contentWrapper.on("click",
        ".cd-close",
        function () {
            var closeBtn = $(this);
            if (!animating) {
                animating = true;

                closeBtn.removeClass("is-scaled-up").one(
                    "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                    function () {
                        contentWrapper.removeClass("is-visible")
                            .one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                            function () {
                                animating = false;
                            });

                        $(".cd-image-block").removeClass("content-block-is-visible");
                        closeBtn.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
                    });
            }
        });

    //on desktop - update visible project when clicking the .block-navigation
    blockNavigation.on("click",
        "button",
        function () {
            var direction = $(this),
                indexVisibleblock = imagesList.index(imageWrapper.children("li.is-selected"));

            if (!direction.hasClass("inactive")) {
                var index = (direction.hasClass("cd-next")) ? (indexVisibleblock + 1) : (indexVisibleblock - 1);
                updateBlock(index);
            }
        });

    //on desktop - update visible project on keydown
    $(document).on("keydown",
        function (event) {
            var device = mq();
            if (event.which == "39" && !blockNavigationNext.hasClass("inactive") && device == "desktop") {
                //go to next project
                updateBlock(imagesList.index(imageWrapper.children("li.is-selected")) + 1);
            } else if (event.which == "37" && !blockNavigationPrev.hasClass("inactive") && device == "desktop") {
                //go to previous project
                updateBlock(imagesList.index(imageWrapper.children("li.is-selected")) - 1);
            }
        });

    function updateBlock(n, device) {
        if (!animating) {
            animating = true;
            var imageItem = imagesList.eq(n),
                contentItem = contentList.eq(n);

            classUpdate($([imageItem, contentItem]));

            if (device == "mobile") {
                contentItem.scrollTop(0);
                $(".cd-image-block").addClass("content-block-is-visible");
                contentWrapper.addClass("is-visible").one(
                    "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                    function () {
                        contentWrapper.find(".cd-close").addClass("is-scaled-up");
                        animating = false;
                    });
            } else {
                contentList.addClass("overflow-hidden");
                contentItem.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                    function () {
                        contentItem.siblings().scrollTop(0);
                        contentList.removeClass("overflow-hidden");
                        animating = false;
                    });
            }

            //if browser doesn't support transition
            if ($(".no-csstransitions").length > 0) animating = false;

            updateBlockNavigation(n);
        }
    }

    function classUpdate(items) {
        items.each(function () {
            var item = $(this);
            item.addClass("is-selected").removeClass("move-left").siblings().removeClass("is-selected").end().prevAll()
                .addClass("move-left").end().nextAll().removeClass("move-left");
        });
    }

    function updateBlockNavigation(n) {
        (n == 0) ? blockNavigationPrev.addClass("inactive") : blockNavigationPrev.removeClass("inactive");
        (n + 1 >= imagesList.length)
            ? blockNavigationNext.addClass("inactive")
            : blockNavigationNext.removeClass("inactive");
    }

    function mq() {
        //return window.getComputedStyle(imageWrapper.get(0), "::before").getPropertyValue("content").replace(/'/g, "")
        //    .replace(/"/g, "").split(", ");

        var ua = navigator.userAgent;

        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))) {

            return "desktop";
        }

    }














    //-------------Custom Ekerö Ryttarutbildning Code---------

    //Justerar så att navbar texten inte hamnar på en till rad.

    //var element = document.getElementById("anmälan");
    //var element2 = document.getElementById("kontakt");


    //if (screen.width <= 1844 && screen.width >= 414) {

    //	element.innerHTML = "Anmälan";
    //	element2.innerHTML = "Kontakt";
    //}

    if (screen.width <= 320) {
        var element3 = document.getElementById("R");
        var element4 = document.getElementById("H");

        element3.innerHTML = "Maila Rebecka";
        element4.innerHTML = "Kontakt";
    }

    //-------------------------------------
    var FÖRSTAHANDSVAL = "0";
    var ANDRAHANDSVAL = "0";
    var TREDJEHANDSVAL = "0";
    //-----------------------------------------

    //Visa text i modal när knappen klickas på
    $("#AvtalKnapp").click(function () {
        $("#AvtalModal h4").text("Ekerö ridutbildning - Avtal");
        $("#AvtalModal p").html('1. Anmälan är bindande.<br/> 2. Avgiften återbetalas ej vid uppsägning av plats.<br/>3. Eleven förbinder sig att ha egen olycksfallsförsäkring.');

    });
    //------------------------------------------

    var $contactForm = $('#contact-form');
    $contactForm.submit(function (e) {
        e.preventDefault();

        if ($("#Förstahandsval").val() === FÖRSTAHANDSVAL/* || $("#Andrahandsval").val() === ANDRAHANDSVAL || $("#Tredjehandsval").val() === TREDJEHANDSVAL*/) {
            $("#AvtalModal h4").text("Tips");
            $("#AvtalModal p").text("Vänligen välj ett Förstahandsval");
            $("#AvtalModal").modal("show");
        } else {
            //Sätter kg och cm på vikt och längd
            appendKgCm();
            //sätter valda värden på hidden fields
            setCorrectDate();
            //Trim name and Adress
            TrimAllInputs();
            //--------------------
            $.ajax({
                url: '//formspree.io/ekeroridutbildning@gmail.com',
                method: 'POST',
                data: $(this).serialize(),
                dataType: 'json',
                //beforeSend: function () {
                //   
                //},
                success: function (data) {
                    $("#AvtalModal h4").text("Lycka!");
                    $("#AvtalModal p").text("Tack för din anmälan! Anmälan har mottagits");
                    $("#AvtalModal").modal("show");
                    resetValues();
                },
                error: function (err) {
                    console.log(err.message);
                    $("#AvtalModal h4").text("Felmeddelande");
                    $("#AvtalModal p").text("Det verkar ha uppståt ett fel när anmälan skickades in. Gör gärna ett nytt försök.");
                    $("#AvtalModal").modal("show");
                }
            });
        }
    });



    $("#Förstahandsval").focusin(function () {
        $(this).data('val', $(this).val());
    })
        .change(function () {
            var newValue = this.value;
            var prevValue = $(this).data('val');
            if (newValue === FÖRSTAHANDSVAL) {
                $("#AvtalModal h4").text("Tips");
                $("#AvtalModal p").text("Vänligen välj ett Förstahandsval");
                $("#AvtalModal").modal("show");
            }
            if (newValue !== ANDRAHANDSVAL || newValue !== TREDJEHANDSVAL) {
                //Gör vald tid ovalbar i de andra dropdown
                $("#Andrahandsval option[value=" + newValue + "]").prop('disabled', true);
                $("#Tredjehandsval option[value=" + newValue + "]").prop('disabled', true);
                //Av selecterar förra valet i de andra dropdowns
                $("#Andrahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Tredjehandsval option[value=" + prevValue + "]").prop('disabled', false);
            } else {
                $("#Andrahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Tredjehandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });
    //-----------------------------------------------------
    $("#Andrahandsval").focusin(function () {
        $(this).data('val', $(this).val());
    })
        .change(function () {
            var newValue = this.value;
            var prevValue = $(this).data('val');
            //if (newValue === FÖRSTAHANDSVAL) {
            //    $("#AvtalModal h4").text("Tips");
            //    $("#AvtalModal p").text("Vänligen välj ett Andrahandsval");
            //    $("#AvtalModal").modal("show");
            //}
            if (newValue !== ANDRAHANDSVAL || newValue !== TREDJEHANDSVAL) {
                //Gör vald tid ovalbar i de andra dropdown
                $("#Förstahandsval option[value=" + newValue + "]").prop('disabled', true);
                $("#Tredjehandsval option[value=" + newValue + "]").prop('disabled', true);;
                //Av selecterar förra valet i de andra dropdowns
                $("#Förstahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Tredjehandsval option[value=" + prevValue + "]").prop('disabled', false);
            } else {
                $("#Förstahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Tredjehandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });
    //--------------------------------------------------------------------------

    $("#Tredjehandsval").focusin(function () {
        $(this).data('val', $(this).val());
    })
        .change(function () {
            var newValue = this.value;
            var prevValue = $(this).data('val');
            //if (newValue === FÖRSTAHANDSVAL) {
            //    $("#AvtalModal h4").text("Tips");
            //    $("#AvtalModal p").text("Vänligen välj ett Tredjehandsval");
            //    $("#AvtalModal").modal("show");
            //}
            if (newValue !== ANDRAHANDSVAL || newValue !== TREDJEHANDSVAL) {
                //Gör vald tid ovalbar i de andra dropdown
                $("#Andrahandsval option[value=" + newValue + "]").prop('disabled', true);
                $("#Förstahandsval option[value=" + newValue + "]").prop('disabled', true);
                //Av selecterar förra valet i de andra dropdowns
                $("#Andrahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Förstahandsval option[value=" + prevValue + "]").prop('disabled', false);
            } else {
                $("#Andrahandsval option[value=" + prevValue + "]").prop('disabled', false);
                $("#Förstahandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });

    //$("#Personnummer").focusout(function () {

    //    var value = this.value;
    //    if (value.length === 10 && (!/-/.test(value))) {
    //        var result = value.splice(6, 0, "-");
    //        $("#Personnummer").val(result)
    //    }
        
    //});
    $("#Personnummer").focusout(function () {
        var value = this.value;

        if (value.length !== 0) {
            if (!(/^[0-9]*$/.test(value))) {
                $("#AvtalModal h4").text("Tips");
                $("#AvtalModal p").text("Ange endast 10 siffror");
                $("#AvtalModal").modal("show");
                $('#Personnummer').val(String.empty);
            }
        }
    });
    $("#Längd").focusout(function () {
        
        var value = this.value;

        if (value.length !== 0) {
            if (!(/^[0-9]*$/.test(value))) {
                $("#AvtalModal h4").text("Tips");
                $("#AvtalModal p").text("Ange Längd endast med siffror");
                $("#AvtalModal").modal("show");
                $('#Längd').val(String.empty);
            }
        }
    });
    $("#Vikt").focusout(function () {

        var value = this.value;

        if (value.length !== 0) {
            if (!(/^[0-9]*$/.test(value))) {
                $("#AvtalModal h4").text("Tips");
                $("#AvtalModal p").text("Ange Vikt endast med siffror");
                $("#AvtalModal").modal("show");
                $('#Vikt').val(String.empty);
            }
        }
    });
    $("#Telefonnummer").focusout(function () {
        var value = this.value;

        if (value.length !== 0) {
            if (!(validatePhoneNumbers(value))) {
                $("#AvtalModal h4").text("Tips");
                $("#AvtalModal p").text("Ange ett giltigt telefonnummer endast med siffror");
                $("#AvtalModal").modal("show");
                $('#Telefonnummer').val(String.empty);
            }
        }
    });


    $("#Vikt").focusout(function () {
        var value = this.value;
        //if (!(/^[0-9]+$/.test(value))) {
        //    $("#AvtalModal h4").text("Tips");
        //    $("#AvtalModal p").text("Vänlige ange din vikt");
        //    $("#AvtalModal").modal("show");
        //}
        if (value.length !== 0) {

            //$('#Vikt').val($('#Vikt').val() + 'kg');
        }
    });
    $("#Längd").focusout(function () {
        var value = this.value;
        //if (!(/^[0-9]+$/.test(value))) {
        //    $("#AvtalModal h4").text("Tips");
        //    $("#AvtalModal p").text("Vänlige ange din längd");
        //    $("#AvtalModal").modal("show");
        //}
        if (value.length !== 0) {

            //$('#Längd').val($('#Längd').val() + 'cm');
        }
    });

    $("#Email").focusout(function () {
        var value = this.value;
        if (!(validateEmail(value.trim())) && value.trim() !== "") {
            $("#AvtalModal h4").text("Tips");
            $("#AvtalModal p").text("Vänligen ange en giltig email");
            $("#AvtalModal").modal("show");
            $('#Email').val(String.empty);
        }
    });


    //Functions--
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    function validatePhoneNumbers(phoneNummber) {
        var re = /^[0-9]*$/;
        return re.test(phoneNummber);
    }
    function resetValues() {
        resetDropDownOne();
        resetDropDownTwo();
        resetDropDownThree();
        resetAllInputsToInitValue();
    }

    function resetAllInputsToInitValue() {
        $(":input").val(String.empty);
        $('#Förstahandsval').prop('selectedIndex', 0);
        $('#Andrahandsval').prop('selectedIndex', 0);
        $('#Tredjehandsval').prop('selectedIndex', 0);
        $('#AvtalCheckBox').attr('checked', false);
    }
    function resetDropDownOne() {
        $('#Förstahandsval option').each(function () {
            var prevValue = this.value;
            if (prevValue !== FÖRSTAHANDSVAL) {
                $("#Förstahandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });
    }
    function resetDropDownTwo() {
        $('#Andrahandsval option').each(function () {
            var prevValue = this.value;
            if (prevValue !== ANDRAHANDSVAL) {
                $("#Andrahandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });
    }
    function resetDropDownThree() {
        $('#Tredjehandsval option').each(function () {
            var prevValue = this.value;
            if (prevValue !== TREDJEHANDSVAL) {
                $("#Tredjehandsval option[value=" + prevValue + "]").prop('disabled', false);
            }
        });
    }

    function dateSwitch(date) {
        var value = "";
        switch (date) {
            case "0":
                value = "Inget val";
                break;
            case "1":
                value = "Måndag - 19:15-20:15";
                break;
            case "2":
                value = "Måndag - 20:15-21:15";
                break;
            case "3":
                value = "Tisdag - 19:15-20:15";
                break;
            case "4":
                value = "Tisdag - 20:15-21:1";
                break;
            case "5":
                value = "Onsdag - 19:15-20:15";
                break;
            case "6":
                value = "Onsdag - 20:15-21:15";
                break;
            case "7":
                value = "Torsdag - 19:15-20:15";
                break;
            case "8":
                value = "Torsdag - 20:15-21:1";
                break;
            case "9":
                value = "Fredag - 19:15-20:15";
                break;
            case "10":
                value = "Fredag - 20:15-21:15";
                break;
            case "11":
                value = "Lördag - 10:00-11:00";
                break;
            case "12":
                value = "Lördag - 11:00-12:00";
                break;
            case "13":
                value = "Söndag - 10:00-11:00";
                break;
            case "14":
                value = "Söndag - 11:00-12:00";
                break;
        }
        return value;
    }

    function setCorrectDate() {

        $("#FörstahandsvalHidden").val(dateSwitch($("#Förstahandsval").val()));

        $("#AndrahandsvalHidden").val(dateSwitch($("#Andrahandsval").val()));

        $("#TredjehandsvalHidden").val(dateSwitch($("#Tredjehandsval").val()));
    }

    function appendKgCm() {
        var längd = $('#Längd').val();
        if (!(/cm/.test(längd))) {
            $('#Längd').val($('#Längd').val() + 'cm');
        }
        var vikt = $('#Vikt').val();
        if (!(/kg/.test(vikt))) {
            $('#Vikt').val($('#Vikt').val() + 'kg');
        }
      
    }

    //function insertMinusSignToMobileNumber(){
    //      var phoneNumber = $("#Telefonnummer").val()
    //        if (/^07/.test(phoneNumber)) {

    //            var result = phoneNumber.splice(3, 0, "-");
    //            $("#Telefonnummer").val(result)
    //        }
      
    //}

    var test = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var ismobile = test;
    if (ismobile) {
        $("#AvtalKnapp").removeClass("AvtalPositionRight");
        $("#AvtalKnapp").addClass("AvtalPositionLeft");
        $("#submitButton").removeClass("SubmitPositionRight");
        $("#submitButton").addClass("SubmitPositionLeft");


        //tar bort "ggr" i gånger columen
        //$("td:contains(ggr)").each(function () {
        //    var newText = $(this).text().replace(/ggr/g, "");
        //    $(this).text(newText);
        //});

    }

    $(".fa-info-circle").click(function() {

        $("#AvtalModal h4").text("Info");
        $("#AvtalModal p").text("Välj ett förstahandsalternativ, ett andrahandsalternativ samt ett tredjehandsalternativ för vilken dag och tid du vill rida");
        $("#AvtalModal").modal("show");
    });

   //Kopiera kontonummer till clipboard---------------------------
    var copyEmailBtn = document.querySelector('.js-emailcopybtn');
    copyEmailBtn.addEventListener('click', function (event) {
        // Select the email link anchor text  
        var emailLink = document.querySelector('#bankAccount');
        var range = document.createRange();
        range.selectNode(emailLink);
        window.getSelection().addRange(range);

        try {
            // Now that we've selected the anchor text, execute the copy command  
            var successful = document.execCommand('copy');
            //var msg = successful ? 'successful' : 'unsuccessful';
            //console.log('Copy email command was ' + msg);
            $("#copieButton").text("Kopierat!");
            setTimeout(setText, 4000);
            
        } catch (err) {
            //console.log('Oops, unable to copy');
            $("#copieButton").text("Oj! nått gick fel. Använd crl + c istället");
            setTimeout(setText, 4000);
        }

        // Remove the selections - NOTE: Should use
        // removeRange(range) when it is supported  
        window.getSelection().removeAllRanges();
    });

    function setText() {
        $("#copieButton").text("Kopiera kontonumret");
    }

    function TrimAllInputs()
    {
        $("#Name").val($.trim($("#Name").val()));
        $("#Adress").val($.trim($("#Adress").val()));
        $("#Email").val($.trim($("#Email").val()));
        $("#Telefonnummer").val($.trim($("#Telefonnummer").val()));
        $("#Personnummer").val($.trim($("#Personnummer").val()));
        $("#Längd").val($.trim($("#Längd").val()));
        $("#Vikt").val($.trim($("#Vikt").val()));
        $("#Fritext").val($.trim($("#Fritext").val()));

    }

    //Kopiera kontonummer till clipboard-------end--------------------


    //Tillläg till JS
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    //--------------------------------------------------------------

    //$("#Förstahandsval").change( function() {

    //    var newValue = this.value;

    //    if (newValue === FÖRSTAHANDSVAL) {
    //        $("#AvtalModal h4").text("Tips");
    //        $("#AvtalModal p").text("Vänlige välj ett Förstahandsval");
    //        $("#AvtalModal").modal("show");
    //    }
    //    if (newValue !== ANDRAHANDSVAL || newValue !== TREDJEHANDSVAL) {

    //        $("#Andrahandsval option[value*=" + newValue + "]").prop('disabled', true);
    //        $("#Tredjehandsval option[value*=" + newValue + "]").prop('disabled', true);   
    //    } else {
    //        $("#Andrahandsval option[value*=" + oldValue + "]").prop('disabled', false);
    //        $("#Tredjehandsval option[value*=" + oldValue + "]").prop('disabled', false); 
    //    }

    //});
    //$("#Andrahandsval").change(function () {
    //    var value = this.value;
    //    if (value === ANDRAHANDSVAL) {
    //        $("#AvtalModal h4").text("Tips");
    //        $("#AvtalModal p").text("Vänlige välj ett Andrahandsval");
    //        $("#AvtalModal").modal("show");
    //    }
    //    if (value !== FÖRSTAHANDSVAL || value !== TREDJEHANDSVAL) {
    //        $("#Förstahandsval option[value*=" + value + "]").prop('disabled', true);
    //        $("#Tredjehandsval option[value*=" + value + "]").prop('disabled', true);
    //    } else {
    //        $("#Förstahandsval, #Tredjehandsval option:selected").prop("selected", false);
    //    }

    //});
    //$("#Tredjehandsval").change(function () {
    //    var value = this.value;
    //    if (value === TREDJEHANDSVAL) {
    //        $("#AvtalModal h4").text("Tips");
    //        $("#AvtalModal p").text("Vänlige välj ett Tredjehandsval");
    //        $("#AvtalModal").modal("show");
    //    }
    //    if (value !== FÖRSTAHANDSVAL || value !== ANDRAHANDSVAL) {

    //        $("#Andrahandsval option[value*=" + value + "]").prop('disabled', true);
    //        $("#Förstahandsval option[value*=" + value + "]").prop('disabled', true);   
    //    } else {
    //        $("#Förstahandsval, #Andrahandsval option:selected").prop("selected", false);
    //    }

    //});

    // let href;
    // function clicked(item) {
    // 				 href = ($(item).attr("href"));


    // 			}

    //för modalen som barar visas om det är mobil
    //var test;
    //test = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    //var ismobile = test;

    //if (ismobile) { //------
    //    $(window).on("load",
    //        function() {
    //            $("#myModal1").modal("show");

    //------------------------------------------------------------------------

    //$(document).ready(function () {


    //    $('.nav-tabs a').on('click', function (event) {


    //        var target = $(this).data('target');


    //        $('html, body').animate({

    //            scrollTop: ($('[href="' + target + '"]').offset().top - 150)

    //        }, 1200);

    //    });

    //});

    //---------------------------------------------------------------------------

    //$(document).ready(function () {

    //    $(".tabs a").on('click', function (event) {


    //        if (this.hash !== "") {

    //            event.preventDefault();

    //            // Store hash
    //            var hash = this.hash;

    //            $('html, body').animate({
    //                scrollTop: $(hash).offset().top
    //            }, 1000, function () {

    //                window.location.hash = hash;
    //            });
    //        }
    //    });
    //})();


    //}); //---Mobile device
    //} //-------------------


    /*document.getElementById("kontakt").innerHTML = "Kontakt";*/
    /*$("#span_id").text("new_value");*/

    // $(document).ready(function() {
    //     var ua = navigator.userAgent;
    //     function is_touch_device() { 
    //         try {  
    //             document.createEvent("TouchEvent");  
    //             return true;  
    //         } catch (e) {  
    //             return false;  
    //         }  
    //     }

    //     if ((is_touch_device()) || ua.match(/(iPhone|iPod|iPad)/) 
    //     || ua.match(/BlackBerry/) || ua.match(/Android/)) {
    //         // Touch browser
    //     } else {
    //         // Lightbox code
    //     }
    // });


});


