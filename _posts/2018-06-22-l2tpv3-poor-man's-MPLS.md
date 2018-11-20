---
layout: post
comments: true
title: L2TPv3 - Poor Man's MPLS
description: Tunnel Encrypted Ethernet Traffic Over IP
category : Cisco
tags : [vpn, security]
---
![L2TPv3 Over IPsec](/images/l2tpv3_over_ipsec.png)  
With this setup, the Remote host 10.6.8.200 will be able to tunnel all ethernet traffic to HQ host 10.6.8.100 over IP using IPsec encryption. This is quite useful when the communication channel between sites is untrustworthy such as Internet. This allows the sites to tunnel traffic destined to each other as if they are located with a LAN.  
>Traffic is encrypted automagically and the only requirement for this to work is that the Cisco router must support l2tpv3 encapulation as shown on the configs. I have included requied commands for both sites.  

    HQ-Configuration
    --------------------
    !
    hostname HQ
    !
    ip cef
    ip name-server 8.8.8.8
    ip name-server 8.8.4.4
    !
    pseudowire-class PW_L2TPV3
     encapsulation l2tpv3
     protocol none
     ip local interface Loopback1
     ip tos reflect
    !
    crypto isakmp policy 10
     encr aes
     hash md5
     authentication pre-share
     group 2
    crypto isakmp key MYTUNNELKEY address 2.3.4.14 no-xauth
    crypto isakmp keepalive 10
    !
    crypto ipsec transform-set MYTUNNELSET esp-aes esp-sha-hmac 
    !
    crypto map MYTUNNELMAP 10 ipsec-isakmp 
     set peer 2.3.4.14
     set transform-set MYTUNNELSET 
     match address INT_TRAFFIC
    !
    interface Loopback1
     ip address 172.16.18.5 255.255.255.255
    !
    interface FastEthernet0/0
     ip address 2.3.4.10 255.255.255.252
     duplex auto
     speed auto
     keepalive 3
     crypto map MYTUNNELMAP
    !
    interface Vlan1
     no ip address
     xconnect 172.16.18.6 1 encapsulation l2tpv3 manual pw-class PW_L2TPV3
      l2tp id 1 1
    !
    ip route 0.0.0.0 0.0.0.0 2.3.4.9
    !
    ip dns server
    !
    ip access-list extended INT_TRAFFIC
     permit ip host 172.16.18.5 host 172.16.18.6
    !




    SITE-B-Configuration
    --------------------
    !
    hostname Remote
    !
    ip cef
    ip name-server 8.8.8.8
    ip name-server 8.8.4.4
    !
    pseudowire-class PW_L2TPV3
     encapsulation l2tpv3
     protocol none
     ip local interface Loopback1
     ip tos reflect
    !
    crypto isakmp policy 10
     encr aes
     hash md5
     authentication pre-share
     group 2
    crypto isakmp key MYTUNNELKEY address 2.3.4.10 no-xauth
    crypto isakmp keepalive 10
    !
    crypto ipsec transform-set MYTUNNELSET esp-aes esp-sha-hmac 
    !
    crypto map MYTUNNELMAP 10 ipsec-isakmp 
     set peer 2.3.4.10
     set transform-set MYTUNNELSET 
     match address INT_TRAFFIC
    !
    interface Loopback1
     ip address 172.16.18.6 255.255.255.255
    !
    interface FastEthernet0/0
     ip address 2.3.4.14 255.255.255.252
     duplex auto
     speed auto
     keepalive 3
     crypto map MYTUNNELMAP
    !
    interface Vlan1
     no ip address
     xconnect 172.16.18.5 1 encapsulation l2tpv3 manual pw-class PW_L2TPV3
      l2tp id 1 1
    !
    ip route 0.0.0.0 0.0.0.0 2.3.4.13
    !
    ip dns server
    !
    ip access-list extended INT_TRAFFIC
     permit ip host 172.16.18.6 host 172.16.18.5
    !
