'use strict';

var copyFiles = require('./copyFiles'),
    mkdirp = require('mkdirp');

module.exports = writeMobile;

function writeMobile() {

    /*
     * General Setup
     ******************************************************************************************************************/
    var mobile = [
        'mobile/hooks',
        'mobile/resources',
        'mobile/.bowerrc',
        'mobile/.eslintignore',
        'mobile/.eslintrc',
        ['mobile/.gitignore_template', 'mobile/.gitignore'],
        ['mobile/bower.json', {packageName: this.props.packageName}],
        ['mobile/config.xml', {
            packageName: this.props.packageName,
            packageDescription: this.props.packageDescription,
            packageAuthorEmail: this.props.packageAuthorEmail,
            packageAuthorWeb: this.props.packageAuthorWeb

        }],
        'mobile/gulpfile.js',
        'mobile/install.js',
        ['mobile/ionic.project', {ionicProjectName: this.props.ionicProjectName}],
        'mobile/karma.conf.js',
        ['mobile/package.json', {
            packageName: this.props.packageName,
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
     * Project
     ******************************************************************************************************************/
    var mobileCode = [

        'mobile/app/components',
        'mobile/app/css/fonts',

        'mobile/app/home',
        ['mobile/app/home/home.html', {
            packageName: this.props.packageName,
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
}
