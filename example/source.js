import { read } from '@wrote/read'
import { resolve } from 'path'
import { render } from 'preact'

const Component = require('./Component');

(async () => {
  const file = await read(resolve('example'))
  render(<Component>{file}</Component>, document.body)
})()
