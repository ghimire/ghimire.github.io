---
layout: post
comments: true
title: Configuring IPv6 BGP Tunnel with Hurricane Electric (tunnelbroker.net)
description: Enable IPv6 on your Cisco Routers
category : Cisco
tags : [ipv6, bgp, bgp tunnel, ipv6 tunnel, hurricane electric, tunnelbroker]
---
    Prerequisites:
    * Cisco IOS with IPv6 support
    * Internet Routable IPv4 address
    * AS number exclusively assigned to you by your RIR

    Throughout the guide, following assumptions are made:
    * Public IP of your Cisco Router is: 9.33.21.35
    * Your ASN is: 31337
    * Your RIR delegated IPv6 Prefix is: 1337:C0DE::/32
    * 1337:C0DE:0A:49::74 an example IPv6 we'll assign to our router

    1) Go to http://tunnelbroker.net
     
     2) Register/Login
     
     3) Create BGP Tunnel
            -> IPV4 Endpoint (Your Side)
            Enter Public IP Address, example: 9.33.21.35
            Prefixes announced: 1337:C0DE::/32
            Selection a tunnel endpoint that's closest to you (eg: Fremont, CA, US 64.71.128.83)
             
             Click on Create BGP Tunnel
         
        On the Main Page, under the tunnel you just created you get following information:
         
            IPv6 Tunnel Endpoints
            Server IPv4 Address: 64.71.128.83
            Server IPv6 Address: 2001:1337:28:bad::1/64
            Client IPv4 Address: 9.33.21.22
            Client IPV6 Address: 2001:1337:28:bad::2/64
         
            BGP Details
            Prefixes: 1337:C0DE::/32
            Your ASN: 31337
            Our ASN: 6262
            Peer Address: 2001:1337:28:bad::1/64
         
        This is sufficient information to create an IPv6 BGP Tunnel.

        Hurricane Electric/Tunnel Broker requires Letter of Authorization that you are the sole owner of your AS and the IPv6 Prefix. 
        You will receive instructions through email to submit this authorization letter through email.

    4) It's now time to configure the Cisco IOS.

        Login in to your Cisco IOS and enter the router configuration mode:
        First thing is to make sure IPv6 support is enabled on your router. To check, enter the command to enable ipv6 on the router
            router(config)# ipv6 unicast-routing

        If it gives an error such as:
            % Invalid input detected at '^' marker.
        then you may need to upgrade the firmware on the router or find another one that supports Ipv6

        We configure the rest of the router according to the information above:
            interface Tunnel0
             description Hurricane Electric IPV6 Tunnel Broker
             no ip address
             ipv6 address 2001:1337:28:bad::2/64
             ipv6 enable
             tunnel source 9.33.21.22
             tunnel destination 64.71.128.83
             tunnel mode ipv6ip
             !
            router bgp 31337
             no bgp default ipv4-unicast
             bgp log-neighbor-changes
             neighbor 2001:1337:28:bad::1 remote-as 6262
             neighbor 2001:1337:28:bad::1 update-source Tunnel0
             !        
             address-family ipv6
              neighbor 2001:1337:28:bad::1 activate
              neighbor 2001:1337:28:bad::1 remove-private-as
              neighbor 2001:1337:28:bad::1 route-map he-ipv6-in in
              neighbor 2001:1337:28:bad::1 route-map he-ipv6-out out
              network 1337:C0DE::/32
              aggregate-address 1337:C0DE::/32 summary-only
              redistribute connected metric 1
              no synchronization
             exit-address-family
            !         
            ipv6 route ::/0 Tunnel0
            !         
            ipv6 prefix-list ipv6-general-prefix seq 5 deny ::/0
            ipv6 prefix-list ipv6-general-prefix seq 10 permit ::/0 le 64
            !         
            ipv6 prefix-list myprivate-prefix seq 5 permit 1337:C0DE::/32 le 64
            !         
            route-map he-ipv6-out permit 10
             match ipv6 address prefix-list myprivate-prefix
             set as-path prepend 31337 31337 31337
            !         
            route-map he-ipv6-in permit 10
             match ipv6 address prefix-list ipv6-general-prefix
             set as-path prepend 6262 6262 6262
            !         

        This should look familiar if you have configured BGP before.  	
        Notice the line "address-family ipv6" is configured from within the "router bgp" prompt.  	
        This basically enables BGP for IPv6 addresses only.  	
        The other lines are responsible for:  	
            1) Setting up the default ipv6 route through the tunnel interface 	
            2) Publishing aggregate routes with our delegated prefix-only to remote peer.

        The final step is to enable the IPv6 on the external router interface.
            !
            interface GigabitEthernet0/0
             ip address 9.33.21.35 255.255.255.0
             
             ipv6 address 1337:C0DE:0A:49::74/64
             ipv6 enable
             ipv6 nd ra suppress
            !         

    Notice, I've added the "ip address" line to show the interface with preconfigured IPv4 address we are using as tunnel endpoint.

    To verify the tunnel is working and the routes are established, use commands below:
    router# sh bgp ipv6
    router# sh ipv6 routes

If these commands produce a long list of IPv6 routes then you have successfully configured your Cisco IOS with BGP and IPv6. If you don't see the IPv6 routes, check the configuration for any errors and verify tunnelbroker.net has received your letter of authorization (shows up as "LoA on file" on the website's tunnel details page).
