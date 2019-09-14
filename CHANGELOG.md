## 14 September 2019

### [2.0.0](https://github.com/dpck/static-analysis/compare/v1.8.0...v2.0.0)

- [license] Update to _Tech Nation Sucks_ license.

### [1.8.0](https://github.com/dpck/static-analysis/compare/v1.7.1...v1.8.0)

- [feature] Allow to pass an array of entries.
- [package] Compile the package with _Depack_ to make 0-dep build.

## 25 April 2019

### [1.7.1](https://github.com/dpck/static-analysis/compare/v1.7.0...v1.7.1)

- [types] Add `dependencyMeta` type for _GCC_.

## 24 April 2019

### [1.7.0](https://github.com/dpck/static-analysis/compare/v1.6.0...v1.7.0)

- [feature] Report whether the entry was `required`.

## 19 April 2019

### [1.6.0](https://github.com/dpck/static-analysis/compare/v1.5.1...v1.6.0)

- [types] Publish externs compiled with _Typal_.

## 18 April 2019

### [1.5.1](https://github.com/dpck/static-analysis/compare/v1.5.0...v1.5.1)

- [feature] Update `resolve-dependency` to be able to find `index.js` when present in the root of the package without the _main_ field.

### [1.5.0](https://github.com/dpck/static-analysis/compare/v1.4.0...v1.5.0)

- [feature] Report `package` of dependencies.
- [fix] Prevent recursion.
- [deps] Move `splitFrom` to `@depack/split`.

## 5 April 2019

### [1.4.0](https://github.com/dpck/static-analysis/compare/v1.3.4...v1.4.0)

- [feature] Allow to return fields from _package.json_ files via `FPJ`.

## 4 April 2019

### [1.3.4](https://github.com/dpck/static-analysis/compare/v1.3.3...v1.3.4)

- [deps] Unfix dependencies.

## 2 April 2019

### [1.3.3](https://github.com/dpck/static-analysis/compare/v1.3.2...v1.3.3)

- [doc] Fix JSDoc for return type.
- [deps] Update dependencies.

## 28 March 2019

### [1.3.2](https://github.com/dpck/static-analysis/compare/v1.3.1...v1.3.2)

- [fix] Pass down the options to child entries.

### [1.3.1](https://github.com/dpck/static-analysis/compare/v1.3.0...v1.3.1)

- [fix] Analyse manual imports like `@idio/preact-fixture/src`.

## 27 March 2019

### [1.3.0](https://github.com/dpck/static-analysis/compare/v1.2.0...v1.3.0)

- [feature] Implement soft mode to prevent throwing when a dependency's `package.json` is not found.
- [fix] Show correct error stack with `erotic`.

## 26 March 2019

### [1.2.0](https://github.com/dpck/static-analysis/compare/v1.1.1...v1.2.0)

- [feature] Shallow analysis of `node_modules`.
- [feature] Allow to pass a resolvable path.

## 18 March 2019

### 1.1.0, 1.1.1

- [feature] Allow to ignore `node_modules` packages.
- [fix] Fix incorrect dependencies.

## 11 February 2019

### 1.0.0

- [feature] Add source code, tests and documentation.

## 9 February 2019

### 0.0.0

- Create `static-analysis` with [`My New Package`](https://mnpjs.org)
- [repository]: `src`, `test`
