<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 * @author     Your Name <email@example.com>
 */
class Echobot_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		//include("TextRazor.php");

		//TextRazorSettings::setApiKey('1d89829be26ad0975ecd39ff7e61a07415da6eb0e8f923285a5e1b7a');

		//include("partials/example.php");

		// For ask a question
		add_action(
			'wp_ajax_nopriv_echobot_parse_ask_question', array(
				$this,
				'echobot_parse_ask_question',
			)
		);

		add_action(
			'wp_ajax_echobot_parse_ask_question', array(
				$this,
				'echobot_parse_ask_question',
			)
		);

		// For welcome question
		add_action(
			'wp_ajax_nopriv_echobot_welcome', array(
				$this,
				'echobot_welcome',
			)
		);

		add_action(
			'wp_ajax_echobot_welcome', array(
				$this,
				'echobot_welcome',
			)
		);

		// For featured products
		add_action(
			'wp_ajax_nopriv_echobot_suggested_products', array(
				$this,
				'echobot_suggested_products',
			)
		);

		add_action(
			'wp_ajax_echobot_suggested_products', array(
				$this,
				'echobot_suggested_products',
			)
		);



	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/echobot-public.css', array(), $this->version, 'all' );

		wp_enqueue_style( "convform_css", plugin_dir_url( __FILE__ ) . 'css/jquery.convform.css', array(), $this->version, 'all' );

		wp_enqueue_style( "convform_demo_css", plugin_dir_url( __FILE__ ) . 'css/demo.css', array(), $this->version, 'all' );


	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( "jquery_js", plugin_dir_url( __FILE__ ) . 'js/jquery-1.12.3.min.js', array( 'jquery' ), $this->version, true );

		wp_enqueue_script( "autosize_js", plugin_dir_url( __FILE__ ) . 'js/autosize.min.js', array( 'jquery' ), $this->version, true );

		wp_enqueue_script( "convform_js", plugin_dir_url( __FILE__ ) . 'js/jquery.convform.js', array( 'jquery' ), $this->version, true );

		wp_enqueue_script( "echobot-public-js", plugin_dir_url( __FILE__ ) . 'js/echobot-public.js', array( 'jquery' ), $this->version, true );

		//$username = $this->echobot_is_logged();

		wp_localize_script(
			"echobot-public-js",
			'PublicGlobal',
			array(
				'ajax_url' => admin_url('admin-ajax.php'),
				//'username' => $username,
			)
		);


	}

	public function echobot_parse_ask_question(){

		$answer = $_POST["answer"];

		$answer_array = explode(" ",$answer);

		// Opciones del array de palabras

		// Está la palabra "see" como en "i want to see"

		// Está la palabra "buy" como en "i want to buy"


		// a) Vamos a buscar si existe alguna página a la que se haga referencia desde la pregunta
		$args = array(
			'sort_order' => 'asc',
			'sort_column' => 'post_title',
			'hierarchical' => 0,
			'parent' => -1,
			'post_type' => 'page',
			'post_status' => 'publish'
		);
		$response = array(
			"title" =>"no_response"
		);
		$pages = get_pages($args);
		foreach($pages as $page){

			$pos = strpos(strtolower ($answer), strtolower ($page->post_name));
			if ($pos !== false){
				$response =  array(
					"title"=>$page->post_title,
					"url"=>get_page_link( $page->ID)
				);
			}
		}


		 echo json_encode($response);

		wp_die();
	}


	public function echobot_welcome(){


			ob_start();

			include plugin_dir_path(__FILE__) . 'partials/echobot_welcome.php';

			$welcome_message = ob_get_contents();

			ob_end_clean();

			echo $welcome_message;

			wp_die();

	}

	public function echobot_suggested_products(){

		// The tax query
		$tax_query[] = array(
			'taxonomy' => 'product_visibility',
			'field'    => 'name',
			'terms'    => 'featured',
			'operator' => 'IN', // or 'NOT IN' to exclude feature products
		);

		// The query
		$featured = new WP_Query( array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'posts_per_page'      => 5,
			'orderby'             => "date",
			'order'               => 'DESC',
			'tax_query'           => $tax_query // <===
		) );

		//var_dump($featured);

		if ( $featured->have_posts() ) {

			$featured_products = array();

			while ( $featured->have_posts() ) {
				$featured->the_post();
				global $post;
				$featured_products[] = array(
					"id" => $post->ID,
					"product_title" => $post->post_title,
					"product_name" => $post->post_name
				);
			}
		}


		//ob_start();

		//include plugin_dir_path(__FILE__) . 'partials/echobot_featured.php';

		//$featured_message = ob_get_contents();

		//ob_end_clean();

		echo json_encode($featured_products);

		wp_die();

	}




}
