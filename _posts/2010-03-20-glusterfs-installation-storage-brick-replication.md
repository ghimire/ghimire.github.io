---
layout: post
comments: true
title: glusterfs installation (storage brick replication)
description: Designing distributed storage
category : Networking
tags : [storage, server]
---

    In this guide we will use gluster2 to replicate stroage bricks between two nodes both of which will act
    as both server and client.

    #File: /etc/hosts
    192.168.0.100	node1.example.org	node2
    192.168.0.101	node2.example.org	node2

    # aptitude install sshfs build-essential flex bison byacc libdb libdb-dev

    # cd /usr/src
    # wget http://ftp.zresearch.com/pub/gluster/glusterfs/3.0/3.0.0/glusterfs-3.0.0.tar.gz
    # tar xzvf glusterfs-3.0.0.tar.gz
    # cd glusterfs-3.0.0
    # ./configure --prefix=/usr > /dev/null
    # make && make install
    # ldconfig

    # mkdir /data
    # mkdir /data/export
    # mkdir /data/export-ns
    # mkdir /etc/glusterfs
    # mkdir /srv

    #File: /etc/glusterfs/glusterfsd.vol
    volume posix
      type storage/posix
      option directory /data/export
    end-volume

    volume locks
      type features/locks
      subvolumes posix
    end-volume

    volume brick
      type performance/io-threads
      option thread-count 8
      subvolumes locks
    end-volume

    volume server
      type protocol/server
      option transport-type tcp
      option auth.addr.brick.allow 192.168.0.*
      subvolumes brick
    end-volume

    # update-rc.d glusterfsd defaults
    # /etc/init.d/glusterfsd start

    # cd /usr/src/
    # wget ftp://ftp.zresearch.com/pub/gluster/glusterfs/fuse/fuse-2.7.4glfs11.tar.gz
    # tar xzvf fuse-2.7.4glfs11.tar.gz
    # cd fuse-2.7.4glfs11
    # ./configure
    # make && make install


    #File: /etc/glusterfs/glusterfs.vol
    volume remote1
      type protocol/client
      option transport-type tcp
      option remote-host node1
      option remote-subvolume brick
    end-volume

    volume remote2
      type protocol/client
      option transport-type tcp
      option remote-host node2
      option remote-subvolume brick
    end-volume

    volume replicate
      type cluster/replicate
      subvolumes remote1 remote2
    end-volume

    volume writebehind
      type performance/write-behind
      option window-size 1MB
      subvolumes replicate
    end-volume

    volume cache
      type performance/io-cache
      option cache-size 512MB
      subvolumes writebehind
    end-volume

    # glusterfs -f /etc/glusterfs/glusterfs.vol /srv 

    #File: /etc/fstab
    /etc/glusterfs/glsuterfs.vol /srv	glusterfs  defaults 0 0

**NOTE**: This guide was largely adopted from 
[HowtoForge GlusterFS on Debian](http://www.howtoforge.org/high-availability-storage-with-glusterfs-on-debian-lenny-automatic-file-replication-across-two-storage-servers)
