---
layout: post
comments: true
title: SKS OpenPGP Keyserver Installation and GnuPG Operations 
description: SKS Installation and using gpg to Generate,Send,Search,Import Keys using newly installed keyserver
category : Networking
tags : [keyserver,gpg]
---

>This is a two part guide. First part describe installating keyserver. This is optional as there are plethora of public keyservers out there. It can be useful however to run your own keyserver in an organization or a compnay. The Second part of this guides describes some of the basic gpg operatins such as generating keys and using keyserver to send, search and import them.  

    ++Part 1: sks keyserver installation (Optional)++
    ==================================================
    Install sks from repository
        # apt-get -y install sks

    Build and Initialize DB 
        # sks build 

    Modify /etc/sks/sksconf

    ==File: /etc/sks/sksconf==
    ---------------------------
    # Replace IP with binding IP
    hostname: example.org
    hkp_address: 192.168.0.100
    hkp_port: 11371  

Default installation lacks html pages. [Download it from rainydayz.org](http://www.rainydayz.org/sites/default/files/download/sks/sks_www.tar.bz2) or [my modified version](downloads/sks_web_root.tar.bz2) of the same to `/var/lib/sks/www/` , assign appropriate permissions and change the post url.  

    # mkdir /var/lib/sks/www
    # cd /var/lib/sks/www
    # wget Rainydayz.org
    # tar xjvf sks_www.tar.bz2

    Modify index.html and replace all instances of "your.site.name" with your site name or IP address.

    # chown debian-sks:debian-sks *

    Launch sks in the background
    # sks db &

    ++Adding Recon++

    With recon, it is possible to distribute keys among keyservers. To enable recon,
    modify /etc/sks/sksconf and uncomment recon options.

    ==File: /etc/sks/sksconf==
    ----------------------------
    # Replace IP with binding IP
    recon_address: 192.168.0.100
    recon_port: 11370

    ==File: /etc/sks/membership==
    -----------------------------------------
    # Add remote sks recon IP with recon port
    172.16.0.20 11370

    Ask sks admin of 172.16.0.20 to add your recon IP and port above (192.168.0.100) in remote membership file

    Start Recon with,
    # sks recon &

    +References+
    [1] http://code.google.com/p/sks-keyserver/wiki/Documentation
    [2] http://www.rainydayz.org/node/10
    [3] http://www.keysigning.org/sks/
    [4] blog.reindel.com

        ++Part 2: GnuPG Operations++
        =============================

    ++Key Generation++

    Generate your key if you don't have one already
    $ gpg --gen-key
        Your selection? 1
        What keysize do you want? (2048) [Press Enter]
        Key is valid for? (0) [Press Enter]
        Is this correct? (y/N) y
        Real name: John Doe
        Email address: john.doe@example.org
        Comment: [Press Enter]
        Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
        Enter passphrase: SomethingSecret
        Repeat passphrase: SomethingSecret
        
    If you get stuck at this message,
        " Not enough random bytes available.  Please do some other work to give 
        the OS a chance to collect more entropy! (Need 284 more bytes)"
    open another terminal as superuser, 
        # apt-get install rng-tools
        # rangd -r /dev/urandom
    and the key generation will be completed.

    ++Sending Keys to Keyserver++

    To send your Key to the keyserver, list out your keys first
    $ gpg --list-keys 
    and look for the ID which is the value after 1024/ which looks like 5E21B437
    You can also use regular expression to grab key ID with:
    $ gpg --list-keys | grep 1024D | sed 's/.*1024D\/\(.*\)\ .*$/\1/'
    or with awk,
    $ gpg --list-keys | grep 1024D | awk -F/ '{print $2}' | awk '{print $1}'

    We will choose above installed sks as our keyserver and send our key using key ID
    $ gpg --keyserver hkp://192.168.0.100 --send-keys 5E21B437

    ++Searching and Importing Key from Keyserver++

    To search key with key ID or name,
    $ gpg --keyserver hkp://192.168.0.100 --search-keys name
    or,
    $ gpg --keyserver hkp://192.168.0.100 --search-keys keyid
    If search matches, output will look like this:
    (1)     John Doe <johndoe@example.org>
      1024 bit DSA key 5E21B437, created: 1990-01-01
    Keys 1-1 of 1 for "john".  Enter number(s), N)ext, or Q)uit > Q

    Keys can be received with search and selecting the number or using: 
    $ gpg --keyserver hkp://keyserver --recv-keys Key_ID

    Trusted keys can be signed with,
    $ gpg --sign-key Key_ID

For more information on GNU Privacy Guard visit http://www.gnupg.org/gph/en/manual.html    
  
