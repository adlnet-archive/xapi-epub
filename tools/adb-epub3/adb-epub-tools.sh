#!/bin/bash
# Tools for generating and versioning Actionable DataBook epub3 files
# Tested on ubuntu 13.10. sed will not work on OSX due to a difference in the -i flag
# ./adb-epub-tools.sh -b <folder name>
# ./adb-epub-tools.sh -b adb-boilerplate.epub

build() {
	if [[ "$1" == "" ]]; then echo "[!] book directory name required"; exit 0; fi
    if [[ ! -d src/$1 ]]; then echo "[!] src/$1 directory does not exist"; exit 0; fi
    if [[ ! -d build ]]; then echo "[i] build directory does not exist, creating it"; fi
    echo "[i] removing old build directory for book"; rm -r build/$1
    cp -Rv src/$1 build/$1    # copy to build directory
    cd build/$1               # change to build directory
    # run the find/replace
    . book.conf               # source file
    BOOK_UID_GENERATED=${BOOK_UID}_$(date +"%F_%H_%M")
    BOOK_TITLE=${BOOK_TITLE}" "$(date +"%F_%H_%M")
    DATE_F=$(date +"%F")
    DATE_UTC=$(date +"%FT%T%:z")
    sed -i "s/{{AUTHOR_FIRST_NAME}}/$AUTHOR_FIRST_NAME/g;s/{{AUTHOR_LAST_NAME}}/$AUTHOR_LAST_NAME/g;s/{{AUTHOR_NAME}}/$AUTHOR_NAME/g;s/{{BOOK_UID}}/$BOOK_UID_GENERATED/g;s/{{BOOK_TITLE}}/$BOOK_TITLE/g;s/{{BOOK_DESCRIPTION}}/$BOOK_DESCRIPTION/g;s/{{DATE_F}}/$DATE_F/g;s/{{DATE_UTC}}/$DATE_UTC/g;" OEBPS/package.opf
    zip -X file.epub mimetype # zip book
    zip -r file.epub * -x "mimetype" "book.conf"
    # move epub out of book build directory, remove that directory, rename file
    mv file.epub ../${BOOK_UID_GENERATED}.epub
    cd .. && rm -r $1
}

help() {
	echo "read the code";
}

case $1 in
  --build|-b)    build $2;;    # build book from a directory, attempt to version
  *|--help|-h)   help;;
esac
