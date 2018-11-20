---
layout: post
comments: true
title: Cisco Site-To-Site IPSEC VPN Tunnel
description: L2L VPN Tunnel with Nat-Traversal
category : Cisco
tags : [vpn]
---
![Site-to-Site IPSec VPN Tunnel](/images/site-to-site-tunnel.png)  
Our site-to-site VPN Tunnel will share 192.168.7.0/24 and 10.11.12.0/24 with each other. For this to work, 172.16.1.10 and 192.168.10.10 should be publicly reachable though static NAT translation on Gateway routers (ip nat inside source static 1.1.1.1 192.168.1.1) where 1.1.1.1 is Public IP and 192.168.1.10 is private ip. All traffic directed to 1.1.1.1 will be translated and forwarded to 192.168.1.10  
>NAT Traversal is automagic if both end devices support it. Cisco routers do. I have included requied commands for both sites.  

    SITE-A-Configuration
    --------------------
    hostname SITEA
    !
    ip cef
    ip name-server 172.16.1.1
    !
    crypto isakmp policy 10
     encr aes
     hash md5
     authentication pre-share
     group 2
    crypto isakmp key MYVPNKEY address 192.168.10.10 no-xauth
    !
    crypto ipsec transform-set MYSET esp-aes esp-sha-hmac
    !
    crypto map MYMAP 10 ipsec-isakmp
     set peer 192.168.10.10
     set transform-set MYSET
     match address NONAT
    !
    interface FastEthernet4
     description ## Publicly reachable Outside End Point IP ##
     ip address 172.16.1.10 255.255.255.0
     ip nat outside
     crypto map MYMAP
    !
    interface Vlan1
     description ## Internal Overloaded IP#
     ip address 192.168.7.1 255.255.255.0
     ip nat inside
    !
    ip default-gateway 172.16.1.1
    ip route 0.0.0.0 0.0.0.0 172.16.1.1
    !
    ip nat inside source route-map allowed-out interface FastEthernet4 overload
    ip dns server
    !
    ip access-list extended NONAT
     permit ip 192.168.7.0 0.0.0.255 10.11.12.0 0.0.0.255
    !
    access-list 150 deny   ip 192.168.7.0 0.0.0.255 10.11.12.0 0.0.0.255
    access-list 150 permit ip 192.168.7.0 0.0.0.255 any
    route-map allowed-out permit 10
     match ip address 150




    SITE-B-Configuration
    --------------------
    hostname SITEB
    !
    ip cef
    ip name-server 192.168.10.1
    !
    crypto isakmp policy 10
     encr aes
     hash md5
     authentication pre-share
     group 2
    crypto isakmp key MYVPNKEY address 172.16.1.10 no-xauth
    !
    crypto ipsec transform-set MYSET esp-aes esp-sha-hmac
    !
    crypto map MYMAP 10 ipsec-isakmp
     set peer 172.16.1.10
     set transform-set MYSET
     match address NONAT
    !
    interface FastEthernet4
     description ## Publicly reachable Outside End Point IP ##
     ip address 192.168.10.10 255.255.255.0
     ip nat outside
     crypto map MYMAP
    !
    interface Vlan1
     description ## Internal Overloaded IP#
     ip address 10.11.12.1 255.255.255.0
     ip nat inside
    !
    ip default-gateway 192.168.10.1
    ip route 0.0.0.0 0.0.0.0 192.168.10.1
    !
    ip nat inside source route-map allowed-out interface FastEthernet4 overload
    ip dns server
    !
    ip access-list extended NONAT
     permit ip 10.11.12.0 0.0.0.255 192.168.7.0 0.0.0.255
    !
    access-list 150 deny   ip 10.11.12.0 0.0.0.255 192.168.7.0 0.0.0.255
    access-list 150 permit ip 10.11.12.0 0.0.0.255 any
    route-map allowed-out permit 10
     match ip address 150
    !
