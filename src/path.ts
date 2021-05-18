import { Disposable, languages, DocumentLink, Range, TextDocument, Uri } from 'vscode'
import path = require('path')

import regex from './resources/regex'

export default class PathLink {
  constructor(subscriptions: Disposable[]) {
    const provider = languages.registerDocumentLinkProvider('mjml', {
      provideDocumentLinks: this.provideDocumentLinks,
    })

    subscriptions.push(provider)
  }

  private provideDocumentLinks(document: TextDocument) {
    const docText = document.getText()
    const matches = docText.matchAll(regex.relativePaths)

    const links = [...matches].map((match) => {
      if (!match.index) return

      const startPos = document.positionAt(match.index)
      const endPos = document.positionAt(match.index + match[0].length)

      const matchSections = match[0].split('/')
      let level = 0

      matchSections.forEach((section) => {
        if (section === '..') level += 1
      })

      const rootPath = document.fileName.split('/')

      if (!rootPath) return

      rootPath.pop()

      for (let i = 0; i < level; i++) {
        rootPath.pop()
        matchSections.shift()
      }

      const uri = Uri.file(path.join(rootPath.join('/'), matchSections.join('/')))

      return new DocumentLink(new Range(startPos, endPos), uri)
    })

    return links.filter((link) => link) as DocumentLink[]
  }
}
