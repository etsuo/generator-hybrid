'use strict';
var assert = require('yeoman-assert'),
    helper = require('yeoman-test'),
    path = require('path');

describe.skip('generator-hybrid:app', function () {

    before(function (done) {
        helper.run(path.join(__dirname, '../generators/app'))
            .withOptions({someOption: true})
            .withPrompts({someAnswer: true})
            .on('end', done);
    });

    it('creates files', function () {
        assert.file([
            'dummyfile.txt'
        ]);
    });
});
