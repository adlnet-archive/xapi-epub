Preface
=======

While the [EPUB3 specification](http://www.idpf.org/epub/30/spec/epub30-overview.html) includes support of HTML5/CSS/JS as a distributable package file, in practice many readers have poor and/or selective [coverage](http://epubtest.org/results/).

[Section 2.9 Scripting](http://www.idpf.org/epub/30/spec/epub30-overview.html#sec-scripting) of the EPUB3 specification advises:

> EPUB strives to treat content declaratively — as data that can be manipulated, not programs that must be executed

**Notable readers that do not support javascript:**

- Google Play Books
- Kindle (converts epubs to KF8 which does not support javascript)

While it's possible to integrate communication to a [Learning Record Store (LRS)](https://lrs.adlnet.gov/xAPI/) via javascript in an epub file, it's important to understand the risks involved. Using an approach of graceful degradation will limit the likelyhood that a book would become unreadable. This finding led to the development of a [xapi-html5-data-attributes](http://github.com/adlnet/xapi-html5-data-attributes).

Ideally, supporting communication to an LRS at the client (reader) level is preferred, this is still undergoing investigation.


##### Additional caveats to be aware of

- Apple "requires" a .plist file for metadata read by iBooks, which is outside the specification
- CSS in books can be overridden by a reader
- It is important to maintain accessibility
- Browser based readers provide a more robust engine than most readers (if not all), thus providing a false sense of capabilities the EPUB3 format can support


##### Tools
- This [epub validator](http://validator.idpf.org/) will give a sense of how well a book validates against the spec


### The Future

Moving forward, Markdown has been identified as a possible pipeline for publishing, access to information and consistency... details to come.

*README In Progress*
