# generator-hybrid [![NPM version][npm-image]][npm-url]  [![Dependency Status][daviddm-image]][daviddm-url]

A [Yeoman](http://yeoman.io) generator that sets up a hybrid multi platform project for concurrently developing native mobile apps (iOS and Andoid), a web-portal, and a desktop app. It trys to follow the [Angular Style Guide](johnpapa/angular-styleguide) whenever possible.

The technologies used include:

* Mobile Apps: Ionic Framework
* Web Portal: AngularJS
* Desktop: Electron (*todo*)


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

## Todo

See the [issue tracker](https://github.com/etsuo/generator-hybrid/issues)

## Contributing
This project uses [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for its git workflow. You should fork the project, make your changes on a feature branch, then submit your pull request from your feature branch against the upstream develop branch.

Before making your changes, however, you should open an [issue](https://github.com/etsuo/generator-hybrid/issues) to communicate what you're doing to sync up with other work that's being done.
 
Also, you might want to make sure that everything works when you do an `npm install -g generator-hybrid` by doing an install of your forked changes. For example: `npm install -g git+ssh://git@github.com:etsuo/generator-hybrid.git`

If you're not familiar with installing npm packages directly from github.com, see the [npm install documentation](https://docs.npmjs.com/cli/install).

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

