---
layout: post
comments: true
title: Configure Exim4 to provide SMTP Relay service with SMTP Authentication and TLS enabled
description: Exim4 + SMTP Relay + SMTP Authentication + TLS
category : Linux
tags : [mail, security, encryption]
---
###Prerequisites  
- Box running Debian Squeeze or Debian variants
- Exim4 Package (apt-get install exim4)
- Internet Routable Public IP Address (172.16.75.12) with reverse DNS relay.example.org  

###Reconfiguring Exim4
Run the command as root,  
	# dpkg-reconfigure exim4-config  
There are two useful scenarios while delivering mails. Smarthosts is safer option if your privoder has a SMTP server you can use.  
If not, you will have to deliver them directly using your mail server. If your IP is blacklisted, or doesn't have a reverse DNS, your mails may not be delivered successfully.  

**Case 1: Direct delivery without Smarthost (eg: To deliver mails directly to remote SMTP servers):**  
	internet site; mail is sent and received directly using SMTP
	System mail name: relay.example.org
	IP-address to listen on for incoming SMTP connections: 127.0.0.1; 172.16.75.12
	Other destinations for which mail is accepted: Leave Empty
	Domains to relay mail for: * (This option will accept mail for any domain) 
	Machines to relay mail for: Leave Empty (Or specify whitelisted relay IPs)
	Keep number of DNS-queries minimal (Dial-on-Demand)? No
	Delivery method for local mail: mbox format in /var/mail/
	Split Configuration into small files? Yes (Very Important)  
This should result in configuration file */etc/exim4/update-exim4.conf.conf*  
	dc_eximconfig_configtype='internet'
	dc_other_hostnames='relay.example.org'
	dc_local_interfaces='127.0.0.1 ; 172.16.75.12'
	dc_readhost='relay.example.org'
	dc_relay_domains='*'
	dc_minimaldns='false'
	dc_relay_nets=''
	CFILEMODE='644'
	dc_use_split_config='true'
	dc_hide_mailname='true'
	dc_mailname_in_oh='true'
	dc_localdelivery='maildir_home'  
**Case 2: Delivery with Smarthost (eg: To Use ISP's SMTP server to relay all your mails):**  
	mail sent by smarthost; received via SMTP or fetchmail
	IP address of hostname of the outgoing smarthost: 1.2.3.4
	Hide local mail name in outgoing mail? Yes
	Visible domain name for local users: relay.example.org  
This should result in configuration file */etc/exim4/update-exim4.conf.conf* with minor differences from file above;  
	dc_eximconfig_configtype='smarthost'
	dc_smarthost='172.16.75.17'  
###Generate Self-signed Certificate  
In order to use TLS (Transport Layer Security) with SMTP authentication, you must generate a self-signed certificate or purchase one from reputed CA.  
	# /usr/share/doc/exim4-base/examples/exim-gencert  
After filling in all the details this will generate a certificate and key files in: */etc/exim4/exim.crt* , */etc/exim4/exim.key*  
This is the default location where exim4 searches for these files.

###Add Exim4 User  
To create username/passwords specifically for exim4 SMTP authentication, run the command  
	# /usr/share/doc/exim4/examples/exim-adduser  
	
You may also copy the file to /sbin and run it,  
	# cp /usr/share/doc/exim4/examples/exim-adduser /sbin
	# exim-adduser  
	
###Enabling TLS  
Type the following command to create a config macro file to enable TLS
	# echo "MAIN_TLS_ENABLE = yes" > /etc/exim4/conf.d/main/00_local_settings  

Additional settings can be added to the file /etc/exim4/conf.d/main/00_local_settings  

###Enabling SMTP Authentication  
Uncomment following lines in /etc/exim4/conf.d/auth/30_exim4-config_examples  
	plain_server:
	   driver = plaintext
	   public_name = PLAIN
	   server_condition = "${if crypteq{$auth3}{${extract{1}{:}{${lookup{$auth2}lsearch{CONFDIR/passwd}{$value}{*:*}}}}}{1}{0}}"
	   server_set_id = $auth2
	   server_prompts = :
	   .ifndef AUTH_SERVER_ALLOW_NOTLS_PASSWORDS
	   server_advertise_condition = ${if eq{$tls_cipher}{}{}{*}}
	   .endif

	login_server:
	   driver = plaintext
	   public_name = LOGIN
	   server_prompts = "Username:: : Password::"
	   server_condition = "${if crypteq{$auth2}{${extract{1}{:}{${lookup{$auth1}lsearch{CONFDIR/passwd}{$value}{*:*}}}}}{1}{0}}"
	   server_set_id = $auth1
	   .ifndef AUTH_SERVER_ALLOW_NOTLS_PASSWORDS
	   server_advertise_condition = ${if eq{$tls_cipher}{}{}{*}}
	   .endif  
	   
###Updating Exim4 Configuration  
Finally run this command to update exim4 configuration and restart exim4:  
	# update-exim4.conf
	# /etc/init.d/exim4 restart  
	
If your provider is blocking port 25 you may want to run the SMTP relay service on additional ports. To do this, modify this line in /etc/default/exim4
	SMTPLISTENEROPTIONS='-oX 587:25 -oP /var/run/exim4/exim.pid'  

*This tells exim4 to listen on port 587 in addition to 25*  

###Testing  
	# telnet 172.16.75.12
	Type, EHLO SMTP
	If you see following line among other things, it means it's working.

	250-STARTTLS
	
A full test can be performed using an email client.
