//当前缩进倍数
var curIndentMultiple = 0;
var curLineNum = 0;
//代码风格转换
function ScriptTypeHandler(line) {
    
    curLineNum = ++curLineNum % 2;
    //空行直接返回
    if(/^[ \t]*\n/.test(line)) {
        return `<div class="script_line script_line_${curLineNum}">&nbsp;</div>`;
    }

    //如果有尖括号开头，本行减少缩进字符
    var startName = line.match(/(?:<)[^>\/\s]+/);
    var endName = line.match(/(?:<\/)[^>\s]+(?=>)/);

    //有尾没头
    if(startName == null && endName != null) {
        curIndentMultiple = curIndentMultiple > 0 ? curIndentMultiple - 1 : 0;
    } 

    var indentLength = curIndentMultiple * formatConfig.perIndentNum;
    var indentStr = "";
    for(var i=0;i<indentLength;i++) {
        indentStr += formatConfig.indent;
    }

    //有头没尾
    if(startName != null && endName == null) {
        curIndentMultiple++;
    } 

    //替换尖括号
    line = line.replace(/</g,"&lt;")
    line = line.replace(/>/g,"&gt;")
    //替换属性名
    line = line.replace(/(?: )[^=<>]+(?==)/g ,HtmlAttribute)
    //替换字符串
    line = line.replace(/(?:")[^"<>]+(?=")/g,HtmlString)
    //替换标签名
    line = line.replace(/(?:&lt;)[^\.\s&]+/g,HtmlKeys)

    return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
} 

function HtmlKeys(str) {
    return `<span class=${htmlCssType.key}>${str}</span>`
}

function HtmlAttribute(str) {
    return `<span class=${htmlCssType.attribute}>${str}</span>`
}

function HtmlString(str) {
    return `<span class=${htmlCssType.string}>${str}</span>`
}

var htmlCssType = {
    key : "html_key",
    attribute : "html_attribute",
    string : "html_string"
}

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        html : ScriptTypeHandler
    }
} else {
    window.scriptType.html = ScriptTypeHandler
}
