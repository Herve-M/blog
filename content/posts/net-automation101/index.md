---
title: "Automation 101 – Making it possible"
description: ""
date: "2020-07-30"
slug: ""
categories: [".NET Automation"]
tags: [".net"]
license: "cc-by-4.0"
summary:  "Read more abnout my bad english" 
featuredImage: "featured-image.jpg"
featuredImagePreview: "featured-image-preview.jpg"
---

When we talk about automation in DevOps, we directly think about automating infrastructure and deployment. Alongside with all the well-known tooling as Kubernetes, Ansible, Docker, etc. But automation doesn’t stop here and even begin far way behind, directly at the Developer and Engineer side! Today we will see how we can introduce some automation for a .Net Core project / team. To note this is a share of vision not yet a guideline 😉   

<!--more-->

## What can we automate? 
Maybe it would be your first question, `what can we automate` in our project? This question could be answered by a simple experiment: take a fresh laptop, an external developer (or friend) and ask him to setup our app locally with making a featureful PR. Observe your friend and take notes of all manual setups he has to do and which isn’t documented (or who is) and what he needs to adapt (because tools get updated contrary to our documentation).  
After the setup you would surely have notes like this one (not exhaustive): install Visual Studio Installer, setup VS 20XX Pro with basic workloads or components, install Git4Windows, Docker, a terminal and other requirement as VS extensions, etc.  
After creating the PR, you will maybe see a kind of deja vue: your CI spot some problems, project not building, NuGet restore failing for his target. Talking about a PR, you will pair review it and shoe him that he didn’t follow the code convention which isn’t really documented, that he updated a project without updating the other, he installed a tool for .Net Core 3.1 instead of 2.1 etc..  
Now the question to ask to yourself as Software Engineer or TechLeads, `how could I have avoided this ?`.  It may be possible to enforce a specific runtime/SDK, enforcing rules and conventions and maybe you could even simplify the PR review process. No harder reading of unwanted space, tabulation... No more eye drain!  

## How does the other do? 
> As any good Engineer, you will do your `State of the Art of making everything less painful` , aka you will seek to see how other companies do it. After your search you will see that Google has monorepo with custom inside tools, Amazon a mix of per project/repository and monorepo and so on. But wait you know that we work on .Net Core and Microsoft has OpenSourced it! How do they manage it? Let’s make a reverse engineering tour and story. 

{{< figure src="repo-dotnetruntime.png" alt="Repository screenshot to show folder & file structure" title="GitHub repository of \[*dotnet/runtime*\](https://github.com/dotnet/runtime)" >}} 

