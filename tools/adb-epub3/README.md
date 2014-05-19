adb-epub-tools.sh
=================

These tools are for generating and versioning an early proof-of-concept of an actionable databook framework that uses xAPI in the EPUB3 format via the xapiwrapper.js file.

The bash script requires a GUN/Linux based operating system such as Ubuntu. It will not run properly in an OSX environment because of the GNU extensions on sed (specifically the -i flag).

A build is included if your convenience. You can open this file with your archive manager to have a look at what gets built.

It's not advised that you publish a book using this template as it will not yet gracefully degrade in readers that do not support javascript. Another project has been started to address this issue.
