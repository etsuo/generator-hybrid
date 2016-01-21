'use strict';

var escodegen = require('escodegen'),
    esprima = require('esprima'),
    mkdirp = require('mkdirp');

var copyFiles = require('./copyFiles'),
    copyJson = require('./copyJson'),
    walkCode = require('./walkCode');

module.exports = writeWeb;

function writeWeb() {

    /*
     * General Setup
     ******************************************************************************************************************/
    var web = [
        'web/.bowerrc',
        'web/.eslintignore',
        'web/.eslintrc',
        ['web/.gitignore_template', 'web/.gitignore'],
        'web/gulpfile.js',
        'web/install.js',
        'web/karma.conf.js',
        ['web/package.json', {
            packageName: this.props.packageName,
            packageDescription: this.props.packageDescription,
            packageVersion: this.props.packageVersion,
            packageAuthor: this.props.packageAuthor,
            packageLicense: this.props.packageLicense,
            packagePrivate: this.props.packagePrivate
        }]
    ];

    mkdirp.sync('web/www');
    copyFiles.bind(this)(web);

    // some bower specifics
    var bower = {
        "name": this.props.packageName
    };
    switch (this.props.webCssLibrary.toLowerCase()) {
        case 'angularmaterial':
            bower.dependencies = {'angular-material': '^1.0.x'};
            break;

        case 'uibootstrap':
            bower.dependencies = {'angular-bootstrap': '^1.0.3'};
            break;

        case 'none':
            break;

        default:
            throw "Unexpected webCssLibrary";
    }
    copyJson.bind(this)('web/bower.json', bower);

    /*
     * Project
     ******************************************************************************************************************/
    var webApp = [
        'web/app/components',
        'web/app/home',
        'web/app/app.cfg.js',
        'web/app/app.ctrl.js',
        'web/app/app.rtr.js',
        'web/app/app.scss',
        'web/app/app.test.js',
        'web/app/index.html',
        'web/app/module.js'
    ];

    mkdirp.sync('web/app/css');
    copyFiles.bind(this)(webApp);

    var codeWalker = new walkCode(this.fs.read(this.templatePath('web/app/module.js')));

    var target = codeWalker.f('body');
    console.log(JSON.stringify(target, null, 2));

    //console.log(JSON.stringify(codeWalker.tree, null, 2));
    //console.log('----------------------------');
    //console.log(escodegen.generate(codeWalker.tree).replace("}());", "})();"));
}
