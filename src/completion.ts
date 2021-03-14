import {
    Disposable,
    languages,
    CompletionItem,
    SnippetString,
    MarkdownString,
    CompletionList,
    ProviderResult,
} from 'vscode'
import attributes from './snippets/attributes.json'

export default class Completion {
    constructor(subscriptions: Disposable[]) {
        const attributeProvider = languages.registerCompletionItemProvider('mjml', {
            provideCompletionItems(document, position) {
                const snippetCompletions: ProviderResult<CompletionItem[] | CompletionList> = []
                const { text: lineText } = document.lineAt(position)
                const tagRegex = /<[^/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
                const tagMatches = lineText.match(tagRegex)

                if (!tagMatches) return

                let isWithinTag = false

                tagMatches.forEach((tag) => {
                    const tagStart = lineText.indexOf(tag)
                    const tagEnd = tagStart + tag.length

                    if (position.character > tagStart && position.character < tagEnd) {
                        isWithinTag = true
                    }
                })

                if (!isWithinTag || !attributes) return

                Object.values(attributes).forEach((attr) => {
                    const snippetCompletion = new CompletionItem(attr.prefix)

                    snippetCompletion.insertText = new SnippetString(attr.body)
                    snippetCompletion.documentation = new MarkdownString(attr.description)

                    snippetCompletions.push(snippetCompletion)
                })

                return snippetCompletions
            },
        })

        subscriptions.push(attributeProvider)
    }
}
