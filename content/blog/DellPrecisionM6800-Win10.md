---
title: "Dell Precision M6800  under Windows 10-PRO"
description: "When you think that M6800 is compatible with Windows 10.."
tags: ["Dell","Win10"]
categories: ["Personal",""]
slug: ""
date: 2017-08-13T10:07:36+02:00
---
## Context

When you begin your CS studies, you think that you just need a laptop that can run most of program smoothly.

So when I started, I bought an HP ProBook 4720s. Worst idea in my life ever! It was my first laptop and to me this was pretty good for starting.
The first year it was OK, running some LAMP stack and some virtual machine. The second year was harder for him, I began using C++ in course and at home.
Here begin the problem, ProBook series has many bad design, etc. The Air Flow has only one output (left) and the input is: the keyboard and other no joined/sealed stuff. The heat system is horrible too,  the Heat sink is connected to the GPU (ATI) and CPU making by default many heat. (ATI driver wasn't stable)

"Making a build of Boost and/or Ogre3D was making my PC stop for heat security (aka TJunction sec.)"

Did you see a student putting his laptop vertically on the window border during winter? It was me.  

Learning from my error, I searched for a laptop having a nice heat sink system with more professionally in the build. I came up selecting the Dell Precision M6800. It just went out when I purchased it (I ordered the old generation and Dell asked me if I wanna have the newest one; was happy this day) and was using Windows 8.1 Pro and Dell Ubuntu 12.02. GNU/Linux wasn't running on it with the ATI card.

## The true

When Windows 10 came out, in stable pro version, I tried to upgrade and my problem began.

Migrating to Windows 10 gave me this result:

* No more stable audio driver  
* No more audio enhancement, MaxAudio working partially  
* No more Bluetooth, no Intel update  
* No more external screen through HDMI, DisplayPort or any ATI output  
* No more MemoryCard slot, it disappears from list  
* Dell E-Port dock station, instability issues  
  * Sound "bad contact" behavior, on Windows 10 plugged in, if you press on the left bottom: the sound struggle and Windows sound manager crash or use the internal HP.  
  * 5 untitled screen, unusable  
  * USB 3.0 becoming USB 2.0?

I have waited many times from Dell to release new drivers, but it takes very long and even __it wasn't running__.

* Dell ATI drivers are the oldish one, never get updated and mess up Windows 10 install.
* Dell Intel Graphic Card driver is a 50/50 joke: once it's running, once it messes up the setup. (the last one make your VGA and ATI driver non-running, even the Intel panel don't show up.. Nice Dell driver QA!)
* Dell Touchpad drivers, there is one but don't run. Windows generic driver is ok...
* Dell Intel Wifi/Bluetooth drivers can be installed but no result. Windows 10 keep overriding this one.

For the ATI GC, I used the driver given directly by Amd but it took one year and more to have stable things.
By stable I mean, you can use your external screen and TV without to have a Minecraft of pixel color:
[screen](#)
Even today, I you plug the HDMI after the Windows boot you can get this.. It's really random.

And Dell says that this mobile working station is tested and running under Windows 10.
[screen](#)

For the fun, let talk about the `Dell Software Updater`. I used to, from the beginning, to get the driver update feed from Dell Download website.
Normally this tools must avoid me to check it and download each thing one by one, etc. __But__ this tool get the update like _2 weeks or 1 month_ after and some never show up. Dell QA did you test it like the other drivers?

Otherwise the machine is still running well, there is some problem about the fan management but it's ok.

## Conclusion
I was thinking that Dell was a good brand and I can say my feeling is mixed:

* The hardware is pretty good, well done and arranged.  
* The software is bad, on non-native support.  

I never had a hardware problem to call the insurance or replacement service, so I can't judge it. But the community and professional (email) support is bad or inexistent. You get more support contacting ATI directly or Intel that Dell..

Now I am asking me if I would buy the new XPS-15, because having a mobile station isn't like a laptop. It's like comparing a bulletproof vest to a shirt.
