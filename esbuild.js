/* eslint @typescript-eslint/no-var-requires: off */

const esbuild = require('esbuild')
const pkg = require('./package.json')

const jointDependencies = Object.keys(pkg.dependencies).join('$|^')
const dependencyRegex = new RegExp(`^vscode$|^${jointDependencies}$`)

const setExternals = {
  name: 'set-externals',
  setup(build) {
    build.onResolve({ filter: dependencyRegex }, (args) => {
      return { path: args.path, external: true }
    })
  },
}

esbuild.build({
  entryPoints: ['src/extension.ts'],
  outfile: 'dist/extension.js',
  platform: 'node',
  bundle: true,
  minify: true,
  sourcemap: true,
  plugins: [setExternals],
})
