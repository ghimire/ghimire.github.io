---
layout: post
comments: true
title: Random Themes (Frame Buffer Splash and SLiM)
category : Idle
tags : [Linux]
---

>One day randomness came to mind and I wrote a script to apply random framebuffer splash to terminal upon login. Gentoo comes with multiple themes in `/etc/splash` directory along with `media-gfx/splash-themes-gentoo` package. This is more or less general script and to prove that I've extended it to use with *SLiM* (Simple Login Manager) applying random themes from `/usr/share/slim/themes/`  

###Script to Apply Random FB Splash from /etc/splash  

    ### Generate random theme name from /etc/splash. Change path variable if you have a different theme location
    THEME=$(MYPATH="/etc/splash/*"; 
            COUNT=$(( $(for i in ${MYPATH};do if [ -d ${i} ]; then echo $(basename ${i}); fi; done | wc -l) - 1)); 
            RAN=$(( $(expr $RANDOM % ${COUNT}) + 1)); 
            for i in ${MYPATH};do echo $(basename ${i}); done | sed -n ${RAN}p);
            
    ### Apply random theme to tty2
    splash_manager -c set -t ${THEME} --tty=2
    
    ### Display info about theme applied
    echo FBSplash Set to: ${THEME}  

*Explanation: The scripts makes use of $RANDOM shell variable and 'sed' way of displaying particular line to get a random theme from path variable and applies it to the terminal through splash_manager*  

###Script to Apply Random SLiM Themes from /usr/share/slim/themes  
    ### Generate random theme name from /usr/share/slim/themes/. Change path variable if you have a different theme location
    THEME=$(MYPATH="/usr/share/slim/themes/*"; 
            COUNT=$(( $(for i in ${MYPATH};do echo $(basename ${i}); done | wc -l) - 1)); 
            RAN=$(( $(expr $RANDOM % ${COUNT}) + 1)); 
            for i in ${MYPATH};do echo $(basename ${i}); done | sed -n ${RAN}p);
            
    ### Replace current_theme line in /etc/slim.conf with random theme
    sed -i 's/current_theme\(\s*.*\)/current_theme '${THEME}'/' /etc/slim.conf
    
    ### Display info about theme applied
    echo SLiM Theme Set To: ${THEME}  

*Explanation: The scripts makes use of $RANDOM shell variable and 'sed' way of displaying particular line to get a random theme from path variable and replaces current_theme line in /etc/slim.conf. SLiM will read the line and apply theme upon displaying the login manager*  

**Note**: On gentoo commands specified in `/etc/conf.d/local.start` are run during startup which is a good location to call the above scripts. On debian it's `/etc/rc.local`
