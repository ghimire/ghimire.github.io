---
layout: post
comments: true
title: Image Streaming with jQuery
category : Programming
tags : [html, programming, jquery]
---
![Camera Sample](/images/web-camera.png)

    <!-- Most IP based security cameras come equipped with management
    software, web interface and rtsp protocol to stream videos. They
    also provide image url which is constantly updated as new video
    capture is available. Following HTML + jQuery code uses such url
    to stream live images from security cameras without management 
    software. This is a sample code for D-Link based security cameras.
    You would need: IP Address, image url and username, password.
    Feel free to reuse the code below.  

    Code Reference: http://savitechnologies.com/?p=107
    Modified by: ghimire :: irc.securitychat.org --> 

    <html>
    <head>
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script>
     $(document).ready(function() {
    setInterval('reloadImages()',2000);
    });

    function reloadImages() {
    $('#camera1').attr('src','http://user:password@192.168.100.200/cgi-bin/video.jpg?' + Math.random());
    $('#camera2').attr('src','http://user:password@192.168.100.201/cgi-bin/video.jpg?' + Math.random());
    $('#camera3').attr('src','http://user:password@192.168.100.202/cgi-bin/video.jpg?' + Math.random());
    $('#camera4').attr('src','http://user:password@192.168.100.203/cgi-bin/video.jpg?' + Math.random());
    }
    </script>
    </head>
    <body>
    <!-- Row 1 Column 1 -->
    <div style="float: left">
    <img id="camera1" src="http://user:password@192.168.100.200/cgi-bin/video.jpg" border=1/>
    </div>
    <!-- Row 1 Column 2 -->
    <div>
    <img id="camera2" src="http://user:password@192.168.100.201/cgi-bin/video.jpg" border=1/>
    </div>
    <!-- Row 2 Column 1 -->
    <div style="clear: both; float: left">
    <img id="camera3" src="http://user:password@192.168.100.202/cgi-bin/video.jpg" border=1/>
    </div>
    <!-- Row 2 Column 2 -->
    <div>
    <img id="camera4" src="http://user:password@192.168.100.203/cgi-bin/video.jpg" border=1/>
    </div>
    </body>
    </html>
