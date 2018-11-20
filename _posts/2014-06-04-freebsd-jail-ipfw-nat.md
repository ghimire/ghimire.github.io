---
layout: post
comments: true
title: FreeBSD Jail + IPFW + NAT
description: Runing Nat'd Jails under FreeBSD
category : BSD
tags : [firewall, jail, ipfw, security]
---

>Running a NATed jail under FreeBSD is quite helpful when you don't have a public internet routable ip address avilable except that of host's. With the combination of ipfw and nat it is possibe to share the same address space and ports as the host and forward certain ports to jail services.  

`BSDGurl` has written a handy ezjail guide available at [http://bsdgurl.net/text/ezjail-guide.txt](http://bsdgurl.net/text/ezjail-guide.txt). With her permission, I'm adopting the first part of this tutorial from the same.

    Setting Up Ezjail:
        
    Install sources: 
        # sysinstall
        Select all sources from Configure -> Distributions -> src and install them
        
    Buildworld:	
        # cd /usr/src
        # make buildworld

    Compile ezjail port:
        # cd /usr/ports/sysutils/ezjail && make install clean

    Prepare Base System:
        # ezjail-admin update -p -i

    Create Your Jail (Replace mydomain.org and ip address)
        # ezjail-admin create -r /usr/jails/mydomain.org mydomain.org 1.2.3.4

    Add alias IP to interface (example: em0) and turn on ezjail service:
        # echo 'ifconfig_em0_alias0="inet 1.2.3.4 netmask 255.255.255.255"' >> /etc/rc.conf
        # echo 'jail_socket_unixiproute_only="NO"' >> /etc/rc.conf
        # echo 'ezjail_enable="YES"' >> /etc/rc.conf
    Configure syslogd to listen on both host and jail
        # echo 'syslogd_flags="-ss"' >> /etc/rc.conf
        
    Copy resolv.conf from host to jail:
        # cp /etc/resolv.conf /usr/jails/mydomain.org/etc/

    Start Jail:
        # /usr/local/etc/rc.d/ezjail.sh start

    Some Userful Jail commands:
        jls => list jails
        jexec 1 /bin/sh => connects to jail console
        /usr/local/etc/rc.d/ezjail.sh restart => restarts all jails
        ezjail-admin delete -w mydomain.org => deletes mydomain.org jail

    Okay now that's done, we will setup ipfw and nat.

    We will now create a basic IPFW rules file. For Advanced example,
    take a look at BSDGurl's IPFW Guide Page: http://bsdgurl.org/text/ipfw-guide.txt

    # ee /usr/local/etc/myfirewall.rules

    Example Contents of file /usr/local/etc/myfirewall.rules
    -----------------START-------------
    # Example Interface: em0
    # List of Ports:
    #   Host SSH: 4567
    #	 HOST WEBERVER: 8080,4443
    #   JAIL SSH: 7890
    #   JAIL WEB SERVER: 80, 443
    #   JAIL DNS SERVER: 53

    IPF="ipfw -q add"
    ipfw -q -f flush

    # Replace with your interface
    PIF="em0"

    # Host IP
    inet="172.16.83.84"

    # Jail IP
    jail="1.2.3.4"

    $IPF 10 allow all from any to any via lo0
    $IPF 15 allow all from any to 127.0.0.0/8
    $IPF 20 deny all from any to 127.0.0.0/8
    $IPF 25 deny all from 127.0.0.0/8 to any
    $IPF 40 deny tcp from any to any frag

    $IPF 41 allow tcp from any to me 4567 established

    # Allow out NATed traffic from Jail. This is DNATed traffic.
    $IPF 45 divert natd ip from $jail to not me out via $PIF
    $IPF 46 skipto 10000 ip from any to any diverted

    # Allow remaining all outgoing traffic
    $IPF 110 allow all from me to any out

    # Allow NATed traffic to Jail. This is SNATed traffic. natd (NAT daemon) will take care of these.
    $IPF 150 divert natd ip from not me to any in via $PIF
    $IPF 160 skipto 10000 ip from any to any diverted

    # Allow ICMP from friendly subnet and deny the rest
    $IPF 165 allow icmp from 172.16.83.0/83 to me
    $IPF 166 deny icmp from any to any

    # Allow inbound ports to host services with maximum 2 concurrent connections
    # We will not add Jail services ports here. They are specified in natd config file. 
    $IPF 171 allow tcp from any to $inet 4567 in via $PIF setup limit src-addr 2
    $IPF 172 allow tcp from any to $inet 8080 in via $PIF setup limit src-addr 2
    $IPF 173 allow tcp from any to $inet 4443 in via $PIF setup limit src-addr 2

    # Log an deny the traffic
    $IPF 500 deny log logamount 10000 ip from any to any

    # This is where all diverted NAT traffic are skipped to after being processed.
    $IPF 10000 allow ip from any to any

    -----------------STOP-------------

    Verify your ipfw firewall is enabled in /etc/rc.conf:
        firewall_enable="YES"
        firewall_script="/usr/local/etc/myfirewall.rules"

    Specify ports to be redirected in natd rules file /usr/local/etc/natd.rules 
    (More Info:  http://freebsd.rogness.net/redirect.cgi?basic/nat.html)
    # ee /usr/local/etc/natd.rules

    Example Contents of file /usr/local/etc/natd.rules (Fomat: jail_ip:jail_port host_ip:host_port)
    -----------------START-------------
    redirect_port tcp 1.2.3.4:4567 4567
    redirect_port tcp 1.2.3.4:80 80
    redirect_port tcp 1.2.3.4:443 443
    -----------------STOP-------------

    Enable natd service:
        # echo 'natd_enable="YES"' >> /etc/rc.conf
        # echo 'natd_interface="em0"' >> /etc/rc.conf
        # echo 'natd_flags="-config /usr/local/etc/natd.rules"' >> /etc/rc.conf

    Test to verify both host and jail services are accessible. If you wish to ping from within jail run this command:
    echo security.jail.allow_raw_sockets=1 >> /etc/sysctl.conf
