adb-epub-tools.sh
=================

These tools are for generating and versioning an early proof-of-concept of an actionable databook framework that uses xAPI in the EPUB3 format via the xapiwrapper.js file.

The bash script requires a GUN/Linux based operating system such as Ubuntu. It will not run properly in an OSX environment because of the GNU extensions on sed (specifically the -i flag).

A build is included if your convenience. You can open this file with your archive manager to have a look at what gets built.

It's not advised that you publish a book using this template as it will not yet gracefully degrade in readers that do not support javascript. Another project has been started to address this issue.

**PLEASE DO NOT DISTRIBUTE BOOKS GENERATED WITH THIS SCRIPT**

This script is helpful for quickly making changes and generating epubs but these books do not yet gracefully degrade and the best practices outlined in the README.md of the root of this repository are not in full effect.

Do study the code and the skeleton of the epub format. File issues if you have questions or suggestions.


### Packaging Notes

The mimetype file is used in the packaging process, then this file is removed from the archive.

A single command to package and epub is as follows: 

```zip -X file.epub mimetype && zip -r file.epub * -x "mimetype"```

The script does that after running through sed based replacement of variables based on book.conf (which is a file that is also not intended to be included in the epub archive.

Archiving the folder on OSX risks including other garbage files, __MACOSX folders, specifically.
