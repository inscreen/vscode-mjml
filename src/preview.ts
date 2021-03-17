import { basename } from 'path'
import {
  commands,
  Disposable,
  ExtensionContext,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  ViewColumn,
  WebviewPanel,
  window,
  workspace,
} from 'vscode'
import { fixImages, isMJMLFile, mjmlToHtml } from './helper'

export default class Preview {
  private openedDocuments: TextDocument[] = []
  private previewOpen = false
  private subscriptions: Disposable[]
  private webview: WebviewPanel | undefined

  constructor(context: ExtensionContext) {
    this.subscriptions = context.subscriptions

    this.subscriptions.push(
      commands.registerCommand('mjml.previewToSide', () => {
        if (window.activeTextEditor) {
          this.previewOpen = true
          this.displayWebView(window.activeTextEditor.document)
        } else {
          window.showErrorMessage("Active editor doesn't show a MJML document.")
        }
      }),

      workspace.onDidOpenTextDocument((document?: TextDocument) => {
        const { autoPreview } = workspace.getConfiguration('mjml')

        if (!document || !this.previewOpen || !autoPreview) return

        this.displayWebView(document)
      }),

      window.onDidChangeActiveTextEditor((editor?: TextEditor) => {
        const { autoPreview } = workspace.getConfiguration('mjml')

        if (!editor || !this.previewOpen || !autoPreview) return

        this.displayWebView(editor.document)
      }),

      workspace.onDidChangeTextDocument((event?: TextDocumentChangeEvent) => {
        const { updateWhenTyping } = workspace.getConfiguration('mjml')

        if (!event || !this.previewOpen || !updateWhenTyping) return

        this.displayWebView(event.document)
      }),

      workspace.onDidSaveTextDocument((document?: TextDocument) => {
        if (!document || !this.previewOpen) return

        this.displayWebView(document)
      }),

      workspace.onDidCloseTextDocument((document?: TextDocument) => {
        if (!document || !this.previewOpen || !this.webview) return

        this.removeDocument(document.fileName)

        const { autoClosePreview } = workspace.getConfiguration('mjml')

        if (this.openedDocuments.length !== 0 || autoClosePreview) return

        this.dispose()
      }),
    )
  }

  public dispose(): void {
    if (this.webview === undefined) return

    this.webview.dispose()
  }

  private displayWebView(document: TextDocument): void {
    if (!isMJMLFile(document)) return

    const activeTextEditor: TextEditor | undefined = window.activeTextEditor
    if (!activeTextEditor || !activeTextEditor.document) return

    const content: string = this.getContent(document)
    const label = `MJML Preview - ${basename(activeTextEditor.document.fileName)}`

    if (!this.webview) {
      this.webview = window.createWebviewPanel('mjml-preview', label, ViewColumn.Two, {
        retainContextWhenHidden: true,
      })

      this.webview.webview.html = content

      this.webview.onDidDispose(
        () => {
          this.webview = undefined
          this.previewOpen = false
        },
        null,
        this.subscriptions,
      )

      if (workspace.getConfiguration('mjml').preserveFocus) {
        // Preserve focus of Text Editor after preview open
        window.showTextDocument(activeTextEditor.document, ViewColumn.One)
      }
    } else {
      this.webview.title = label
      this.webview.webview.html = content
    }
  }

  private getContent(document: TextDocument): string {
    if (!workspace.getConfiguration('mjml').switchOnSeparateFileChange) {
      document = this.openedDocuments[0] || document
    }

    const docText = document.getText()
    const html: string = mjmlToHtml(docText, false, false, document.uri.fsPath, 'skip')
      .html

    if (html) {
      this.addDocument(document)

      return this.setBackgroundColor(fixImages(html, document.uri.fsPath))
    }

    return this.error("Active editor doesn't show a MJML document.")
  }

  private setBackgroundColor(html: string): string {
    const { previewBackgroundColor } = workspace.getConfiguration('mjml')

    if (previewBackgroundColor) {
      const tmp: RegExpExecArray | null = /<.*head.*>/i.exec(html)

      if (tmp && tmp[0]) {
        html = html.replace(
          tmp[0],
          `${tmp[0]}\n<style>
            html, body { background-color: ${previewBackgroundColor}; }
          </style>`,
        )
      }
    }

    return html
  }

  private error(error: string): string {
    return `<body>${error}</body>`
  }

  private addDocument(document: TextDocument): void {
    if (this.openedDocuments.indexOf(document) !== -1) return

    this.openedDocuments.push(document)
  }

  private removeDocument(fileName: string): void {
    this.openedDocuments = this.openedDocuments.filter(
      (file: TextDocument) => file.fileName !== fileName,
    )
  }
}
