### Generate random theme name from /usr/share/slim/themes/. Change path variable if you have a different theme location
THEME=$(MYPATH="/usr/share/slim/themes/*"; COUNT=$(( $(for i in ${MYPATH};do echo $(basename ${i}); done | wc -l) - 1)); RAN=$(( $(expr $RANDOM % ${COUNT}) + 1)); for i in ${MYPATH};do echo $(basename ${i}); done | sed -n ${RAN}p)
### Replace current_theme line in /etc/slim.conf with random theme
sed -i 's/current_theme\(\s*.*\)/current_theme '${THEME}'/' /etc/slim.conf
### Display info about theme applied
echo SLiM Theme Set To: ${THEME}