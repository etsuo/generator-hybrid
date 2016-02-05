'use strict';

module.exports = copyFiles;

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

                if (typeof(path[1]) === 'string') {

                    this.fs.copy(
                        this.templatePath(path[0]),
                        this.destinationPath(path[1])
                    );

                } else if (typeof(path[1]) === 'object') {

                    this.fs.copyTpl(
                        this.templatePath(path[0]),
                        this.destinationPath(path[0]),
                        path[1]
                    );

                } else {
                    throw 'Error with copying file, something is configured in an unexpected way';
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
