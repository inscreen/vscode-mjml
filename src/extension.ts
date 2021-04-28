import { ExtensionContext } from 'vscode'

import Beautify from './beautify'
import Copy from './copy'
import Export from './export'
import Linter from './linter'
import Preview from './preview'
import Version from './version'
import Completion from './completion'
import LanguageConfig from './language'

export function activate(context: ExtensionContext): void {
  new Beautify(context.subscriptions)
  new Copy(context.subscriptions)
  new Export(context.subscriptions)
  new Linter(context.subscriptions)
  new Preview(context)
  new Version(context.subscriptions)
  new Completion(context.subscriptions)
  new LanguageConfig(context.subscriptions)
}
