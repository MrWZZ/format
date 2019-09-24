
function DefaultScriptTypeHandler(scriptContent) {
    //当前缩进倍数
    var curIndentMultiple = 0;
    //代码风格转换
    var curLineNum = 0;
    scriptContent = scriptContent.replace("<","&lt;")
    scriptContent = scriptContent.replace(">","&gt;")

    scriptContent = scriptContent.replace(/[\s\S]*?\n/g,function(line) {
        curLineNum = ++curLineNum % 2;
        //空行直接返回
        if(line.substring(0,1) == "\n") {
            return `<div class="script_line script_line_${curLineNum}"> </div>`;
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
        var isEnd = /\{\n/.test(line)
        if(isEnd) {
            curIndentMultiple++;
        }

        return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
    });

    return `<div class="script_no script_content">${scriptContent}</div>`;
} 

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        no : DefaultScriptTypeHandler
    }
} else {
    window.scriptType.no = DefaultScriptTypeHandler
}

