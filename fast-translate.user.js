// ==UserScript==
// @name        En-Ru Word Translator
// @description Translates words under curser when CTRL is pressed.
// @namespace   fast_translate
// @include     http://*
// @include     https://*
// @version     0.3
// ==/UserScript==

var d = document;
var t_id, last_searched, elem;
var shown = false;
var loader_html = '<img src="data:image/gif;base64,R0lGODlhKAAFAIQAAFxeXLy+vOTm5JyanPT29Hx6fGxqbNTW1PTy9Pz+/MTCxOzq7KyurPz6/Hx+fGxubP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCQAQACwAAAAAKAAFAAAFOWBCLEhinmiqrmzCGAPRzHRt3/idHIXzBIqgcEgsGosHFyDWIIiaT6dMCp1Gr1bIqATper/gsFgcAgAh+QQJCQAQACwAAAAAKAAFAAAFPWAijsSCjGiqrmvjuowxEG9t33idHErfF45HwEcsGo/EQ8JFSBAYgFmjSaNOndcq1mpNQL7g0glMLpvP5RAAIfkECQkAEAAsAAAAACgABQAABTxgIo5kQixIqa5s0rxwzBgDEd94/iaH4v/AguMRABqPSN/B1SCYmk8GoAa1Oa3Pa7WagHi/YMgpFS6bzSEAIfkECQkAEAAsAAAAACgABQAABTxgIo5kmRALYq5s0rxwLDPGQMh43iSH4v/AYMHxCASPSMXB1SCcmk/njcAA2KDTqDbbgHi/4DAEpRKbzSEAIfkECQkAEAAsAAAAACgABQAABT1gIo5kaRILYq5k475wHDPGQMh4kxxK7/9AYMHxCASPikPCRUjcmk9nAzptMAC2qZTKTUC+4LB4jFKNz98QACH5BAkJABAALAAAAAAoAAUAAAU9YCKOZGmWxIKcZeO+cCzDjDEQs5scSu//wOCv4HgEhL1DwkVI4JpPZwM6lUIZgFs1iktAvuCweCxOrcjgEAAh+QQJCQAQACwAAAAAKAAFAAAFPGAijmRpniOxIGfjvnAszy5jDAScHErv/8CgsFdwPAK/Q8JFSOSaT2cDOpVSqQwArtqEeL/gsHj8VbHCIQAh+QQJCQAQACwAAAAAKAAFAIRcXlzEwsTk5uScmpz09vR8enxsamzU0tT08vT8/vzs6uysrqz8+vx8fnxsbmzU1tT///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFOWAijmRpniihICLjvnAsz/NiDMQT7Hzv/0BgoeE4JFyEBIGRXDaZSqgz+qwuADiIdsvter9gxioRAgAh+QQJCQAQACwAAAAAKAAFAAAFPGAijmRpniOxIGfjvnAszy5jDAScHErv/8CgsFdwPAK/Q8JFSOSaT2cDOpVSqQwArtqEeL/gsHj8VbHCIQAh+QQJCQAQACwAAAAAKAAFAAAFPWAijmRplsSCnGXjvnAsw4wxELObHErv/8Dgr+B4BIS9Q8JFSOCaT2cDOpVCGYBbNYpLQL7gsHgsTq3I4BAAIfkECQkAEAAsAAAAACgABQAABT1gIo5kaRILYq5k475wHDPGQMh4kxxK7/9AYMHxCASPikPCRUjcmk9nAzptMAC2qZTKTUC+4LB4jFKNz98QACH5BAkJABAALAAAAAAoAAUAAAU8YCKOZJkQC2KubNK8cCwzxkDIeN4kh+L/wGDB8QgEj0jFwdUgnJpP543AANig06g224B4v+AwBKUSm80hACH5BAkJABAALAAAAAAoAAUAAAU8YCKOZEIsSKmubNK8cMwYAxHfeP4mh+L/wILjEQAaj0jfwdUgmJpPBqAGtTmtz2u1moB4v2DIKRUum80hACH5BAkJABAALAAAAAAoAAUAAAU9YCKOxIKMaKqua+O6jDEQb23feJ0cSt8XjkfARywaj8RDwkVIEBiAWaNJo06d1yrWak1AvuDSCUwum8/lEAA7"/>';

function mousemoveHandler (e) {
    if (!e.ctrlKey)
        return;

    // get text under cursor
    var range = d.createRange();
    range.selectNode(e.rangeParent);
    var text = range.toString();
    range.detach();

    var word = getWord(text, e.rangeOffset);

    if (!word || last_searched === word)
        return;

    last_searched = word;

    showTranslation(word);
}

function getWord (text, offset) {
    // if not english word char
    if (!/[a-z-']/i.test(text[offset]))
        return;

    // before and after the cursor
    var before = text.substr(0, offset).match(/[a-z-'’]+$/i);
    before = before ? before[0] : '';
    var after = text.substr(offset).match(/^[a-z-'’]+/i);
    after = after ? after[0] : '';

    return before + after;
}

function detachItself (node) {
    node.parentElement.removeChild(node);
}

function showTranslation (word) {
    if (shown) {
        clearTimeout(t_id);
        elem.innerHTML = loader_html;
    }

    d.body.appendChild(elem);
    shown = true;

    // TODO Greasemonkey xhr
    var script_url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20130627T145755Z.380c7f262015ef32.f3d5bbc21298dc8d017b6596fcd6d632d62f6c3c&callback=__insertText&lang=en-ru&text=';
    var script = d.createElement('script');
    script.addEventListener('load', function (e) {
        // remove script node after its executed
        detachItself(this)
    });
    script.setAttribute('src', script_url + escape(word));
    d.head.appendChild(script);

}

window.__insertText = function(text) {
    elem.innerHTML = text.text[0];

    clearTimeout(t_id);
    t_id = setTimeout(function () {
        detachItself(elem)
        shown = false;
    }, 3000);
}

// Main

elem = d.createElement('span');
elem.setAttribute('style', 'font-size:14px;display:inline-block;background-color:white;color:#333;padding:1px 3px;min-height:10px;min-width:40px;position:fixed;right:7px;top:7px;z-index:999999999999;box-shadow:0 0 1px black;');
elem.innerHTML = loader_html;
d.body.addEventListener('mousemove', mousemoveHandler);
