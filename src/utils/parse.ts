import { TextDocument, Position } from 'vscode'

/**
 * Determines if the given position is within any matched portion of text.
 */
export function isWithinRegex(
  document: TextDocument,
  position: Position,
  regex: RegExp,
): boolean {
  const docText = document.getText()
  const matches = [...docText.matchAll(regex)]

  if (!matches) return false

  const offset = document.offsetAt(position)

  let isWithin = false

  matches.forEach((block) => {
    if (isWithin) return

    const blockIndex = block.index || docText.indexOf(block[0])
    const blockLength = blockIndex + block[0].length

    isWithin = offset >= blockIndex && offset <= blockLength
  })

  return isWithin
}
