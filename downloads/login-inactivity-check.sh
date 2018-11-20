#!/bin/bash
#
#SSH Inactivity Script by ghimire @ irc.securitychat.org released under the
# terms and license of GPLv3.
#
# The bash script calculates the time difference between last logged-in date
# and current date of users using lastlog entry. In case the user hasn't
# logged in before, the modification date of user's homedir is used. By
# default users inactive for more than a month are restricted from logging in
# by adding an entry to /etc/security/limits.conf but the inactivity time
# period can be changed by editing the script. The script requires root access
# to function properly since su access is required to make an entry to
# /etc/security/limits.conf For any questions, suggestions feel free to email
# me at ghimire@badfoo.net or reach me at irc.securitychat.org

cat > /tmp/conv_secs2days.pl << EOF
#! /usr/bin/perl
# Convert seconds to days, hours, minutes, seconds
\$seconds = \$ARGV[0];
@parts = gmtime(\$seconds);
printf ("%3d days %2d hours %2d minutes %2d seconds\n",@parts[7,2,1,0]);
EOF

# Change this value to 1 to lock inactive users through /etc/security/limits.conf
lock_inactive_users=0

if [ -e "inactivity_details.txt" ]; then rm inactivity_details.txt; fi
for users in /home/*
do
	user_name=$(basename "$users")
	login_date=$(lastlog -u "$user_name" | sed 1d | cut -c 43- | sed -e s/^\ //) 		#<-- get login date for user
	
	if test "$login_date" == "**Never logged in**" ; then  				#<-- If users hasn't logged in before
		local_date=$(ls -l "/home"| grep "$user_name" | head -n 1 | awk '{ printf "%s %s\n",$6,$7}') 	#<-- extract timestamp from user's ~/
		login_date=$(date -d "$local_date")			#<-- convert timestamp into standard form
	fi
	
	logindate_inseconds=$(date -u -d "$login_date" +%s) 				#<-- convert login date to seconds from epoch (Thu Jan 1 00:00:00 1970)
	curdate_inseconds=$(date -u +%s); 				#<-- convert current date to seconds from epoch
	DIFF=$(( $curdate_inseconds - $logindate_inseconds )); 		#<-- calculate the difference
	# diff_date=$(date -u -d@$DIFF) 				#<-- converts difference to date 
	
	if [ "$DIFF" -ge "86400" ]; then				#<-- if the difference is more than 24 hours
		cat /dev/null
		# do some stuff here for 24 hours inactivity
	fi

	if [ $DIFF -ge '2678400' ]; then				#<-- if the difference is more than 1 month
		# do some stuff here for 1 month inactivity
		
		if [[ $lock_inactive_users -gt 0 ]]; then
			grep "$user_name hard maxlogins 0" /etc/security/limits.conf > /dev/null
			if test $? -eq 0; then
				echo "$user_name's account is already locked."
			else
					echo "$user_name" hard maxlogins 0 >> /etc/security/limits.conf
					echo "$user_name userlocked."
			fi
		fi
	fi
	
	if [ $DIFF -ge '4320000' ]; then				#<-- if the difference is more than 50 days
		cat /dev/null
		# do some stuff here for 50 days inactivity
		
	fi
	
	last_logged_in=$(perl /tmp/conv_secs2days.pl $DIFF)

	## formatting output
	mylen=`expr length $user_name`
	spaces_required=`expr 15 - $mylen`
	formatted_user_name=$user_name`perl -e 'print " "x'$spaces_required';'`
	echo -e "$formatted_user_name\tlast logged in:\t$last_logged_in ago."
	echo -e "$formatted_user_name\tlast logged in:\t$last_logged_in ago." >> inactivity_details.txt
done

