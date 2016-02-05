'use strict';

var ejs = require('ejs'),
    escodegen = require('escodegen'),
    mkdirp = require('mkdirp');

var copyFiles = require('./copyFiles'),
    copyJson = require('./copyJson'),
    codeTweaker = require('./tweakCode');

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
        ['web/gulpfile.js', {
            webServerPort: this.props.webServerPort
        }],
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
    copyJson.bind(this)('web/bower.json', bowerConfig.bind(this)());

    /*
     * Project
     ******************************************************************************************************************/
    var webApp = [
        'web/app/components',
        'web/app/home',
        'web/app/app.cfg.js',
        'web/app/app.ctrl.js',
        'web/app/app.rtr.js',
        ['web/app/app.scss', {
            cssFramework: appScssCssFramework(this.props.webCssLibrary)
        }],
        'web/app/app.test.js'
    ];

    mkdirp.sync('web/app/css');
    mkdirp.sync('web/app/img');
    copyFiles.bind(this)(webApp);
    buildModuleJS.bind(this)();

    var indexTemplate = {
        cssAdditions: cssAditionsTemplate(this.props.webCssLibrary),
        cssFramework: cssFrameworkIndexTemplate(this.props.webCssLibrary),
        cssFrameworkDependencies: cssFrameworkDependenciesTemplate(this.props.webCssLibrary),
        packageDescription: this.props.packageDescription,
        projectName: this.props.packageName
    };
    indexTemplate.htmlTemplate = htmlTemplate.bind(this)(this.props.webCssLibrary, indexTemplate);
    copyFiles.bind(this)([['web/app/index.html', indexTemplate]]);
}

///////////

function appScssCssFramework(framework) {
    // Add the selected CSS framework's SCSS source to app.scss so you don't end up needing to include the css file
    // separately in the index.html file.
    if (framework.toLowerCase() === 'angularmaterial') {
        return "@import 'lib/managed/angular-material/angular-material.scss';"
    }
}

function bowerConfig() {
    var bower = {
        "name": this.props.packageName
    };

    switch (this.props.webCssLibrary.toLowerCase()) {
        case 'angularmaterial':
            bower.dependencies = {
                'angular-animate': '^1.4.9',
                'angular-aria': '^1.4.9',
                'angular-material': '^1.0.x'
            };
            break;

        case 'uibootstrap':
            bower.dependencies = {
                'angular-bootstrap': '^1.0.3',
                'bootstrap': '^3.3.6'
            };
            break;

        case 'none':
            break;

        default:
            throw "Unexpected webCssLibrary";
    }

    return bower;
}

function buildModuleJS() {
    // build web/app/module.js
    var tweaker = codeTweaker(this.fs.read(this.templatePath('web/app/module.js')));
    switch (this.props.webCssLibrary.toLowerCase()) {
        case 'angularmaterial':
            tweaker.addModuleDependency('ngMaterial');
            break;
        case 'uibootstrap':
            tweaker.addModuleDependency('ui.bootstrap');
            break;
        case 'none':
            break;
        default:
            throw "Unexpected webCssLibrary";
    }
    this.fs.write(this.destinationPath('web/app/module.js'), tweaker.getCode());
}

function cssFrameworkDependenciesTemplate(framework) {
    // Add to index.html some specific JS dependencies if installing angular-material
    var template = '';

    switch (framework.toLowerCase()) {
        case 'angularmaterial':
            template = '<script src="lib/managed/angular-animate/angular-animate.js"></script>\n'
                + '    <script src="lib/managed/angular-aria/angular-aria.js"></script>\n'
                + '    <!-- endbuild -->';
            break;
        case 'uibootstrap':
            template = '<script src="lib/managed/angular-animate/angular-animate.js"></script>\n'
                + '    <!-- endbuild -->';
            break;
        case 'none':
            template += '<!-- endbuild -->';
            break;
        default:
            throw "Unexpected webCssLibrary";
    }

    return template;
}

function cssAditionsTemplate(framework) {
    var template = '';

    switch (framework.toLowerCase()) {
        case 'angularmaterial':
            break;
        case 'uibootstrap':
            template += '<!--build:css css/bootstrap.min.css -->\n';
            template += '    <link href="lib/managed/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">\n';
            template += '    <!-- endbuild -->\n';
            break;
        case 'none':
            break;
        default:
            throw "Unexpected webCssLibrary";
    }

    return template;
}

function cssFrameworkIndexTemplate(framework) {
    // Add to index.html the script dependency for the CSS framework (angular-material, or ui-bootstrap, or none)
    var template = '';

    switch (framework.toLowerCase()) {
        case 'angularmaterial':
            template += '<script src="lib/managed/angular-material/angular-material.js"></script>\n'
                + '    <!-- endbuild -->\n';
            break;
        case 'uibootstrap':
            template += '<script src="lib/managed/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>\n'
                + '    <!-- endbuild -->\n';
            break;
        case 'none':
            template += '<!-- endbuild -->\n';
            break;
        default:
            throw "Unexpected webCssLibrary";
    }

    return template;
}

function htmlTemplate(framework, template) {
    var templateFile = '';

    switch (framework.toLowerCase()) {
        case 'angularmaterial':
            templateFile = 'web/app/index.material.tmpl.html';
            break;
        case 'uibootstrap':
            templateFile = 'web/app/index.bootstrap.tmpl.html';
            break;
        case 'none':
            templateFile = 'web/app/index.none.tmpl.html';
            break;
        default:
            throw "Unexpected webCssLibrary";
    }

    var html = this.fs.read(this.templatePath(templateFile));
    return ejs.render(html, template);
}
