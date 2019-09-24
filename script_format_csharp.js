//上一个单词
var beforeWord = "";
//是否是注释
var isComment = false;
//当前行
var curLineContent = "";

//代码风格转换
function CsharpScriptTypeHandler(scriptContent) {
    
    //前面是否出现了case要缩进
    var caseIndentNum = 0;
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
        //如果有大括号开头，本行减少缩进字符
        var isStart = /^\}/.test(line);
        if(isStart) {
            curIndentMultiple = curIndentMultiple > 0 ? curIndentMultiple - 1 : 0;
        }
        if(/^(case )/.test(line)){
            caseIndentNum--;
            if(caseIndentNum<0) {
                caseIndentNum = 0;
            }
        }

        var indentLength = (curIndentMultiple + caseIndentNum) * formatConfig.perIndentNum;
        var indentStr = "";
        for(var i=0;i<indentLength;i++) {
            indentStr += formatConfig.indent;
        }

        //如果有大括号结尾，下一行增加缩进字符
        var isEnd = /\{\n/.test(line)
        if(isEnd) {
            curIndentMultiple++;
        }
        if(/^(case )/.test(line)){
            caseIndentNum++;
        }

        beforeWord = "";
        isComment = false;
        line = line.replace(/[^\s.=(){};:&#\[\]]+/g,CsharpLineGroup);

        // //识别关键字
        // line = line.replace(/[^\s.=(){};&]+/g,CsharpKeys);
        // //识别字符串
        // line = line.replace(/"[\s\S]+?"/g,CsharpStrings);
        // //识别类
        // line = line.replace(/"[\s\S]+?"/g,CsharpClass);

        return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
    });

    return `<div class="script_cs script_content">${scriptContent}</div>`;
} 

//对一行中的每个单词做处理
function CsharpLineGroup(match,index,origion) {
    if(isComment) {
        //如果是注释，前面处理过了
        return "";
    }
    //如果是注释
    if(match.substr(0,2)=="//") {
        isComment = true;
        return  CsharpComment(origion.substr(index,origion.length-1));
    }

    var doMatchStr = "";
    var beginTag = "";
    var endTag = "";
    //识别一个单词的前面是什么
    if(index<=0) {
        beginTag = "";
    }
    else {
        beginTag = origion.substr(index-1,1);
    }

    //识别一个单词末尾是什么
    if(index + match.length >= origion.length) {
        endTag = "";
    }
    else {
        endTag = origion.substr(index + match.length,1);
    }

     if(csKeys[match]) {
        //识别是不是关键字
        return `<span class="${csharpsCssType.key}">${match}</span>`;
    }

    switch(beginTag) {
        case "":
            switch(endTag) {
                case "(":
                    //方法
                    doMatchStr = CsharpFuntion(match);
                    break;
                default:
                    doMatchStr = CsharpDefault(match,index,origion);
                    break;
            }
            break;
        case " ":
            switch(endTag) {
                case "(":
                    //方法
                    doMatchStr = CsharpFuntion(match);
                    break;
                case "&":
                case "[":
                    doMatchStr = CsharpClass(match);
                    break;
                default:
                    doMatchStr = CsharpDefault(match,index,origion);
                    break;
            }
            break;
        case ";":
            switch(endTag) {
                case "&":
                case "[":
                    doMatchStr = CsharpClass(match);
                    break;
                default:
                    doMatchStr = CsharpDefault(match,index,origion);
                    break;
            }
            break;
        case ".":
            switch(endTag) {
                case "(":
                    doMatchStr = CsharpFuntion(match);
                    break;
                default:
                    doMatchStr = CsharpDefault(match,index,origion);
                    break;
            }
            break;
        default:
            doMatchStr = CsharpDefault(match,index,origion);
            break;
    }

    beforeWord = match;
    return doMatchStr;
}

function CsharpDefault(str,index,origion) {
    if(str == "lt" || str == "gt") {
        return str;
    }

    switch(beforeWord) {
        case "public":
        case "private":
        case "protected":
        case "namespace":
            return CsharpClass(str);
        default:
            var nextContent = origion.substr(index,origion.length-1);
            if(/^[a-zA-Z0-9]+\s+[a-zA-Z0-9]+/.test(nextContent)) {
                return CsharpClass(str);
            } 
            return str;
    }
}

function CsharpFuntion(str) {
    if(beforeWord != "new") {
        return `<span class="${csharpsCssType.function}">${str}</span>`
    }
    else {
        return CsharpClass(str);
    }
}

function CsharpComment(str) {
    return `<span class="${csharpsCssType.comment}">${str}</span>`
}

function CsharpStrings(str) {
    return `<span class="${csharpsCssType.string}">${str}</span>`
}

function CsharpClass(str) {
    return `<span class="${csharpsCssType.class}">${str}</span>`
}

var csharpsCssType = {
    key : "cs_key",
    string : "cs_string",
    class : "cs_class",
    error : "cs_error",
    function : "cs_function",
    comment : "cs_comment",
}

if(window.scriptType === null || window.scriptType === undefined) {
    window.scriptType = {
        cs : CsharpScriptTypeHandler,
    }
} else {
    window.scriptType.cs = CsharpScriptTypeHandler
}

var csKeys = {
abstract:1,
as: 1,
base: 1,
bool: 1,
break: 1,
byte: 1,
case: 1,
catch: 1,
class : 1,
char: 1,
checked: 1,
const: 1,
continue: 1,
decimal: 1,
default: 1,
delegate: 1,
do: 1,
double: 1,
enum: 1,
event: 1,
explicit: 1,
else : 1,
extern: 1,
finally: 1,
fixed: 1,
float: 1,
for: 1,
foreach: 1,
goto: 1,
if: 1,
implicit: 1,
in: 1,
int: 1,
interface: 1,
internal: 1,
is: 1,
lock: 1,
long: 1,
new : 1,
namespace:1,
object: 1,
operator: 1,
out: 1,
override: 1,
params: 1,
private: 1,
protected: 1,
public: 1,
readonly: 1,
return : 1,
ref: 1,
sbyte: 1,
sealed: 1,
short: 1,
sizeof: 1,
stackalloc: 1,
static: 1,
string: 1,
struct: 1,
switch: 1,
this: 1,
try: 1,
typeof: 1,
uint: 1,
ulong: 1,
unchecked: 1,
unsafe: 1,
ushort: 1,
using: 1,
virtual: 1,
void: 1,
volatile: 1,
while: 1,
add: 1,
alias: 1,
ascending: 1,
async: 1,
await: 1,
by: 1,
descending: 1,
dynamic: 1,
equals: 1,
from: 1,
get: 1,
global: 1,
group: 1,
into: 1,
join: 1,
let: 1,
on: 1,
orderby: 1,
partial: 1,
remove: 1,
select: 1,
set: 1,
value: 1,
var: 1,
where: 1,
yield: 1,
}