### Root files
`*.md` Most of them are documentation related files, most important files for Developer is the CONTRIBUTING.md
[` .dockerignore`]( https://github.com/dotnet/runtime/blob/master/.dockerignore) is used by the Docker system for creating a container image, to ignore folder/files. 
[`.editorconfig `](https://github.com/dotnet/runtime/blob/master/.editorconfig) is used by VisualStudio (and other tools) to define your code format convention :-) This files can be generated.
[`.gitattributes `](https://github.com/dotnet/runtime/blob/master/.gitattributes) & [`.gitignore `]( https://github.com/dotnet/runtime/blob/master/.gitignore) are git related files. The first one defines how a type of files is diff. (and counted in the diff.) and the End Of Lines behavior. The second one is used to ignore specifics files/folders.
[`.vsconfig `](https://github.com/dotnet/runtime/blob/master/.vsconfig) is used by VisualStudion to define what the project/solution needs as components/workloads to work correctly. This files can be generated too.
[`*.proj`] * [`*..targets`] are MSBuild files used to define some behavior and configuration (where are the source, what targert, define constant etc..). VisualStudio as Visual Studio Code (and other decent .Net IDE) use them too. You can check this doc and this one to learn more about MsBuild concept. 
[`Nuget.config`]( https://github.com/dotnet/runtime/blob/master/NuGet.config) as the name state, this files is used by NuGet to define, most of the time, your feeds & API keys. As you may see, Microsoft has internal feeds with specific tools (we will talk about them later)
[`global.json`](https://github.com/dotnet/runtime/blob/master/global.json) is a .Net Core manifest file helping the Target Framework Moniker to know which version of runtime/SDK to use. It has consequences on all the .Net tooling env. as VisualStudio etc.. To note that Microsoft extended it for they own (`native-tools`, `tools`, ` msbuild-sdks`) for the setup of a new dev. env. (more later)!
[`*.sh`] & other scripts, used to automate task as building, testing but mostly to setup a new developer environment following their guideline! Most of them are just shortcut to the `eng/` folder… 

### Folder structure 
[`.config`](https://github.com/dotnet/runtime/tree/master/.config) one another folder used to store .Net Core related files. Here we have [`dotnet-tools.json`]( https://github.com/dotnet/runtime/tree/master/.config) used by .Net Core 2.X (and up) to setup automatically .Net Core tools. The second one is used for configuration a CI security scanner tool named SecDevTools (beta limited to Azure, because DevOps + Security = DevSecOps)
[`.github`](https://github.com/dotnet/runtime/tree/master/.github) is dedicated to setup the behavior of your Github repository tools (Issue, Wiki, Contribution rules, PR reviewer code assignment, etc..) 
[`docs`](https://github.com/dotnet/runtime/tree/master/docs) as is named tells us, it’s the documentation folder for the project. It contains the guidelines,  tech glossary, architecture decision/explanation and many others (as who is the TechLeads of a feature for review, Team charter etc…).
[`eng`](https://github.com/dotnet/runtime/tree/master/eng) one of the most important folder, the `engineering` folder. It contains all the global rules from Microsoft that most of all the teams/projects try to follow but not only, it give you the script to setup your dev. and CI/CD environment, analyzer rules, CI/CD pipelines definition or custom task and many more. You will see that most of the .Net project has this folder!  
[`src`](https://github.com/dotnet/runtime/tree/master/src) nothing surprising for this one, it contains the source of your project. 
[`tools-local`]( https://github.com/dotnet/runtime/tree/master/tools-local) this folder is a little bit special as it contains source code of tools used by or for the project.

## How is it for other?
Just for the fun if you search inside the .Net Foundation organization collection on Github you will find plenty of other projects. Let us take the last known experiment from them[`tye`]( https://github.com/dotnet/tye). 

{{< figure src="repo-dotnettye.png" alt="Repository screenshot to show folder & file structure" title="GitHub repository of [*dotnet/tye*](https://github.com/dotnet/tye)" >}} 

Unlike the “old” repository structure of `runtime` we can see other new folders: 
* `build`: store the public key for signing and other config. file
* `samples`: example of how to use it
* `test`: all the test for the project
We can take a look to another important repository of the upcoming .NET 5: [`performance`]( https://github.com/dotnet/performance)

{{< figure src="repo-dotnetperformance.png" alt="Repository screenshot to show folder & file structure" title="GitHub repository of [*dotnet/performance*](https://github.com/dotnet/performance)" >}} 


As we can see, we have the kind of same structure, interesting no? Where does it come from? And Why? 
## Understanding the need 
History lesson first, do you know how Microsoft managed to host and setup the CI/CD all the long? 
Long, long time ago, in another far far away company trying to do/take Open Source seriously; Microsoft tried to adapt to a new word and tools. As you may have seen, Microsoft teams didn’t even use their own tools (DevOps/TFS) for hosting these big projects. Each project (runtime, SDK, installer, extension, etc..) had a dedicated repository, a dedicated Developer Team & Engineering Team without any sync to other (hum looks like us? =P). They used Github as a repository system, Jenkins for cross-platform CI/CD and VSTS (DevOps aka old TFS) for signing and other internal tasks. Even using kind of centralized definition of CI/scripts (KoreBuild) and dotnet-ci, this introduced problems, many problems: 
* Cohesion between the Soft. Teams and Projects, developers moving between repositories were less efficient.
* Coupling between project was hard, unstable and each had a custom #fix.
* Legacy team was using other tooling, like Roselyn teams still use roslyn-tools nowadays.
This is why the Engineering team introduced [`arcade`](https://github.com/dotnet/arcade) project, to have a kind of `single source of true for tooling, process and rules`. Arcade describes itself as:  
> [A] well-understood and consistent mechanisms to consume, update, and share engineering [culture] across the .NET Core team.
Today Arcade project helps all Microsoft .NET Core team on: 
* Defining .Net Analyzer base rules
* Defining project targets, constants, and compiler configurations per platform
* Defining what and how a developer setup must be
  * SDK
  * Runtime 
  * External (cross language) dependencies compilations & setup
  * Tooling setup & configuration 
* Dependencies management (more info. here)
  * Reporting and versioning process
  * Updating process 
  * Tools (darc / maestro++)
* Versioning 
* And plenty more

Since the introduction, the .Net Foundation began a big move to a monorepo alike for .NET 5 [`Consolidating .NET GitHub repos `](https://github.com/dotnet/announcements/issues/119) & by example for [`dotnet/extensions`](https://github.com/aspnet/Announcements/issues/411) and it implies the arcade migration too!

## What can we learn
First to be able to do automation we need that the VSC file structure can support our needs. For this most of the OpenSource & Closed source try to follow a modern global folder pattern: docs, src, tests, eng, scripts, tools. Alongside all the IDE & Tools & CI/CD configuration files that are mostly present in the root folder or private dedicated one (like `.XXX`, folders or file who begins with a dot isn’t displayed in Linux FS aka dot files)
Speaking about the tooling, most modern languages are delivered with a rich toolchain. Taking Golang from Google for example, it gives out-of-the-box these tools: 
* cover: a program for analyzing the coverage profile
* doc: show/generate the documentation for the package
* gofmt: used to formats Go programs src files following Google golang guideline
* nm: lists the symbols (dependencies) defined or used by an object file, archive, or executable
* pprof: interprets and display profiles of Go programs
* trace: a tool for viewing trace files
* vet: a go program analyzer 
* …
Rust do the same too! Contrary to .Net world who did not adapt or through to the new needs of developers. Therefore the .Net Core tooling community is crowing and more & more options begin to be available for us (like dotnet-format for gofmt, dotnet-monitor|trace|counter for pprof & trace, docfx for doc, coverlet for cover and even Nerdbank.GitVersioning without any other match!, etc…) 

## How can we automate? 
Today’s post won’t sadly present the how to do it, it will be for the next `Automation 102` one which will present to you a repository structure with most automation that we can do easily without sweating too many and a how the DevOps team did apply/migrate to it for the Titan project (as a forced pilot team ψ(｀∇´)ψ ). 
If you have any questions related to Developer/Ops automation don’t hesitate to reach out the DevOps😉 
