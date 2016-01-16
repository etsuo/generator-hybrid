'use strict';

var chalk = require('chalk'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    semver = require('semver'),
    yeoman = require('yeoman-generator'),
    yosay = require('yosay');

var generator = {
    prompting: prompting,
    configuring: configuring,
    writing: writing,
    install: install
};

module.exports = yeoman.Base.extend(generator);

///////////
function prompting() {
    this.log(yosay(
        'Setting up a hybrid mobile and web portal project.'
    ));

    var done = this.async(),
        hybridConfig = getHybridConfig();

    var prompts = [
        // package.json
        {
            type: 'input',
            name: 'packageName',
            message: 'What is the name of this project?',
            validate: validNameNPM
        }, {
            type: 'input',
            name: 'packageDescription',
            message: 'Describe your project for package.json:'
        }, {
            type: 'input',
            name: 'packageVersion',
            message: 'Version:',
            default: hybridConfig.packageVersion || '',
            validate: validateVersion
        }, {
            type: 'input',
            name: 'packageAuthor',
            message: 'Author:',
            default: hybridConfig.packageAuthor || ''
        }, {
            type: 'input',
            name: 'packageAuthorEmail',
            message: 'Author email:',
            default: hybridConfig.packageAuthorEmail || ''
        }, {
            type: 'input',
            name: 'packageAuthorWeb',
            message: 'Author website',
            default: hybridConfig.packageAuthorWeb || ''
        }, {
            type: 'list',
            name: 'packageLicense',
            message: 'License (for private use UNLICENSED):',
            choices: hybridConfig.packageLicense || ['UNLICENSED', 'MIT']
        }, {
            type: 'confirm',
            name: 'packagePrivate',
            message: 'Will this be a private project? (only mark no if you plan to publish the NPM module):',
            default: (hybridConfig.packagePrivate !== undefined) ? hybridConfig.packagePrivate : true
        }
        // ionic.project
        , {
            type: 'input',
            name: 'ionicProjectName',
            message: 'Project name for ionic.io:',
            default: function (vals) {
                return vals.packageName;
            }
        }
        // installations
        , {
            type: 'confirm',
            name: 'installDeps',
            message: 'Install dependencies (bower, npm, etc)?:',
            default: (hybridConfig.installDeps !== undefined) ? hybridConfig.installDeps : true
        }, {
            type: 'confirm',
            name: 'initGit',
            message: 'Initialize a git repo?:',
            default: (hybridConfig.initGit !== undefined) ? hybridConfig.initGit : true
        }
    ];

    this.prompt(prompts, function (props) {
        this.props = props;
        // To access props later use this.props.someOption;

        done();
    }.bind(this));

    /////
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

    function validateVersion(input) {
        if (semver.valid(input)) {
            return true;
        }

        return 'Your version number must be parsable by semver. For example: 0.0.1';
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
    }

}

function configuring() {
    this.props.packageNameSafe = this.props.packageName.split(' ').join('-').toLowerCase();
    this.props.ionicProjectName = this.props.ionicProjectName.split(' ').join('-').toLowerCase();
}

function writing() {
    /*
     * Common Project Root Stuff
     ********************************************************************************************************************/
    var common = [
        'common',
        'scripts',
        '.editorconfig',
        '.gitattributes',
        ['.gitignore_template', '.gitignore'],
        ['README.md', {packageName: this.props.packageName}]
    ];

    // License Template
    if (this.props.packageLicense === 'MIT') {
        common.push(['LICENSE', {
            year: new Date().getFullYear(),
            packageAuthor: this.props.packageAuthor,
            packageAuthorEmail: this.props.packageAuthorEmail,
            packageAuthorWeb: this.props.packageAuthorWeb
        }]);
    }

    mkdirp.sync('common/components');
    mkdirp.sync('common/services');
    copyFiles.bind(this)(common);


    /*
     * Mobile Project (General Setup)
     ********************************************************************************************************************/
    var mobile = [
        'mobile/hooks',
        'mobile/resources',
        'mobile/.bowerrc',
        'mobile/.eslintignore',
        'mobile/.eslintrc',
        ['.gitignore_template', '.gitignore'],
        ['mobile/bower.json', {packageName: this.props.packageNameSafe}],
        ['mobile/config.xml', {
            packageName: this.props.packageNameSafe,
            packageDescription: this.props.packageDescription,
            packageAuthorEmail: this.props.packageAuthorEmail,
            packageAuthorWeb: this.props.packageAuthorWeb

        }],
        'mobile/gulpfile.js',
        'mobile/install.js',
        ['mobile/ionic.project', {ionicProjectName: this.props.ionicProjectName}],
        'mobile/karma.conf.js',
        ['mobile/package.json', {
            packageName: this.props.packageNameSafe,
            packageDescription: this.props.packageDescription,
            packageVersion: this.props.packageVersion,
            packageAuthor: this.props.packageAuthor,
            packageLicense: this.props.packageLicense,
            packagePrivate: this.props.packagePrivate
        }]
    ];
    mkdirp.sync('mobile/components');
    mkdirp.sync('mobile/services');
    mkdirp.sync('mobile/www'); // without this `$ cordova plugin add cordova-plugin-device fails`
    copyFiles.bind(this)(mobile);


    /*
     * Mobile Project (General Setup)
     ********************************************************************************************************************/
    var mobileCode = [

        'mobile/app/components',
        'mobile/app/css/fonts',

        'mobile/app/home',
        ['mobile/app/home/home.html', {
            packageName: this.props.packageNameSafe,
            packageDescription: this.props.packageDescription
        }],

        'mobile/app/more',

        'mobile/app/app.cfg.js',
        'mobile/app/app.ctrl.js',
        'mobile/app/app.rtr.js',
        'mobile/app/app.scss',
        'mobile/app/app.test.js',

        ['mobile/app/index.html', {ionicProjectName: this.props.ionicProjectName}],
        'mobile/app/module.js',
        'mobile/app/tab.ctrl.js',
        'mobile/app/tabs.html'

    ];
    copyFiles.bind(this)(mobileCode);
    mkdirp.sync('mobile/img');


    //////
    function copyFiles(sources) {

        sources.forEach(function (path) {
            if (typeof path === 'string') {

                this.fs.copy(
                    this.templatePath(path),
                    this.destinationPath(path)
                );

            }

            else if (Array.isArray(path)) {
                if (path.length === 2) {

                    if (typeof(path[1] === 'object')) {

                        this.fs.copyTpl(
                            this.templatePath(path[0]),
                            this.destinationPath(path[0]),
                            path[1]
                        );

                    } else {

                        this.fs.copy(
                            this.templatePath(path[0]),
                            this.destinationPath(path[1])
                        );

                    }

                } else {
                    this.log('An array passed into copyFiles must have two members, and they must both be strings: [source, destrination]');
                }
            }

            else {
                this.log('Path: ' + path + ' needs to be either a string or an array');
            }

        }, this);
    }

}

function install() {
    if (this.props.initGit) {
        this.log('Initializing your git repo...');
        this.spawnCommand('git', ['init']);
    }

    if (this.props.installDeps) {
        this.log('Installing dependencies... this may take a while...');
        this.spawnCommand('npm', ['install'], {'cwd': 'mobile'});

    } else {
        this.log('All done. Thanks for playing.');
    }
}
