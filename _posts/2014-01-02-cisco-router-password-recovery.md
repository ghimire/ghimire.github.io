---
layout: post
comments: true
title: Cisco Router Password Recovery
description: Recovering Passwords on IOS
category : Cisco
tags : [recovery]
---

### Configure Putty to following details:  

    Serial Line: COM5
    Speed: 9600
    Speed (baud):9600
    Data bits: 8
    Stop bits: 1
    Parity: None
    Flow Control: None

    Power up the router.

    Press Ctrl + Pause Break key combinations while it's booting up.
    This will present a ROMmon mode.

    rommon 2 > confreg 0x2142
    rommon 2 > reset

    After the router finishes loading, 

    Router> sh ver | begin ^Configuration
    Configuration register is 0x2142
    Router> enable
    Router> copy startup-config running-config
    Router> config t
    Router(config)# enable secret mysecretpassword
    Router(config)# config-register 0x2102
    Router(config)# exit
    Router# copy running-config startup-config
    Destination filename [startup-config]? (Press Enter)
    Router# reload
    Proceed with reload? [confirm] (Press Enter)

    Once the router finishes booting up:

    Router>sh ver | begin ^Configuration
    Configuration register is 0x2102  

*Congratulations!*
