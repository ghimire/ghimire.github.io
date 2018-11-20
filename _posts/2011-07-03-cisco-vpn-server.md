---
layout: post
comments: true
title: Cisco VPN Server
description: IOS VPN Configuration
category : Cisco
tags : [vpn, security]
---
![VPN Server](/images/vpn_server.png)

    aaa new-model
    aaa authentication login default local
    aaa authentication login MYVPNXAUTH local
    aaa authorization exec default local
    aaa authorization network MYVPNAUTHGROUP local
    !
    username admin privilege 15 password 0 MYPASSWORD
    !
    crypto isakmp policy 10
     encr aes
     hash md5
     authentication pre-share
     group 2
    !
    crypto isakmp client configuration group TUNNELGROUP
     key MYVPNKEY
     pool MYPOOL
     acl 100
     netmask 255.255.255.0
    crypto isakmp profile MYIKEPROFILE
       match identity group TUNNELGROUP
       client authentication list MYVPNXAUTH
       isakmp authorization list MYVPNAUTHGROUP
       client configuration address respond
       virtual-template 1
    !
    crypto ipsec transform-set MYSET esp-aes esp-sha-hmac
    !
    crypto ipsec profile MYIPSECPROFILE
     set transform-set MYSET
     set isakmp-profile MYIKEPROFILE
    !
    interface Virtual-Template1 type tunnel
     ip unnumbered FastEthernet4
     tunnel mode ipsec ipv4
     tunnel protection ipsec profile MYIPSECPROFILE
    !
    ip local pool MYPOOL 192.168.1.50 192.168.1.60
    !
    access-list 100 permit ip 192.168.1.0 0.0.0.255 any
    access-list 110 deny ip 192.168.1.0 0.0.0.255 192.168.1.0 0.0.0.255
    access-list 110 permit ip 192.168.1.0 0.0.0.255 any
    !
    route-map nonat permit 10
     match ip address 110
    !
    interface FastEthernet4
     ip address 172.16.12.13 255.255.255.0
     ip nat outside
    !
    interface Vlan1
     ip address 192.168.1.1 255.255.255.0
     ip nat inside
    !
    ip route 0.0.0.0 0.0.0.0 172.16.12.1
    !
    ip nat inside source route-map nonat interface FastEthernet4 overload
