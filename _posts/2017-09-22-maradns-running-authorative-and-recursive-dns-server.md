---
layout: post
comments: true
title: MaraDNS - Running Authorative and Recursive DNS server
description: How to configure MaraDNS to provide authorative and recursive funcationality
category : Linux
tags : [dns]
---

    MaraDNS - Authorative DNS server Configuration
    ++++++++++++++++++++++++++++++++++++++++++++++

        # apt-get install maradns

    If you are using the default configuration file sometimes it's helpful to see the non-commented lines
        # cat /etc/maradns/mararc  | awk '/^[^#]/ { print $0 '}

    -----------------------------------
    Running an Authorative DNS Server
    -----------------------------------

    Now let's modify the mararc config file by adding/modifying the lines below:
        # vim /etc/maradns/mararc
            csv2 = {}
            csv2["example.org."] = "db.example.org"
            csv2["helloworld.net."] = "db.helloworld.net"
            
            bind_address = "50.3.1.8"

            chroot_dir = "/etc/maradns"

    It's time to create the corresponding zone files.

        # vim /etc/maradns/db.example.org
            example.org NS ns1.example.org ~
            example.org 1.2.3.4 ~
            www.example.org 1.2.3.4 ~
            example.org MX 10 mail.example.org ~
            ns1.example.org 50.3.1.8 ~
            mail.example.org 50.3.1.8 ~
            irc.example.org 1.3.3.7 ~

    Notice the lack of SOA records which are generate automagically.

    Another way is to use the shortcut % which represents the domain as defined on mararc.
        # vim /etc/maradns/db.helloworld.net
            % NS ns1.% ~
            % 1.2.3.4 ~
            www.% 1.2.3.4 ~
            % MX 10 mail.% ~
            ns1.% 50.3.1.8 ~
            mail.% 50.3.1.8 ~
            irc.% 1.3.3.7 ~

    This is exactly the same as above zone file except all '%' symbols in this file are 
    replaced by 'helloworld.net.'

    Finally restart the service:
        # /etc/init.d/maradns restart

    and check the log,
        # cat /var/log/syslog | grep maradns

    to make sure there are no errors.
        
    Test using 'askmara':
        $ askmara Awww.example.org. 50.3.1.8
            # Querying the server with the IP 50.3.1.8
            # Question: Awww.example.org.
            www.example.org. +86400 a 1.2.3.4
            # NS replies:
            #example.org. +86400 ns ns1.example.org.
            # AR replies:
            #ns1.example.org. +86400 a 50.3.1.8

    Test using 'dig':
        $ dig A www.example.org @50.3.1.8
            ;; ANSWER SECTION:
            www.example.org.         86400   IN      A       1.2.3.4

            ;; AUTHORITY SECTION:
            example.org.             86400   IN      NS      ns1.example.org.


    -------------------------------
    Running a Recursive DNS Server
    -------------------------------

    In addition to authorative server, maradns can also funcation as a recursive DNS server. 

    To run a recursive server, add/modify lines in the config file.
        # vim /etc/maradns/mararc

            bind_address = "50.3.1.8"

            chroot_dir = "/etc/maradns"

            # Uncomment this line if commented.
            ipv4_alias = {}

            # Here you define the forwarders which in most cases are the providers DNS server IPs
            # or Public DNS Servers. We're using Google DNS for this purpse
            upstream_servers = {}
            upstream_servers["."] = "8.8.8.8 8.8.4.4"
            
            # Hosts allowed to perform recursive queries
            recursive_acl = "192.168.51.0/24"

    That's it. Verify it works:
        $ dig A google.com @50.3.1.8

    Since the modifcation of config file for both authorative and recursive purpose do
    not conflict with one another, it is possible to run  them both at the same time
    through a single config file.
        
    More Info:
    * Example files: /usr/share/doc/maradns/en/examples
    * Manual: man maradns
    * Manual: man askmara
    * Web: http://www.maradns.org
