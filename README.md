![Logo](admin/smartvisu.png)
# ioBroker.smartvisu

[![Greenkeeper badge](https://badges.greenkeeper.io/Apollon77/ioBroker.smartvisu.svg)](https://greenkeeper.io/)
![Number of Installations](http://iobroker.live/badges/smartvisu-installed.svg) ![Number of Installations](http://iobroker.live/badges/smartvisu-stable.svg) [![NPM version](http://img.shields.io/npm/v/iobroker.smartvisu.svg)](https://www.npmjs.com/package/iobroker.smartvisu)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smartvisu.svg)](https://www.npmjs.com/package/iobroker.smartvisu)
[![Code Climate](https://codeclimate.com/github/Apollon77/ioBroker.smartvisu/badges/gpa.svg)](https://codeclimate.com/github/Apollon77/ioBroker.smartvisu)

**Tests:** Linux/Mac: [![Travis-CI](http://img.shields.io/travis/Apollon77/ioBroker.smartvisu/master.svg)](https://travis-ci.org/Apollon77/ioBroker.smartvisu)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Apollon77/ioBroker.smartvisu?branch=master&svg=true)](https://ci.appveyor.com/project/Apollon77/ioBroker-smartvisu/)

[![NPM](https://nodei.co/npm/iobroker.smartvisu.png?downloads=true)](https://nodei.co/npm/iobroker.smartvisu/)


This adapter allows to run SmartVISU (http://www.smartvisu.de/) in ioBroker.

**You also need to have the SocketIO-Adapter installed on the same machine**

SmartVISU (https://github.com/Martin-Gleiss/smartvisu) is ... (some more conten here? :-)

The adapter needs PHP-CGI on the computer where it runs because SmartVISU is based on PHP.
Some more information on the PHP requirements can be found below.

## SmartVisu ioBroker Example
By Default the Adapter will install a slightly customized pre-version of SmartVisu 2.9. An "ioBroker SocketIO" driver is included to connect to the ioBroker data. The driver is configured by default to connect to the SocketIO port 8084 on the same host where the SmartVISU adapter is running too. You can change the configuration in SmartVISU UI or by editing config.ini

Additionally a small example page called "iobroker" is installed which shows some example datapoints from ioBroker. This can be your starting point to customize the pages and templates.

More information and support to create and customize the pages can be found ... ??

## Customize SmartVisu
You can find additional information on SmartVISU and steps to customize at https://github.com/Martin-Gleiss/smartvisu/blob/master/readme.md

... ?? More?

## SmartVISU requirements
The directory where the SmartVISU files are in needs to be writeable for the ioBroker user. Especially the config.ini file.
When Page caching is used then the "temp" folder in SmartVISU directory needs to be writeable too.

## Adapter Configuration/Parameter

### Server port
This is the port of the SmartVISU server that will be started to serve the visualization.
The default port is 8100 and can be changed as needed. Please consider the already used other ports in ioBroker!

### Document-Root (Doc-Root)
Here you can specify the directory where the SmartVISU files are located. There are multiple options for the values:
* When left empty the files will be placed in a directory "smartvisu_<instancenumber of adapter>" under iobroker-data in the ioBroker basic Directory
* When you enter a name which is not an absolute path (starting with a "/" or such) then this directory is created unter iobroker-data in the ioBroker basic Directory
* When you enter an absolute directory (starting with a "/" or a drive letter like "C:/") then this directory will be used
In general the adapter will check on start if the given project exists. If not it will be created and all needed SmartVISU files will be copied into this directory. If the directory exists the adapter will change nothing (for now).
The given directory needs to be writeable by the ioBroker user!

### PHP-CGI Path
The Adapter needs an installed php-cgi (see below). If the executable (php-cgi for Linux/Mac and php-cgi.exe for Windows) is in your PATH then you can leave this setting empty. If needed you can enter the location of the executable here and this will be used.

## PHP Installations

### Linux
For Linux you can use apt-get to install PHP. Depending on your OS different versions are available.
Potentially you need to use an PPA (e.g. https://launchpad.net/~ondrej/+archive/ubuntu/php) to get a current PHP version (7.x recommended!)

On Ubuntu systems you could get a PHP 7.1 by using:

```
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install php7.1-cgi
```

### macOS
For macOS the easiest way to go is to use "homebrew-php" (https://github.com/Homebrew/homebrew-php)

You can get PHP 7.1. e.g. by using:
```
brew tap homebrew/homebrew-php
brew update
brew install --with-cgi php71
export PATH="$(brew --prefix homebrew/php/php71)/bin:$PATH"
```
If the path export is not working for the ioBroker running you may need to enter the php-cgi path directly into the adapter configuration.
You can get the path by

```
which php-cgi
```

### Windows
Download a PHP-for-WIndows package from http://windows.php.net/download/ depending on your system (e.g. http://windows.php.net/downloads/releases/archives/php-7.1.0-Win32-VC14-x64.zip). Recommended is to use a "x64 Thread Safe" build.

Extract into a directory of your choice and add this directory to the system PATH. Alternatively enter the location path of "php-cgi.exe" into the adapter configuration.

### Verify availability of php-cgi for adapter and version
When you have started the adapter you can use http://<host>:<Serverport>/phpinfo.php to see the details of the installed PHP. If you do not get the phpinfo-Page something is wrong with the php-cgi availability.

## Todo
* Define update procedures
* complete README
* update sphp (after they accepted PRs) to fix Windows or patch it

## Changelog

### __WORK IN PROGRESS__
* (Apollon77) Prepare for future js-controller versions

### 0.0.1
* (Apollon77) initial test version

## License
The MIT License (MIT)

Copyright (c) 2017-2018 Apollon77 <ingo@fischer-ka.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
