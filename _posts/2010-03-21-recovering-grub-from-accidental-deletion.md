---
layout: post
comments: true
title: Recovering Grub from accidental deletion
description: Grub disaster and recovery
category : Linux
tags : [boot,recovery]
---

Every once in a while we may run into a situation where we accidentally delete the contents of MBR which stops grub bootloader from loading the menu and booting the system. This can happen when windows is installed on top of a *nix OS with grub installed in which case Windows deletes the MBR content and replaces it with it's own. Here is a fix.  

Download and burn `Knoppix` (or any live-cd for that matter) into a cd or dvd.  

Boot the system from live cd/dvd.  

Once boot is completed, type `sudo su -` to become a superuser. Type `grub` (enter). This will result in a grub prompt. type `find /boot/grub/stage1` which will output a partition with stage1 file. In our example below it's (hd0,1) which can be */dev/sda2* or */dev/hda2*. Note the partition number because we will need this in the next step. Type root followed by the partition from above output. Finally type setup followed by the part before comma. In our example this is (hd0). This is the device block we will be installing grub loader to.

Note: This fix will work if the *nix partition is intact and hasn't been corrupted.  

_An example scenario:_
    # grub
    grub> find /boot/grub/stage1
    (hd0,1)
    grub> root (hd0,1)
    grub> setup (hd0)
    grub> quit
    # reboot

*Voila!*
