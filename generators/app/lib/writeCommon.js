'use strict';

var copyFiles = require('./copyFiles'),
    mkdirp = require('mkdirp');

module.exports = writeCommon;

function writeCommon() {
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
}
