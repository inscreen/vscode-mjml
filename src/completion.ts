import {
  Disposable,
  languages,
  CompletionItem,
  SnippetString,
  MarkdownString,
  CompletionList,
  ProviderResult,
  TextDocument,
  Position,
} from 'vscode'
import { tagAttributes, cssProperties, htmlTags } from './snippets'

interface Snippet {
  prefix: string
  body: string
  description?: string
}

function createCompletionItem(snippet: Snippet, detail: string, kind?: number) {
  const snippetCompletion = new CompletionItem(snippet.prefix)

  snippetCompletion.detail = detail
  snippetCompletion.documentation = new MarkdownString(snippet.description)
  snippetCompletion.insertText = new SnippetString(snippet.body)
  snippetCompletion.kind = kind

  return snippetCompletion
}

function isWithinTags(
  document: TextDocument,
  position: Position,
  regex: RegExp,
): boolean {
  const docText = document.getText()
  const tagMatches = docText.match(regex)

  if (!tagMatches) return false

  const offset = document.offsetAt(position)

  let isWithinOpeningTag = false
  let isWithinClosingTag = false
  let indexOfPos = 0

  tagMatches.forEach((tag) => {
    if (isWithinOpeningTag && isWithinClosingTag) return

    const tagIndex = docText.indexOf(tag, indexOfPos)
    const tagLength = tagIndex + tag.length
    const isHTMLTag = tag[0] === '<'

    indexOfPos = tagLength

    if ((isHTMLTag && tag[1] !== '/') || tag === '{') {
      isWithinOpeningTag = tagLength < offset
    } else if (tag[1] === '/' || tag === '}') {
      isWithinClosingTag = tagIndex > offset - 1
    }
  })

  if (isWithinOpeningTag && isWithinClosingTag) return true
  else return false
}

function isWithinOpeningTag(
  document: TextDocument,
  position: Position,
  regex: RegExp,
): boolean {
  const docText = document.getText()
  const tagMatches = docText.match(regex)

  if (!tagMatches) return false

  const cursorPos = document.offsetAt(position)
  let isWithinOpeningTag = false
  let indexOfPos = 0

  tagMatches.forEach((tag) => {
    const tagStart = docText.indexOf(tag, indexOfPos)
    const tagEnd = tagStart + tag.length

    indexOfPos = tagEnd

    if (cursorPos > tagStart && cursorPos <= tagEnd) {
      isWithinOpeningTag = true
    }
  })

  return isWithinOpeningTag
}

function hasExistingHyphen(
  document: TextDocument,
  position: Position,
  body: string,
): string {
  const range = document.getWordRangeAtPosition(position, /(?:\w|-)+\w*/)
  const typedText = document.getText(range)

  if (!typedText || !range) return body

  const typedTextAtLastHyphen = typedText.slice(0, typedText.lastIndexOf('-') + 1)
  const matchingLengthBody = body.slice(0, typedText.lastIndexOf('-') + 1)

  if (typedTextAtLastHyphen === matchingLengthBody) {
    return body.slice(typedText.lastIndexOf('-') + 1)
  }

  return body
}

export default class Completion {
  constructor(subscriptions: Disposable[]) {
    const attributeProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const tagRegex = /<[^/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gm

        if (!isWithinOpeningTag(document, position, tagRegex)) return

        return tagAttributes.map((attr) => {
          const attrCopy = { ...attr }

          attrCopy.body = hasExistingHyphen(document, position, attr.body)

          return createCompletionItem(attrCopy, 'MJML')
        })
      },
    })

    const cssPropertyProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const { text: lineText } = document.lineAt(position)
        const lastLineChar = lineText[position.character]

        if (lastLineChar === ';') return

        const tagRegex = /<\/?mj-style(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>/gm
        const bracketRegex = /{|}/gm

        if (!isWithinTags(document, position, tagRegex)) return
        if (!isWithinTags(document, position, bracketRegex)) return

        return cssProperties.map((prop) => {
          const propCopy = { ...prop }

          propCopy.body = hasExistingHyphen(document, position, prop.body)

          const snippetCompletion = createCompletionItem(propCopy, 'MJML (CSS)')

          snippetCompletion.command = {
            command: 'editor.action.triggerSuggest',
            title: '',
          }

          return snippetCompletion
        })
      },
    })

    const cssValueProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const snippetCompletions: ProviderResult<CompletionItem[] | CompletionList> = []
        const range = document.getWordRangeAtPosition(position, /(?:\w|-)*:\s[^;]*;/)

        if (!range) return

        const typedText = document.getText(range)
        const addSemi = !typedText.includes(';')

        cssProperties.forEach((prop) => {
          const bodyRegex = new RegExp(`(?<!-)${prop.body.split('$1').join('[^;]*')}?`)

          if (!bodyRegex.test(typedText)) return

          prop.values.forEach((val) => {
            const propBody = addSemi ? val + ';' : val
            const body = hasExistingHyphen(document, position, propBody)
            const completionItem = createCompletionItem({ prefix: val, body }, '', 11)

            snippetCompletions.push(completionItem)
          })
        })

        return snippetCompletions
      },
    })

    const htmlTagProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const mjTextRegex = /<\/?mj-text(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>/gm
        const htmlTagRegex = /<\/?[^/?mj\-.*](?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>/gm

        if (!isWithinTags(document, position, mjTextRegex)) return
        if (isWithinOpeningTag(document, position, htmlTagRegex)) return

        return htmlTags.map((tag) => createCompletionItem(tag, 'MJML (HTML)'))
      },
    })

    subscriptions.push(
      attributeProvider,
      cssPropertyProvider,
      cssValueProvider,
      htmlTagProvider,
    )
  }
}
