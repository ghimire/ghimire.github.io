---
layout: post
comments: true
title: qwebirc - installation and configuration with cgiirc enabled
description: ajax web irc client in pure python
category : IRC
tags : [irc, server, cgi]
---
![qwebirc](/images/qwebircsmall.png)  
    ==Installation==

    =Debian/Ubuntu=
    # apt-get install mercurial
    # apt-get install python-twisted-names
    # apt-get install python-twisted-mail
    # apt-get install python-twisted-web
    # apt-get install python-twisted-words

    =FreeBSD/PCBSD=
    # cd /usr/ports/devel/mercurial && make install clean
    # cd /usr/ports/www/py-twistedWeb && make install clean
    # cd /usr/ports/dns/py-twistedNames && make install clean
    # cd /usr/ports/mail/py-twistedMail && make install clean
    # cd /usr/ports/net-im/py-twistedWords && make install clean

    $ cd ~/
    $ hg clone http://hg.qwebirc.org qwebirc
    $ cd qwebirc
    $ hg up -C stable
    $ hg pull
    $ hg up

    ==Configuration==

    Create config.py with following content:

    File: config.py
    --------------------------------
    from qwebirc.config_options import *
    IRCSERVER, IRCPORT = "irc.myserver.com", 6667
    REALNAME = "http://moo.com/"
    IDENT = "webchat"
    WEBIRC_MODE = None
    BASE_URL = "http://foo.foo.org/"
    NETWORK_NAME = "FooNet"
    APP_TITLE = NETWORK_NAME + " Web IRC"
    FEEDBACK_FROM = "moo@moo.com"
    FEEDBACK_TO = "moo@moo.com"
    FEEDBACK_SMTP_HOST, FEEDBACK_SMTP_PORT = "127.0.0.1", 25
    ADMIN_ENGINE_HOSTS = ["127.0.0.1"]
    UPDATE_FREQ = 0.5
    MAXBUFLEN = 100000
    MAXSUBSCRIPTIONS = 1
    MAXLINELEN = 600
    DNS_TIMEOUT = 5
    HTTP_AJAX_REQUEST_TIMEOUT = 30
    HTTP_REQUEST_TIMEOUT = 5
    HMACKEY = "mrmoo"
    HMACTEMPORAL = 30
    AUTHGATEDOMAIN = "webchat_test"
    QTICKETKEY = "boo"
    AUTH_SERVICE = "Q!TheQBot@CServe.quakenet.org"
    AUTH_OK_REGEX = "^You are now logged in as [^ ]+\\.$"
    import dummyauthgate as AUTHGATEPROVIDER
    -----End of File----------------

    Modify default values like IRCSERVER, REALNAME, IDENT, BASE_URL, NETWORK_NAME,    FEEDBACK_FROM, FEEDBACK_TO, AUTHGATEDOMAIN, QTICKETKEY

    To start server (with default port 9090 and all IPs):
        cd ~/qwebirc
        ./run.py

    To start server on port 7777:
        cd ~/qwebirc
        ./run -p 7777
        
    To start server on port 7777 and specific IP 1.2.3.4:
        cd ~/qwebirc
        ./run -i 1.2.3.4 -p 7777
        
    ==Enabling CGIIRC==

    Modify the value of WEBIRC_MODE in config.py and add WEBIRC_PASSWORD as shown below:

    File: config.py (partial)
    -------------------------
    WEBIRC_MODE = "webirc"
    WEBIRC_PASSWORD = "some-secret-password"
    ------End of File--------

    If you are using UnrealIRCD add these lines in unrealircd.conf:

    File: unrealircd.conf (partial)
    -------------------------------
    cgiirc {
    type webirc;
    hostname "irc.myserver.com";
    password "some-secret-password";
    };
    ------End of File---------------  

For other IRC Clients, use this link for reference:
[Enable Mibbit on Your IRC Server](http://wiki.mibbit.com/index.php/Enable_Mibbit_on_Your_IRC_Server)
