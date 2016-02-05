'use strict';

var codeTweaker = require('../../generators/app/lib/tweakCode'),
    should = require('should');


describe('tweakCode.addModuleDependency', function () {


    var tweaker;

    beforeEach(function (done) {
        tweaker = codeTweaker(getTestAST());

        done();
    });

    it('should be able to add a dependency in the right place to a module definition', function () {
        var results = tweaker.addModuleDependency('angular.material');

        var found = false;
        for (var i in results) {
            if (results[i].value === 'angular.material') {
                found = true;
                break;
            }
        }

        found.should.be.true();
    });

});

describe.skip('codeTweak: Test simple tweakCode capablities', function () {

    var obj,
        tweakCode;

    beforeEach(function (done) {
        obj = getTestObj();
        tweakCode = codeTweaker(obj);
        done();
    });

    it('should be able to find a path', function () {
        var val = '';
        tweakCode.change('a:aa:aaa', function (node, value) {
            val = value;
        });

        val.should.equal('a.aa.aaa');

        tweakCode.change('b:bb:bbb', function (node, value) {
            console.log(JSON.stringify(node, null, 2));
            val = value;
        });

        val.should.equal('b.bb.bbb');
    });


});

describe.skip('codeTweak: Test complex tweakCode capabilities', function () {

    var obj,
        tweakCode;

    beforeEach(function (done) {
        obj = getTestAST();
        tweakCode = codeTweaker(obj);
        done();
    });

    it('should find the first property match and modify it', function () {
        tweakCode.change('body', function (node, value) {
            node.body = [{'changed': true}];

            value.should.be.Array();
        });

        tweakCode.tree.body[0].changed.should.be.true();
    });

    it('should find a deeply nested property and allows you to modify it', function () {

        tweakCode.change('value=ionic', function (node, value) {
            //console.log(JSON.stringify(node, null, 2));
            //console.log(value);

            node.value = 'notIonic';
            node.raw = 'notIonic';
        });

        var location = tweakCode.tree.body[0].expression.callee.body.body[1].expression['arguments'][1].elements[0];

        location.value.should.equal('notIonic');
        location.raw.should.equal('notIonic');

    });

    it('should be able to find where dependencies are injected into a module the manual way', function () {

    });
});


///////////

function getTestAST() {
    return {
        "type": "Program",
        "body": [
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "FunctionExpression",
                        "id": null,
                        "params": [],
                        "defaults": [],
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "Literal",
                                        "value": "use strict",
                                        "raw": "'use strict'"
                                    }
                                },
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "CallExpression",
                                        "callee": {
                                            "type": "MemberExpression",
                                            "computed": false,
                                            "object": {
                                                "type": "Identifier",
                                                "name": "angular"
                                            },
                                            "property": {
                                                "type": "Identifier",
                                                "name": "module"
                                            }
                                        },
                                        "arguments": [
                                            {
                                                "type": "Literal",
                                                "value": "app",
                                                "raw": "'app'"
                                            },
                                            {
                                                "type": "ArrayExpression",
                                                "elements": [
                                                    {
                                                        "type": "Literal",
                                                        "value": "ionic",
                                                        "raw": "'ionic'"
                                                    },
                                                    {
                                                        "type": "Literal",
                                                        "value": "app.common",
                                                        "raw": "'app.common'"
                                                    },
                                                    {
                                                        "type": "Literal",
                                                        "value": "app.components",
                                                        "raw": "'app.components'"
                                                    },
                                                    {
                                                        "type": "Literal",
                                                        "value": "app.home",
                                                        "raw": "'app.home'"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "generator": false,
                        "expression": false
                    },
                    "arguments": []
                }
            }
        ],
        "sourceType": "script"
    };
}

function getTestObj() {
    return {
        a: {
            aa: {
                aaa: 'a.aa.aaa'
            }
        },
        b: {
            bb: {
                bbb: 'b.bb.bbb'
            }
        }
    }
}
