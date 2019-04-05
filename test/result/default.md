## manual import
import Fixture from '@idio/preact-fixture/src'

/* expected */
[
  {
    "entry": "node_modules/@idio/preact-fixture/src/index.js",
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