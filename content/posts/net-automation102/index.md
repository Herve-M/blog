---
title: "Automation 102 – How to make it"
description: ""
date: "2020-10-30"
slug: ""
categories: []
tags: [".net"]
license: "cc-by-4.0"
summary:  "Read more abnout my bad english" 
featuredImage: "featured-image.jpg"
featuredImagePreview: "featured-image-preview.jpg"
categories: [".NET Automation"]
---

In the last article about Automation ([101]({{< ref "/net-automation101" >}})), I presented you quickly how Microsoft managed across their teams to follow a “well-understood and consistent mechanisms to consume, update, and share engineering [culture]”. Thankfully to the Open Sourcing of the code but not only, the opening of their process. Now that we know the what and partially the how, can we reproduce something alike? Welcome to this guided tour :-)

<!--more-->

Before all, this article is about to share a vision and experiment: it is *not yet a guideline* neither a *rule*\! If you are interested to follow or adapt it\, see with your Team and/or EM\|PA before :\-\) It will also imply that we are working in a \.Net Core project with Visual Studio 2019 as main IDE\. If you are using an alternative IDE like [Rider](https://www.jetbrains.com/rider/) or [VSCode](https://code.visualstudio.com/), the `Making your IDE your friend` won’t help you directly (check the compatibility matrix of your IDE).

*We will suppose that your environment is setup and running: [Visual Studio](https://visualstudio.microsoft.com/), [git4windows](https://gitforwindows.org/), a terminal ([Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701), [cmder](https://cmder.net/) or even [Git Bash](https://gitforwindows.org/)) and PowerShell. Btw, I will try to follow as much as possible the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.*
<br>
### Preparing the battle ground

First to be able to do automation we need that the [VSC](https://en.wikipedia.org/wiki/Version_control) file structure can support our needs. As said before we will follow a modern global folder pattern: docs, src, tests, eng, scripts, tools. Let us see what go where:

* `docs`: all the related docs for your project and team.
* `src`: all the source code of your project, but only the main one.
* `tests`: all the tests related source code
* `eng`: all the configuration related to Engineering guideline and other.
* `scripts`: all the scripts used in your solution \(not sql\, powershell \| bacch one\)
* `tools`: all the source code of tools implemented or used alongside your project

From here we will begin from scratch with a new, empty, repository from TFS: [Automation.Playground](https://tfs.amaris.com/tfs/ITArchitecture/DevOps/_git/Automation.Playground)

#### Creating the base folders:

* `mkdir docs,src,tests,eng,scripts,tools`

{{< figure src="base-folder.png" alt="Cmdline screenshot to show how to create all folders & see result" >}} 


#### Adding basic git files: ` .gitignore` & ` .gitattributes`:

I will import the [gitignore](https://www.git-scm.com/docs/gitignore) file from [Github template](https://github.com/github/gitignore/blob/master/VisualStudio.gitignore) one, and the [gitattributes](https://www.git-scm.com/docs/gitattributes) file from [dotnet/runtime](https://github.com/dotnet/runtime/blob/master/.gitattributes) and remove the specific lines from the project.
<br>
* `curl -O https://raw.githubusercontent.com/dotnet/runtime/master/.gitattributes`
* `curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/master/VisualStudio.gitignore`

{{< figure src="git-files.png" alt="Cmdline screenshot showing result of previous snippet" >}} 

#### Adding a `global.json`:

Here we know that our team works with .Net Core and for the moment the latest 2.X LTS version.

* `dotnet new globaljson  --sdk-version 2.1.800`

{{< figure src="adding-globaljson.png" alt="Cmdline screenshot showing result of previous snippet" >}} 

For safety reason, we will block to only use the latest LTS in our project by following this [doc](https://docs.microsoft.com/en-us/dotnet/core/tools/global-json?tabs=netcore3x#rollforward).

```json
{
  "sdk": {
    "version": "2.1.800",
    "allowPrerelease": false,
    "rollForward": "latestFeature"
  }
}
```

#### Adding a basic project

Before continuing further, we will need to setup a little empty project!

1. Go to `src/` and do a new project: `dotnet new console -n Playground`
{{< figure src="adding-basicproject.png" alt="Cmdline screenshot showing result of previous snippet" >}} 
2. Open the generated project and save the solution file in the root folder
3. Add the other existing files into the solution, (Right click on solution > Add existing item > select them \* Add) and Save
{{< figure src="setup-solution.png" alt="Cmdline screenshot showing result of previous snippet" >}} 
4. Add these solution folders: src, docs, tests  
  a. Move the `Playground` project inside `src`
5. Add a `XUnit Test Project` into the solution folder tests and the corresponding physical folder
6. Add a `.Net Standard class library` into the solution folder `src` and the corresponding physical folder
7. Link everything correctly
8. Build

Now we have a basic but solid base ground to continue our work, we have:

* Clean folder structure
* Clean .Net friendly git setup
* Failsafe .Net Core environment

### Making the IDE your friend

In the developer worlds, there are two kinds of developer: the one who use IDE and the one that use editor. The first kind prefers to have a one tools for all, the second one use multiple light tools with automated behavior. Happily, for us most of .Net Software Engineer use IDEs for the sake of the learning curve and Microsoft support: Visual Studio. But do they use it fully? Let make the usage percentage from 10% to 15%!
Before putting or hand in the oils, what can we do with it? Remember your notes from the last experiment with your friends?
Let’s take a look:

> * He had to setup Visual Studio correctly for the app.
> * He didn’t find the documentation about the needed Visual Studio extensions
> * He had problem to follow the code convention
> * He used dangerous behavior in his code
> * He created a project using a to advanced runtime
> * ?

#### Adding a Visual Studio Configuration files

Go to the `Solution > right click > Installation Configuration File`

{{< figure src="adding-vsconfig-prompt_01.png" alt="Cmdline screenshot showing result of previous snippet" >}} 

{{< figure src="adding-vsconfig-prompt_02.png" alt="Cmdline screenshot showing result of previous snippet" >}} 

But before, review the configuration to only include what the project needs:

* .NET Core cross-platform development
* Other for the fun?
* Export it!

{{< figure src="adding-vsconfig-prompt_03.png" alt="Cmdline screenshot showing result of previous snippet" >}} 
<br>
#### Adding a coding convention

We will follow the one used by Microsoft .Net Core teams for simple reason: first all the code your will read from their documentation will be the same as the one used at [https://source.dot.net/](https://source.dot.net/) as the one in the .Net Core context!

* `curl -O https://raw.githubusercontent.com/dotnet/runtime/master/.editorconfig`

Don’t forget to add the file in the `Solution Items` folder too!

#### Add the Teams VS extensions

Now that we have a coding convention, it could be wise to make it easy to follow. How? By using some useful Visual Studio extensions :-)
You can find them on the [dedicated marketplace](https://marketplace.visualstudio.com/), for now we will use the one that we introduced into Titan project, as:

* [Format document on Save](https://marketplace.visualstudio.com/items?itemName=mynkow.FormatdocumentonSave): to help use to make it automatic and headache free
* [Editor Guidelines](https://marketplace.visualstudio.com/items?itemName=PaulHarrington.EditorGuidelines): to setup + see the maximum length of a line of code
* [Indent Guides](https://marketplace.visualstudio.com/items?itemName=SteveDowerMSFT.IndentGuides): to see easily scopes
* [Trailing Whitespace Visualizer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.TrailingWhitespaceVisualizer): to spot unwanted space
* [Visual Studio Spell Checker (VS2017 and Later)](https://marketplace.visualstudio.com/items?itemName=EWoodruff.VisualStudioSpellCheckerVS2017andLater): to correct our English
* [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.VSIntelliCode): to help use with the Intellisence
* [File Icons](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.FileIcons): to help us to distinguish more easily the type of file
* [Extension Manager 2019](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.ExtensionManager2019): to make easy to setup everything

After having installed everything you can go to the `Solution > right click > Manage Extensions` and save the file (Playground.vsext) in the root folder.
{{< figure src="setting-vsaddons.png" alt="Cmdline screenshot showing result of previous snippet" >}} 

The only things know to document in our Team charter is to install at minima the Extension Manager 2019 extension and that it’s.
Of course each extension has it own set of settings that you can export/save, be free to do so.

{{< figure src="vsview-customaddonsetting" alt="Cmdline screenshot showing result of previous snippet" >}} 
<br>
#### Adding a \`one for all\` configuration file

After all this simple advancement, let’s begin to touch Visual Studio and MsBuild configuration file, can we? The goal will be to help VS to know where is the source code folder, what configuration we want to apply to them etc.. If you want to learn more about it, check [this](https://docs.microsoft.com/en-us/visualstudio/msbuild/customize-your-build?view=vs-2019) out!

##### Create a `Directory.Build.props` in the root folder.

``` xml
<Project TreatAsLocalProperty="RepoRoot">
  <PropertyGroup>
    <ImportDirectoryBuildProps>false</ImportDirectoryBuildProps>
  </PropertyGroup>

  <PropertyGroup>
    <RepoRoot>$([MSBuild]::EnsureTrailingSlash('$(MSBuildThisFileDirectory)'))</RepoRoot>
    <RepositoryEngineeringDir>$([MSBuild]::NormalizeDirectory('$(RepoRoot)', 'eng'))</RepositoryEngineeringDir>
  </PropertyGroup>

  <Import Project="$(RepositoryEngineeringDir)Configurations.props" />
</Project>
```

Here we define that the main root folder musn’t be seen as the root source code one, so not imported and seen as the `RepoRoot`. We define the engineering folder and a `Configuration.props` configuration properties file.

##### Create a ` Directory.Build.targets` in the root folder too.

``` xml
<Project>
  <PropertyGroup>
    <!--
    For non-SDK projects that import this file and then import Microsoft.Common.targets,
    tell Microsoft.Common.targets not to import Directory.Build.targets again
    -->
    <ImportDirectoryBuildTargets>false</ImportDirectoryBuildTargets>
  </PropertyGroup>
</Project>
```

##### Adding the configuration file

``` xml
<!-- Package configuration -->
  <PropertyGroup>
    <Company>Mantu</Company>
    <Product>Automation.Playground</Product>
    <Authors>DevOps</Authors>
    <RepositoryUrl>https://tfs.amaris.com/tfs/ITArchitecture/DevOps/_git/Automation.Playground</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
  </PropertyGroup>
```

Here we setup some global configuration settings as the team name, product name and repository url etc.. Mostly used in the assembly and nuget package output :-)
*PS: using \`latest\` in your option could break your build in the CI in some rare cases!*

``` xml
<!-- Language configuration -->
  <PropertyGroup>
    <LangVersion>latest</LangVersion>
    <Deterministic>true</Deterministic>
  </PropertyGroup>
```

This one permit us to setup for all projects inside the solution which version of the C# language we want to use and asking the compiler to make a [deterministic](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-options/deterministic-compiler-option) build (*for example only\**).

``` xml
<!-- Build configuration -->
  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|AnyCPU'">
    <CheckForOverflowUnderflow>true</CheckForOverflowUnderflow>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Release|AnyCPU'">
    <CheckForOverflowUnderflow>true</CheckForOverflowUnderflow>
  </PropertyGroup>
```

To finish we add some build configuration for the fun 👿

##### Adding source code analyzers

One of the most famous things about .Net world are the [source code analyzers](https://docs.microsoft.com/en-us/visualstudio/code-quality/roslyn-analyzers-overview?view=vs-2019) who help developer to detect, explain and in the best case fix know problems. We will setup ` StyleCop.Analyzers` and ` FxCopAnalyzers`.

###### Create a ` Analyzers.props` in the `eng` folder.

*For .Net Framework related*

``` xml
<Project>
  <PropertyGroup>
    <CodeAnalysisRuleset>$(MSBuildThisFileDirectory)CodeAnalysis.ruleset</CodeAnalysisRuleset>
    <RunAnalyzersDuringBuild>false</RunAnalyzersDuringBuild>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.FxCopAnalyzers" Version="3.0.0" PrivateAssets="all">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta.261" PrivateAssets="all">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
  </ItemGroup>
</Project>
```
<br>
*For .Net Core related (need .Net 5 SDK installed locally)*
<br>
``` xml
<Project>
  <PropertyGroup>
    <CodeAnalysisRuleset>$(MSBuildThisFileDirectory)CodeAnalysis.ruleset</CodeAnalysisRuleset>
    <AnalysisLevel>latest</AnalysisLevel>
    <AnalysisMode>AllEnabledByDefault</AnalysisMode>
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="5.0.*" PrivateAssets="all" />
    <PackageReference Include="StyleCop.Analyzers" Version="1.2.*-*" PrivateAssets="all" />
  </ItemGroup>
</Project>
```
<br>
###### Create a ` Analyzers.test.props` in the `eng` folder.
<br>
``` xml
<Project>
    <PropertyGroup> 
    	<CodeAnalysisRuleset>$(MSBuildThisFileDirectory)CodeAnalysis.test.ruleset</CodeAnalysisRuleset>
    	<RunAnalyzersDuringBuild>false</RunAnalyzersDuringBuild>
    </PropertyGroup>
</Project>
```
<br>
Of course, we need to import it too we need to add this line into the root props file

``` xml
  <Import Project="$(RepositoryEngineeringDir)Analyzers.props" /> 
  <Import Project="$(RepositoryEngineeringDir)Analyzers.test.props" Condition="'$(IsTestProject)' == 'true'"/>
```

##### Import ` CodeAnalysis.ruleset` & `CodeAnalysis.test.ruleset` in the `eng` folder.

Something hard to do when you arrive in the world of source code analysis are the rules.. Here we will follow the one from Microsoft .Net Core team too (for the ease)

*For .Net Framework*

* `curl -O`[`https://raw.githubusercontent.com/dotnet/runtime/83e56c474af7127d2909e5d4a11400964abb3ac9/eng/CodeAnalysis.ruleset`](https://raw.githubusercontent.com/dotnet/runtime/83e56c474af7127d2909e5d4a11400964abb3ac9/eng/CodeAnalysis.ruleset)
* `curl -O`[`https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.test.ruleset`](https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.test.ruleset)

*For .Net Core*

* `curl -O`[`https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.ruleset`](https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.ruleset)
* `curl -O`[`https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.test.ruleset`](https://raw.githubusercontent.com/dotnet/runtime/master/eng/CodeAnalysis.test.ruleset)

<br>
##### Linking our configuration file

Now that we have setup all our basic, we still need to tell which folder is what. You don't want to run test.rules on your Web/Api project =P
<br>
###### Create a `Directory.Build.props` & ``Directory.Build.targets ``in the `src` folder.

``` xml
<Project>
  <Import Project="..\Directory.Build.props" />

  <!-- Common properties -->
  <PropertyGroup>
    <IsTestProject>false</IsTestProject>
  </PropertyGroup>
</Project>
```
<br>
``` xml
<Project>
  <Import Project="..\Directory.Build.targets" />
</Project>
```
<br>
###### Create a `Directory.Build.props` & `Directory.Build.targets` in the `test` folder.
<br>
``` xml
<Project>
	<Import Project="..\Directory.Build.props" /> 
	<!-- Common properties -->
	<PropertyGroup>
		<IsTestProject>true</IsTestProject> 
	</PropertyGroup> 
</Project>
```
<br>
<br>
``` xml
<Project>
	<Import Project="..\Directory.Build.targets" />
</Project>
```
<br>
### Using an existing battleground

Sometime we don't have the luck to have green-space project but this don't mean we can't do it to.
Begin the process of preparing the battleground, after creating the new needed folders you will needs to move all the stuff around. For this I advice you to use `git mv` ([doc](https://git-scm.com/docs/git-mv)), why? Git need to know where the file was and where it goes, to permit your team to have a painless experience of moving/renaming files. (and allow the tracking too)

In some lines:

* Do a clean (in VS, dotnet cmd or even git)
* Create the base structure folder
* Move folder/file with [git mv](https://git-scm.com/docs/git-mv)
* Edit your sln file to update the csproj link
* Update your nuget path/restore by [reinstalling](https://docs.microsoft.com/en-us/nuget/consume-packages/reinstalling-and-updating-packages) them
* Update your `.gitignore` file
* Follow the rest of this post :-)

### After pushing the modification

After that the SE have pull the change, it's adviced to run:

* `dotnet clean XXX.sln`, to remove temporary build & cache files
* <span class="colour" style="color:rgba(0, 0, 0, 0.9)">`git clean -f -d -x -e src/`</span>**`/`*`.csproj.user -e .vs`*`/ -e tools/`**<span class="colour" style="color:rgba(0, 0, 0, 0.9)">`/*.csproj.user `</span>**`-e tests/`**<span class="colour" style="color:rgba(0, 0, 0, 0.9)">`/*.csproj.user -n`, to check any untracked files who could have been miss</span>
    * <span class="colour" style="color:rgba(0, 0, 0, 0.9)">if nothing important is displayed, please redo it without the `-n`, to remove any files not needed</span>

### To sum up

If you followed this series of "how to automate", you could ask yourself why we need to have a structured repository structure?
Consequences of these changes aren't visible directly but here are they:

* Separation of concern from the repository / code
* CI enabler
    * Faster checkout for release build (need only to checkout `src` folder)
    * Easier CI setup for tests (need only to build and run every project in `tests` folder)
    * Easier & automated PR review
        * Invite groups / people only if a change from a specific folder happens (QC for any `tests/**`  changes, SE for any `src/**` changes etc.)
        * PR Reviewer know the impact of changes
* Guidelines / convention over configuration
* Product cross-team alignment

What we have done:

* Enforce Visual Studio tooling/setup per repository/application
* Enforce code guideline/convention
* Enforce code style guideline/convention
* Enforce quality by setting up analyzer
* Align our SE on the Microsoft code standard
    * Easier to read code from [https://referencesource.microsoft.com/](https://referencesource.microsoft.com/) or [https://source.dot.net/](https://source.dot.net/) or related github
    * Less behavior surprise by using Microsoft.\* packages

<br>
What could be done to improve:

* Use the docs folder to store the public wiki. and setup a [Wiki as code](https://docs.microsoft.com/en-us/azure/devops/project/wiki/publish-repo-to-wiki?view=azure-devops&tabs=browser)
* Setup a guideline for the name of tests projects
    * Like, `{NameOfLayer}.{TypeOfTest}.csproj`
        * Application.UT.csproj, Application.IT.csproj, Application.FZ.csproj..
* ?

### Open questions

* It would be interesting to have a TFS template repository (as [Github do](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-template-repository)) to have a clean updated out-of-the-box experience. How can we do it?
* Analyzer rules and other configuration could be centralized as the [dotnet/arcade](https://github.com/dotnet/arcade) project, with git subtree or manually sync, and maintained by the *Engineering Manager* and *Product Architect*

<br>
- - -

After settings all the necessary software, we still miss some point as:

* Documentation
    * for our Teams
    * for our Users
* Scripting
    * for our Team
* Enforcing the rules, locally or remotely (CI)

In the next article `Automation 103` I will present you an example of  scripting for making the developer environment setup, how to test it and how to enforce some of our today work.

Photo by [Rob Lambert](https://unsplash.com/@roblambertjr?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/collections/10591022/industrial?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)