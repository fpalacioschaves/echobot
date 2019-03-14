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
	<div id="chat-header">EchoBot<div class="close-chat"></div><div class="open-chat"></div></div>
	<div id="chat">
		<form action="" method="GET" class="hidden">
			<!--<input type="text" data-conv-question="Hello! My name is Echobot. Welcome to the site. What do you need?" name="first-question">-->
            <select data-conv-question="My name is Echobot. Welcome to <?php bloginfo( 'name' ); ?>. What do you need? (You always can say to me Refresh to clean chat)" name="first-question">
                <option value="suggestion">Make me any suggestion</option>
                <option value="looking_for">Im looking for a product</option>
                <option value="company">I want info about the company</option>
                <option value="question">I want to ask you a question</option>
            </select>
		</form>
	</div>
</div>