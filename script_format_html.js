
//代码风格转换
function HtmlScriptTypeHandler(scriptContent) {
    
    //当前缩进倍数
    var curIndentMultiple = 0;
    //代码风格转换
    var curLineNum = 0;
    scriptContent = scriptContent.replace(/</g,"&lt;")
    scriptContent = scriptContent.replace(/>/g,"&gt;")

    scriptContent = scriptContent.replace(/[\s\S]*?\n/g,function(line) {
        curLineNum = ++curLineNum % 2;
        //空行直接返回
        if(line.substring(0,1) == "\n") {
            return `<div class="script_line script_line_${curLineNum}"> </div>`;
        }
        //如果有结束标签开头，本行减少缩进字符
        var isStart = /^&lt;\//.test(line);
        if(isStart) {
            curIndentMultiple = curIndentMultiple > 0 ? curIndentMultiple - 1 : 0;
        }

        var indentLength = curIndentMultiple * formatConfig.perIndentNum;
        var indentStr = "";
        for(var i=0;i<indentLength;i++) {
            indentStr += formatConfig.indent;
        }

        //如果有开始标签结尾，下一行增加缩进字符
        var isEnd = /&lt;[^\/]+?&gt;\n/.test(line)
        if(isEnd) {
            curIndentMultiple++;
        }

        //识别标签
        line = line.replace(/&lt;[^&]+?&gt;/g,HtmlTags);

        return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
    });

    return `<div class="script_cs script_content">${scriptContent}</div>`;
} 


var htmlTagsStart = 0;
var htmlTagsEnd = 0;
var htmlFormat = "";
function HtmlTags(str) { 
    htmlTagsStart = 0;
    htmlTagsEnd = 0;
    htmlFormat = "";
    var isEnd = false;
    while(true) {
        //匹配空格
        htmlTagsEnd = str.indexOf(" ",htmlTagsStart);
        //匹配末尾
        if(htmlTagsEnd < 0 ) {
            isEnd = true;
            htmlTagsEnd = str.indexOf("&gt;",htmlTagsStart);
        }

        if(htmlTagsEnd < 0) {
            break;
        }
        //这里不把空格传入
        var group = str.substring(htmlTagsStart,htmlTagsEnd);
        
        htmlFormat += DoHtmlTags(group);
        //这里补充空格的位置
        if(!isEnd) {
            htmlFormat += " ";
        }
        
        htmlTagsStart += (group.length + 1);
    }

    //补充结尾尖括号
    htmlFormat += "&gt;"
    return htmlFormat;
}

function DoHtmlTags(str) {
    if(/^&lt;\S+/g.test(str)) {
        //识别标签头 <xxx 
        str = str.replace(str,HtmlKeysBegin);
    }
    else if(/^&lt;\/\S+/g.test(str)) {
        //识别标签尾 </xxx
        str = str.replace(str,HtmlKeysEnd);
    }
    else if(/\S*?=\S*/g.test(str)) {
         //识别标签属性 <html a="x"
        str = str.replace(str,HtmlAttribute);
    }

    return str;
}

function HtmlKeysBegin(str) {
    str = str.replace(/&lt;/,"");
    return `&lt;<span class=${HtmlCssType.key}>${str}</span>`;
}

function HtmlKeysEnd(str) {
    str = str.replace(/&lt;\//,"");
    return `&lt;/<span class=${HtmlCssType.key}>${str}</span>`;
}

function HtmlAttribute(str) {
    var arr = str.split("=");
    var keyName = arr[0];
    var keyValue = arr[1];
    return `<span class=${HtmlCssType.attribute}>${keyName}</span>=<span class=${HtmlCssType.string}>${keyValue}</span>`;
}

var HtmlCssType = {
    key : "html_key",
    attribute : "html_attribute",
    string : "html_string",
}

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        html : HtmlScriptTypeHandler,
    }
} else {
    window.scriptType.html = HtmlScriptTypeHandler
}
