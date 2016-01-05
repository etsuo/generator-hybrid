var shell = require('shelljs'),
    err = null,
    isDarwin = /^darwin/.test(process.platform),
    isWin = /^win/.test(process.platform),
    isLinux = /^linux/.test(process.platform);

InstallGitHooks();
InstallNpmGlobals();
IonicStateReset();
RunBower();
RunGulp();

//////////
// git hooks *******************************************************************
function InstallGitHooks() {
    console.log('\nInstalling git hooks');
    // make the .git/hooks directory
    console.log('... making the directory');
    shell.mkdir('-p', '../.git/hooks');
    err = shell.error();
    if (err) {
        console.log('Error creating hooks directory in ../.git/hooks\n' + err);
        shell.exit(1);
    } else {
        // copy the hooks
        console.log('... copying the file');
        shell.cp('-f', '../scripts/git/*', '../.git/hooks');
        err = shell.error();
        if (err) {
            console.log('Error copying files into ../.git/hooks\n');
            shell.exit(1);
        } else {
            // set the hooks to executable
            console.log('... making the hooks executable');
            shell.ls('../.git/hooks/*.*').forEach(function (file) {
                shell.chmod(755, file);
                err = shell.error();
                if (err) {
                    console.log('Error with chmod 755 of ' + file + '\n' + err);
                    shell.exit(1);
                }
            });
        }
    }
}
// Install npm global dependencies *********************************************
function InstallNpmGlobals() {
    var sudo = (isWin) ? '' : 'sudo ';
    console.log("Checking to see if you need to install ionic, cordova, ios-sim and gulp globally (as required by Ionic Framework).");

    // check for cordova
    if (!isInstalled('cordova')) {
        Install('cordova');
    }
    // check for ionic
    if (!isInstalled('ionic')) {
        Install('ionic');
    }
    // check for gulp
    if (!isInstalled('gulp')) {
        Install('gulp');
    }
    // check of ios-sim if on darwin
    if (isDarwin && !isInstalled('ios-sim')) {
        Install('ios-sim');
    }
    // check of ios-deploy if on darwin
    if (isDarwin && !isInstalled('ios-deploy')) {
        // This is a hack / workaround for: https://github.com/phonegap/ios-deploy/issues/109
        console.log('...ios-deploy not found. Installing');
        if (shell.exec('sudo npm install --global --unsafe-perm ios-deploy').code != 0) {
            console.log('Error installing: ' + package);
            shell.exit(1);
        }
    }

    function isInstalled(package) {
        return (shell.exec('npm list -g --depth=0 | grep -q ' + package, {silent: true}).code == 0);
    }

    function Install(package) {
        console.log('...' + package + ' not found. Installing');
        if (shell.exec(sudo + 'npm install -g ' + package).code != 0) {
            console.log('Error installing: ' + package);
            shell.exit(1);
        }
    }
}

// Ionic State Reset ***********************************************************
function IonicStateReset() {
    console.log('Running ionic state reset');

    if (shell.exec('ionic state reset').code != 0) {
        console.log('Error running ionic state reset');
        shell.exit(1);
    }
}

// Bower ************************************************************************
function RunBower() {
    console.log('Running bower install');

    if (shell.exec('npm run bower install').code != 0) {
        console.log('Error running bower');
        shell.exit(1);
    }
}

// Gulp ************************************************************************
function RunGulp() {
    console.log('Running gulp to verify your project builds');

    if (shell.exec('gulp').code != 0) {
        console.log('Error running gulp');
        shell.exit(1);
    }
}
