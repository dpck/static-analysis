# static-analysis

[![npm version](https://badge.fury.io/js/static-analysis.svg)](https://npmjs.org/package/static-analysis)

`static-analysis` Performs Static Analysis On JavaScript Programs To Find Out All Dependencies That Stem From The Given File.

```sh
yarn add -E static-analysis
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async staticAnalysis(path: string, config: Config): Array<Detection>`](#async-staticanalysispath-stringconfig-config-arraydetection)
  * [`Config`](#type-config)
  * [`Detection`](#type-detection)
  * [Ignore Node_Modules](#ignore-node_modules)
  * [Shallow Node_Modules](#shallow-node_modules)
  * [Soft Mode](#soft-mode)
- [`sort(detections: Array<Detection>): {}`](#sortdetections-arraydetection-)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import staticAnalysis from 'static-analysis'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `async staticAnalysis(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`config: Config,`<br/>`): Array<Detection>`

Detects all dependencies in a file and their dependencies recursively. It is possible to pass path to the directory which has `index.js` or `index.jsx` files. If the package exports `main` over `module`, the `hasMain` property will be added. This function can be useful to find out all files to pass to the Google Closure Compiler, for example, which is what [_Depack_](https://github.com/dpck/depack) does to bundle frontend code and compile Node.js packages.

__<a name="type-config">`Config`</a>__: The configuration for staticAnalysis.

|    Name     |   Type    |                                             Description                                             | Default |
| ----------- | --------- | --------------------------------------------------------------------------------------------------- | ------- |
| nodeModules | _boolean_ | Whether to include packages from `node_modules` in the output.                                      | `true`  |
| shallow     | _boolean_ | Only report on the entries of `node_module` dependencies, without analysing their own dependencies. | `false` |
| soft        | _boolean_ | Do not throw an error when the dependency cannot be found in `node_modules`.                        | `false` |

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
  { entry: 'node_modules/@artdeco/clean-stack/src/index.js',
    packageJson: 'node_modules/@artdeco/clean-stack/package.json',
    version: '1.0.1',
    name: '@artdeco/clean-stack',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js',
       'node_modules/erotic/src/callback.js' ] },
  { entry: 'node_modules/@wrote/read/node_modules/catchment/src/lib/index.js',
    from: 
     [ 'node_modules/@wrote/read/node_modules/catchment/src/index.js' ] },
  { entry: 'node_modules/erotic/src/lib.js',
    from: 
     [ 'node_modules/erotic/src/index.js',
       'node_modules/erotic/src/callback.js' ] },
  { entry: 'node_modules/erotic/src/callback.js',
    from: [ 'node_modules/erotic/src/index.js' ] },
  { internal: 'os',
    from: [ 'node_modules/@artdeco/clean-stack/src/index.js' ] } ]
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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="15"></a></p>

### Ignore Node_Modules

It is possible to ignore `node_modules` folders. In this case, only dependencies that start with `./` or `/` will be included in the output.

```js
import staticAnalysis from 'static-analysis'

(async () => {
  const res = await staticAnalysis('example/source.js', {
    nodeModules: false,
  })
  console.log(res)
})()
```
```js
[ { entry: 'example/Component.jsx',
    from: [ 'example/source.js' ] } ]
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true" width="15"></a></p>

### Shallow Node_Modules

To only report the entry to the dependency from `node_modules` without analysing its dependency, the `shallow` options can be set.

```js
import staticAnalysis from 'static-analysis'

(async () => {
  const res = await staticAnalysis('example/source.js', {
    shallow: true,
  })
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
    from: [ 'example/source.js' ] } ]
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true" width="15"></a></p>

### Soft Mode

_Static Analysis_ will try to figure out entry points of package dependencies by looking up their `package.json` in the `node_modules` folder. If it cannot find this file, an error will be throw. To prevent the error, and exclude the module from appearing the results, the `soft` mode can be activated.

_With the following file being analysed:_

```jsx
import missing from 'missing'
import { render } from 'preact'

render(<div>Hello World</div>)
```

_The program will throw initially, but will skip the missing dependency in **soft mode**:_

```js
import staticAnalysis from 'static-analysis'

(async () => {
  try {
    const res = await staticAnalysis('example/missing-dep')
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})()

;(async () => {
  const res = await staticAnalysis('example/missing-dep', {
    soft: true,
  })
  console.log('Soft mode on.')
  console.log(res)
})()
```
```js
Error: example/missing-dep.jsx
 [!] Package.json for module missing not found.
    at staticAnalysis (/Users/zavr/depack/static-analysis/src/index.js:14:13)
    at /Users/zavr/depack/static-analysis/example/soft.js:5:23
    at Object.<anonymous> (/Users/zavr/depack/static-analysis/example/soft.js:10:3)
Soft mode on.
[ { entry: 'node_modules/preact/dist/preact.mjs',
    packageJson: 'node_modules/preact/package.json',
    version: '8.4.2',
    name: 'preact',
    from: [ 'example/missing-dep.jsx' ] } ]
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## `sort(`<br/>&nbsp;&nbsp;`detections: Array<Detection>,`<br/>`): {}`

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
     'node_modules/@artdeco/clean-stack/package.json' ],
  commonJs: [],
  js: 
   [ 'node_modules/@wrote/read/src/index.js',
     'node_modules/preact/dist/preact.mjs',
     'example/Component.jsx',
     'node_modules/@wrote/read/node_modules/catchment/src/index.js',
     'node_modules/erotic/src/index.js',
     'node_modules/@artdeco/clean-stack/src/index.js',
     'node_modules/@wrote/read/node_modules/catchment/src/lib/index.js',
     'node_modules/erotic/src/lib.js',
     'node_modules/erotic/src/callback.js' ],
  internals: [ 'path', 'fs', 'stream', 'os' ],
  deps: 
   [ '@wrote/read',
     'preact',
     'catchment',
     'erotic',
     '@artdeco/clean-stack' ] }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>

## Copyright

<table><tr><th><a href="https://artd.eco"><img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" /></a></th><th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://artd.eco/depack">Depack</a> 2019</th><th><a href="https://www.technation.sucks" title="Tech Nation Visa"><img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif" alt="Tech Nation Visa" /></a></th><th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th></tr></table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>