'use strict';

var fs = require('fs'),
    semver = require('semver'),
    yosay = require('yosay');

module.exports = prompts;

function prompts() {

    this.log(yosay(
        'Setting up a hybrid mobile and web portal project.'
    ));

    var done = this.async(),
        hybridConfig = getHybridConfig();

    var prompts = [];

    // General Questions -----------------------------------------------------------------------------------------------
    this.props = {};

    prompts = prompts.concat([
        {
            message: 'What is the name of this project?',
            type: 'input',
            name: 'packageName',
            filter: function (input) {
                return input.split(' ').join('-').toLowerCase();
            },
            validate: validNameNPM,
            when: (this.headless)
                ? (this.props.packageName = 'test', false)
                : true
        }, {
            message: 'Describe your project for package.json:',
            type: 'input',
            name: 'packageDescription',
            when: (this.headless)
                ? (this.props.packageDescription = 'test', false)
                : true
        }, {
            message: 'Version:',
            type: 'input',
            name: 'packageVersion',
            default: hybridConfig.packageVersion || '',
            validate: validateVersion,
            when: (this.headless)
                ? (this.props.packageVersion = hybridConfig.packageVersion || '0.0.0', false)
                : true
        }, {
            message: 'Author:',
            type: 'input',
            name: 'packageAuthor',
            default: hybridConfig.packageAuthor || '',
            when: (this.headless)
                ? (this.props.packageAuthor = hybridConfig.packageAuthor || '', false)
                : true
        }, {
            message: 'Author email:',
            type: 'input',
            name: 'packageAuthorEmail',
            default: hybridConfig.packageAuthorEmail || '',
            when: (this.headless)
                ? (this.props.packageAuthorEmail = hybridConfig.packageAuthorEmail || '', false)
                : true
        }, {
            message: 'Author website',
            type: 'input',
            name: 'packageAuthorWeb',
            default: hybridConfig.packageAuthorWeb || '',
            when: (this.headless)
                ? (this.props.packageAuthorWeb = hybridConfig.packageAuthorWeb || '', false)
                : true
        }, {
            message: 'License (for private use UNLICENSED):',
            type: 'list',
            name: 'packageLicense',
            choices: hybridConfig.packageLicense || ['UNLICENSED', 'MIT'],
            when: (this.headless)
                ? (this.props.packageLicense = hybridConfig.packageLicense || 'UNLICENSED', false) : true
        }, {
            message: 'Will this be a private project? (only mark no if you plan to publish the NPM module):',
            type: 'confirm',
            name: 'packagePrivate',
            default: (hybridConfig.packagePrivate !== undefined) ? hybridConfig.packagePrivate : true,
            when: (this.headless)
                ? (this.props.packagePrivate = (hybridConfig.packagePrivate !== undefined) ? hybridConfig.packagePrivate : true, false)
                : true
        }]);

    // Installation Scope  ---------------------------------------------------------------------------------------------
    prompts = prompts.concat([
        {
            message: 'Install Mobile Project?:',
            type: 'confirm',
            name: 'installMobile',
            default: (hybridConfig.installMobile !== undefined) ? hybridConfig.installMobile : true,
            when: (this.headless)
                ? (this.props.installMobile = (hybridConfig.installMobile !== undefined) ? hybridConfig.installMobile : true, false)
                : true
        }, {
            message: 'Install Web Project?:',
            type: 'confirm',
            name: 'installWeb',
            default: (hybridConfig.installWeb !== undefined) ? hybridConfig.installWeb : true,
            when: (this.headless)
                ? (this.props.installWeb = (hybridConfig.installWeb !== undefined) ? hybridConfig.installWeb : true, false)
                : true
        }
    ]);

    // Mobile ----------------------------------------------------------------------------------------------------------
    prompts = prompts.concat([
        {
            message: 'Project name for ionic.io:',
            type: 'input',
            name: 'ionicProjectName',
            filter: function (input) {
                return input.split(' ').join('-').toLowerCase();
            },
            default: function (vals) {
                return vals.packageName;
            },
            when: (this.headless)
                ? (this.props.ionicProjectName = hybridConfig.ionicProjectName || this.props.packageName, false)
                : doMobile
        }]);

    // Web -------------------------------------------------------------------------------------------------------------
    prompts = prompts.concat([
        {
            message: 'CSS Library:',
            type: 'list',
            name: 'webCssLibrary',
            choices: ['AngularMaterial', 'UIBootstrap', 'None'],
            default: hybridConfig.webCssLibrary || 'AngularMaterial',
            when: (this.headless)
                ? (this.props.webCssLibrary = hybridConfig.webCssLibrary || 'AngularMaterial', false)
                : doWeb
        }
    ]);

    // Installation ----------------------------------------------------------------------------------------------------
    prompts = prompts.concat([
        {
            message: 'Install dependencies (bower, npm, etc)?:',
            type: 'confirm',
            name: 'installDeps',
            default: (hybridConfig.installDeps !== undefined) ? hybridConfig.installDeps : true,
            when: (this.headless)
                ? (this.props.installDeps = (hybridConfig.installDeps !== undefined) ? hybridConfig.installDeps : true, false)
                : true
        }, {
            message: 'Initialize a git repo?:',
            type: 'confirm',
            name: 'initGit',
            default: (hybridConfig.initGit !== undefined) ? hybridConfig.initGit : true,
            when: (this.headless)
                ? (this.props.initGit = (hybridConfig.initGit !== undefined) ? hybridConfig.initGit : true, false)
                : true
        }]);


    this.prompt(prompts, function (props) {
        if (!this.headless) {
            // To access props later use this.props.someOption;
            this.props = props;
        }

        done();
    }.bind(this));


    function doMobile(vals) {
        return vals.installMobile;
    }

    function doWeb(vals) {
        return vals.installWeb;
    }
}

