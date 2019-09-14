### Multiple Entries

It's possible to scan multiple files at ones, taking advantage of intermediate caching of results (i.e., after a file has been read ones, it won't be read again, but its `from` field will contain all files that required it).

%EXAMPLE: example/multiple, ../src => static-analysis%
%FORK-js example/multiple%