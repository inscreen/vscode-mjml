# Change Log

All notable changes to the "mjml" extension will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/).

### [2.2.0] (18/05/2021)

- Document link providers
- Linked-editing providers
- Color providers in `border` attribute
- CSS value completions without leading whitespace
- CSS `background` value completions
- CSS gradient support for color-providers

### [2.1.2] (15/05/2021)

Fix `snippetsInsideComments`

### [2.1.1] (15/05/2021)

`<mj-all />` attribute completions

### [2.1.0] (15/05/2021)

- Fix `<-- mj-head-render -->` not working with other comments in the same file
- Add slash to self-closing tag snippets
- Remove end of snippet tab-stop
- Add option to prevent snippets/completion items inside comments
- Tag completions account for leading `<`
- Prevent completions inside closing tags as well as opening tags

### [2.0.2] (09/05/2021)

Fix regex for self-closing `mj-text`

### [2.0.1] (09/05/2021)

- Fix color providers showing in the middle of words
- Make changelog dates `dd/mm/yyyy`

### [2.0.0] (09/05/2021)

- Color providers
- Prevent auto opening snippets
- Added CSS `padding` completion
- Added completions for all supported attributes
- Attribute completions scoped to compatible tags
- Prevented attribute completions inside comments
- Refactored MJML snippets into completion items
- Fixed `mjml.preserveFocus` and `mjml.autoClosePreview` config options

### [1.5.2] (01/05/2021)

Bump MJML version to `4.9.3`.

### [1.5.1] (29/04/2021)

Remove unnecessary completion item hyphen handling.

### [1.5.0] (28/04/2021)

Added indentation rules.

### [1.4.3] (17/04/2021)

Fixed CSS property/value completion bugs when there are multiple properties per line.

### [1.4.2] (25/03/2021)

Fixed hyphens messing with completion provider, check if semi-colon already exists before completing CSS properties.

### [1.4.1] (24/03/2021)

Fixed catastrophic backtracking in `mj-head-render` regex.

### [1.4.0] (24/03/2021)

Added `<!-- mj-head-render -->` magic comment to render head elements inside previewer when using `<!-- mjml-render -->`.

### [1.3.1] (24/03/2021)

Added `<!-- mjml-render -->` snippet.

### [1.3.0] (24/03/2021)

Added ability to preview individual components with `<!-- mjml-render -->` magic comment. Inspired by [this merge request in the official extension repo](https://github.com/mjmlio/vscode-mjml/pull/18).

### [1.2.4] (20/03/2021)

Removed unnecessary whitespace in some HTML snippets.

### [1.2.3] (18/03/2021)

Added missing `border` attribute.

### [1.2.2] (18/03/2021)

Initial preview open bug fix.

### [1.2.0] (18/03/2021)

HTML tag completions within `mj-text` tags, minor bug fixes.

### [1.1.1] (17/03/2021)

Upgrade dependencies.

### [1.1.0] (16/03/2021)

Extra CSS snippet values.

### [1.0.0] (16/03/2021)

Removed screenshot, email, documentation, migration and template features. Also, removed `mj-link` snippet.

### [0.2.13] (16/03/2021)

Updated display name.

### [0.2.12] (16/03/2021)

Scrapped Webpack integration.

### [0.2.5-11] (16/03/2021)

Webpack integration (fix).

### [0.2.4] (16/03/2021)

Webpack integration.

### [0.2.3] (16/03/2021)

Removed required `node_modules` dependencies from `.vscodeignore`.

### [0.2.2] (16/03/2021)

Removed required `node_modules` dependencies from `.vscodeignore`.

### [0.2.1] (16/03/2021)

Added `node_modules` to `.vscodeignore` to reduce extension size.

### [0.2.0] (16/03/2021)

CSS property/value completions within `mj-style` tags.
Attribute completion over multiple line.

### [0.1.4] (14/03/2021)

Enhanced attribute completion description.

### [0.1.3] (14/03/2021)

Convert snippet from JSON to JS.

### [0.1.2] (14/03/2021)

Minor bug fix.

### [0.1.1] (14/03/2021)

TS config fix.

### [0.1.0] (14/03/2021)

Attribute auto-completion within tags.

### [0.0.2] (13/03/2021)

Minor bug-fix.

### [0.0.1] (13/03/2021)

`mjml.switchOnSeparateFileChange` option.
