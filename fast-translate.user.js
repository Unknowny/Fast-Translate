// ==UserScript==
// @name        En-Ru Fast Translate
// @namespace   fast_translate
// @include     http://*
// @include     https://*
// @version     0.2
// ==/UserScript==

var d = document,
    last, tout,
    elem = d.createElement("span");

var imghtml = '<img src="data:image/gif;base64,R0lGODlhKAAFAIQAAFxeXLy+vOTm5JyanPT29Hx6fGxqbNTW1PTy9Pz+/MTCxOzq7KyurPz6/Hx+fGxubP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAQACwAAAAAKAAFAAAFOWBCLEhinmiqrmzCGAPRzHRt3/idHIXzBIqgcEgsGosHFyDWIIiaT6dMCp1Gr1bIqATper/gsFgcAgAh+QQJCQAQACwAAAAAKAAFAAAFPWAijsSCjGiqrmvjuowxEG9t33idHErfF45HwEcsGo/EQ8JFSBAYgFmjSaNOndcq1mpNQL7g0glMLpvP5RAAIfkECQkAEAAsAAAAACgABQAABTxgIo5kQixIqa5s0rxwzBgDEd94/iaH4v/AguMRABqPSN/B1SCYmk8GoAa1Oa3Pa7WagHi/YMgpFS6bzSEAIfkECQkAEAAsAAAAACgABQAABTxgIo5kmRALYq5s0rxwLDPGQMh43iSH4v/AYMHxCASPSMXB1SCcmk/njcAA2KDTqDbbgHi/4DAEpRKbzSEAIfkECQkAEAAsAAAAACgABQAABT1gIo5kaRILYq5k475wHDPGQMh4kxxK7/9AYMHxCASPikPCRUjcmk9nAzptMAC2qZTKTUC+4LB4jFKNz98QACH5BAkJABAALAAAAAAoAAUAAAU9YCKOZGmWxIKcZeO+cCzDjDEQs5scSu//wOCv4HgEhL1DwkVI4JpPZwM6lUIZgFs1iktAvuCweCxOrcjgEAAh+QQJCQAQACwAAAAAKAAFAAAFPGAijmRpniOxIGfjvnAszy5jDAScHErv/8CgsFdwPAK/Q8JFSOSaT2cDOpVSqQwArtqEeL/gsHj8VbHCIQAh+QQJCQAQACwAAAAAKAAFAIRcXlzEwsTk5uScmpz09vR8enxsamzU0tT08vT8/vzs6uysrqz8+vx8fnxsbmzU1tT///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFOWAijmRpniihICLjvnAsz/NiDMQT7Hzv/0BgoeE4JFyEBIGRXDaZSqgz+qwuADiIdsvter9gxioRAgAh+QQJCQAQACwAAAAAKAAFAAAFPGAijmRpniOxIGfjvnAszy5jDAScHErv/8CgsFdwPAK/Q8JFSOSaT2cDOpVSqQwArtqEeL/gsHj8VbHCIQAh+QQJCQAQACwAAAAAKAAFAAAFPWAijmRplsSCnGXjvnAsw4wxELObHErv/8Dgr+B4BIS9Q8JFSOCaT2cDOpVCGYBbNYpLQL7gsHgsTq3I4BAAIfkECQkAEAAsAAAAACgABQAABT1gIo5kaRILYq5k475wHDPGQMh4kxxK7/9AYMHxCASPikPCRUjcmk9nAzptMAC2qZTKTUC+4LB4jFKNz98QACH5BAkJABAALAAAAAAoAAUAAAU8YCKOZJkQC2KubNK8cCwzxkDIeN4kh+L/wGDB8QgEj0jFwdUgnJpP543AANig06g224B4v+AwBKUSm80hACH5BAkJABAALAAAAAAoAAUAAAU8YCKOZEIsSKmubNK8cMwYAxHfeP4mh+L/wILjEQAaj0jfwdUgmJpPBqAGtTmtz2u1moB4v2DIKRUum80hACH5BAkJABAALAAAAAAoAAUAAAU9YCKOxIKMaKqua+O6jDEQb23feJ0cSt8XjkfARywaj8RDwkVIEBiAWaNJo06d1yrWak1AvuDSCUwum8/lEAA7"/>'

elem.setAttribute("style", "display:inline-block;background-color:white;color:#333;padding:0 2px;min-height:10px;min-width:40px;position:fixed;right:7px;top:7px;z-index:999999999999;box-shadow:0 0 1px black;");
elem.innerHTML = imghtml;

function main (e) {
    if(e.ctrlKey){

        var str = getString(e.rangeParent);
        var word = getWord(str, e.rangeOffset);

        if(!word || last === word) return;

        last = word;

        appendSpan();
        getTranslate(word);

    }
}

function getString (node) {
    var r = d.createRange(); 
        r.selectNode(node);
    var str = r.toString();
        r.detach();
    return str;
}

function getWord (str, offset) {
    if ( !/[a-z-']/i.test( str[offset] ) ) return;

    var start = str.substr(0, offset).match(/[a-z-'’]+(?!.+[a-z-’']*)/i) || "",
        end = str.substr(offset).match(/[a-z-'’]+/i) || "";

    return start + end;
}

function appendSpan () {
    removeSpan();
    d.body.appendChild(elem);
}

function removeSpan () {
    try{ d.body.removeChild(elem); }catch(e){}
    elem.innerHTML = imghtml;
}

function getTranslate (word) {
    var z=d.createElement("script");
    z.setAttribute("src", "https://translate.yandex.net/api/v1.5/tr.json/translate"+"?key=trnsl.1.1.20130627T145755Z.380c7f262015ef32.f3d5bbc21298dc8d017b6596fcd6d632d62f6c3c&callback=insertText_&lang=en-ru&text="+escape(word));
    d.body.appendChild(z);
}
    // JSONP function
    window.insertText_ = function(text) {
        elem.innerHTML = text.text[0];

        clearTimeout(tout);
        tout = setTimeout(function(){
            removeSpan();
        }, 3000)
    }

// Init
document.body.addEventListener("mousemove", main);
