import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  Disposable,
  languages,
  Position,
  Range,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  window,
  workspace,
} from 'vscode'

import { getPath, mjmlToHtml } from './helper'

export default class Linter {
  private diagnosticCollection!: DiagnosticCollection

  constructor(subscriptions: Disposable[]) {
    if (!workspace.getConfiguration('mjml').lintEnable) return

    this.diagnosticCollection = languages.createDiagnosticCollection('mjml')

    subscriptions.push(
      this.diagnosticCollection,

      window.onDidChangeActiveTextEditor((editor?: TextEditor) => {
        if (!editor || !editor.document) return

        this.lintDocument(editor.document)
      }),

      workspace.onDidChangeTextDocument((event?: TextDocumentChangeEvent) => {
        const { lintWhenTyping } = workspace.getConfiguration('mjml')

        if (!event || !event.document || !lintWhenTyping) return

        this.lintDocument(event.document)
      }),

      workspace.onDidCloseTextDocument((document?: TextDocument) => {
        if (!document) return

        this.diagnosticCollection.delete(document.uri)
      }),

      workspace.onDidOpenTextDocument((document?: TextDocument) => {
        if (!document) return

        this.lintDocument(document)
      }),

      workspace.onDidSaveTextDocument((document?: TextDocument) => {
        if (!document) return

        this.lintDocument(document)
      }),
    )

    // Lint all open mjml documents
    workspace.textDocuments.forEach(this.lintDocument, this)
  }

  public dispose(): void {
    this.diagnosticCollection.clear()
    this.diagnosticCollection.dispose()
  }

  private lintDocument(textDocument: TextDocument): void {
    if (textDocument.languageId !== 'mjml') return

    const diagnostics: Diagnostic[] = []

    try {
      const errors = mjmlToHtml(textDocument.getText(), false, false, getPath(), 'strict')
        .errors

      if (errors && errors[0]) {
        errors[0].errors.forEach((error) => {
          const line: number = error.line - 1
          const currentLine: string = textDocument.lineAt(line).text

          diagnostics.push(
            new Diagnostic(
              new Range(
                new Position(line, currentLine.indexOf('<')),
                new Position(line, currentLine.length),
              ),
              error.message,
              DiagnosticSeverity.Error,
            ),
          )
        })
      }

      this.diagnosticCollection.set(textDocument.uri, diagnostics)
    } catch (error) {
      this.diagnosticCollection.set(textDocument.uri, diagnostics)
    }
  }
}
