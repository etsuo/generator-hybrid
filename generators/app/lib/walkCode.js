'use strict';

var esquery = require('esquery'),
    esprima = require('esprima');

module.exports = codeWalker;

function codeWalker(file) {
    return new WalkCode(file);
}

function WalkCode(file) {
    this.tree = esprima.parse(file);
    this.target = this.tree;
}

WalkCode.prototype.f = find;
WalkCode.prototype.find = find;


//////////


function find(name) {

    if (Array.isArray(this.target)) {

        this.target = iterateArray(this.target);

    } else if (typeof(this.target) === 'object') {

        this.target = iterateObject(this.target);

    } else {
        throw 'Node needs to be either an array or object to keep walking...';
    }


    return this;

    //////////
    function iterateArray(target) {

        for (var i in target) {

            if (Array.isArray(target[i])) {

                return iterateArray(target[i]);

            } else if (typeof(target[i]) === 'object') {

                var result = iterateObject(target[i]);
                if (result) {
                    return result;
                }
            }
        }

        return undefined;
    }

    function iterateObject(target) {

        for (var key in target) {

            if (target.hasOwnProperty(key)) {

                if (key === name) {
                    return target[key];
                }
            }
        }

        return undefined;
    }
}

function reset() {
    this.target = tree;
}
