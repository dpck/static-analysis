## API

The package is available by importing its default function:

```js
import staticAnalysis from 'static-analysis'
```

%~%

```## async staticAnalysis => Array<Detection>
[
  ["path", "string"]
]
```

Detects all dependencies in a file and their dependencies recursively. If the package exports `main` over `module`, the `hasMain` property will be added.

_For example, for the given file_:
%EXAMPLE: example/source.js, ../src => static-analysis%

_Static Analysis can detect matches using the following script_:
%EXAMPLE: example/example.js, ../src => static-analysis%
%FORK-js example example/example%

%TYPEDEF types/index.xml%

%~%