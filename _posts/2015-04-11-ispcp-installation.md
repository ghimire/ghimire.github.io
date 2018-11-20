---
layout: post
comments: true
title: IspCP Installation
description: Open Source Hosting Control Panel Solution
category : Linux
tags : [control panel, hosting]
---

If you are in search of a free/open source hosting control panel IspCP might offer the solution.  

Here's a guide to install IspCP (version 1.0.7 at the time of writing) on Debian Lenny:  

### Installation  
    # cd /usr/src/
    # wget ispcp-omega-1.0.7.tar.bz2
    # tar cjvf ispcp-omega-1.0.7.tar.bz2
    # cd ispcp-omega-1.0.7

    # aptitude update && aptitude safe-upgrade
    # aptitude install lsb-release
    # aptitude install $(cat ./docs/Debian/debian-packages-`lsb_release -cs`)
    OR,
    # apt-get install $(cat ./docs/Debian/debian-packages-`lsb_release -cs`)

    #File: /etc/apt/sources.list
    -----------------------------
       deb     http://ftp.de.debian.org/debian/         lenny         main contrib non-free
       deb     http://security.debian.org/              lenny/updates main contrib non-free

    *Note*
    (if you get to the proftpd screen, select 'standalone')
    (if you get to the postfix screen select 'internet site'. 'mail name' should be
    the server's domain. If you've set debian up correctly on install your domain
    should be already shown.)
    (if you get to the courier screen select 'no' to web directories)

    # make install
    # cp -R /tmp/ispcp/* /
    # mysql_secure_installation
    # cd /var/www/ispcp/engine/setup
    # perl ispcp-setup
    Go to http://ip.add.re.ss
    # rm -fR /tmp/ispcp/  
    
###To Uninstall 
    # cd /var/www/ispcp/engine/setup
    # perl ispcp-uninstall
