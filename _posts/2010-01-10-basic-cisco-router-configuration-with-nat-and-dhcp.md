---
layout: post
comments: true
title: Basic Cisco Router Configuration with NAT and DHCP
description: Just enough lines to get the router up and running
category : Cisco
tags : [router, configuration]
---

    hostname myrouter
    enable password @bcD987
    enable secret @bcD987
    service password-encryption
    int fa4
     ip address 1.2.3.4 255.255.255.0
     ip nat outside
     no shut
    int vlan 1
     ip address 192.168.5.1 255.255.255.0
     ip nat inside
     no shut
    line vty 0 4
     password @bcD987
     login
    line con 0
     password @bcD987
     login
    access-list 100 permit 192.168.5.0 0.0.0.255
    ip nat inside source list 100 interface FastEthernet 4 overload
    ip name-server 1.2.3.4
    ip name-server 5.6.7.8
    ip dns server
    ip http server
    ip http secure-server
    ip default-gateway 1.2.3.1
    ip route 0.0.0.0 0.0.0.0 1.2.3.1
    username myuser privilege 15 password 0 gh!JK678
    ip dhcp excluded-address 192.168.5.1
    ip dhcp pool mydhcppool
     network 192.168.5.0 255.255.255.0
     default-router 192.168.5.1
     domain-name mydomain.org
     dns-server 192.168.5.1 5.6.7.8
     netbios-name-server 192.168.5.1
     netbios-node-type h-node
