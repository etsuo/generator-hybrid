'use strict';

var escodegen = require('escodegen'),
    esprima = require('esprima');

module.exports = codeTweaker;

function codeTweaker(source) {
    return new CodeTweak(source);
}

function CodeTweak(source) {
    var sourceType = typeof (source);
    this.tree = (sourceType === 'object') ? source : esprima.parse(source);
}

CodeTweak.prototype.addModuleDependency = addModuleDependency;
CodeTweak.prototype.getCode = getCode;
CodeTweak.prototype.change = change;


//////////

function addModuleDependency(dependency) {
    var dependencies = this.tree.body[0].expression.callee.body.body[1].expression['arguments'][1].elements,
        entry = {
            'type': 'Literal',
            'value': dependency,
            'raw': dependency
        };

    var indexOfAppDependencies = 0;
    for (var i in dependencies) {
        if (dependencies[i].value.startsWith('app.')) {
            indexOfAppDependencies = i;
            break;
        }
    }

    dependencies.splice(indexOfAppDependencies, 0, entry);

    return dependencies;
}


function getCode() {
    return escodegen.generate(this.tree).replace("}());", "})();");
}


function change(path, action) {

    var keys = path.split(':'),
        found = false;

    keys.forEach(function (key) {

        var parts = key.split('=');

        if (Array.isArray(this.tree)) {

            iterateArray(this.tree, parts);

        } else if (typeof(this.tree) === 'object') {

            iterateObject(this.tree, parts);

        } else {

            throw 'Node needs to be either an array or object to keep walking... the tree is already as deep as you can go';

        }

    }, this);

    if (!found) {
        throw 'Unable to find path: ' + path;
    }


    //////////
    function iterateArray(tree, parts) {

        for (var index in tree) {

            if (Array.isArray(tree[index])) {

                iterateArray(tree[index], parts);

            } else if (typeof(tree[index]) === 'object') {

                iterateObject(tree[index], parts);
            }

            if (found) return;
        }
    }

    function iterateObject(tree, parts) {

        var key = parts[0],
            value = (parts.length === 2) ? parts[1] : undefined;

        for (var property in tree) {

            if (tree.hasOwnProperty(property)) {

                if (property === key && !value) {

                    found = true;
                    action(tree, tree[key]);
                    break;

                } else if (Array.isArray(tree[property])) {

                    iterateArray(tree[property], parts)

                } else if (typeof(tree[property]) === 'object') {

                    iterateObject(tree[property], parts)

                } else if ((value && tree[property] === value) || !value) {

                    found = true;
                    action(tree, tree[key]);
                    break;
                }
            }

            if (found)return;
        }
    }
}

