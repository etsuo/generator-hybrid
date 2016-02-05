# generator-hybrid [![NPM version][npm-image]][npm-url]  [![Dependency Status][daviddm-image]][daviddm-url]

A [Yeoman](http://yeoman.io) generator that sets up a hybrid multi platform project for concurrently developing native mobile apps (iOS and Andoid), a web-portal, and a desktop app. It trys to follow the [Angular Style Guide](johnpapa/angular-styleguide) whenever possible.

The technologies used include:

* Mobile Apps: Ionic Framework
* Web Portal: AngularJS
* Desktop: Electron (*todo*)

**Note**: This is a work in progress. It's getting worked on as fast as possible between day-to-day obligations. :)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-hybrid using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-hybrid
```

Then generate your new project:

```bash
mkdir new_project
cd new_project
yo hybrid
```

If you told generator-hybrid to install dependencies (npm and bower), then your projects should be good to go. If you said no to this option, you're on your own to get the dependencies installed... but it's not that hard. `npm install` in either the `web` or `mobile` directory will run in the `install.js` script, which includes running bower install.

### Mobile
```bash
$ cd mobile
$ ionic serve -b
```
Then browse to http://localhost:8100

### Web
```bash
$ cd web
$ gulp serve
```
Then browse to http://localhost:8088 (unless you changed the default port during the install).

## Todo

See the [issue tracker](https://github.com/etsuo/generator-hybrid/issues)

## Config
If you want to set your default answers, create a file in your home directory (`cd ~`) called `.hybridconfig.json`. For example:

```json
{
   "packageVersion": "0.0.1",
   "packageAuthor": "Olive Technology",
   "packageAuthorEmail": "support@olivetech.com",
   "packageAuthorWeb": "www.OliveTech.com",
   "packageLicense": ["UNLICENSED", "MIT", "Apache-2.0"],
   "packagePrivate": true,
   "installMobile": true,
   "installWeb": true,
   "webCssLibrary": "AngularMaterial",
   "installDeps": true,
   "initGit": true
}
```
You can include as many or as few of these options as you want to override.

Keep in mind that the license types should be valid [SPDX values](https://spdx.org/licenses/). If you do not wish to extend licensing rights to others, you should include "UNLICENSED" as an option. For version numbers, you must provide a valid [node semver](https://github.com/npm/node-semver).

If you do not supply a `.hybridconfig.json` file in your home directory, then the generator will fall back to reasonable defaults.

## Headless
`yo hybrid --headless -n 'some-name' -d 'some project description'` will run generator-hybrid in headless mode.

The `-n` option should be a package.json `name` compatible value.

## Contributing

### Reporting bugs
Open an [issue](https://github.com/etsuo/generator-hybrid/issues). This helps more than you could imagine with just about any open-source project. We have no way of testing this on every possible combination of OS X, Windows, and Linux/BSD.

### Make suggestions
This project serves some pretty specific needs of a group of us, but we figured it might serve the needs or a large community so we beefed it up some and make it more usable outside of our really limited set of needs. If you have an idea as to how we could improve this project, suggest it to us. You might end up helping more people than you realize! :)

### Coding
Fork the project, then work off your develop branch or a feature branch. When you're ready, submit a pull request back against develop.

Before making your changes, however, you should open an [issue](https://github.com/etsuo/generator-hybrid/issues) to communicate what you're doing to sync up with other work that's being done.
 
Also, you might want to make sure that everything works when you do an `npm install -g generator-hybrid` by doing an install of your forked changes. For example: `npm install -g git+ssh://git@github.com:etsuo/generator-hybrid.git#develop`

If you're not familiar with installing npm packages directly from github.com, see the [npm install documentation](https://docs.npmjs.com/cli/install).

Another helpful tip is to use `npm link`. Once you have cloned your fork to your local system, from within the root of the `generator-hyrbid` directory, type [`npm link`](https://docs.npmjs.com/cli/link). Your hybrid generator is now your local copy for testing purposes. 

## Supported Platforms
This is tested on modern releases of Apple OS X, Microsoft Windows, and Ubuntu Linux. If you're running into problems on one of these platforms, please open an [issue](https://github.com/etsuo/generator-hybrid/issues). Make sure to include your OS and version. If you're using a different version of Linux/Unix/BSD, feel free to open an [issue](https://github.com/etsuo/generator-hybrid/issues) - we might be able to do something about it... we might not... never hurts to try.

## Credits
Here are some of the main projects that this generator uses:

<a href="http://ionicframework.com/"><img src="http://news.ebscer.com/wp-content/uploads/2014/05/ionic_logo.png" height="175"></a>
<a href="https://angularjs.org/"><img src="http://www.w3schools.com/angular/pic_angular.jpg" height="175"></a>
<a href="http://gulpjs.com/"><img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png" height="200"></a>
<a href="http://bower.io/"><img src="http://bower.io/img/bower-logo.png" height="125"></a>
<a href="https://www.npmjs.com/"><img src="https://www.npmjs.com/static/images/npm-logo.svg" width="200"></a>
<a href="http://sass-lang.com/"><img src="http://sass-lang.com/assets/img/logos/logo-b6e1ef6e.svg" width="200"></a>
<a href="http://eslint.org/"><img src="https://pbs.twimg.com/profile_images/422081374422446080/RNoIP-zD.png" height="175"></a>
<a href="https://github.com/jasmine/jasmine"><img src="http://jasmine.github.io/images/jasmine_vertical.svg" height="175"></a>
<a href="http://karma-runner.github.io/"><img src="http://karma-runner.github.io/assets/img/banner.png" width="200"></a>
<a href="http://yeoman.io/"><img src="http://yeoman.io/static/tool-yo.3dcc437449.png" width="200"></a>
  
## License

MIT © [J.P. Poveda](https://github.com/etsuo/generator-hybrid)


[npm-image]: https://badge.fury.io/js/generator-hybrid.svg
[npm-url]: https://npmjs.org/package/generator-hybrid
[travis-image]: https://travis-ci.org/etsuo/generator-hybrid.svg?branch=master
[travis-url]: https://travis-ci.org/etsuo/generator-hybrid
[daviddm-image]: https://david-dm.org/etsuo/generator-hybrid.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/etsuo/generator-hybrid

