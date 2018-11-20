---
layout: post
comments: true
title: Decompile an Android APK packages using apk2src
category : Android
tags : [android,security,reverse-engineering]
---
In this guide, we will use [apk2src](https://github.com/ghimire/apk2src) from my github to decompile an android apk package that isn't protected by something like [proguard](https://www.guardsquare.com/en/products/proguard).

1. Download and Extract <https://github.com/ghimire/apk2src/archive/master.zip>
2. Download APK from mobile device:  
   `adb ls /data/app`
   `adb pull adb pull /data/app/com.example-1.apk`
3. `cd apk2src-master`
4. `./apk2src com.example-1.apk`
5. `Extract com.example-1.tar.bz2`