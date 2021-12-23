#!/usr/bin/env node
import { cac } from 'cac'
import {
  downloadFile,
  existsSync,
  args,
  exit,
  getOwnVersion,
  isEmptyDirSync,
  resolvePath,
  getTempDir,
} from './lib'
import { PrettyError, parseRepo, getDefaultBranchFromApi, extract } from './'

const start = async () => {
  const cli = cac('aho')

  cli
    .command('[repo] [desitination]', 'Download a repo')
    .option(
      '-f, --force',
      `Force override desitination directory even if it's not empty`,
    )
    .action(async (_repo, desitination, flags) => {
      if (!_repo) {
        throw new PrettyError('No repo provided')
      }

      const { owner, repoName, subpath, tag } = parseRepo(_repo)
      const repo = `${owner}/${repoName}`

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

      console.log(
        `Downloading ${repo} ${subpath ? `(sub folder: ${subpath})` : ''}`,
      )

      const ref = tag || (await getDefaultBranchFromApi(repo))

      const tempTarFile = `${getTempDir()}/aho_${Date.now()}.tar.gz`
      await downloadFile(
        `https://codeload.github.com/${repo}/tar.gz/refs/heads/${ref}`,
        tempTarFile,
      )
      console.log(`Generating to ${desitination}`)
      await extract(tempTarFile, desitination, { path: subpath })
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

start()