function getHybridConfig() {
    var hybridConfigPath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.hybridconfig.json',
        hybridConfigContnet = '';

    try {
        hybridConfigContnet = fs.readFileSync(hybridConfigPath, 'utf8');
        var hybridConfig;
        try {
            hybridConfig = JSON.parse(hybridConfigContnet);
            return hybridConfig
        } catch (e) {
            console.log('Error with .hybridconfig.json - it is being ignored.\n Error:\n\t' + e);
            return {}
        }
    } catch (e) {
        console.log(e);
    }
}

function validateVersion(input) {
    if (semver.valid(input)) {
        return true;
    }

    return 'Your version number must be parsable by semver. For example: 0.0.1';
}

function validNameNPM(input) {
    if (input.length == 0) {
        return 'This is a required field';
    }

    if (input.length > 214) {
        return 'Your project name must be less than 214 characters';
    }

    if (input.startsWith('.') || input.startsWith('_')) {
        return 'Your project name cannot start with an _ or .';
    }

    var urlInvalids;
    if (input.startsWith('@')) {
        urlInvalids = input.match(/[:?#\[\]!$&'"*+,;=\(\)]/g);
        var atMatches = input.match(/[@]/g);
        var validSlashes = input.match(/[/]/g);

        var also = (urlInvalids && urlInvalids.length > 0) ? ' --- also, these are not valid ' + urlInvalids.join(' ') : '';

        if (atMatches && atMatches.length > 1) {
            return 'An NPM scoped package name must only contain @ at the start of the name' + also;
        } else if (validSlashes && validSlashes.length > 1) {
            return 'An NPM scoped package name must only contain a single /' + also;
        }
        else if (urlInvalids && urlInvalids.length > 0) {
            return 'NPM names are used in URLs and must therefore not include invalid characters like ' + urlInvalids.join(' ');
        }

    } else {

        urlInvalids = input.match(/[/@:?#\[\]!$&'"*+,;=\(\)]/g);
        if (urlInvalids) {
            return 'NPM names are used in URLs and must therefore not include invalid characters like ' + urlInvalids.join(' ');
        }
    }
    return true;
}
