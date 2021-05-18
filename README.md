# MJML

This is a fork of the [@mjmlio extension](https://github.com/mjmlio/vscode-mjml), which itself, is a fork of [the original @attilabuti VSC extension.](https://github.com/attilabuti/vscode-mjml)

## Differences

### Additions:

- `mjml.switchOnSeparateFileChange`: optionally restrict preview to original file used to open it, reflects external updates.
- Attribute auto-completion within tags.
- CSS property/value completion within `mj-style` tags.
- HTML tag completion within `mj-text` tags.
- Updated dependencies.
- `<!-- mjml-render -->`: add this comment anywhere in a file **that doesn't already have an `<mjml>` tag** to enable previewing.
- `<!-- mj-head-render ... -->`: wraps `...` in `mj-head` tags which are only rendered when previewing with `mjml-render`.
- Color providers (hover palettes)
- `mjml.snippetsInsideComments`: optionally prevent snippets/completion items inside HTML and CSS comments
- <kbd>cmd</kbd> (or your configured key) + <kbd>click</kbd> relative paths to follow link
- Linked-editing of tag pairs (if enabled in `settings.json` under `editor.linkedEditing`)

### Removals:

- Template feature.
- Screenshot feature.
- Email sending feature.
- Documentation feature.
- Migration feature.
- `mj-link` snippet as it's deprecated.

The reason for removing these features is they take up a massive chunk of the overall extension size (over 70mb of a roughly 80mb package).

---

MJML preview, lint, compile for Visual Studio Code.

## Features

- Live preview for MJML files. Preview updates as you type. Preview based on [html-preview-vscode](https://github.com/tht13/html-preview-vscode).
- Inline errors (squiggle underlines). Linter based on [atom-linter-mjml](https://github.com/mjmlio/atom-linter-mjml).
- Export HTML file from MJML.
- Copy the result HTML to clipboard.
- Code snippets for MJML. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).
- Beautify MJML code.
- MJML syntax highlight. Based on [mjml-syntax](https://github.com/mjmlio/mjml-syntax).

## It looks like this

![MJML Preview](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-preview.gif)

![MJML Lint](https://raw.githubusercontent.com/attilabuti/vscode-mjml/master/images/mjml-lint.gif)

## Installation

- [From the VS Marketplace.](https://marketplace.visualstudio.com/items?itemName=DanielKnights.vscode-mjml)
- From the extensions bar in VSCode.

## Usage

Start command palette and start typing `MJML`.

## Available commands

The following commands are available:

- **MJML: Beautify** or **Format Document** Beautify MJML code.
- **MJML: Copy HTML** Copy the result HTML to clipboard.
- **MJML: Export HTML** Export HTML file from MJML.
- **MJML: Open Preview to the Side** Opens a preview in a column alongside the current document.
- **MJML: Version** Shows the version of MJML.

## Settings

| Name                              | Default | Description                                                                                  |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `mjml.autoPreview`                | `false` | Automatically update preview when switching between MJML documents.                          |
| `mjml.beautifyHtmlOutput`         | `false` | Beautify HTML output. (Works when `mjml.minifyHtmlOutput` aren't enabled.)                   |
| `mjml.beautify`                   | ` `     | Beautify options ([available options](https://github.com/beautify-web/js-beautify#options)). |
| `mjml.exportType`                 | `.html` | Specifies the file type of the output file.                                                  |
| `mjml.lintEnable`                 | `true`  | Enable/disable MJML linter (requires restart).                                               |
| `mjml.lintWhenTyping`             | `true`  | Whether the linter is run on type or on save.                                                |
| `mjml.minifyHtmlOutput`           | `true`  | Minify HTML output.                                                                          |
| `mjml.preserveFocus`              | `true`  | Preserve focus of Text Editor after preview open.                                            |
| `mjml.updateWhenTyping`           | `true`  | Update preview when typing.                                                                  |
| `mjml.previewBackgroundColor`     | ` `     | Preview background color.                                                                    |
| `mjml.autoClosePreview`           | `true`  | Automatically close preview when all open MJML documents have been closed.                   |
| `mjml.showSaveDialog`             | `false` | Show the save as dialog instead of input box.                                                |
| `mjml.switchOnSeparateFileChange` | `true`  | Automatically switch preview when editing a different file.                                  |
| `mjml.snippetsInsideComments`     | `true`  | Determines whether snippets/completion items are triggered inside HTML and CSS comments.     |

## Snippets

| Trigger               | URL                                                                                                                         | Content                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `mjall`               | [mj-all](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md)                                | `<mj-all />`                                       |
| `mjattributes`        | [mj-attributes](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md)                         | `<mj-attributes></mj-attributes>`                  |
| `mjbody`              | [mj-body](https://github.com/mjmlio/mjml/blob/master/packages/mjml-body/README.md)                                          | `<mj-body></mj-body>`                              |
| `mjbreakpoint`        | [mj-breakpoint](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-breakpoint/README.md)                         | `<mj-breakpoint width="" />`                       |
| `mjbutton`            | [mj-button](https://github.com/mjmlio/mjml/blob/master/packages/mjml-button/README.md)                                      | `<mj-button></mj-button>`                          |
| `mjcarousel`          | [mj-carousel](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md)                                  | `<mj-carousel></mj-carousel>`                      |
| `mjcarousel-image`    | [mj-carousel-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-carousel/README.md#mjml-carousel-image)        | `<mj-carousel-image src="" />`                     |
| `mjclass`             | [mj-class](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-attributes/README.md)                              | `<mj-class name="" />`                             |
| `mjcolumn`            | [mj-column](https://github.com/mjmlio/mjml/blob/master/packages/mjml-column/README.md)                                      | `<mj-column width=""></mj-column>`                 |
| `mjdivider`           | [mj-divider](https://github.com/mjmlio/mjml/blob/master/packages/mjml-divider/README.md)                                    | `<mj-divider />`                                   |
| `mjfont`              | [mj-font](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-font/README.md)                                     | `<mj-font name="" href="" />`                      |
| `mjgroup`             | [mj-group](https://github.com/mjmlio/mjml/blob/master/packages/mjml-group/README.md)                                        | `<mj-group></mj-group>`                            |
| `mjhead`              | [mj-head](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-head)                                                  | `<mj-head></mj-head>`                              |
| `mjhero`              | [mj-hero](https://github.com/mjmlio/mjml/blob/master/packages/mjml-hero/README.md)                                          | `<mj-hero></mj-hero>`                              |
| `mjimage`             | [mj-image](https://github.com/mjmlio/mjml/blob/master/packages/mjml-image/README.md)                                        | `<mj-image src="" alt="" />`                       |
| `mjinclude`           | [mj-include](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mj-include)                                            | `<mj-include path="" />`                           |
| `mjraw`               | [mj-raw](https://github.com/mjmlio/mjml/blob/master/packages/mjml-raw/README.md)                                            | `<mj-raw></mj-raw>`                                |
| `mjsection`           | [mj-section](https://github.com/mjmlio/mjml/blob/master/packages/mjml-section/README.md)                                    | `<mj-section></mj-section>`                        |
| `mjsocial`            | [mj-social](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md)                                      | `<mj-social></mj-social>`                          |
| `mjsocialelement`     | [mj-social-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-social/README.md#mj-social-element)            | `<mj-social-element></mj-social-element>`          |
| `mjstyle`             | [mj-style](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-style/README.md)                                   | `<mj-style></mj-style>`                            |
| `mjtable`             | [mj-table](https://github.com/mjmlio/mjml/blob/master/packages/mjml-table/README.md)                                        | `<mj-table></mj-table>`                            |
| `mjtext`              | [mj-text](https://github.com/mjmlio/mjml/blob/master/packages/mjml-text/README.md)                                          | `<mj-text></mj-text>`                              |
| `mjtitle`             | [mj-title](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-title/README.md)                                   | `<mj-title></mj-title>`                            |
| `mjml`                | [mjml](https://github.com/mjmlio/mjml/blob/master/doc/guide.md#mjml)                                                        | `<mjml></mjml>`                                    |
| `mjpreview`           | [mj-preview](https://github.com/mjmlio/mjml/blob/master/packages/mjml-head-preview/README.md)                               | `<mj-preview></mj-preview>`                        |
| `mjspacer`            | [mj-spacer](https://github.com/mjmlio/mjml/blob/master/packages/mjml-spacer/README.md)                                      | `<mj-spacer height="" />`                          |
| `mjwrapper`           | [mj-wrapper](https://github.com/mjmlio/mjml/blob/master/packages/mjml-wrapper/README.md)                                    | `<mj-wrapper></mj-wrapper>`                        |
| `mjaccordion`         | [mj-accordion](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md)                                | `<mj-accordion></mj-accordion>`                    |
| `mjaccordion-element` | [mj-accordion-element](https://github.com/mjmlio/mjml/blob/master/packages/mjml-accordion/README.md#mjml-accordion-element) | `<mj-accordion-element>...</mj-accordion-element>` |
| `mjnavbar`            | [mj-navbar](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md)                                      | `<mj-navbar></mj-navbar>`                          |
| `mjnavbarlink`        | [mj-navbar-link](https://github.com/mjmlio/mjml/blob/master/packages/mjml-navbar/README.md#mjml-navbar-link)                | `<mj-navbar-link></mj-navbar-link>`                |
| `mjml-`               |                                                                                                                             | Basic MJML Template                                |

## Issues

Submit an [issue](https://github.com/Daniel-Knights/vscode-mjml/issues) if you find any bug or have any suggestion.

## Contribution

Fork the [repo](https://github.com/Daniel-Knights/vscode-mjml) and submit pull requests.

## Contributors

Main Author: Attila Buti ([@attilabuti](https://github.com/attilabuti))

A big thanks to the people that have contributed to this project:

- Christian Brevik ([@cbrevik](https://github.com/cbrevik)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=cbrevik))
- Kevin Oliveira ([@kvnol](https://github.com/kvnol)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=kvnol))
- Joshua Skrzypek ([@jskrzypek](https://github.com/jskrzypek)) - [contributions](https://github.com/attilabuti/vscode-mjml/commits?author=jskrzypek))

## License

This extension is licensed under the MIT License.
