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