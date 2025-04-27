---
title: Linux
date: 2025-04-02
updated: 2025-04-02
tags: [linux, commands, operating-system, ubuntu]
category: operating-systems
---

# Linux

## Table of Contents
<!-- This section will be automatically generated -->

## Overview
This is a collection of my linux based learnings since summer 2024. I have been studying from a variety of sources, mainly the internet, boot.dev, claude for helpful comments and of course some old school paper!
The OS of choice is Ubuntu, with my interest in cyber security i have dabbled with kali, but lets stick to more solid understandings of ubuntu, of course alot of commands work on both, because linux is awesome!  

## Fundamentals
Some of the basic Linux commands I initially wrote down, and some that I have actually used a lot!

### System Information
Some of the most basic and useful tools in Linux are just a few characters away, quicker than going via control panel in Windows!

**First commands to know ** 
```
cd <path> - change directory, no path = $HOME, 'cd -' returns to previous dir
history - will show all command per terminal, use grep! ( history | grep cd )
ctrl + r - search back through command history
ctrl + L - clears console (clear - also works)
```

**Commands list**
```
who - show all logged in users
whoami - show current username
uname - OS name and hardware details
hostname - current host name
pwd - show the present working directory
```

### System Resources
**Purpose**: There is a lot of useful information inside your computer. These are some of the easiest ways to extract that information in Linux.

**Show system pheriphals**: 
```
lsblk - show all block devices (#storage)
lsusb - show all connected USB devices
lsof - show all open files
lspci - show all PCI devices connected (#graphics)
```
**Show system resource usage**
```
top - native system overview
glances - a nice interface to show system resources
ps - process status commonly used with aux (flags: -user)

```
**Show system variables**
```
env - show enviroment variables, grep'n is recomended!
```

**Network tools**
```
ifconfig - show routing, network and interfaces (flags: -a -s)
ip - replcaed ifconfig. 
netstat - network status
ss - socket status 
ping - we all know ping 
traceroute - show the route through the network 
tcpdump - show all tcp connections
wireshare - show network traffic (big topic, another day) #TODO : wireshark
nmap - (Lets do this well another day) #TODO : nmap
```
**Notes**:
- The `ls` prefix stands for "list" so lsblk is list all blk's 
- These commands often need root privileges to show all information

## File System Navigation
Description of basic file management commands in Linux.

### Navigation and Viewing
**Purpose**: Moving around the file system and seeing file content.

**Syntax/Format**: 
```
ls - list directory contents
cd - change directory
cat - view file contents
less - view file contents with pagination
tail - show the last of a file (-n 10 = last 10 lines, -f follows the file)
grep - search for terms in files (upgraded to rgrep) #TODO : rgep 
```
**Example** 
We can use grep to search these .md files for all TODO notes with the command 
- grep linux.md "#TODO"

### File managment
```
touch - create a new file
mkdir - new directory
tree show all files in a tree structure 
mv <current location> <new location>
cp <current file> <new file> 
```
**Example **
cp - all_files/in/here/* move/here/

### Package managment 
** Choice of package managers **
``` 
pkg
apt
```
