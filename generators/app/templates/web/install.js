var shell = require('shelljs');

var err = null,
    isDarwin = /^darwin/.test(process.platform),
    isWin = /^win/.test(process.platform),
    isLinux = /^linux/.test(process.platform);

InstallGitHooks();
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
