(function ($) {
    'use strict';

    var logged = false;

    var welcome_message, look_for_message, contact_message, question_message, answer


    $(document).ready(function () {

        var current_chat = localStorage['current_chat'];
        if (!current_chat) {
            // open popup
            localStorage['current_chat'] = "";
            // Welcome message
            $.post(PublicGlobal.ajax_url,
                {
                    action: "echobot_welcome",
                })

                .done(function (result) {
                    welcome_message = result;
                    $("#content").append(welcome_message);
                    localStorage["welcome_message"] = welcome_message
                });
        }
        else{
            $("#content").append(localStorage['current_chat']);
        }




    });

    // Close Chat
    $(document).on("click", ".close-chat", function () {
        $(".echobot-form").hide();
        $(".card").css("width", "7%");
        $(this).hide();
        $(".open-chat").show();
    });

    // Open Chat
    $(document).on("click", ".open-chat", function () {
        $(".echobot-form").show();
        $(this).hide();
        $(".close-chat").show();
        $(".card").css("width", "25%");
    });

    // Send input
    $(document).on("click", ".echobot-send", function (e) {
        e.preventDefault();
        var answer = $("#echobot-input").val();
        eval(answer + "()");

    });

    // Send input looking for
    $(document).on("click", ".echobot-send-look-for", function (e) {
        e.preventDefault();
        var question = $("#echobot-input-look-for").val();
        // AJAX CALL
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_look_for_product",
                product: question,
            })
            .done(function (result) {
                var find_array = jQuery.parseJSON(result);
                console.log(find_array)
                if (find_array.length == 0) {
                    answer = '<p>Sorry, i dont find any product like ' + question + '</p>'
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    $(".echobot-input-container-look-for").show();
                }

                else {

                    var answer = '<p>Great, i have found some products for you:</p>';
                    $.each(find_array, function (index, value) {
                        answer = answer + "<a class='myButtonGreen' href='" + PublicGlobal.site_url + "/product/" + value.product_name + "'><span class='left title'>" + value.product_title + "</span><span class='dashicons dashicons-cart'></span></a>";
                    });
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    $(".echobot-input-container").show();
                }


            });

    });

    // Send input looking for
    $(document).on("click", ".echobot-send-question", function (e) {
        e.preventDefault();
        var question_answer = $("#echobot-input-question").val();
        // AJAX CALL
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_parse_ask_question",
                answer: question_answer,
            })
            .done(function (result) {
                var answers_array = jQuery.parseJSON(result);
                console.log(answers_array)
                if (answers_array.length == 0) {
                    answer = '<p>Sorry, i dont find any content as ' + question_answer + '</p>'
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    $(".echobot-input-container-question").show();
                }

                else {

                    var answer = '<p>Great, i have found something for you:</p>';
                    $.each(answers_array, function (index, value) {
                        console.log(index + " " + value)
                        answer = answer + "<a class='myButtonGreen' href='" + value.url + "'><span class='left title'>" + value.title + "</span></a>";
                    });
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    $(".echobot-input-container").show();
                }


            });

    });

    // Select option
    $(document).on("click", "button.myButtonGreen", function (e) {
        e.preventDefault();
        var action = $(this).attr("data-action")
        eval(action + "()");
    });


    // Para actualizar el chat con la respuesta correspondiente
    function ready(answer) {

        $(".answer").append(answer)

        var objDiv = document.getElementById("card");
        objDiv.scrollTop = objDiv.scrollHeight;

        var stored_chat = localStorage['current_chat'];
        var new_chat = '<div class="card no-border" id="card">' + $(".card").html() + '</div>';
        localStorage['current_chat'] = new_chat;

    }


    // For Suggestion Option
    function suggestion() {
        // AJAX CALL
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_suggested_products",
            })
            .done(function (result) {
                var featured_array = jQuery.parseJSON(result);
                console.log(featured_array)
                if (featured_array.length == 0) {
                }

                else {

                    var answer = '<p>Great, i have some featured products for you:</p>';
                    $.each(featured_array, function (index, value) {
                        answer = answer + "<a class='myButtonGreen' href='" + PublicGlobal.site_url + "/product/" + value.product_name + "'><span class='left title'>" + value.product_title + "</span><span class='dashicons dashicons-cart'></span></a>";
                    });
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    //$(".echobot-input-container").show();
                }


            });
    }

    // For Looking For Option
    function looking_for() {

        // Look for  message
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_look_for_message",
            })
            .done(function (result) {
                console.log(result)
                look_for_message = result;
                //$(".echobot-input-container").show();
                setTimeout(ready(look_for_message), 5000);
            });
    }

    // For Question Option
    function question() {

        // Look for  message
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_question_message",
            })
            .done(function (result) {
                console.log(result)
                question_message = result;
                //$(".echobot-input-container").show();
                setTimeout(ready(question_message), 5000);
            });
    }

    // For Company Option
    function company() {
        // AJAX CALL
        // Welcome message
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_company",
            })

            .done(function (result) {
                contact_message = result;
                setTimeout(ready(contact_message), 5000);
            });
    }

    // Clean the chat
    function refresh() {
        console.log(welcome_message)
        localStorage["current_chat"] = "";
        $("#content").html(localStorage["welcome_message"]);
    }


    $('html').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    });


})(jQuery);
