### Soft Mode

_Static Analysis_ will try to figure out entry points of package dependencies by looking up their `package.json` in the `node_modules` folder. If it cannot find this file, an error will be throw. To prevent the error, and exclude the module from appearing the results, the `soft` mode can be activated.

_With the following file being analysed:_

%EXAMPLE: example/missing-dep, ../src => static-analysis%

_The program will throw initially, but will skip the missing dependency in **soft mode**:_

%EXAMPLE: example/soft, ../src => static-analysis%
%/FORK-js example/soft%

%~ width="25"%