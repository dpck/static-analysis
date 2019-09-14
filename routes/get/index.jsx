import { relative } from 'path'
import render from '@depack/render'
import detect from '../../src'

/** @type {import('koa').Middleware} */
const index = async (ctx) => {
  // /** @type {Array<import('../../src').Detection>} */
  // const staticAnalysis = ctx.staticAnalysis
  // const { relative: relPath } = ctx
  const relPath =  '../../idiocc/koa'
  // const relPath =  '../depack'
  // const staticAnalysis = await detect(`${relPath}/src/bin/depack`)
  const staticAnalysis = await detect(`${relPath}/depack`)
  const deps = staticAnalysis
    .map(({ name, packageJson, version, from, entry }, i) => {
      if (!packageJson) return
      const hasDuplicate = staticAnalysis.some(
        ({ name: n, version: v }, ii) => {
          return n == name && version == v && ii != i
        })
      const hasNameDuplicate = staticAnalysis.some(
        ({ name: n }, ii) => {
          return n == name && ii != i
        })
      return { name, packageJson, version, from, hasDuplicate,
        hasNameDuplicate, entry }
    })
    .filter(Boolean)
    .sort(({ name: a }, { name: b }) => {
      if (a > b) return 1
      if (b > a) return -1
      return 0
    })
  ctx.body = render(<html>
    <head>
      <title>Static Analysis</title>
    </head>
    <body>
      {deps.map(({ name, version, from, hasDuplicate, hasNameDuplicate, entry }, i) => {
        return <div key={`${i}`}>
          <details open>
            <summary style={`${hasDuplicate ? 'background: yellow' : ''}`}>
              <strong>
                <span style={`${hasNameDuplicate ? 'background: red' : ''}`}>
                  {name}
                </span>
                {version}
              </strong>
              <pre style="display:inline;opacity:.5"> {relative(relPath, entry)}</pre>
            </summary>
            <DepsTree staticAnalysis={staticAnalysis} fullTree={deps} from={from} relPath={relPath} />
          </details>
        </div>
      })}
    </body>
  </html>)
}

const Label = ({ name, version }) => {
  if (!name) return null
  return <span>[{name}{version}]</span>
}

const findEntryPackage = (staticAnalysis, entry) => {
  const entryRecord = staticAnalysis
    .find(({ entry: e }) => e == entry)
  if (!entryRecord) return undefined
  if (entryRecord.name) return entryRecord
  if (entryRecord.package) return entryRecord
}

const DepsTree = ({
  staticAnalysis, fullTree, from, relPath, level = 0,
}) => {
  return <div>
    {from.map((fromEntry, j) => {
      const t = relative(relPath, fromEntry)
      const entryRecord = findEntryPackage(staticAnalysis, fromEntry)
      return <div style="padding-left:1rem" key={j}>
        - {t} {entryRecord && <Label {...entryRecord}/>}
        {(entryRecord && level < 5) &&
          <DepsTree staticAnalysis={staticAnalysis} fullTree={fullTree} from={entryRecord.from} relPath={relPath} level={level+1} />
        }
      </div>
    })}
  </div>
}


// {newTree.map(({ name, version, from, entry }, i) => {
//   return <DepsTree
//     fullTree={fullTree} from={from} relPath={relPath} key={i}
//     name={name} version={version} entry={entry} />
// })}

{/* <Label name={name} version={version}/> */}
// - {entry && relative(relPath, entry)}


export default index

export const aliases = ['/']