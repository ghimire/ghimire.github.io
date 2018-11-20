---
layout: post
comments: true
title: Blocking ZmEu scans with IPTables
description: Preventing ZmEu attack reconnaissance
category : Linux
tags : [firewall]
---

With latest spike on ZmEu attacks and exploits, it is a good idea to block these scans right at the source.

These scans look like these:  
    * 91.121.243.113 - - [31/May/2011:01:18:40 +0000] "GET /pma/scripts/setup.php HTTP/1.1" 404 296 "-" "ZmEu"  
    * 91.121.243.113 - - [31/May/2011:01:18:39 +0000] "GET /w00tw00t.at.blackhats.romanian.anti-sec:) HTTP/1.1" 404 315 "-" "ZmEu"  

They show up all over the logs and fire up IDS.  

There are other solutions based on modsecurity like the one mentioned on [http://linux.m2osw.com/zmeu-attack](http://linux.m2osw.com/zmeu-attack)  

It is also possible to block these using IPTables. Here's a script that does just that:  

    #!/bin/bash
    # Filename: /root/block_zmeu_attack.sh
    httpd_accesslog="/var/log/apache2/access_log"
    logfile="/root/zmeu_scan_blocked.log"

    for i in $(egrep -i 'w00tw00t|zmeu' ${httpd_accesslog} | awk '{print $1}' | sort -u)
    do 
    if [ $(iptables -nL | grep -c $i) -lt 1 ]; then
    iptables -A INPUT -s ${i} -j DROP && echo "${i} blocked on $(date)" >> ${logfile}
    fi 
    done  

Once the script is in place, it's time to add an hourly cronjob.  
    # crontab -e
        @hourly /root/block_zmeu_attack.sh >/dev/null 2>&1
