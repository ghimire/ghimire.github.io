#!/bin/bash
### Generate random theme name from /etc/splash. Change path variable if you have a different theme location
THEME=$(MYPATH="/etc/splash/*"; COUNT=$(( $(for i in ${MYPATH};do if [ -d ${i} ]; then echo $(basename ${i}); fi; done | wc -l) - 1)); RAN=$(( $(expr $RANDOM % ${COUNT}) + 1)); for i in ${MYPATH};do echo $(basename ${i}); done | sed -n ${RAN}p);
### Apply random theme to tty2
splash_manager -c set -t ${THEME} --tty=2
### Display info about theme applied
echo FBSplash Set to: ${THEME}