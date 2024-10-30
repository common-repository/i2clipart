<?php
/*
Plugin Name: i2Clipart
Plugin URI: http://wordpress.org/plugins/i2clipart/
Description: TinyMCE plugin to search and insert royalty free public domain images from i2clipart.com to your page or post.
Version: 1.0
Author: i2Clipart
Author URI: http://www.i2clipart.com
*/

/*  Copyright 2014  Sciweavers  (email : admin@sciweavers.org)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function i2clipartplugin_addbuttons() {
   // Don't bother doing this stuff if the current user lacks permissions
   if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;
 
   // Add only in Rich Editor mode
   if ( get_user_option('rich_editing') == 'true') {
     add_filter("mce_external_plugins", "add_i2clipartplugin_tinymce_plugin");
     add_filter('mce_buttons', 'register_i2clipartplugin_button');
   }
}
 
function register_i2clipartplugin_button($buttons) {
   array_push($buttons, "separator", "i2clipart");
   return $buttons;
}
 
// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function add_i2clipartplugin_tinymce_plugin($plugin_array) {
   $plugin_array['i2clipart'] ='../../../wp-content/plugins/i2clipart/plugin/editor_plugin.js';
   return $plugin_array;
}
 
// init process for button control
add_action('init', 'i2clipartplugin_addbuttons');
?>