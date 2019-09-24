
//代码风格转换
function CsharpScriptTypeHandler(scriptContent) {
    
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

        //识别关键字
        line = line.replace(/[^\s.=(){};&]+/g,CsharpKeys);
        //识别字符串
        line = line.replace(/"[\s\S]+?"/g,CsharpStrings);
        //识别类
        line = line.replace(/"[\s\S]+?"/g,CsharpClass);

        return `<div class="script_line script_line_${curLineNum}">${indentStr}${line}</div>`;
    });

    return `<div class="script_cs script_content">${scriptContent}</div>`;
} 

var csharpTagsStart = 0;
var csharpTagsEnd = 0;
var csharpFormat = "";
function CsharpLine(str) { 
    csharpTagsStart = 0;
    csharpTagsEnd = 0;
    csharpFormat = "";
    var isEnd = false;
    while(true) {
        //匹配空格
        csharpTagsEnd = str.indexOf(" ",csharpTagsStart);
        //匹配末尾
        if(csharpTagsEnd < 0 ) {
            isEnd = true;
            csharpTagsEnd = str.indexOf("&gt;",csharpTagsStart);
        }

        if(csharpTagsEnd < 0) {
            break;
        }
        //这里不把空格传入
        var group = str.substring(csharpTagsStart,csharpTagsEnd);
        
        csharpFormat += DoCsharpGroup(group);
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

function DoCsharpGroup() {

}

function CsharpKeys(str) { 
    if(csKeys[str]) {
        return `<span class=${csharpsCssType.key}>${str}</span>`
    }
    return str;
}

function CsharpStrings(str) {
    return `<span class=${csharpsCssType.string}>${str}</span>`
}

function CsharpClass(str) {
    return `<span class=${csharpsCssType.class}>${str}</span>`
}

var csharpsCssType = {
    key : "cs_key",
    string : "cs_string",
    class : "cs_class",
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