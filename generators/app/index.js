'use strict';

var chalk = require('chalk'),
    yeoman = require('yeoman-generator');

var prompts = require('./lib/prompts'),
    writeCommon = require('./lib/writeCommon'),
    writeMobile = require('./lib/writeMobile'),
    writeWeb = require('./lib/writeWeb');

var generator = {
    constructor: constructor,
    prompting: prompts,
    configuring: configuring,
    writing: writing,
    install: install
};

module.exports = yeoman.Base.extend(generator);

///////////
function constructor() {
    yeoman.Base.apply(this, arguments);
    this.argument('headless', {type: String, required: false});

    this.headless = (this.headless !== undefined);
}

function configuring() {

}

function writing() {

    when(true).run(writeCommon.bind(this));
    when(this.props.installMobile).run(writeMobile.bind(this));
    when(this.props.installWeb).run(writeWeb.bind(this));

}

function install() {
    if (this.props.initGit) {
        this.log('Initializing your git repo...');
        this.spawnCommand('git', ['init']);
    }

    if (this.props.installDeps) {
        this.log('Installing dependencies... this may take a while...');

        when(this.props.installMobile).run(this.spawnCommand, ['npm', ['install'], {'cwd': 'mobile'}]);
        when(this.props.installWeb).run(this.spawnCommand, ['npm', ['install'], {'cwd': 'web'}]);

    }

}

function when(condition) {
    var installer = function () {
    };

    if (condition) {
        installer = function (func) {
            if (arguments.length == 1) {
                func();
            } else if (arguments.length == 2) {
                func.apply(this, arguments[1]);
            } else {
                throw "Error: invalid parameters for when(...).run(...)";
            }
        };
    }

    return {
        run: installer
    }
}
