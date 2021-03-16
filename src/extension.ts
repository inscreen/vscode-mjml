import { ExtensionContext } from 'vscode'

import Beautify from './beautify'
import Copy from './copy'
import Export from './export'
import Linter from './linter'
import Preview from './preview'
import Version from './version'
import Completion from './completion'

let context: ExtensionContext
let extensionFeatures: object[] = []

export function activate(extensionContext: ExtensionContext) {
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

export function deactivate() {
    for (const feature of extensionFeatures) {
        if (typeof (feature as any).dispose === 'function') {
            ;(feature as any).dispose()
        }
    }

    for (const subscription of context.subscriptions) {
        subscription.dispose()
    }
}
