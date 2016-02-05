'use strict';

var merge = require('deepmerge');

module.exports = copyJson;

function copyJson(source, adds) {
    var json = this.fs.readJSON(this.templatePath(source));

    this.fs.writeJSON(this.destinationPath(source), merge(json, adds));
}
