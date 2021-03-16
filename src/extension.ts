import { Disposable, ExtensionContext } from 'vscode'

import Beautify from './beautify'
import Copy from './copy'
import Export from './export'
import Linter from './linter'
import Preview from './preview'
import Version from './version'
import Completion from './completion'

let context: ExtensionContext
let extensionFeatures:
  | [Beautify, Copy, Export, Linter, Preview, Version, Completion]
  | [] = []

export function activate(extensionContext: ExtensionContext): void {
  context = extensionContext

  extensionFeatures = [
    new Beautify(context.subscriptions),
    new Copy(context.subscriptions),
    new Export(context.subscriptions),
    new Linter(context.subscriptions),
    new Preview(context),
    new Version(context.subscriptions),
    new Completion(context.subscriptions),
  ]
}

export function deactivate(): void {
  for (const feature of extensionFeatures) {
    const typedFeature = feature as Disposable

    if (typeof typedFeature.dispose === 'function') {
      typedFeature.dispose()
    }
  }

  for (const subscription of context.subscriptions) {
    subscription.dispose()
  }
}
