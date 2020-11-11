<?php
/**
 * Bootstrap file to launch the plugin.
 *
 * @wordpress-plugin
 * Plugin Name: Detailer
 * Description: Plugin to create custom Gutenberg block, search block and add to the page.
 * Version:     0.1
 * Author:      Rodin Oleksandr
 */

namespace DavidYeiser\Detailer;

// Exit if accessed directly.
defined('ABSPATH') || exit;

// Gets this plugin's absolute directory path.
function _get_plugin_directory() {
  return __DIR__;
}

// Gets this plugin's URL.
function _get_plugin_url() {
  static $plugin_url;

  if (empty($plugin_url)) {
    $plugin_url = plugins_url(null, __FILE__);
  }

  return $plugin_url;
}

// Enqueue JS and CSS
include __DIR__ . '/lib/enqueue-scripts.php';

// Load dynamic blocks
include __DIR__ . '/blocks/book-details/index.php';
