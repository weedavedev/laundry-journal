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
Learnings of Linux and how the master OS works.
Main OS is Ubuntu. 

## Fundamentals
Some of the basic Linux commands I initially wrote down, and some that I have actually used a lot!h bla ksakdasd

### System Information
Some of the most basic and useful tools in Linux are just a few characters away, quicker than going via control panel in Windows!

**Commands list**
```
whoami - show current username
uname - OS name and hardware details
hostname - current host name
pwd - show the present working directory
```

**Examples**:
```
$ whoami
username

$ uname -a
Linux hostname 5.15.0-89-generic #99-Ubuntu SMP Wed Feb 7 12:24:14 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
```

**Notes**:
- These commands work across most Linux distributions
- Many have additional options with flags like `-a` for "all"

### System Resources
**Purpose**: There is a lot of useful information inside your computer. These are some of the easiest ways to extract that information in Linux.

**Syntax/Format**: 
```
lsblk - show all block devices (#storage)
lsusb - show all connected USB devices
lsof - show all open files
lspci - show all PCI devices connected (#graphics)
```

**Examples**:
```
$ lsblk -f
NAME   FSTYPE   LABEL UUID                                 MOUNTPOINT
sda                                                        
├─sda1 ext4           6197e068-42a7-4d0c-aa3a-fd9b0ce87332 /
└─sda2 swap           4f2635d8-e6e0-4c19-8228-23787769c321 [SWAP]
```

**Notes**:
- The `ls` prefix stands for "list"
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
```

**Examples**:
```
$ ls -la
total 20
drwxr-xr-x 3 user user 4096 Apr  2 10:30 .
drwxr-xr-x 6 user user 4096 Apr  2 10:25 ..
-rw-r--r-- 1 user user  123 Apr  2 10:30 example.txt
```

**Notes**:
- Use `cd ..` to move up one directory
- Use `cd ~` to go to your home directory
