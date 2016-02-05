module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'www/lib/**/*.js',
            'www/**/*.js'
        ],

        preprocessors: {
            'www/app.js': 'coverage',
            'www/**/*.js': 'sourcemap'
        },

        autoWatch: true,

        frameworks: [
            'jasmine'
        ],

        browsers: ['Chrome', 'Safari'],

        plugins: [
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-jasmine',
            'karma-safari-launcher',
            'karma-spec-reporter',
            'karma-sourcemap-loader'
        ],

        logLevel: 'warn',

        loggers: [
            {type: 'console'}
        ],

        reporters: ['spec', 'coverage'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'html', subdir: 'html'},
                {type: 'text', subdir: '.', file: 'coverage.txt'},
                {type: 'json', subdir: '.', file: 'coverage-karma.json'},
                {type: 'text-summary'}
            ]
        }
    });
};
