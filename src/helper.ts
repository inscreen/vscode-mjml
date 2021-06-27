import { existsSync, readFileSync, statSync } from 'fs'
import { basename, dirname, join as joinPath } from 'path'
import { extensions, TextDocument, TextEditor, window } from 'vscode'
import { html as jsBeautify } from 'js-beautify'
import { getExtension, getType as getMimeType } from 'mime'
import { spawnSync } from 'child_process'

import { workspaceConfig } from './extension'

export function renderMJML(cb: (content: string) => void): void {
  const activeTextEditor: TextEditor | undefined = window.activeTextEditor

  if (!activeTextEditor) return

  if (!isMJMLFile(activeTextEditor.document)) {
    window.showWarningMessage('This is not a MJML document!')

    return
  }

  const content: string = mjmlToHtml(
    workspaceConfig.minifyHtmlOutput,
    workspaceConfig.beautifyHtmlOutput,
  )

  if (content) return cb(content)

  window.showErrorMessage(`MJMLError: Failed to parse file ${basename(getPath())}`)
}

export function isMJMLFile(document: TextDocument): boolean {
  const { scheme } = document.uri

  return document.languageId === 'mjml' && (scheme === 'file' || scheme === 'untitled')
}

export function mjmlToHtml(minify: boolean, beautify: boolean): string {
  try {
    return spawnSync(
      extensions.getExtension('danielknights.vscode-mjml')?.extensionPath +
        '/node_modules/.bin/mjml',
      [
        getPath(),
        'skip',
        '--config.beautify',
        beautify.toString(),
        '--config.minify',
        minify.toString(),
      ],
    ).stdout.toString()
  } catch (error) {
    console.error(error)
    return ''
  }
}

export function fixImages(text: string, mjmlPath: string): string {
  const regex = new RegExp(
    /((?:src|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/,
    'gmi',
  )

  function replacer(_: string, start: string, src: string, end: string): string {
    return start + encodeImage(joinPath(dirname(mjmlPath), src), src) + end
  }

  return text.replace(regex, replacer)
}

export function beautifyHTML(mjml: string): string | undefined {
  try {
    const mjStyleRegex = new RegExp(/<.*mj-style[^>]*>(?:[^<>]+)<.*\/.*mj-style>/, 'gmi')
    const replaced: string = mjml.replace(mjStyleRegex, (style: string): string => {
      return style.replace(/mj-style/gi, 'style')
    })

    const { beautify } = workspaceConfig
    const beautified: string = jsBeautify(replaced, beautify)

    if (replaced !== mjml) {
      const styleTagsRegex = new RegExp(/<.*style[^>]*>(?:[^<>]+)<.*\/.*style>/, 'gmi')

      return beautified.replace(styleTagsRegex, (styleBlock: string): string => {
        const styleRegex = new RegExp(/<.*style.*>/, 'gi')

        function replacer(style: string): string {
          return style.replace('style', 'mj-style')
        }

        return styleBlock.replace(styleRegex, replacer)
      })
    }

    return beautified
  } catch (error) {
    window.showErrorMessage(error)

    return
  }
}

export function getPath(): string {
  const { activeTextEditor } = window

  if (activeTextEditor && activeTextEditor.document) {
    return activeTextEditor.document.uri.fsPath
  }

  return ''
}

function encodeImage(filePath: string, original: string): string {
  const mimeType: string | null = getMimeType(filePath)

  if (!mimeType) return original

  const extension: string | null = getExtension(mimeType)
  const imageExtensions = ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg']

  if (!extension || imageExtensions.indexOf(extension) === -1) {
    return original
  }

  if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
    const data: Buffer = readFileSync(filePath)

    if (data) return `data:${mimeType};base64,${data.toString('base64')}`
  }

  return original
}
