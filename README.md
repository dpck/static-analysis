# static-analysis

[![npm version](https://badge.fury.io/js/static-analysis.svg)](https://npmjs.org/package/static-analysis)

`static-analysis` Performs Static Analysis On JavaScript Programs To Find Out All Dependencies That Stem From The Given File.

```sh
yarn add -E static-analysis
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async staticAnalysis(path: string): Array<Detection>`](#async-staticanalysispath-string-arraydetection)
  * [`Detection`](#type-detection)
- [`sort(detections: Array<Detection>)`](#sortdetections-arraydetection-void)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import staticAnalysis from 'static-analysis'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `async staticAnalysis(`<br/>&nbsp;&nbsp;`path: string,`<br/>`): Array<Detection>`

Detects all dependencies in a file and their dependencies recursively. If the package exports `main` over `module`, the `hasMain` property will be added. This function can be useful to find out all files to pass to the Google Closure Compiler, for example, which is what [_Depack_](https://github.com/dpck/depack) does to bundle frontend code and compile Node.js packages.

_For example, for the given file_:
```js
import read from '@wrote/read'
import { resolve } from 'path'
import { render } from 'preact'

const Component = require('./Component');

(async () => {
  const file = await read(resolve('example'))
  render(<Component>{file}</Component>, document.body)
})()
```

_Static Analysis can detect matches using the following script_:
```js
/* yarn example/ */
import staticAnalysis from 'static-analysis'

(async () => {
  const res = await staticAnalysis('example/source.js')
  console.log(res)
})()
```
```js
[ { entry: 'node_modules/@wrote/read/src/index.js',
    packageJson: 'node_modules/@wrote/read/package.json',
    version: '1.0.2',
    name: '@wrote/read',
    from: [ 'example/source.js' ] },
  { internal: 'path', from: [ 'example/source.js' ] },
  { entry: 'node_modules/preact/dist/preact.mjs',
    packageJson: 'node_modules/preact/package.json',
    version: '8.4.2',
    name: 'preact',
    from: [ 'example/source.js' ] },
  { entry: 'example/Component.jsx',
    from: [ 'example/source.js' ] },
  { internal: 'fs',
    from: [ 'node_modules/@wrote/read/src/index.js' ] },
  { entry: 'node_modules/@wrote/read/node_modules/catchment/src/index.js',
    packageJson: 'node_modules/@wrote/read/node_modules/catchment/package.json',
    version: '3.2.1',
    name: 'catchment',
    from: [ 'node_modules/@wrote/read/src/index.js' ] },
  { internal: 'stream',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js' ] },
  { entry: 'node_modules/erotic/src/index.js',
    packageJson: 'node_modules/erotic/package.json',
    version: '2.0.2',
    name: 'erotic',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js' ] },
  { entry: 'node_modules/@wrote/read/node_modules/@artdeco/clean-stack/src/index.js',
    packageJson: 'node_modules/@wrote/read/node_modules/@artdeco/clean-stack/package.json',
    version: '1.0.1',
    name: '@artdeco/clean-stack',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js' ] },
  { entry: 'node_modules/@wrote/read/node_modules/catchment/src/lib/index.js',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js' ] },
  { entry: 'node_modules/erotic/src/lib.js',
    from: 
     [ 'node_modules/erotic/src/index.js',
       'node_modules/erotic/src/callback.js' ] },
  { entry: 'node_modules/erotic/src/callback.js',
    from: [ 'node_modules/erotic/src/index.js' ] },
  { entry: 'node_modules/erotic/node_modules/@artdeco/clean-stack/src/index.js',
    packageJson: 'node_modules/erotic/node_modules/@artdeco/clean-stack/package.json',
    version: '1.0.1',
    name: '@artdeco/clean-stack',
    from: [ 'node_modules/erotic/src/callback.js' ] },
  { internal: 'os',
    from: 
     [ 'node_modules/erotic/node_modules/@artdeco/clean-stack/src/index.js',
       'node_modules/@wrote/read/node_modules/@artdeco/clean-stack/src/index.js' ] } ]
```

__<a name="type-detection">`Detection`</a>__: The module detection result.

|    Name     |         Type          |                                                               Description                                                               |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| entry       | _string_              | The path to the JavaScript file to be required. If an internal Node.js package is required, it's name is found in the `internal` field. |
| __from*__   | _Array&lt;string&gt;_ | The file in which the dependency was found.                                                                                             |
| packageJson | _string_              | The path to the `package.json` file of the dependency if it's a module.                                                                 |
| name        | _string_              | The name of the package.                                                                                                                |
| version     | _string_              | The version of the package.                                                                                                             |
| internal    | _string_              | If it's an internal NodeJS dependency, such as `fs` or `path`, contains its name.                                                       |
| hasMain     | _boolean_             | Whether the entry from the package was specified via the `main` field and not `module` field.                                           |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `sort(`<br/>&nbsp;&nbsp;`detections: Array<Detection>,`<br/>`): void`

Sorts the detected dependencies into commonJS modules, packageJsons and internals.

```js
import staticAnalysis, { sort } from 'static-analysis'

(async () => {
  const d = await staticAnalysis('example/source.js')
  const sorted = sort(d)
  console.log(sorted)
})()
```
```js
{ commonJsPackageJsons: [],
  packageJsons: 
   [ 'node_modules/@wrote/read/package.json',
     'node_modules/preact/package.json',
     'node_modules/@wrote/read/node_modules/catchment/package.json',
     'node_modules/erotic/package.json',
     'node_modules/@wrote/read/node_modules/@artdeco/clean-stack/package.json',
     'node_modules/erotic/node_modules/@artdeco/clean-stack/package.json' ],
  commonJs: [],
  js: 
   [ 'node_modules/@wrote/read/src/index.js',
     'node_modules/preact/dist/preact.mjs',
     'example/Component.jsx',
     'node_modules/@wrote/read/node_modules/catchment/src/index.js',
     'node_modules/erotic/src/index.js',
     'node_modules/@wrote/read/node_modules/@artdeco/clean-stack/src/index.js',
     'node_modules/@wrote/read/node_modules/catchment/src/lib/index.js',
     'node_modules/erotic/src/lib.js',
     'node_modules/erotic/src/callback.js',
     'node_modules/erotic/node_modules/@artdeco/clean-stack/src/index.js' ],
  internals: [ 'path', 'fs', 'stream', 'os' ],
  deps: 
   [ '@wrote/read',
     'preact',
     'catchment',
     'erotic',
     '@artdeco/clean-stack',
     '@artdeco/clean-stack' ] }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>
      © <a href="https://artd.eco">Art Deco</a> for <a href="https://artd.eco/depack">Depack</a>
      2019
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif" alt="Tech Nation Visa" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
    </th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>