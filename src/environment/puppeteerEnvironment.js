const chalk = require('chalk')
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')
const fs = require('fs')
const constants = require('./constants')
const logger =require('../logger')

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    // console.log(chalk.yellow('Setup Test Environment.'));
    logger.info('Setup Test Environment.');
    await super.setup()
    const wsEndpoint = fs.readFileSync(constants.WS_ENDPOINT_PATH, 'utf8')
    if (!wsEndpoint) {
      logger.error('wsEndpoint not found');
      throw new Error('wsEndpoint not found');
    }
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
    this.global.browser = this.global.__BROWSER__;
    this.global.page = await this.global.__BROWSER__.newPage()
  }

  async teardown() {
    // console.log(chalk.yellow('Teardown Test Environment.'));
    logger.info('Teardown Test Environment.');
    await super.teardown()
    
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = PuppeteerEnvironment