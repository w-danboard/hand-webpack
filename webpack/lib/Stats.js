class Stats {
  constructor (compilation) {
    console.log('1111')
    this.entries = compilation.entries;
    this.moudules = compilation.modules;
  }
  toJson () {
    return this;
  }
}

module.exports = Stats;