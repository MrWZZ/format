var elementArr = [];
//读取整个文本
function FormatContent(className) {
    elementArr = []
    var list = document.getElementsByClassName(className);
    for(var i=0;i<list.length;i++) {
        elementArr.push(list[i]);
    }
    DoFormat();
}

function DoFormat() {
    var element;
    if(elementArr.length>0) {
        element = elementArr.shift();
    } else {
        return;
    }

    var content = element.innerHTML;
    content = Trim(content)
    content = MatchEndLink(content);
    content = MatchTitle(content);
    content = MatchScript(content);
    content = MatchScriptLine(content);
    content = MatchIndent(content);
    
    //处理段落类型
    content = MatchParagraph(content);
    content = content.replace(/\n/g,"");
    element.innerHTML = content;

    setTimeout(DoFormat,10);
}

//删除每一行前后的空格
function Trim(content) {
    return content.replace(/^[ \t]+|[ \t]+(?=\n)/gm,"");
}

//替换标题类型
function MatchTitle(content) {
    return content.replace(/^#+[^#]+?#\/+$/gm,TitleHandler);
}

function TitleHandler(str) {
    //标题类型
    var type = str;
    //获取标题名字
    str = str.replace(/^#+\s+|\s+#+$/g,"");
    str = `<h${type}>${str}</h${type}>`
    return str;
}

//替换代码类型
function MatchScript(content) {
    return content.replace(/\n`{3}\S*\n[\s\S]*?`{3}/g,ScriptHandler);
}

function ScriptHandler(str) {
    //获取代码声明的类型
    var type = str.match(/`{3}\S*/);
    //删除代码声明标识
    str = str.replace(/\n`{3}\S*\n|`{3}/g,"");
    //给代码中的每一行加上代码段标识
    var handler;
    if(window.scriptType[type] === null || window.scriptType[type] === undefined) {
        handler = window.scriptType.default;
        type = "default";
    } else {
        handler = window.scriptType[type];
    }
    str = str.replace(/[^\n]+/gm,handler)
    str = `<div class="script_${type} script">${str}</div>`;
    return str;
}

//替换代码行类型
function MatchScriptLine(content) {
    return content.replace(/`{3}[\s\S]+?`{3}/g,ScriptLineHandler);
}

function ScriptLineHandler(str) {
    str = str.replace(/`{3}/g,"");
    str = `<span class="script_inLine">${str}</span>`
    return str;
}

//替换缩进类型
function MatchIndent(content) {
    return content.replace(/^\++[^\n]+/gm,IndentHandler);
}

function IndentHandler(str) {
    var add = str.match(/^\++/);
    var addMultiple = add[0].length;
    str = str.replace(/^\++\s*/,"")
    
    var indentLength = addMultiple * formatConfig.perIndentNum;
    var indentStr = "";
    for(var i=0;i<indentLength;i++) {
        indentStr += formatConfig.indent;
    }

    str = `<p>${indentStr}${str}<\p>`;
    return str;
}

//替换尾部连接类型
function MatchEndLink(content) {
    return content.replace(/\s*\+\n/g,"");
}

//替换段落类型
function MatchParagraph(content) {
   return content.replace(/^[^<\n][^\n]+?\n/gm,ParagraphHandler);
}

function ParagraphHandler(str) {
    return `<p>${str}</p>`;
}

