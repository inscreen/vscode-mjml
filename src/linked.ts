import {
  Disposable,
  languages,
  LinkedEditingRanges,
  Range,
  Position,
  TextDocument,
} from 'vscode'
import { isWithinRegex, getTagIndexes } from './utils'
import regex from './resources/regex'

export default class LinkedEditing {
  constructor(subscriptions: Disposable[]) {
    const provider = languages.registerLinkedEditingRangeProvider('mjml', {
      provideLinkedEditingRanges: this.provideLinkedEditingRanges,
    })

    subscriptions.push(provider)
  }

  private provideLinkedEditingRanges(document: TextDocument, position: Position) {
    const { styleBlock, htmlComment, typedOpeningTag, typedClosingTag } = regex

    if (isWithinRegex(document, position, styleBlock)) return
    if (isWithinRegex(document, position, htmlComment)) return

    const openTagRange = document.getWordRangeAtPosition(position, typedOpeningTag)
    const closingTagRange = document.getWordRangeAtPosition(position, typedClosingTag)

    if (openTagRange) {
      const offset = document.offsetAt(openTagRange.start) - '<'.length
      const docText = document.getText().slice(offset)
      const typedText = document.getText(openTagRange)

      const tagIndexes = getTagIndexes(docText, {
        start: `<${typedText}[^>]*>?`,
        end: `(?<=</)${typedText}(?=>?)`,
      })

      if (!tagIndexes) return

      const endRange = new Range(
        document.positionAt(tagIndexes.nodeEnd.startIndex + offset),
        document.positionAt(tagIndexes.nodeEnd.endIndex + offset),
      )

      return new LinkedEditingRanges([openTagRange, endRange])
    } else if (closingTagRange) {
      const offset = document.offsetAt(closingTagRange.end) + '>'.length
      const docText = document.getText().slice(0, offset).split('').reverse().join('')
      const typedText = document.getText(closingTagRange).split('').reverse().join('')

      const tagIndexes = getTagIndexes(docText, {
        start: `>?${typedText}/<`,
        end: `(?<=>?[^<]*)${typedText}(?=<)`,
      })

      if (!tagIndexes) return

      const endRange = new Range(
        document.positionAt(offset - tagIndexes.nodeEnd.startIndex),
        document.positionAt(offset - tagIndexes.nodeEnd.endIndex),
      )

      return new LinkedEditingRanges([closingTagRange, endRange])
    }

    return
  }
}
