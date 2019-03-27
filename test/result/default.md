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