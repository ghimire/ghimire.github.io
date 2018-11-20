---
layout: post
comments: true
title: Thumbnail Layout Generator
description: PHP Code to generate specific number of rows and columns in groups
category : Programming
tags : [php,thumbnail]
---


    <?php
    /*
    Thumbnail Generator by ghimire :: irc.securitychat.org

    This php code will generate specific number of vertical and horizontal tables
    with specifi number of columns and rows per cell. This can be used to generate
    image thumbnails by replacing the * with <img> tag.

    Sample Output 1:
        Column per cell: 5
        Rows Per cell: 5
        Horizontal Tables: 2
        Vertical Tables: 3

      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|

      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|

      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|
      |*_|*_|*_|*_|*_|  |*_|*_|*_|*_|*_|

    Sample Output 2:
        Column per cell: 2
        Rows Per cell: 2
        Horizontal Tables: 8
        Vertical Tables: 4

      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|
      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|

      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|
      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|

      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|
      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|

      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|
      |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|  |*_|*_|

     
    */  
    $columns_per_cell=2;
    $rows_per_cell=2;
    $horizontal_tables =3;
    $vertical_tables = 3;

    $columncount = $columns_per_cell * $horizontal_tables;
    $rowcount = $rows_per_cell * $vertical_tables;
    $endvalue = $columncount * ($vertical_tables-1);

    $colors=array("red","green","blue","green","orange","gray","brown");
    for ($i=0; $i<=$endvalue; $i=$i+$columncount) {
        for ($k = 1; $k <= $rows_per_cell; $k++) {
            $mycolorindex = array_rand($colors);
            $mycolor = $colors[$mycolorindex];
            echo "<font color='".$mycolor."'>";
        
            for ($j=$i; $j <= ($i+$columncount-1); $j++){
                if(!($j%$columns_per_cell)) echo "&nbsp;&nbsp;|";
                echo "*_|";
            }
            echo "</font>";
            echo '<br>';	
        }
            echo "<br> ";
    }
    echo '<br>';

    ?>
