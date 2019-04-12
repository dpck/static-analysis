## manual import
import Fixture from '@idio/preact-fixture/src'

/* expected */
[
  {
    "entry": "node_modules/@idio/preact-fixture/src/index.js",
    "package": "@idio/preact-fixture",
    "from": [
      "test/temp/test.js"
    ]
  },
  {
    "entry": "node_modules/preact/dist/preact.mjs",
    "packageJson": "node_modules/preact/package.json",
    "version": "8.4.2",
    "name": "preact",
    "from": [
      "node_modules/@idio/preact-fixture/src/index.js"
    ]
  },
  {
    "entry": "node_modules/@idio/preact-fixture/src/Test.jsx",
    "package": "@idio/preact-fixture",
    "from": [
      "node_modules/@idio/preact-fixture/src/index.js"
    ]
  }
]
/**/

## returns fields
import Zoroaster from 'zoroaster'
import Fixture from '@idio/preact-fixture'

/* options */
{
  "fields": ["license", "author"],
  "shallow": true
}
/**/

/* expected */
[
  {
    "entry": "node_modules/zoroaster/build/index.js",
    "packageJson": "node_modules/zoroaster/package.json",
    "version": "3.11.4",
    "name": "zoroaster",
    "hasMain": true,
    "license": "MIT",
    "author": "Anton <anton@adc.sh>",
    "from": [
      "test/temp/test.js"
    ]
  },
  {
    "entry": "node_modules/@idio/preact-fixture/src/index.js",
    "packageJson": "node_modules/@idio/preact-fixture/package.json",
    "version": "1.0.0",
    "name": "@idio/preact-fixture",
    "license": "MIT",
    "author": "Anton <anton@adc.sh>",
    "from": [
      "test/temp/test.js"
    ]
  }
]
/**/

## skips recursion
import r from '../fixture/recursion'

/* expected */
[{
  "entry": "test/fixture/recursion/index.js",
  "from": [
    "test/temp/test.js"
  ]
},
{
  "entry": "test/fixture/recursion/node_modules/recursion/index.js",
  "packageJson": "test/fixture/recursion/node_modules/recursion/package.json",
  "name": "recursion",
  "from": [
    "test/fixture/recursion/index.js"
  ],
  "version": "1.0.0"
}]
/**/