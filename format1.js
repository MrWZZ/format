var contentList = {
    title : {},
    paragraph : {},
    script : {},

};

var contentArr = [];

function FormatContent() {
    var list = document.getElementsByClassName("content");
    contentHTML = list[0].innerHTML;
    list[0].innerHTML = AddList();
}

var start = 0;
var end = 0;
var line = "";
var format = "";
var contentHTML = "";
function AddList() {
    //删除前后空格
    contentHTML = contentHTML.replace(/^[ \t]+|[ \t]+?(?=\n)/gm,"");
    //替换连接类型
    contentHTML = contentHTML.replace(/\s*?\+\n/g,"");
    //填写的文本
    while(true) {
        end = contentHTML.indexOf("\n",start);
        if(end<0) {
            break;
        }
        line = contentHTML.substring(start,end + 1);
        
        format += Do(line);
        start += line.length;
    }

    
    return format;
}

var lineNum = 0;
var change = "";
function Do(str) {
    change = "";
    //console.log(`${lineNum}==|${str}`);

    switch(str.substring(0,1)) {
        case "#":
            change = TitleHandler(str);
            break;
        case "+":
            change = IndentHandler(str);
            break;
        case "`":
            change = ScriptHandler(str);
            break;
        case "\n":
            change = "";
            break;
        default:
            change = ParagraphHandler(str);
            break;
    }

    //console.log(`${lineNum}--|${change}`);
    lineNum++;
    return change;
}

function TitleHandler(str) {

    //对比开始和结尾#号是数量，相等才认为是一个标题
    var list = str.match(/#+/g);
    if(list[0] == null || list[1] == null || list[0].length != list[1].length) {
        return str;
    } 
    //获取标题名字
    str = str.replace(/[\s#]/g,"");
    //根据#号长度设置标题类型
    var type = list[0].length;
    str = `<h${type}>${str}</h${type}>`
    return str;
}

function IndentHandler(str) {

    var add = str.match(/^\++/);
    var addMultiple = add[0].length;
    str = str.replace(/^\++\s*/,"")
    str = str.replace("\n","");

    var indentLength = addMultiple * formatConfig.perIndentNum;
    var indentStr = "";
    for(var i=0;i<indentLength;i++) {
        indentStr += formatConfig.indent;
    }

    str = `<p>${indentStr}${str}<\p>`;
    return str;
}

function ScriptHandler(str) {
    var oldLength = str.length;
    var match = "```\n";
    var find = contentHTML.indexOf( match, start );
    str = contentHTML.substring(start ,find + match.length);
    start += str.length - oldLength;
    //获取代码声明的类型
    var type = str.match(/`{3}\S*/);
    //删除代码声明标识
    str = str.replace(/`{3}\S*\n|`{3}\n/g,"");
    //给代码中的每一行加上代码段标识
    var handler;
    if(window.scriptType[type] === null || window.scriptType[type] === undefined) {
        handler = window.scriptType.default;
        type = "default";
    } else {
        handler = window.scriptType[type];
    }
    str = handler(str);
    return str;
}

//替换段落类型
function ParagraphHandler(str) {
    str = str.replace("\n","");
    // //段落间加粗
    // str = str.replace(/\*+[^*]+?\*+/g,function(blod){
    //     //对比开始和结尾*号是数量，相等才认为是同一个加粗
    //     var list = blod.match(/\*+/g);
    //     if(list[0] == null || list[1] == null || list[0].length != list[1].length) {
    //         return blod;
    //     } 
    //     //获取标题名字
    //     blod = blod.replace(/[\s#*]/g,"");
    // });
    //段落间代码
    return `<p>${str}<\p>`;
}