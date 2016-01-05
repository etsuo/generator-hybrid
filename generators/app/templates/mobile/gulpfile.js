/*eslint-disable*/

/* Dependencies
 ***********************************************************/
var gulp = require('gulp-help')(require('gulp'), {
    aliases: ['h', '?'],
    afterPrintCallback: helpOptions
});

var argv = require('yargs').argv,
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    filelog = require('gulp-filelog'),
    gulpDebug = require('gulp-debug'),
    gulpif = require('gulp-if'),
    insert = require('gulp-insert'),
    karma = require('karma').Server,
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    ngAnnotate = require('gulp-ng-annotate'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    run = require('run-sequence'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    watch = require('gulp-watch');

/* Initialization
 ***********************************************************/
var machine_gen_warning = "/*\n*\tWARNING: This is machine generated.\n*\tYou're wasting your time if you edit this file.\n*/\n\n";

var paths = {
    html: [
        'app/**/*.html',
        '../common/**/*.html',
        '!app/index.html',
        '!app/lib/managed/**'
    ],
    img: [
        'app/img/**/*'
    ],
    js: [
        // module.js needs to load first to insure that the modules
        // exist before the other components are added to the modules
        'mobile/app/**/module.js',
        'common/**/module.js',
        'common/**/*.js',
        'mobile/app/**/*.js',
        '!mobile/app/lib/managed/**',
        '!mobile/app/**/*.test.js'
    ],
    tests: [
        'mobile/app/**/*.test.js'
    ],
    css: [
        'app/css/**/**',
        '!app/css/**/*.less',
        '!app/css/**/*.scss'
    ],
    sass: [
        'app/app.scss',
        'app/**/*.scss',
        '!app/lib/managed/**'
    ]
};

argv.production = (argv.production) ? true : false;
if (argv.production == false && process.env.ENV == 'production') {
    argv.production = true;
}

var debug = process.env.DEBUG;

console.log('\033[0;31m\033[40m');
console.log('Running in production mode: ' + argv.production + '\033[0m');

/* Gulp Tasks
 ***********************************************************/

// JS Build Related
gulp.task('assets', false, assets);
gulp.task('build', 'Removes previous builds, compiles js, compiles less', build);
gulp.task('js', 'Compiles js', js);
gulp.task('jsTests', 'Compiles js tests', jsTests);

// JS Test Related
gulp.task('eslint', 'Lints your code', lint);
gulp.task('runTests', false, runTests);
gulp.task('rebuildAndTest', false, rebuildAndTest);
gulp.task('test', 'Run tests (same as gulp build)', build);

// CSS Related
gulp.task('css', 'Generates CSS from sass and less files', css);
gulp.task('cpcss', false, cpcss);
gulp.task('sass', 'Compile sass', sassTask);

// HTML & Images
gulp.task('html', 'Compile HTML', html);
gulp.task('img', 'Compile Images', img);

// Utility Related
gulp.task('clean', 'Removes previous builds', clean);
gulp.task('coverage', 'Runs tests and serves up a coverage report', coverage);
gulp.task('noTests', false, []);
gulp.task('nuke', 'Remove all dependencies. Run npm install after this to restore your dependencies', nuke);
gulp.task('outdated', 'List outdated npm globals and locals and bower dependencies that have an update available', outdated);
gulp.task('precommit', 'Should be called before a commit with exit 0', precommit);
gulp.task('watch', false, watchTask);

// Default
gulp.task('default', 'Builds the project, adds watchers, then starts the server (same as gulp build)', build);


/* Implementation Details //////////
 ***********************************************************/

function assets() {
    var assets = useref.assets();

    return gulp.src('app/index.html')
        .pipe(plumber())
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('www'));
}

function build(done) {
    var runTests = (argv.production) ? 'noTests' : 'runTests',
        buildTests = (argv.production) ? 'noTests' : 'jsTests';

    run(
        'clean',
        ['eslint', 'js', buildTests, 'css', 'html', 'img'],
        'assets',
        runTests,
        done
    );
}

function clean() {
    return del([
        'www/**/*'
    ]);
}

function cpcss() {
    // copy css directory
    return gulp.src(paths.css)
        .pipe(plumber())
        .pipe(gulp.dest('www/css'));
}

function css(done) {
    run(
        'cpcss',
        'sass',
        next
    );

    function next() {
        connect.reload();
        done();
    }
}

function sassTask() {
    return gulp.src(paths.sass)
        .pipe(plumber())
        .pipe(debugOutput('sassTask'))
        .pipe(concat('app.min.css'))
        .pipe(insert.prepend(machine_gen_warning))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }))
        .pipe(gulpif(argv.production, minifyCss({
            keepSpecialComments: 0
        })))
        .pipe(gulp.dest('./www/css/'));
}

