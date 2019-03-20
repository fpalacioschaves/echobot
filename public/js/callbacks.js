function question(stateWrapper, ready) {

    console.log(stateWrapper)

    stateWrapper.current.next = stateWrapper.newState({
        type: 'text',
        name: 'question-1',
        questions: ['Ok guy, what is your question?'],
        noanswer:false,



    });
    var answer_ask_question = stateWrapper.current.next.answer.text;

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
            if (result_array.title == "no_response") {
                stateWrapper.current.next.next = stateWrapper.newState({
                    type: 'text',
                    name: 'question-2',
                    questions: ['I dont understand you, guy. Can you repeat your question?'],

                });

            }
            else {
                stateWrapper.current.next.next = stateWrapper.newState({
                    type: 'text',
                    noanswer: 'true',
                    name: 'dynamic-question-' + count + 1,
                    questions: ['Please, follow me to the <a class=""button" href="' + result_array.url + '" target="_blank">' + result_array.title + ' </a>page'],

                });
            }

            //emulating random response time (100-600ms)
            setTimeout(ready, Math.random() * 500 + 100);

        });

}

