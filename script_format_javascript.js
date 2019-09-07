//当前缩进倍数
var curIndentMultiple = 0;
var curLineNum = 0;
//代码风格转换
function JavascriptScriptTypeHandler(line) {
    
    curLineNum = ++curLineNum % 2;
    //空行直接返回
    if(/^[ \t]*\n/.test(line)) {
        return `<div class="script_line script_line_${curLineNum}">&nbsp;</div>`;
    }

    //如果有大括号开头，本行减少缩进字符
    var isStart = /^\}/.test(line);
    if(isStart) {
        curIndentMultiple = curIndentMultiple > 0 ? curIndentMultiple - 1 : 0;
    }

    var indentLength = curIndentMultiple * formatConfig.perIndentNum;
    var indentStr = "";
    for(var i=0;i<indentLength;i++) {
        indentStr += formatConfig.indent;
    }

    //如果有大括号结尾，下一行增加缩进字符
    var isEnd = /\{$/.test(line)
    if(isEnd) {
        curIndentMultiple++;
    }
    //识别关键字
    line = line.replace(/\b(var|function|if|return|for)\b/g,JavascriptKeys);
    

    return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
} 

function JavascriptKeys(str) {
    return `<span class=${javascriptCssType.key}>${str}</span>`
}

var javascriptCssType = {
    key : "javascript_key"
}

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        javascript : JavascriptScriptTypeHandler,
    }
} else {
    window.scriptType.javascript = JavascriptScriptTypeHandler
}