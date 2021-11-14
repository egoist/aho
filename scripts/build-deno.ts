import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'

async function main() {
  const files = await glob(['src/**/*.ts', '!**/.*', '!**/node'], {})
  await Promise.all(
    files.map(async (file) => {
      const content = await fs.promises.readFile(file, 'utf-8')
      const outFile = file.replace('src', 'deno')
      await fs.promises.mkdir(path.dirname(outFile), { recursive: true })
      await fs.promises.writeFile(
        outFile,
        content.replace('./node/lib', './deno/lib.ts'),
        'utf8',
      )
    }),
  )
}

main()
