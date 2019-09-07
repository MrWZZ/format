//当前缩进倍数
var curIndentMultiple = 0;
var curLineNum = 0;
//代码风格转换
function CsharpScriptTypeHandler(line) {
    
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
    line = line.replace(/\b(var|if|return|foreach|for|int|in|out|public|private|void|string|new)\b/g,CsharpKeys);
 
    return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
} 

function CsharpKeys(str) {
    return `<span class=${csharpsCssType.key}>${str}</span>`
}

var csharpsCssType = {
    key : "csharp_key"
}

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        csharp : CsharpScriptTypeHandler,
    }
} else {
    window.scriptType.csharp = CsharpScriptTypeHandler
}
