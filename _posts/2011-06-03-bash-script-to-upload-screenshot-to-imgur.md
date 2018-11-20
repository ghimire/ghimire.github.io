---
layout: post
comments: true
title: Bash script to upload screenshot to imgur.com
description: Upload screenshot from commandline
category : Image
tags : [imgur, upload]
---
    #!/bin/sh
    if [ ! -f imgurbash.sh ]; then
    wget http://imgur.com/tools/imgurbash.sh
    fi
    result=$(uname -a | grep -i -c bsd)
    if [ $result -gt 0 ]; then
    $(sed  's/sed -r/sed -E/g' imgurbash.sh  > /tmp/imgurbash.tmp; mv /tmp/imgurbash.tmp imgurbash.sh)
    fi
    filename="screenshot-$(date +%s).png"
    import -window root $filename
    bash imgurbash.sh $filename
