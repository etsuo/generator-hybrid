var shell = require('shelljs');

var err = null,
    isDarwin = /^darwin/.test(process.platform),
    isWin = /^win/.test(process.platform),
    isLinux = /^linux/.test(process.platform);

InstallGitHooks();
InstallNpmGlobals();
IonicStateReset();
IonicResourceGenerate();
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
    var sudo = (isWin) ? '' : '';

    console.log("Checking to see if you need to install ionic, cordova, ios-sim and gulp globally (as required by Ionic Framework).");

    var results = shell.exec('npm ls -g -json --depth=0', {silent: true, async: false});

    if (results.code > 0) {
        console.log('ERROR checking npm globally installed packages.\nRequired npm global packages were not installed.\nExit code was: ' + results.code);
        return;
    }

    var json = JSON.parse(results.output);

    install('cordova');
    install('ionic');
    install('gulp');
    install('ios-sim', isDarwin);
    // This is a hack / workaround for: https://github.com/phonegap/ios-deploy/issues/109
    install('ios-deploy', isDarwin, 'npm install --global --unsafe-perm ios-deploy');

    //////////
    function isInstalled(npmPackage) {
        return (json.dependencies[npmPackage] !== undefined)
    }

    function install(npmPackage, osMatch, override) {
        if (osMatch || osMatch === undefined) {
            if (!isInstalled(npmPackage)) {
                console.log('...' + npmPackage + ' not found. Installing');

                var cmd = (override === undefined) ? sudo + 'npm install -g ' + npmPackage : override;
                if (shell.exec(cmd).code != 0) {
                    console.log('Error installing: ' + npmPackage);
                    shell.exit(1);
                }
            } else {
                console.log('...' + npmPackage + ' found:\n' + JSON.stringify(json.dependencies[npmPackage]));
            }
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

function IonicResourceGenerate() {
    console.log('Running ionic resources');

    if (shell.exec('ionic resources').code != 0) {
        console.log('Error running ionic resources');
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
