# HTML-CHECK
检测 HTML 书写是否规范的工具

## 说明
通过 [cheerio](https://github.com/cheeriojs/cheerio) 解析 HTML 后,顺序执行rule部分进行检测
可以自定义输出文案

## API

### `htmlCheck(option)`
-   参数 option
    + `option.src`  必填, 可以是 链接, HTML文本, 或者 文件路径,
    + `option.rule` 必填, 对 每种类型的标签(eg: `table` `a`)执行设置的规则
-   返回 Promise/A 的对象, 在resolve 回调里,会传入结果值 `result`
    + `result.collectTag` 页面使用的标签
    + `result.ignoreTag` 页面未设置规则的标签
    + `result.collectError` 页面警告和错误收集

## Rule

目前已实现 rule 有:

[EDM-RULE](https://github.com/zhangsanshi/edm-rule)

## 使用
```javascript
    htmlCheck({
        src: source 
        rule: rules
    }).then(function (result) {
    
        fs.writeFile(path.join(__dirname, './dist.html'), result.html, function (err) {
            if (err) throw err;
        });
    
        fs.writeFile(path.join(__dirname, './debug.log'),
            "页面使用的标签 \n" +
            JSON.stringify(result.collectTag, null, '\t') +
            "\n 页面未添加规则的标签 \n" +
            JSON.stringify(result.ignoreTag, null, '\t') +
            "\n 页面警告 \n" +
            JSON.stringify(result.collectError, null, '\t'), function (err) {
                if (err) throw err;
            }
        );
    });
```
