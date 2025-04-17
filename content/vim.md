---
title: Vim
date: 2025-04-02
updated: 2025-04-02
tags: [vim, text-editor, linux, productivity]
category: tools
---

# Vim edited

## Table of Contents
<!-- This section will be automatically generated -->

## Overview
Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.

## Basic Navigation
Moving around in Vim requires understanding its modal nature and keyboard shortcuts.

### Modes
**Purpose**: Vim operates in different modes for different tasks.

**Main Modes**: 
```
Normal Mode - Default mode for navigation and commands
Insert Mode - For inserting/editing text
Visual Mode - For selecting text
Command Mode - For entering commands with ":"
```

**Examples**:
```
Press 'i' to enter Insert mode from Normal mode
Press <Esc> to return to Normal mode from any other mode
Press 'v' to enter Visual mode from Normal mode
```

**Notes**:
- Always know which mode you're in (check bottom of screen)
- <Esc> is your safe key - when in doubt, press it to return to Normal mode

### Movement Commands
**Purpose**: Efficiently navigate through text without using a mouse.

**Syntax/Format**: 
```
h - move cursor left
j - move cursor down
k - move cursor up
l - move cursor right
w - jump to start of next word
b - jump to start of previous word
0 - jump to start of line
$ - jump to end of line
```

**Examples**:
```
5j - move down 5 lines
3w - move forward 3 words
2b - move back 2 words
```

**Notes**:
- Combine numbers with commands to repeat them
- These commands only work in Normal mode

## Text Editing
Basic commands for editing text in Vim.

### Inserting Text
**Purpose**: Enter text editing mode.

**Syntax/Format**: 
```
i - insert before cursor
a - insert after cursor
I - insert at beginning of line
A - insert at end of line
o - open new line below cursor
O - open new line above cursor
```
**Examples of barbaric things going on here!!! **:
ohh well send this does it appear???



**Examples**:
```
i Hello<Esc> - insert the word "Hello" and return to Normal mode
A world<Esc> - append " world" at the end of the current line
```

**Notes**:
- Always return to Normal mode after editing by pressing <Esc>
- Most Vim users spend most of their time in Normal mode, entering Insert mode briefly to make changes

### Deleting Text
**Purpose**: Remove text efficiently.

**Syntax/Format**: 
```
x - delete character under cursor
dd - delete current line
dw - delete from cursor to end of word
d$ - delete from cursor to end of line
```

**Examples**:
```
3dd - delete 3 lines
d2w - delete 2 words forward
```

**Notes**:
- Deleted text is copied to a register and can be pasted
- Combine numbers with delete commands to delete multiple items
