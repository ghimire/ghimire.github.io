---
layout: post
comments: true
title: Setting up IPv6 Tunnel with Hurricane Electric (Tunnelbroker.net)
description: IPv6 made easy
category : IPV6
tags : [tunnel, ipv6]
---
Since today's [World IPv6 Day](http://www.worldipv6day.org), i've taken the opportunity to create a brief how-to on setting up an IPv6 Tunnel with Hurricane Electric's Tunnelbroker service.  
    1) Go to http://tunnelbroker.net

    2) Register/Login

    3) Create Regular Tunnel
        -> IPV4 Endpoint (Your Side)
        Enter Public IP Address, example: 9.33.21.35
        Selection a tunnel endpoint that's closest to you example: Los Angeles, CA, US
        
        If you have a firewall allow ICMP packets from source IP: 66.220.2.74 with, 
        # iptables -A INPUT -p icmp -s 66.220.2.74 -j ACCEPT

    On the Main Page, under the tunnel you just created you get following information:

        Server IPv4 Address: 74.82.46.6
        Server IPv6 Address: 2001:1337:24:3ac::1/64
        Client IPv4 Address: 9.33.21.35
        Client IPV6 Address: 2001:1337:24:3ac::2/64

        Routed /64: 2001:db8:12:413::/64
        
        Configure your firewall to allow traffic from 74.82.46.6 endpoint.
        # iptables -A INPUT -p ip -s 74.82.46.6 -j ACCEPT

    This is sufficient information to create an IPv6 Tunnel.

    Setting up IPv6 Tunnel on Debian/Ubuntu:
    ----------------------------------------
    This below is a Debian/Ubuntu specific guide. It may or maynot work on other Linux flavors.

    1) Edit /etc/network/interfaces file (# vim /etc/network/interfaces)

    ## Add these lines below to setup a tunnel to your endpoint from information gathered above
    auto mytunnel0
    iface mytunnel0 inet6 v4tunnel
      address 2001:1337:24:3ac::2
      netmask 64
      endpoint 74.82.46.6
      up ip -6 route add default dev mytunnel0
      down ip -6 route del default dev mytunnel0

    # This is network configuration for your default network interfaces. Leave it the way it is.
    auto eth0
    iface eth0 inet dhcp

    # Add these lines to assign a static ipv6 address to your network interface from your very own routed /64 subnet.
    iface eth0 inet6 static
      address 2001:db8:12:413::1
      netmask 64
      
    ############EOF################
     
    That's it. if you want to load it without rebooting the server:
     # ifup mytunnel0
     # ifdown eth0 && ifup eth0
     
     or, reboot
     # reboot
     
     Setting up IPv6 Tunnel on FreeBSD/PC-BSD
     -----------------------------------------
     Using /etc/rc.conf: 
     ============
        ## Edit /etc/rc.conf and add these lines according to the tunnel information above:
        ipv6_enable="YES"
        ipv6_gateway_enable="YES"
        ipv6_network_interfaces="lo0 gif0"
        ipv6_ipv4mapping="YES"
        gif_interfaces="gif0"
        gifconfig_gif0="9.33.21.35 74.82.46.6"
        ipv6_ifconfig_gif0="2001:1337:24:3ac::2 2001:1337:24:3ac::1 prefixlen 128"
        ipv6_defaultrouter="2001:1337:24:3ac::1"

        # Assuming your default network interface is re0, add this line to assign an address from /64 subnet allocated to you.
        ifconfig_fxp0_alias0="inet6 2001:db8:12:413::1 prefixlen 64"

    Using script: 
    ============
    #!/usr/local/bin/bash
    # Script: /root/ipv6_tunnel.sh
    ifconfig gif0 create
    ifconfig gif0 tunnel 9.33.21.35 74.82.46.6
    ifconfig gif0 inet6 2001:1337:24:3ac::2 2001:1337:24:3ac::1 prefixlen 128
    route -n add -inet6 default 2001:470:1f04:1cf4::1
    ifconfig gif0 up

    ifconfig re0 inet6 2001:db8:12:413::1 prefixlen 64 alias

    If you are planning to bind your services/applications on both IPv4 and IPv6 sockets, it's necessary to tune in some sysctl values.

    On GNU/Linux: 
    -------------
    # sysctl -w net.ipv6.bindv6only=0
    # echo net.ipv6.bindv6only=0 >> /etc/sysctl.conf

    On FreeBSD/PC-BSD:
    ------------------
    # sysctl -w net.inet6.ip6.v6only=0
    # echo net.inet6.ip6.v6only=0 >> /etc/sysctl.conf

    Testing IPv6 Connectivity: 
    --------------------------
     $ ping6 ipv6.google.com  
