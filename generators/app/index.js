'use strict';

const chalk = require('chalk'),
    yeoman = require('yeoman-generator');

const prompts = require('./lib/prompts'),
    writeCommon = require('./lib/writeCommon'),
    writeMobile = require('./lib/writeMobile'),
    writeWeb = require('./lib/writeWeb');

const generator = {
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

    try {

        this.option('headless', {
            type: Boolean,
            desc: 'Run generator-hybrid in headless mode. Requires the name argument.'
        });
        this.headless = (this.options.headless !== undefined);

        this.option('name', {
            type: String,
            alias: 'n',
            desc: 'The name of the project for package.json, etc.'
        });
        this.name = this.options.name;
        if (!this.name && this.headless) {
            throw 'The --name option is required when running in --headless mode';
        }

        this.option('description', {
            type: String,
            alias: 'd',
            desc: 'The description of the project for package.json, etc.'
        });
        this.description = this.options.description;

    } catch (e) {
        this.log(e);
        process.exit(1);
    }

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