function helpOptions() {
    console.log('\toptions:');
    console.log('\tTo pass arguments: ...$ npm run gulp -- --lintfail\n')
    console.log('\t--production\tBuild the system for production. Output will be in deploy/');
    console.log('\t--port=x\tOverrides the default 8080 port when launching the test server');
    console.log('\t--lintfail\tCauses ESLint to exit > 0 if there is a lint error');

    console.log('');
    console.log('\t$ ENV=production ionic serve');
    console.log('\t\tPasses a command line environment variable to set production mode');
    console.log('\t$ DEBUG=1 gulp [args]');
    console.log('\t\tSets task to debug mode 1 (uses gulp-filelog)');
    console.log('\t$ DEBUG=2 gulp [args]');
    console.log('\t\tSets task to debug mode 2 (uses gulp-debug)');
    console.log('\n\n\033[0;31m\033[40m');

    console.log('\tFor general use, you should be fine with: ...$ npm run gulp\n');
    console.log('\tThis will run the default task, which compiles everything and launches a test server');
    console.log('\twhile continually looking for changes in relevant files and refreshing the server.\033[0m');
    console.log('\n\n');
}

function html() {
    var opts = {
        empty: true
    };

    return gulp.src(paths.html)
        .pipe(plumber())
        .pipe(debugOutput('html'))
        .pipe(gulpif(argv.production, minifyHtml(opts)))
        .pipe(gulp.dest('www/'))
        .pipe(connect.reload());
}

function img() {
    return gulp.src(paths.img)
        .pipe(plumber())
        .pipe(debugOutput('img'))
        .pipe(gulp.dest('www/img'))
        .pipe(connect.reload());
}

function js() {

    if (argv.production) {
        return gulp.src(paths.js, {cwd: '../'})
            .pipe(plumber())
            .pipe(debugOutput('js'))
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(uglify({mangle: true}))
            .pipe(gulp.dest('www/'))
            .pipe(connect.reload());
    } else {
        return gulp.src(paths.js, {cwd: '../'})
            .pipe(plumber())
            .pipe(debugOutput('js'))
            .pipe(sourcemaps.init({debug: true}))
            .pipe(concat('app.js'))
            .pipe(ngAnnotate())
            .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../app'}))
            .pipe(gulp.dest('www/'))
            .pipe(connect.reload());
    }

}

function jsTests() {
    return gulp.src(paths.tests, {cwd: '../'})
        .pipe(plumber())
        .pipe(debugOutput('jsTest'))
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('app.test.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '../app'}))
        .pipe(gulp.dest('www/'))
        .pipe(connect.reload());
}

function lint() {
    return gulp.src(paths.js, {cwd: '../'})
        .pipe(plumber())
        .pipe(debugOutput('lint'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulpif(argv.lintfail, eslint.failAfterError()));
}

function outdated() {
    return gulp.src('')
        .pipe(shell([
            echoHeader('Outdated npm Globals'),
            npm('outdated -g'),
            echoHeader('Outdated npm Locals'),
            npm('outdated'),
            echoHeader('Available bower packages'),
            bower()
        ]));

    //////////
    function echoCRLF() {
        return 'echo ';
    }

    function echoLine() {
        return 'echo -----------------------------------------------------------';
    }

    function echoTitle(title) {
        return 'echo "\033[0;30m\033[41m ' + title + ' \033[0m"';
    }

    function echoHeader(title) {
        return echoCRLF() + ' && ' + echoLine() + ' && ' + echoTitle(title);
    }

    function npm(cmd) {
        return 'npm ' + cmd;
    }

    function bower() {
        return 'bower list | grep -v │ | grep available | sort';
    }
}

function precommit(done) {
    argv.lintfail = true;

    run(
        'build'
    )
}

function rebuildAndTest(done) {
    var runTests = (argv.production) ? 'noTests' : 'runTests',
        buildTests = (argv.production) ? 'noTests' : 'jsTests';

    run(
        ['eslint', 'js', buildTests],
        runTests,
        next
    );

    function next() {
        connect.reload();
        done();
    }
}

function runTests(done) {
    var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, next).start();

    // TODO - fix QUIKMOB-63
    function next() {
        //gulp.src('coverage/coverage-karma.json')
        //    .pipe(debugOutput('runTests'))
        //    .pipe(remapIstanbul({
        //        reports: {
        //            'json': 'coverage/coverage.json'
        //            //'html': 'coverage/html-report'
        //        }
        //    }), function () {
        //        done();
        //    });
        done();
    }
}

function watchTask() {
    var options = {cwd: '../'};

    watch(paths.js, options, function () {
        gulp.start('rebuildAndTest');
    });

    watch(paths.tests, options, function () {
        gulp.start('rebuildAndTest');
    });

    watch(paths.sass, function () {
        gulp.start('css');
    });

    watch(paths.css, function () {
        gulp.start('css');
    });

    watch('app/index.html', function () {
        gulp.start('assets');
    });

    watch(paths.html, function () {
        gulp.start('html');
    });

    watch(paths.img, function () {
        gulp.start('img')
    });
}

function nuke() {
    del([
        '.bower/',
        'node_modules/',
        'app/lib/managed/',
        'platforms',
        'plugins'
    ]).then(function (paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
}

function coverage(done) {
    run('build', 'watchTask', serve);

    function serve() {
        connect.server({
            port: 5050,
            livereload: true,
            root: ["coverage/html"],
            fallback: "coverage/html/index.html"
        });
        done();
    }

}

function debugOutput(location) {
    if (debug == 1) {
        return filelog(location);
    } else if (debug == 2) {
        return gulpDebug({title: location, minimal: false})
    } else {
        return gulpif(false, connect.reload()); // noop: will never be true
    }
}

/*eslint-enable*/
