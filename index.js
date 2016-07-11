module.exports = check;

var cheerio = require('cheerio'),
    Q = require('q'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    _ = require('lodash');

var getFile = require('./lib/getFile.js');
var parse = require("./lib/parse.js");

var $ = null,
    collectTag = {}, //收集创建元素的种类以及个数
    collectError = {}, //收集错误信息
    ignoreTag = {}; //未添加规则的元素

function check (ops) {

    ops = _.extend({
        //rule: '',
        //src: '',
    }, ops);


    if (!ops.src) {
        throw new Error("must have a source file");
    }

    if (!ops.rule) {
        throw new Error("must have a rule path or rule object");
    }

    var deferred = Q.defer();

    getFile(ops.src).done(function (src) {
        var rules = ops.rule,
            $ = cheerio.load(src, {
                decodeEntities: false
            }),
            root = null;
        var body = $('body');
        if (body.length) {
            root = body;
        } else {
            root = $.root();
        }
        function loop (root) {

            var children = root.children(),
                $child = null,
                child = null,
                tageName = '';
            if (!children) {
                return;
            }

            for (var i = 0, len = children.length; i < len; i++) {

                child = children[i];
                $child = $(child);
                tageName = child.name || '';
                tageName = tageName.toLowerCase();
                //收集使用了多少标签
                if (tageName in collectTag) {
                    collectTag[tageName]++;
                } else {
                    collectTag[tageName] = 1;
                }

                var rule = rules[tageName];
                if (rule) {
                    //主动忽略的元素不作处理
                    if ($child.hasClass('check-ignore')) {
                        $child.removeClass('check-ignore');
                    } else {
                        rule.base = rules.base;
                        parse($child, root, collectError, rule);
                    }
                } else {
                    // 不需要处理的元素
                    ignoreTag[tageName] = true;
                }
                loop($child);
            }
        }
        loop(root);

        deferred.resolve({
            collectTag: collectTag,
            ignoreTag: ignoreTag,
            collectError: collectError,
            html: $.html()
        });

    });
    return deferred.promise;

}
