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
    if (isWithinRegex(document, position, regex.styleBlock)) return
    if (isWithinRegex(document, position, regex.htmlComment)) return

    const startRange = document.getWordRangeAtPosition(position, regex.typedTag)

    if (!startRange) return

    const typedText = '<' + document.getText(startRange)
    const offset = document.offsetAt(startRange.start)
    const docText = '<' + document.getText().slice(offset)

    const tagIndexes = getTagIndexes(docText, {
      start: `${typedText}[^>]*>`,
      end: `(?<=</)${typedText.slice(1)}(?=>)`,
    })

    if (!tagIndexes) return

    const endRange = new Range(
      document.positionAt(tagIndexes.nodeEnd.startIndex + offset - 1),
      document.positionAt(tagIndexes.nodeEnd.endIndex + offset - 1),
    )

    return new LinkedEditingRanges([startRange, endRange])
  }
}
