<?php

namespace DavidYeiser\Detailer\Blocks\BookDetails;

add_action('plugins_loaded', __NAMESPACE__ . '\register_dynamic_block');

function register_dynamic_block() {
  // Only load if Gutenberg is available.
  if (!function_exists('register_block_type')) {
    return;
  }

  // Hook server side rendering into render callback
  // Make sure name matches registerBlockType in ./index.js
  register_block_type('davidyeiser-detailer/book-details', array(
    'render_callback' => __NAMESPACE__ . '\render_dynamic_block'
  ));
}

function render_dynamic_block($attributes) {
  // Parse attributes

  $book_details_title = $attributes['title'];
  $book_details_content = $attributes['content'];
  $book_details_link = $attributes['link'];
  $book_details_image = $attributes['image'];
  $class_position = $class_position = "block-search-post single_related_post ".$attributes['radioField'];

  ob_start(); // Turn on output buffering

 /* BEGIN HTML OUTPUT */
?>

<div class=" <?php echo $class_position; ?>">
  <img src="<?php echo $book_details_image; ?>" alt="">
  <a href="<?php echo $book_details_link; ?>"><h3 class="block-search-post-title"><?php echo $book_details_title; ?></h3></a>
  <p class="block-search-post-content"><?php echo $book_details_content; ?></p>



</div>

<?php
 /* END HTML OUTPUT */

 $output = ob_get_contents(); // collect output
 ob_end_clean(); // Turn off ouput buffer

 return $output; // Print output
}
