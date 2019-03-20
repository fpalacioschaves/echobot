<?php
/**
 * Created by PhpStorm.
 * User: Fco Palacios Chaves
 * Date: 14/03/2019
 * Time: 9:28
 */

if ( is_user_logged_in() ) {

	global $current_user;

	$username = $current_user->user_nicename;
}
?>

<div class="card no-border">
    <div id="chat-header">EchoBot
        <div class="close-chat"></div>
        <div class="open-chat"></div>
    </div>
    <div id="chat">
        <form action="" method="GET" class="echobot-form">
            <div class="question">
                <p>My name is Echobot. Welcome to <?php bloginfo( 'name' ); ?>. What do you need? (You always can say to
                    me
                    Refresh to clean chat)</p>
            </div>
            <div class="answer">
                <button class="myButtonGreen" data-action="suggestion">Make me any suggestion</button>
                <button class="myButtonGreen" data-action="looking_for">Im looking for a product</button>
                <button class="myButtonGreen" data-action="company">I want info about the company</button>
                <button class="myButtonGreen" data-action="question">I want to ask you a question</button>
            </div>

            <div class="echobot-input-container">
                <input type="text" name="echobot-input" id="echobot-input">
                <button class="echobot-send">Send</button>
            </div>

        </form>
    </div>
</div>