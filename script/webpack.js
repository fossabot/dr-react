import { resolve as resolvePath } from 'path'
import { DefinePlugin, HashedModuleIdsPlugin } from 'webpack'

import { argvFlag, runMain } from 'dev-dep-tool/library/__utils__'
import { compileWithWebpack } from 'dev-dep-tool/library/webpack'
import { getLogger } from 'dev-dep-tool/library/logger'

const PATH_ROOT = resolvePath(__dirname, '..')
const fromRoot = (...args) => resolvePath(PATH_ROOT, ...args)

runMain(async (logger) => {
  const MODE = argvFlag('development', 'production') || 'production'
  const IS_PRODUCTION = MODE === 'production'
  const BABEL_OPTIONS = {
    babelrc: false,
    cacheDirectory: IS_PRODUCTION,
    presets: [ [ '@babel/env', { targets: { node: 8 }, modules: false } ], [ '@babel/react' ] ],
    plugins: [ [ 'babel-plugin-styled-components' ], [ '@babel/proposal-class-properties' ], [ '@babel/proposal-object-rest-spread', { useBuiltIns: true } ] ]
  }

  const config = {
    mode: MODE,
    output: { path: fromRoot('example/source-gitignore/'), filename: '[name].js', library: 'DR_REACT', libraryTarget: 'umd' },
    entry: { 'index': 'source/index.example' },
    resolve: { alias: { source: fromRoot('source') } },
    module: { rules: [ { test: /\.js$/, exclude: /node_modules/, use: [ { loader: 'babel-loader', options: BABEL_OPTIONS } ] } ] },
    plugins: [
      new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(MODE), '__DEV__': !IS_PRODUCTION }),
      new HashedModuleIdsPlugin()
    ]
  }

  logger.padLog(`compile with webpack mode: ${MODE}`)
  await compileWithWebpack({ config, isWatch: !IS_PRODUCTION, logger })
}, getLogger(`webpack`))
