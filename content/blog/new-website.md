---
title: "New Website"
description: "New website for hervematysiak, moved from Wordpress to Hugo"
date: "2017-04-17"
slug: ""
categories: ["Personal"]
tags: ["hugo"]
---

## History

Many years have come across, I began with Joomla for my "Website" who ended more like unfinished
resource site. After I moved to Wordpress, first hosted by [Archive-Host](https://www.archive-host.com/) (great hoster), after by Levya Org.,
to finally end to my own VPS at [Scaleway](https://www.scaleway.com/). Btw. I never have the time to write something trough..

## Why moving?
My first thinking about Wordpress was to have a one-click usable blog2go. As I don't like WebDesign stuff, I bought a theme named `Salient` who reflected my need:  

- Portfolio  
- Blog (with rich syntax, etc.)  
- Contact  

But I get some trouble with this setup: load time, ssl config., css customization, Wordpress  Network.

The load time was very bad, even with a good back-end server. Ningx, php-fpm, tmpsfs (for cache).
The desktop version took pretty 3 to 6 s. to load, the mobile version was even worse. I played with many template option
for packing the CSS/JS, using CDN, etc. Only time it was fast it was behind a Varnish cache.

The SSL config. was very ugly. The template comes with an article editor who I wasn't fan at the first day but if you want some feature,
I was obligated to use it. And yeah, when uploading an `img` it was using the full URL to the file in *HTTP*, no relative things. It was the case for a long time. Solution? Install an extension who rewrites HTTP to HTTPS.. Whoua.. <!-- language: lang-none -->#Impressed

Wordpress is a great software but it needs time to maintains. Most of the time you have auto-update (minor) but the extension must be updated with user confirmation. It will say that every time you have an idea to write something, you login into and you see some *badge* notifying you that X ext. have an update. And here begin the mess, I must read the changelog, test (locally) if everything is running fine with the template; if not update the template, etc. For a casual blogger like me, it's an over-powered solution.

## Moving to Hugo
After discovering golang, I discovered this piece of software and the static site generation. I was aware of Jekyll but I never imagine moving into.
I will first use it with the most know template `hyde` for the moment and with the time I will create my own template for my need. During this time (eta. 6 months), I will just do basic blogging and some template fix.
