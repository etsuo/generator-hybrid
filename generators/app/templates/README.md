# Setup <%= packageName %>

Make sure you have node installed and run `[project_root]/[platform]$ npm install`.

This will install all of your dev dependencies as well as your .js dependencies. `npm install` can be run as often as you
want / need. In fact, anytime you notice that any package.json or bower.json has been updated, you should re-run
npm install.

To get a list of things you can execute with npm run, `[project_root]/[platform]$ npm run`.

Where platform is `web/` || `mobile/` || `common/` depending on which platform you're working on.

You can access `gulp`, `bower`, and `eslint` via the `[project_root]/[platform]$npm run` command.

# Mobile
This project uses Ionic Framework (www.ionicframework.com), which is built on top of Cordova.

When you run `[project_root]/mobile$ npm install`, in addition to all the npm packages and bower packages
that get installed, the install will also attempted to determine if you already have `ionic`, `cordova`, and `gulp`
installed globally. If any of these are missing, the install script will do a `sudo npm install -g` of the missing
package. This will require that you provide your admin password.

Before you get too far down the path... if you don't understand the `ionic` command line utility,
you'll want to cuddle up with: https://github.com/driftyco/ionic-cli

## Android
Make sure your $ANDROID_HOME env variable is set.

If you did `brew install android`, then you can have the following in your .bash_profile:

export ANDROID_HOME=`brew --prefix android`
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH

If you get an error stating `ERROR: Error: Please install Android target: "android-22".` when you try tp `ionic emulate android`, you should `$ android` from your bash shell with the environmental variables mentioned above set. Once there, make sure you install whatever it's complaining about.

# ESLint and WebStorm (etc.)
Because you have not installed ESLint globally, you'll need to configure your Webstorm project to point to your npm locally installed eslint bin.

On a Mac, you would find the settings by:

1. Command-,
1. Languages & Frameworks
1. Javascript
1. Code Quality Tools
1. ESLint

ESLint Package should be something like: `/Users/user_name/dev/forks/quiknurse-prototype/mobile/node_modules/eslint`
... where user_name is, well, your username.

You need to give an absolute path.

Note: You'll be tempted to globally install eslint. If you do this, understand that you'll also have to globally install each eslint plugin... then manage the versions, etc. It'll be sad days. Don't do it.
