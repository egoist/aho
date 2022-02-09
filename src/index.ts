import {
  ensureDirSync,
  getTempDir,
  runCommand,
  fetchJSON,
  moveSync,
  emptyDirSync,
  joinPath,
} from './lib'

export class PrettyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }
}

export async function extract(
  from: string,
  to: string,
  { path }: { path?: string },
) {
  const tempDir = getTempDir() + `/aho_temp_${Date.now()}`
  ensureDirSync(tempDir)
  const cmd = ['tar', 'xvzf', from, '-C', tempDir, '--strip-components', '1']
  await runCommand(cmd)
  emptyDirSync(to)
  moveSync(path ? joinPath(tempDir, path) : tempDir, to)
}

export function parseRepo(input: string) {
  const [_repo, tag] = input.split('#')
  const [, owner, repoName, subpath = ''] =
    /^([\w\-\.]+)\/([\w\-\.]+)(\/.+)?$/.exec(_repo)!
  return { owner, repoName, subpath: subpath.slice(1), tag }
}

export async function getDefaultBranchFromApi(repo: string): Promise<string> {
  const data = await fetchJSON(`https://api.github.com/repos/${repo}`)
  return data.default_branch
}
