'use strict';

var copyFiles = require('./copyFiles'),
    mkdirp = require('mkdirp');

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
        ['web/bower.json', {packageName: this.props.packageName}],
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
}
