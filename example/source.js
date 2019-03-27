import read from '@wrote/read'
import { resolve } from 'path'
import { render } from 'preact'
import Fixture from '@idio/preact-fixture/src/Test'

const Component = require('./Component');

(async () => {
  const file = await read(resolve('example'))
  render(<Component>
    {file}
    <Fixture />
  </Component>, document.body)
})()
