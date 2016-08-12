var _ = require('lodash');

module.exports = Check;

function Check() {

}
Check.prototype.attrRule = checkAttrRule;
Check.prototype.styleRule = checkStyleRule;


function checkRule($child, root, collectError, rule, style, ops) {
    var args = _.toArray(arguments);
    for (var key in rule) {
        if (_.isFunction(rule[key])) {
            rule[key].apply(null, [].concat.apply([key], args));
        }
    }
}


//检测属性的规则
function checkAttrRule($child, root, collectError, rule, style, ops) {
    var args = _.toArray(arguments);
    if (this.baseAttr) {
        args[args.length - 3] = this.baseAttr;
        checkRule.apply(null, args);
    }
    args[args.length - 3] = rule;
    checkRule.apply(null, args);

}

//检测样式的规则
function checkStyleRule($child, root, collectError, rule, style, ops) {
    var args = _.toArray(arguments);
    if (this.baseStyle) {
        args[args.length - 3] = this.baseStyle;
        checkRule.apply(null, args);
    }
    args[args.length - 3] = rule;
    checkRule.apply(null, args);
}

