---
layout: post
comments: true
title: Fixing nvidia drivers issue after every kernel update on Debian/Ubuntu
category : Linux
tags : [nvidia, graphics, kernel]
---

I've noticed after every kernel update, nvidia drivers need to be manually compiled yet it fails to load due to incorrect modules path. Here is how.

_Requirements_  
nvidia-current must be present `apt-get install nvidia-current` which puts the source in */usr/src*  

    On every kernel update:
    Install kernel headers (this can be done from console if WM isn't loading up):
        apt-get install linux-headers-$(uname -r)

    Change directory to latest version of nvidia-current package (195.36.24 at the time of writing) in /usr/src and compile the driver:
        cd /usr/src/nvidia-current-195.36.24
        make && make install

    One time command (Symlink new drivers to X11 modules):
        cd /usr/lib/xorg/modules/extensions
        ln -s /usr/lib/nvidia-current/xorg/nvidia_drv.so ./nvidia_drv.so
        ln -s /usr/lib/nvidia-current/xorg/libglx.so ./libglx.so

    Restart Display Manager (kdm, gdm):
        /etc/init.d/kdm restart
