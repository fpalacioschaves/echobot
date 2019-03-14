(function( $ ) {
	'use strict';

	var logged = false;

    var welcome_message

    var convForm;

    $(document).ready(function () {

        // Welcome message
        $.post(PublicGlobal.ajax_url,
            {
                action: "echobot_welcome",
            })

            .done(function (result) {
                console.log(result)
                welcome_message = result;
                $("#content").append(welcome_message);
                var count = 0;
                convForm = $('#chat').convform({eventList:{onInputSubmit: function(convState, ready) {
                            if(Array.isArray(convState.current.answer)) var answer = convState.current.answer.join(', ');
                            else var answer = convState.current.answer.text;


                            // Caso I want to ask you a question
                            if(answer == "I want to ask you a question"){

                                convState.current.next = convState.newState({
                                    type: 'text',
                                    name: 'dynamic-question-'+count,
                                    questions: ['Ok guy, what is your question?' ],
                                    noanswer:false,

                                });
                                var answer_ask_question = convState.current.answer.text;

                                // Llamamos a una funcion en PHP que se encargue de trocear la respuesta y buscar dentro de las páginas
                                // AJAX CALL
                                $.post(PublicGlobal.ajax_url,
                                    {
                                        action: "echobot_parse_ask_question",
                                        answer: answer_ask_question,
                                    })

                                    .done(function (result) {
                                        console.log(result)
                                        var result_array = jQuery.parseJSON(result);
                                        if(result_array.title == "no_response"){
                                            convState.current.next.next = convState.newState({
                                                type: 'text',
                                                name: 'dynamic-question-'+count,
                                                questions: ['I dont understand you, guy. Can you repeat your question?' ],

                                            });

                                        }
                                        else{
                                            convState.current.next.next = convState.newState({
                                                type: 'text',
                                                noanswer: 'true',
                                                name: 'dynamic-question-'+count,
                                                questions: ['Please, follow me to the <a class=""button" href="'+result_array.url+'" target="_blank">' + result_array.title + ' </a>page' ],

                                            });
                                        }

                                        //emulating random response time (100-600ms)
                                        setTimeout(ready, Math.random()*500+100);

                                    });
                            }


                            // Caso 2: Sugerencia. Podemos enviarle a los productos sugeridos
                            else if(answer == "Make me any suggestion"){

                                // AJAX CALL

                                var answer_ask_question = convState.current.answer.text;

                                $.post(PublicGlobal.ajax_url,
                                    {
                                        action: "echobot_suggested_products",
                                    })

                                    .done(function (result) {
                                        var featured_array = jQuery.parseJSON(result);
                                        console.log(featured_array)
                                        if(featured_array.length == 0){
                                            convState.current.next = convState.newState({
                                                type: 'text',
                                                name: 'dynamic-question-'+count,
                                                questions: ['Sorry. we dont have featured products right now.' ],
                                                noanswer: 'true',

                                            });

                                        }
                                        else{

                                            var questions = 'Great, i have some featured products for you:<br>';

                                            $.each( featured_array, function( index, value ){
                                                console.log(value)

                                                questions = questions + "<a href='" + PublicGlobal.site_url + "/product/" + value.product_name + "'>" + value.product_title + "</a><br>";

                                            });

                                            questions = questions + "Anything more?";

                                            convState.current.next = convState.newState({
                                                type: 'text',
                                                noanswer: 'true',
                                                name: 'dynamic-question-'+count,
                                                questions: [questions ],
                                            });
                                        }

                                        setTimeout(ready, Math.random()*500+100);

                                    });

                            }

                            // Caso 3. Le preguntamos por qué producto o tipo de producto quiere
                            else if(answer == "Im looking for a product"){

                            }

                            // Caso 4: lo mandamos a los servicios de la empresa
                            else if(answer == "I want info about the company"){

                            }

                            // Volver al inicio y refrescar el chat
                            else if(answer.toLowerCase() == "refresh"){

                                convState.current.next = false;
                                //emulating random response time (100-600ms)
                                setTimeout(ready, Math.random()*500+100);

                            }


                            // Estoy fuera de las opciones iniciales, busco en las páginas directamente
                            else{
                                // Llamamos a una funcion en PHP que se encargue de trocear la respuesta y buscar dentro de las páginas
                                // AJAX CALL

                                var answer_ask_question = convState.current.answer.text;

                                $.post(PublicGlobal.ajax_url,
                                    {
                                        action: "echobot_parse_ask_question",
                                        answer: answer_ask_question,
                                    })

                                    .done(function (result) {
                                        console.log(result)
                                        var result_array = jQuery.parseJSON(result);
                                        if(result_array.title == "no_response"){
                                            convState.current.next = convState.newState({
                                                type: 'text',
                                                name: 'dynamic-question-'+count,
                                                questions: ['I dont understand you, guy. Can you repeat your question?' ],

                                            });

                                        }
                                        else{
                                            convState.current.next = convState.newState({
                                                type: 'text',
                                                noanswer: 'true',
                                                name: 'dynamic-question-'+count,
                                                questions: ['Please, follow me to the <a class=""button" href="'+result_array.url+'" target="_blank">' + result_array.title + ' </a>page' ],

                                            });
                                        }

                                        setTimeout(ready, Math.random()*500+100);

                                    });
                            }

                            count++;
                        }}});

            });

    });

    $(document).on("click", ".close-chat", function () {
        $(".conv-form-wrapper").hide();
        $(".card").css("width", "7%");
        $(this).hide();
        $(".open-chat").show();
    });

    $(document).on("click", ".open-chat", function () {
        $(".conv-form-wrapper").show();
        $(this).hide();
        $(".close-chat").show();
        $(".card").css("width", "25%");
    });


})( jQuery );
