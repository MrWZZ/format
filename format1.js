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
    //删除第一个换行
    contentHTML = contentHTML.replace(/\n/,"");
    var t1 = new Date().getTime();
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

    var t2 = new Date().getTime();
    console.log("时间:"+(t2-t1));
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
        case "`":
            change = ScriptHandler(str);
            break;
        case "[":
            change = LinkHandler(str);
            break;
        case "\n":
            change = "<br>";
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
    //判断是否有设置id
    var id = str.match(/\s*@\S+\s+/);
    if(id) {
        id = id[0];
        str = str.replace(id,"");
        id = id.replace(/[@ ]/g,"");
    }
    //获取标题名字
    str = str.replace(/[\s#]/g,"");
    //根据#号长度设置标题类型
    var type = list[0].length;
    if(id) {
        str = `<h${type} id="${id}">${str}</h${type}>`
    } else {
        str = `<h${type}>${str}</h${type}>`
    }
    
    return str;
}

function ScriptHandler(str) {
    var oldLength = str.length;
    var match = "```/\n";
    var find = contentHTML.indexOf( match, start );
    str = contentHTML.substring(start ,find + match.length);
    start += str.length - oldLength;
    //获取代码声明的类型
    var type = str.match(/`{3}\S*/);
    //删除代码声明标识
    str = str.replace(/`{3}\S*\n|`{3}\/\n/g,"");
    //给代码中的每一行加上代码段标识
    var handler;
    if(window.scriptType[type] === null || window.scriptType[type] === undefined) {
        handler = window.scriptType.no;
        type = "no";
    } else {
        handler = window.scriptType[type];
    }
    str = handler(str);
    return str;
}

function LinkHandler(str) {
    var tag = str.substring(1,2);
    switch(tag) {
        case "a":
            str = ALink(str);
            break;
        case "i":
            str = ILink(str);
            break;
    }
    return str;
}

function ALink(str) {
    var endIndex = str.indexOf("]");
    //[a-x x位置之后为地址
    var ahref = str.substring(3,endIndex);
    //[a-x]()/n 倒数第2个为内容结尾
    var aContent = str.substring(endIndex+2,str.length-2);
    return `<a href="${ahref}">${aContent}</a>`
}

//<img src="/i/eg_tulip.jpg"  alt="上海鲜花港 - 郁金香" />
function ILink(str) {
    var endIndex = str.indexOf("]");
    //[i-x x位置之后为地址
    var ihref = str.substring(3,endIndex);

    if(endIndex + 2 >= str.length) {
        return `<img src="${ihref}"/>`
    } else {
        //[i-x]()/n 倒数第2个为内容结尾
        var alt = str.substring(endIndex+2,str.length-2);
        return `<img src="${ihref}" alt="${alt}"/>`
    }
}

//替换段落类型
function ParagraphHandler(str) {
    str = str.replace("\n","");
    //段落间缩进
    var tag = str.substring(0,1);
    if(tag == "+") {
        str = str.replace(str,IndentHandler);
    }
    //段落间加粗
    str = str.replace(/\s*\*[\s\S]+?\*\/\s*/g,BlodHandler)
    //段落间代码
    str = str.replace(/\s*`{3}[\s\S]+?`{3}\/\s*/g,ScriptInlineHandler)
    return `<p>${str}<\p>`;
}

//缩进处理
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

//段落间加粗
function BlodHandler(blod) {
    //判断是否有设置id
    var id = blod.match(/\s*@\S+\s+/);
    if(id) {
        id = id[0];
        blod = blod.replace(id,"");
        id = id.replace(/[@ ]/g,"");
    }
    //获取加粗内容
    blod = blod.replace(/\s|\*\/|\*/g,"");
    if(id) {
        return `<b id="${id}">${blod}</b>`;
    } else {
        return `<b>${blod}</b>`;
    }
}

//段落间代码
function ScriptInlineHandler(script) {
    script = script.replace(/^\s+|\s+$/g,"");
    script = script.replace(/`{3}\/|`{3}/g,"");
    //替换特殊字符
    script = script.replace("<","&lt;")
    script = script.replace(">","&gt;")
    
    return `<span class="script_inline">${script}</span>`;
}