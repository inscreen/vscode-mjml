import {
  Disposable,
  languages,
  CompletionItem,
  SnippetString,
  MarkdownString,
  CompletionList,
  ProviderResult,
} from 'vscode'
import attributes from './snippets/attributes'
import cssProperties from './snippets/css'

export default class Completion {
  constructor(subscriptions: Disposable[]) {
    const attributeProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const snippetCompletions: ProviderResult<CompletionItem[] | CompletionList> = []
        const docText = document.getText()
        const tagRegex = /<[^/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gm
        const tagMatches = docText.match(tagRegex)

        if (!tagMatches) return

        const cursorPos = document.offsetAt(position)
        let isWithinTag = false
        let indexOfPos = 0

        tagMatches.forEach((tag) => {
          const tagStart = docText.indexOf(tag, indexOfPos)
          const tagEnd = tagStart + tag.length

          indexOfPos = tagEnd

          if (cursorPos > tagStart && cursorPos <= tagEnd) {
            isWithinTag = true
          }
        })

        if (!isWithinTag) return

        attributes.forEach((attr) => {
          const snippetCompletion = new CompletionItem(attr.prefix)

          snippetCompletion.detail = 'MJML'
          snippetCompletion.documentation = new MarkdownString(attr.description)
          snippetCompletion.insertText = new SnippetString(attr.body)

          snippetCompletions.push(snippetCompletion)
        })

        return snippetCompletions
      },
    })

    const cssPropertyProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const { text: lineText } = document.lineAt(position)
        const lastLineChar = lineText[position.character]

        if (lastLineChar === ';') return

        const snippetCompletions: ProviderResult<CompletionItem[] | CompletionList> = []
        const docText = document.getText()
        const offset = document.offsetAt(position)
        const tagRegex = /<\/?mj-style(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>/gm
        const tagMatches = docText.match(tagRegex)

        if (!tagMatches) return

        let isWithinOpeningTag = false
        let isWithinClosingTag = false
        let indexOfPos = 0

        if (tagMatches)
          tagMatches.forEach((tag) => {
            if (isWithinOpeningTag && isWithinClosingTag) return

            const tagIndex = docText.indexOf(tag, indexOfPos)
            const tagLength = tagIndex + tag.length

            indexOfPos = tagLength

            if (tag[1] !== '/') {
              isWithinOpeningTag = tagLength < offset
            } else if (tag[1] === '/') {
              isWithinClosingTag = tagIndex > offset - 1
            }
          })

        if (!isWithinOpeningTag || !isWithinClosingTag) return

        cssProperties.forEach((prop) => {
          const snippetCompletion = new CompletionItem(prop.prefix)

          snippetCompletion.detail = 'MJML (CSS)'
          snippetCompletion.documentation = new MarkdownString(prop.description)
          snippetCompletion.insertText = new SnippetString(prop.body)
          snippetCompletion.command = {
            command: 'editor.action.triggerSuggest',
            title: '',
          }

          snippetCompletions.push(snippetCompletion)
        })

        return snippetCompletions
      },
    })

    const cssValueProvider = languages.registerCompletionItemProvider('mjml', {
      provideCompletionItems(document, position) {
        const snippetCompletions: ProviderResult<CompletionItem[] | CompletionList> = []

        cssProperties.forEach((prop) => {
          const formattedBody = prop.body.split('$1').join('')

          if (!document.lineAt(position).text.includes(formattedBody)) return

          prop.values.forEach((val) => {
            const snippetCompletion = new CompletionItem(val)

            snippetCompletion.insertText = new SnippetString(val)
            snippetCompletion.kind = 11 // 11 = Value

            snippetCompletions.push(snippetCompletion)
          })
        })

        return snippetCompletions
      },
    })

    subscriptions.push(attributeProvider, cssPropertyProvider, cssValueProvider)
  }
}
