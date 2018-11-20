---
layout: post
comments: true
category : Linux
tags : [linux, encryption, dropbox, cloud]
---

This is a guide on setting up secure data synchronization on multiple OS distributed over multiple cloud vendors such as Dropbox, Google Drive, SugarSync, Ubuntu One, etc.

## Install Dropbox
### On x86 
    $ cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86" | tar xzf -

### On x86_64
    $ cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -

To start immediately:
    $ ~/.dropbox-dist/dropboxd

and leave the terminal window open.

Optionally, you can download dropbox script:
    $ wget -O ~/dropbox.py https://www.dropbox.com/download?dl=packages/dropbox.py  
    $ chmod u+x ~/dropbox.py

To Auto launch Dropbox on startup,  

### On Gnome:  
*Goto Application -> System Tools -> Preferences -> Startup Applications*  
*Add/Modify Name: Dropbox*  
*Run Command: `~/.dropbox-dist/dropbox start -i`*  

### On KDE:  
    $ echo -e '#!/bin/bash\n~/.dropbox-dist/dropboxd &' > ~/.kde/Autostart/dropbox.sh  
    $ chmod u+x ~/.kde/Autostart/dropbox.sh  
## Install encfs
    $ apt-get install encfs  
    $ mkdir -p ~/Dropbox/.encrypted ~/Private  
    $ encfs ~/Dropbox/.encrypted ~/Private  

`Press 'p' for preconfigured paranoid mode`  
`Enter encryption password`

You can now add files to **~/Private** folder which will automatically be encrypted and synced to dropbox's **.encrypted** folder

In order to auto-mount and decrypt the folder during startup, 
    $ apt-get install cryptkeeper  
    $ cryptkeeper  

**nautilus** will be used as a default file browser. But if you're on KDE, right click the tray, select Preferences and change File browser to: *dolphin*

Click on the `Cryptkeeper` icon on the tray, and select `Import EncFS Folder`.  
>Type: ~/Dropbox/.encrypted as the encrypted folder  
>Type: ~/Private as a mount folder  
>Click Forward to finish the setup.  
>Click on the Cryptkeeper icon again to list the encrypted folders, select the item and enter password to mount it.  

**To Auto launch Cryptkeeper on startup,**
### On Gnome:  
`Goto Application -> System Tools -> Preferences -> Startup Applications`  
`Add Name: Cryptkeeper`  
`Command: /usr/bin/cryptkeeper`  
**Note**, This method launches the cryptkeeper application but doesn't 
automount the encrypted folder. See the alternate solution below.
    
### On KDE:  
    $ echo -e '#!/bin/bash\n/usr/bin/cryptkeeper &' > ~/.kde/Autostart/cryptkeeper.sh  
    $ chmod u+x ~/.kde/Autostart/cryptkeeper.sh  

Alternately if you're using gnome, you can install `gnome-encfs` to auto-mount encrypted folder on startup.  
    $ sudo apt-get install mercurial  
    $ hg clone http://bitbucket.org/obensonne/gnome-encfs   
    $ cd gnome-encfs  
    $ sudo install gnome-encfs /usr/local/bin  
    $ gnome-encfs -a ~/Dropbox/.encrypted ~/Private  

`Enter Password`  
`Type 'y' to mount at start when asked.`  

If you need to access the encrypted data on Windows, install  
1) [Dokan Library](http://dokan-dev.net/wp-content/uploads/DokanInstall_0.6.0.exe)  
2) [encfs4win](http://members.ferrara.linux.it/freddy77/count.php)  

To mount the encrypted folder to virtual L: drive, run the command:  
`encfs4win.exe C:\Users\username\Dropbox\.encrypted L:`  
  
### On Android:
You can install [Cryptonite](https://play.google.com/store/apps/details?id=csh.cryptonite).  
The app is able to decrypt the encrypted folder in Dropbox or local disk.
    
If you need offline copy of the encrypted data, install Dropsync or any other Dropbox synchronization apps and use Cryptonite to decrypt the local folder where dropsync is synchronizing the data to.

For better reliability, you can install other cloud synchronization applications like Google Drive/Ubuntu One/SugarSync for distributed synchronization. With SugarSync, you can download the client app and add `~/Dropbox` to sync. With this setup, a copy of files are synchronized to both Dropbox and SugarSync. The same can be done with Ubuntu One. 

With Google Drive client application, it's a bit tricky. As of this writing, it doesn't yet suport adding existing folders and a linux client is in the making. However, on Windows, after intalling Dropbox and Google Drive, sign in to your Google account and change the Folder location to `C:/Users/username/Dropbox` instead of default. Once this is done, Google Drive app will add a folder in Dropbox called 'Google Drive'. With this setup, the `.encrypted` folder can be created `~/Dropbox/Google Drive/.encrypted` in linux.  
Change the path of the `.encrypted` folder to the new one in the steps above and the data gets synchronized to Google Drive as well as Dropbox.

My Current Setup Looks like This:  

        Linux
     ------------
    | Dropbox    |\
    | Ubuntu One | \
     ------------   \
                     \
        Windows       \ ----EncFS------>{----------------}    /=====> Dropbox
     ---------------                    {                }  /
    |   Dropbox     |-----EncFS4win---->{ Encrypted Data }/=========> Google Drive
    | Google Drive  |                   {  (.encrypted)  }\
    |  Sugar Sync   | /---Cryptonite--->{----------------} \ =======> Sugar Sync
    ---------------- /                                      \
                    /                                        \======> Ubuntu One
       Android     /
     ------------ /
    |   Dropbox  | 
    |  Dropsync  |
    |____________|

