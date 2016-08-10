#!/usr/bin/env node
'use strict'

const path = require('path')
const program = require('commander')

const pkg = require(path.resolve('package.json'))
const config = require(path.resolve('source/config.js'))('./config.json')

program
  .version(pkg.version)

program
  .command('set [key] [value]')
  .description('set a configuration variable')
  .action((key, value) => {
    config.set(key, value)
    config.save(function(err) {
      if (err) {
        console.error(err.message)
        process.exit(1)
        return
      }
      console.log(`successfully set "${key}" to "${value}"`)
    })
  })

program.command('get [key]')
  .description('get a configruation variable’s value')
  .action((key) => console.log(config.get(key)))

program.command('list')
  .description('list all currently defined config vars')
  .action(() => console.log(config.get()))

program.parse(process.argv)

if (!program.args.length) {
  program.help()
  process.exit()
}
