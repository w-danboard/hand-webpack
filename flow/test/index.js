const PLUGIN_NAME = 'test';
const { readFileSync, writeFileSync } = require('fs-extra');
const { resolve } = require('path');

class testPlugin {
  constructor (options) {
    this.options = options;
  }

  apply (compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      const file = await readFileSync(resolve(this.options.staticDir, this.options.fileName))
      console.log(file);
      // await writeFileSync(resolve(this.options.staticDir, this.options.target), file);
    });
  }
};

module.exports = testPlugin;