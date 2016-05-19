var _ = require('lodash');
var Check = require('./check.js');
var checker = new Check();


function getStyleObj(style) {

    var obj = {},
        styleArr = [];

    if (style) {
        styleArr = style.split(';');
        _.forEach(styleArr, function (styleItem) {
            var styleItemArr = _.trim(styleItem).split(':');
            if (styleItemArr.length == 2) {
                obj[_.trim(styleItemArr[0])] = _.trim(styleItemArr[1]);
            }
        });
    }
    return obj;
}

function setStyleObj(style, $child) {
    var str = '';
    for (var key in style) {
        str += (key + ':' + style[key] + ';');
    }
    if (str) {
        $child.attr('style', str);
    }
}

module.exports = function ($child, root, collectError, rule) {

    if (rule.base) {
        checker.baseAttr = rule.base.attr;
        checker.baseStyle = rule.base.style;
        delete rule.base;
    }

    var args = [$child, root, collectError];

    var style = getStyleObj($child.attr('style'));

    checker.attrRule.apply(checker, args.concat(rule.attrRule, style));

    checker.styleRule.apply(checker, args.concat(rule.styleRule, style));
    //回写样式
    setStyleObj(style, $child);
};