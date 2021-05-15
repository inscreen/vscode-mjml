import { ExtensionContext, workspace } from 'vscode'

import Beautify from './beautify'
import Copy from './copy'
import Export from './export'
import Linter from './linter'
import Preview from './preview'
import Version from './version'
import Completion from './completion'
import Color from './color'
import LanguageConfig from './language'
import PathLink from './path'

export let workspaceConfig = workspace.getConfiguration('mjml')

workspace.onDidChangeConfiguration((e) => {
  if (!e.affectsConfiguration('mjml')) return

  workspaceConfig = workspace.getConfiguration('mjml')
})

export function activate(context: ExtensionContext): void {
  new Beautify(context.subscriptions)
  new Copy(context.subscriptions)
  new Export(context.subscriptions)
  new Linter(context.subscriptions)
  new Preview(context)
  new Version(context.subscriptions)
  new Completion(context.subscriptions)
  new Color(context.subscriptions)
  new LanguageConfig(context.subscriptions)
  new PathLink(context.subscriptions)
}
