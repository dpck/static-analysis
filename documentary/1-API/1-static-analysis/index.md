```## async staticAnalysis => Array<Detection>
[
  ["path", "string"],
  ["config", "Config"]
]
```

Detects all dependencies in a file and their dependencies recursively. It is possible to pass path to the directory which has `index.js` or `index.jsx` files. If the package exports `main` over `module`, the `hasMain` property will be added. This function can be useful to find out all files to pass to the Google Closure Compiler, for example, which is what [_Depack_](https://github.com/dpck/depack) does to bundle frontend code and compile Node.js packages.

- The package does not build an AST, it just looks for `import` and `require` statements using regular expressions. Therefore, there's also no tree-shaking or complete analysis of the real dependencies.
- If a source is imported like `import fn from '@idio/preact/build/fn`, then the analysis will not contain `@idio/preact` as a `node_module` dependency with the `packageJson`, `name` and `version` fields, it will only appear as an entry file.

%TYPEDEF types/index.xml Config%

_For example, for the given file_:
%EXAMPLE: example/source, ../src => static-analysis%

_Static Analysis can detect matches using the following script_:
%EXAMPLE: example, ../src => static-analysis%
%FORK-js example%

%TYPEDEF types/index.xml Detection%

%~ width="15"%