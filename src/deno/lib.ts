import {
  resolve as resolvePath,
  join as joinPath,
} from 'https://deno.land/std@0.114.0/path/mod.ts'
import { writableStreamFromWriter } from 'https://deno.land/std@0.114.0/streams/mod.ts'
import { USER_AGENT } from '../shared.ts'
import { moveSync as _moveSync } from 'https://deno.land/std@0.114.0/fs/move.ts'
import { emptyDirSync } from 'https://deno.land/std@0.114.0/fs/empty_dir.ts'

export { resolvePath, emptyDirSync, joinPath }

export { cac } from 'https://unpkg.com/cac@6.7.12/mod.ts'

export const moveSync = (from: string, to: string) => {
  _moveSync(from, to, { overwrite: true })
}

export const fetchJSON = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
    },
  })
  if (!res.ok) {
    throw new Error(`failed to fetch ${url}: ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export const downloadFile = async (url: string, outFilePath: string) => {
  const res = await fetch(url)
  const file = await Deno.open(outFilePath, { write: true, create: true })
  const writableStream = writableStreamFromWriter(file)
  await res.body?.pipeTo(writableStream)
}

export { ensureDirSync } from 'https://deno.land/std@0.114.0/fs/ensure_dir.ts'

export { existsSync } from 'https://deno.land/std@0.114.0/fs/exists.ts'

export const isEmptyDirSync = (dir: string) => {
  for (const _ of Deno.readDirSync(dir)) {
    return false
  }
  return true
}

export const getTempDir = () => Deno.makeTempDirSync({ prefix: 'aho_' })

export const runCommand = async (cmd: string[]) => {
  const p = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
  })
  const [status, output] = await Promise.all([p.status(), p.output()])
  p.close()

  if (!status.success) {
    throw new Error(`Command failed with status ${status.code}: ${output}`)
  }
}

export const args = ['deno', 'cli', ...Deno.args]

export const exit = Deno.exit

export const getOwnVersion = () => {
  const [, version] = /\@([a-z0-9\.]+)/.exec(import.meta.url) || []
  return version || 'unknown'
}
