```## async staticAnalysis => Array<Detection>
[
  ["path", "string"],
  ["config", "Config"]
]
```

Detects all dependencies in a file and their dependencies recursively. It is possible to pass path to the directory which has `index.js` or `index.jsx` files. If the package exports `main` over `module`, the `hasMain` property will be added. This function can be useful to find out all files to pass to the Google Closure Compiler, for example, which is what [_Depack_](https://github.com/dpck/depack) does to bundle frontend code and compile Node.js packages.

%TYPEDEF types/index.xml Config%

_For example, for the given file_:
%EXAMPLE: example/source.js, ../src => static-analysis%

_Static Analysis can detect matches using the following script_:
%EXAMPLE: example/example.js, ../src => static-analysis%
%FORK-js example example/example%

%TYPEDEF types/index.xml Detection%

%~ width="15"%