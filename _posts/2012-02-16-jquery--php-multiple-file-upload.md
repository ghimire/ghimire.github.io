---
layout: post
comments: true
title: jQuery + PHP Multiple File Upload v1.0 by ghimire
description: Upload multiple image files at one go with single input box
category : Programming
tags : [php, jquery]
---

    <?php
    ## Jquery + PHP Multiple File Upload Script v1.0 by ghimire  released under GNU General Public License Version 2.0
    ## This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License 
    ## as published by the Free Software Foundation; version 2 of the License.

    session_start();

    if (!isset($_SESSION['imagelist'])) $_SESSION['imagelist'] = array();

    $errormsg = "";
    define ('MAX_FILE_SIZE', 1024000);
    define('UPLOAD_DIR', 'uploads/');
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755);
    }
    touch(UPLOAD_DIR."index.html");


    $image_extensions_allowed = array('jpg', 'jpeg', 'png', 'gif','bmp');
    $mime_allowed = array('image/jpg', 'image/jpeg', 'image/pjpeg','image/png', 'image/gif','image/bmp');

    if (isset($_POST['Send'])) {
        while(list($key,$value) = each($_FILES[fileX][name]))
        {
            if(!empty($value)){
                $filename = basename($value);
                $filename=str_replace(" ","_",$filename);
                $ext = strtolower(substr($filename, strrpos($filename, '.') + 1));
                if( ($_FILES[fileX][size][$key] > 0) && ( $_FILES[fileX][size][$key] <= MAX_FILE_SIZE ) && ( in_array($_FILES[fileX][type][$key],$mime_allowed) ) && (in_array($ext, $image_extensions_allowed)) )
                {
                    $file_info = getimagesize($_FILES[fileX][tmp_name][$key]);
                    if(!empty($file_info)) {
                        $add = UPLOAD_DIR."$filename";
                        if (!move_uploaded_file($_FILES[fileX][tmp_name][$key], $add)) unlink($_FILES[fileX][tmp_name][$key]);
                        chmod("$add",0777);
                        $_SESSION['imagelist'][] = "$add";			
                    } else $errormsg .="Empty File Information. ";

                } else $errormsg .="Unknown Extension. ";
            } //else $errormsg .="Empty File. ";
        }
    }

    ?>


    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" dir="ltr"><head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <head>
    <title>Jquery + PHP Multiple File Upload Script v1.0 by ghimire v1.0 released under GPLv2</title>

    <style type="text/css">
    .remove:hover{
        background: #DDD;
    }
    .remove{
        color: #F00;
        font-size: 15px;
        font-weight: bold;
    }
    </style>

    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>	

    <script type="text/javascript">

    $(document).ready(function() {

    var MaxNumber = 3;
    $("input.upload").change(function(){
        validateFile(this, MaxNumber);
    });

         
    function validateFile(myelement, maxAllowed) {
        if($('input.upload').size() > maxAllowed) {
            $("#errormsg").html("Files count exceeded Maximum Allowed Number of "+maxAllowed);return true;
        }

        $(myelement).hide();
        $(myelement).parent().prepend('<input type="file" class="upload" name="fileX[]" />').find("input").change(function() {validateFile(this, maxAllowed)});
        var elementval = myelement.value;
        if(elementval != '') {
            $("#queue").append('<div>'+elementval+'&nbsp;&nbsp;<a class="remove">X</a></div>').find("a").click(function(){
                $(this).parent().remove();
                $(myelement).remove();
                return true;
            });
        }
    };

    });

    </script>
    </head>
    <body>

    <?php if(!empty($errormsg)) { echo "<span style='color: f00'>$errormsg</span>"; } ?>
    <span id="errormsg" style="color: #f00"></span>
    Upload Image - Maximum Number of Files: 3 &amp; Maximum Size: 1Mb
    <form method=post action="<?php $_SERVER['PHP_SELF']; ?>" enctype='multipart/form-data' id="myform">
    <input type="file" class="upload" name="fileX[]" />
    <input type="hidden" name="MAX_FILE_SIZE" value="1048000" />
    <input type=submit name="Send" value="Upload">
    </form>
    <div id="queue" class="queue"></div>

    <?php
    if (!empty($_SESSION['imagelist'][0])) {
        echo "Thank You For Uploading:<br>";
        foreach ($_SESSION['imagelist'] as &$value) {
            echo "<img src='$value' />";
        }
    }
    ?>

    </body>
    </html>
