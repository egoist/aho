import {
  cac,
  downloadFile,
  ensureDirSync,
  existsSync,
  getTempDir,
  isEmptyDirSync,
  resolvePath,
  runCommand,
  fetchJSON,
  args,
  exit,
  getOwnVersion,
  moveSync,
  emptyDirSync,
  joinPath,
} from './node/lib'

export const start = async () => {
  const cli = cac('aho')

  cli
    .command('[repo] [desitination]', 'Download a repo')
    .option(
      '-f, --force',
      `Force override desitination directory even if it's not empty`,
    )
    .option('-p, --path <path>', `Only extract a sub path within the repo`)
    .action(async (_repo, desitination, flags) => {
      if (!_repo) {
        throw new PrettyError('No repo provided')
      }

      const { repo, tag } = parseRepo(_repo)

      desitination = resolvePath(desitination || '.')

      if (
        !flags.force &&
        existsSync(desitination) &&
        !isEmptyDirSync(desitination)
      ) {
        throw new PrettyError(
          `Destination directory is not empty, use --force if you are sure about this`,
        )
      }

      console.log(`Downloading ${repo}`)

      const ref = tag || (await getDefaultBranchFromApi(repo))

      const tempTarFile = `${getTempDir()}/aho_${Date.now()}.tar.gz`
      await downloadFile(
        `https://codeload.github.com/${repo}/tar.gz/refs/heads/${ref}`,
        tempTarFile,
      )
      console.log(`Generating to ${desitination}`)
      await extract(tempTarFile, desitination, { path: flags.path })
    })

  cli.version(getOwnVersion())
  cli.help()
  cli.parse(args, { run: false })

  try {
    await cli.runMatchedCommand()
  } catch (error) {
    if (error instanceof PrettyError) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    exit(1)
  }
}

class PrettyError extends Error {
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

async function extract(from: string, to: string, { path }: { path?: string }) {
  const tempDir = getTempDir() + `/aho_temp_${Date.now()}`
  ensureDirSync(tempDir)
  const cmd = ['tar', 'xvzf', from, '-C', tempDir, '--strip-components', '1']
  await runCommand(cmd)
  emptyDirSync(to)
  moveSync(path ? joinPath(tempDir, path) : tempDir, to)
}

function parseRepo(input: string) {
  const [repo, tag] = input.split('#')
  return { repo, tag }
}

async function getDefaultBranchFromApi(repo: string): Promise<string> {
  const data = await fetchJSON(`https://api.github.com/repos/${repo}`)
  return data.default_branch
}
