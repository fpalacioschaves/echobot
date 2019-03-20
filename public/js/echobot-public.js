(function( $ ) {
	'use strict';

	var logged = false;

    var welcome_message

    var look_for_message

    var convForm;

    $(document).ready(function () {

        // Welcome message
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_welcome",
            })

            .done(function (result) {
                welcome_message = result;
                $("#content").append(welcome_message);
            });

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
        eval(answer+"()");

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
                if(find_array.length == 0){
                    answer = '<p>Sorry, i dont find any product like ' + question + '</p>'
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    $(".echobot-input-container-look-for").show();
                }

                else{

                    var answer = '<p>Great, i have found some products for you:</p>';
                    $.each( find_array, function( index, value ){
                        answer = answer + "<a class='myButtonGreen' href='" + PublicGlobal.site_url + "/product/" + value.product_name + "'><span class='left title'>" + value.product_title + "</span><span class='dashicons dashicons-cart'></span></a>";
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
        eval(action+"()");
    });


    // Para actualizar el chat con la respuesta correspondiente
    function ready(answer){
        $(".answer").html(answer)
    }


    // For Suggestion Option
    function suggestion(){
        // AJAX CALL
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_suggested_products",
            })
            .done(function (result) {
                var featured_array = jQuery.parseJSON(result);
                console.log(featured_array)
                if(featured_array.length == 0){
                }

                else{

                    var answer = '<p>Great, i have some featured products for you:</p>';
                    $.each( featured_array, function( index, value ){
                        answer = answer + "<a class='myButtonGreen' href='" + PublicGlobal.site_url + "/product/" + value.product_name + "'><span class='left title'>" + value.product_title + "</span><span class='dashicons dashicons-cart'></span></a>";
                    });
                    answer = answer + "<button class='myButtonGreen' data-action='refresh'>Anything more?</button>";
                    setTimeout(ready(answer), 5000);
                    //$(".echobot-input-container").show();
                }



            });
    }

    // For Looking For Option
    function looking_for(){

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

    // Clean the chat
    function refresh(){
        $("#content").html(welcome_message);
    }



    $('html').bind('keypress', function(e)
    {
        if(e.keyCode == 13)
        {
            return false;
        }
    });



})( jQuery );
