---
title: "How to convert a dynamic disk to a basic disk without losing data"
description: ""
date: "2011-08-22"
slug: ""
categories: ["HDD"]
tags: ["how-to"]
license: "cc-by-4.0"
summary:  "" 
lightgallery: true
---

Did you accidentally convert your basic disk to a dynamic disk?
Have you looked for a solution but it costs money or you risk losing your data?
Here is the solution.

<!--more-->

{{< admonition type=info title="This article has been imported & translated from my old french blog" open=false >}}
This article has been imported from my old french blog which was hosted over [http://rvmatysiak.free.fr/index.php/fr/tutgene/29-convertir-un-disque-dynamique-en-disque-de-base-sans-perte-de-donnees.html](https://web.archive.org/web/20180312210952/http://rvmatysiak.free.fr/index.php/fr/tutgene/29-convertir-un-disque-dynamique-en-disque-de-base-sans-perte-de-donnees.html)
{{< /admonition >}}

## What is a dynamic hard drive?

A dynamic hard drive allows you to create an unlimited number of primary and extended partitions, on several hard drives, and all this virtually. This allows you to exceed the limit of a basic hard drive which has a maximum of 4 partitions (under an MBR system).

{{< image src="arti_dyna2base-multiPartitions.png" alt="Windows Disk Management overview of main dynamic drive" caption="Disk Management overview" >}}

## Practical

### Preamble

We will need TestDisk.
Download the latest stable version for your system.
First, you will have to do everything to have only 4 active partitions.
To do this, use your preferred partitioning utility. If you are on Windows you can use its manager
partition which is accessible under `Computer=> Right Click Manage=> Storage=> Disk Management`.
If you are on Unix/Linux you can use for example GParted.

{{< image src="arti_dyna2base-dynaHDD.png" alt="Windows Disk Management overview of main drive" caption="Disk Management overview" >}}

### Put into practice
{{< admonition type=warning open=true >}}
The example below is done on a Windows system.
{{< /admonition >}}

Run testdisk_win.exe
{{< image src="arti_dyna2base-00.png" alt="Explorer windows over TestDisk folder from zip" caption="TestDisk unziped folder" >}}

A console environment should appear:
{{< image src="arti_dyna2base-01.png" alt="TestDisk main menu" caption="TestDisk main menu" >}}

Go to `Create` and enter.

Select the disk and `Proceed`
{{< image src="arti_dyna2base-02.png" alt="TestDisk disk/partition selection pane" caption="TestDisk disk/partition selection pane" >}}

Then select your partition type.
{{< image src="arti_dyna2base-03.png" alt="TestDisk partition table type view" caption="TestDisk partition table type view" >}}

Then `Analysis`.
{{< image src="arti_dyna2base-04.png" alt="TestDisk disk action view" caption="TestDisk disk action view" >}}

You should see all partitions in `dynamic/SFS`. As you have noticed a partition has been added since then, this is the oem system recovery partition which is hidden.
{{< image src="arti_dyna2base-05.png" alt="TestDisk disk analysis result" caption="TestDisk disk analysis result" >}}

Before making any changes, make a `Backup`.  
{{< image src="arti_dyna2base-06.png" alt="TestDisk disk analysis view, selecting backup sub-action" caption="TestDisk disk analysis view, selecting backup sub-action" >}}

Once you have done this, you should arrive on a similar console:
{{< image src="arti_dyna2base-07.png" alt="TestDisk disk partition view" caption="TestDisk disk partition view" >}}

Here are the commands we will use:

     ↑ and ↓ to select partitions
     ← and → to change the characteristics of the partitions:
         * = Bootable partition
         P = Primary partition
         L = Logical partition
         E = Extended partition
         D = to delete the partition
         L = to load the backup if you made a mistake or are not sure.

In Windows 7, you have a partition named `System` which must be bootable.
{{< image src="arti_dyna2base-08.png" alt="TestDisk disk partition view with modification" caption="TestDisk disk partition view with modification" >}}

Set up your partitions correctly.
Once finished, type `enter`.

Check your settings for the last time.

If you made a mistake, quit the application.
If everything looks good, apply the `Write` changes.
{{< image src="arti_dyna2base-09.png" alt="TestDisk disk partition view with modification, selecting Write sub-action" caption="TestDisk disk partition view with modification, selecting `Write` sub-action" >}}


Confirm by typing `y`.
{{< image src="arti_dyna2base-10.png" alt="TestDisk confirmation view" caption="TestDisk confirmation" >}}

And that's it, you can exit the application "enter".
{{< image src="arti_dyna2base-11.png" alt="TestDisk validating our changes and asking for reboot" caption="TestDisk validating our changes" >}}

You must restart your computer for the changes to take effect.
If you have done everything correctly, you should normally boot into your operating system.

{{< figure src="arti_dyna2base-baseHDD.png" alt="Windows Disk Management overview of main basic drive" caption="Partitioning utility should indicate from now one a basic disk" >}}

## Related links

- [TestDisk](https://www.cgsecurity.org/wiki/TestDisk)
- [GParted](https://gparted.org/)