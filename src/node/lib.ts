import { spawn } from 'child_process'
import { tmpdir } from 'os'
import { resolve } from 'path'
import https from 'https'
import fs from 'fs'
import { version } from '../../package.json'
import { USER_AGENT } from '../shared'

export { cac } from 'cac'

export const fetchJSON = (url: string): Promise<any> =>
  new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'user-agent': USER_AGENT,
        },
      },
      (res) => {
        let body = ''

        res.on('data', (chunk) => {
          body += chunk
        })

        res.on('end', () => {
          resolve(JSON.parse(body))
        })

        res.on('error', reject)
      },
    )
  })

export const downloadFile = (url: string, outFile: string) =>
  new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(outFile)

    stream.on('finish', () => {
      stream.close()
      resolve(true)
    })

    https
      .get(url)
      .on('response', (res) => {
        res.pipe(stream, { end: true })
      })
      .on('error', reject)
  })

export const ensureDir = (dir: string) => fs.mkdirSync(dir, { recursive: true })

export const existsSync = fs.existsSync

export const isEmptyDir = (dir: string) => fs.readdirSync(dir).length === 0

export const getTempDir = () => tmpdir()

export function runCommand(cmd: string[]) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd[0], cmd.slice(1), {
      stdio: 'pipe',
    })
    let output = ''
    ps.stdout.on('data', (data) => {
      output += data.toString()
    })
    ps.stderr.on('data', (data) => {
      output += data.toString()
    })
    ps.on('exit', (code) => {
      if (code === 0) {
        resolve(true)
      } else {
        reject(new Error(output))
      }
    })
  })
}

export const resolvePath = resolve

export const args = process.argv

export const exit = process.exit

export const getOwnVersion = () => {
  return version
}
