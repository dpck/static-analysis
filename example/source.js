import { read } from '@wrote/read'
import { resolve } from 'path'
import { render } from 'preact'
import Component from './Component'

(async () => {
  const file = await read(resolve('example'))
  render(<Component>{file}</Component>, document.body)
})()
