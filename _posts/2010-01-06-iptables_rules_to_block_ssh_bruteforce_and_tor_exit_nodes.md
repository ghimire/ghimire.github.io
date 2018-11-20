---
layout: post
comments: true
title: IPtables Rules to block SSH Bruteforce and Tor exit nodes
category : Linux
tags : [tor, ssh, security]
---

I was going through some of the old files and came across IPTables Rules to block SSH Bruteforce and Tor exit nodes. These rules are helpful in protecting your VPS/Dedicated Servers from related attacks and IP Spoofing.

IPTables Rules to limit SSH bruteforce
---------------------------------------
    iptables -A INPUT -p tcp --dport 22 -i eth0 -m state --state NEW -m recent --set --name SSH  
    iptables -A INPUT -p tcp --dport 22 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 7 --rttl --name SSH -j DROP  

*Explanation: The first lines assigns a name SSH to the packets with destination port 22. If the packet count exceeds 7 hits per 60 second for an ip address further connections are dropped. If your sshd is listening to a port other than 22 update above rules to reflect changes.*

IPTables Rules to block Tor exit nodes
--------------------------------------
    #!/bin/bash
    wget -P/tmp http://anonymizer.blutmagie.de:2505/ip_list_exit.php/Tor_ip_list_EXIT.csv
    if [ -f /tmp/Tor_ip_list_EXIT.csv ]; then
        for BAD_IP in `cat /tmp/Tor_ip_list_EXIT.csv`
        do
            iptables -A INPUT -s "$BAD_IP" -j DROP
        done
    else
        echo "Can't read /tmp/Tor_ip_list_EXIT.csv"
    fi

*Explanation: The above commands sequence downloads the tor exit node list from blutmagie.de and adds IPTables rules to drop the connection with each IP address as source.*
