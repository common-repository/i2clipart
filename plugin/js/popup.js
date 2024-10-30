var page  = 1;
var pages = 0;
var limit = 8;
var rows  = 2;
var imgPerLine = limit / rows;

// initialize UI for first time. if cookie is not set, assume checkbox checked by default
if(getCookie("save_search") == null)
{
    setCookie("save_search", 'checked');
}

function GetAJAXObject()
{
  var xmlHttp;
  try {
    // Firefox, Opera 8.0+, Safari
    xmlHttp=new XMLHttpRequest();
  } catch (e)   {
    // Internet Explorer
    try {
      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try{
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
    alert("Your browser does not support AJAX!");
      }
    }
  }
  
  return xmlHttp;
}

tinyMCEPopup.requireLangPack();

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
  
function setCookie(name,value,days)
{
  days = 0.01; // 15 min
  value = encodeURIComponent(value);
  if (days) {var date = new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires = "; expires="+date.toGMTString();} else var expires = ""; 
  document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    }
    return null;
}
function eraseCookie(name) {setCookie(name,"",-1);}
function clearCookies(){eraseCookie("query"); eraseCookie("page");}

function frontPage()
{
    var query = getCookie('query');
    page = getCookie('page');
    if((query != "") && (query != "undefined") && (query != null) && 
        (page != "") &&  (page != "undefined") &&  (page != null))
    {
        document.getElementById("search_box_id").value = query;
        i2clipartDialog.search();
    }
    else
    {
        color_swatch();
    }
}

function pin(small, medium, large, xlarge, imgMedium, imgTitle, imgUrl, imgKey) {
    
    var s ="<a class='link' href='javascript:void(0)' title='small' onclick='i2clipartDialog.inserturl(\"" + small + "\")'>S</a> ";
    var m ="<a class='link' href='javascript:void(0)' title='medium' onclick='i2clipartDialog.inserturl(\"" + medium + "\")'>M</a> ";
    var l ="<a class='link' href='javascript:void(0)' title='large' onclick='i2clipartDialog.inserturl(\"" + large + "\")'>L</a>";
    var x ="<a class='link' href='javascript:void(0)' title='xlarge' onclick='i2clipartDialog.inserturl(\"" + xlarge + "\")'>X</a>";
    var v ="<a class='link link_hue' href='javascript:void(0)' title='Color Variations' onclick='colorFan(\"" + imgUrl + "\", \"" + imgKey + "\")'>&#x263C;</a>";

    var o = '';
    o += "<div class='span3'>";
        o += "<div class='pin'>";
                o += "<a href='javascript:void(0)' onclick='i2clipartDialog.inserturl(\"" + medium + "\")'>";
                    o += "<img class='thumb' src='" + imgMedium + "' title='"+ imgTitle + "'/>";
                o += "</a>";
        o += "</div>";
        o += "<div class='attribution'>";
        o += s + " " + m + " " + l + " " + x + " " + v;
        o += "</div>";
    o += "</div>";

    return o;
}

function pinColorWheel(small, medium, imgMedium, imgTitle) {
    
    var s ="<a class='link' href='javascript:void(0)' title='small' onclick='i2clipartDialog.inserturl(\"" + small + "\")'>S</a> ";
    var m ="<a class='link' href='javascript:void(0)' title='medium' onclick='i2clipartDialog.inserturl(\"" + medium + "\")'>M</a> ";

    var o = '';
    o += "<div class='span3'>";
        o += "<div class='pin'>";
                o += "<a href='javascript:void(0)' onclick='i2clipartDialog.inserturl(\"" + medium + "\")'>";
                    o += "<img class='thumb' src='" + imgMedium + "' title='"+ imgTitle + "'/>";
                o += "</a>";
        o += "</div>";
        o += "<div class='attribution'>";
        o += s + " " + m;
        o += "</div>";
    o += "</div>";

    return o;
}

function color_swatch()
{
    init_search();
    clearCookies();
    var checked = getCookie("save_search"); 

    var ui_color_swatch = "#ccf3fc,#cedffc,#c1b9fc,#d7b9fc,#e8c6db,#f0ced1,#f4d5cc,#f8e3cb,#f9e7cb,#fef6d5,#f9f7d4,#e0e9ca,#9fe6f6,#a1c1f6,#988cf7,#bc8cf7,#daa2c4,#e4a8ae,#eab4a4,#f1cba1,#f2d2a0,#f9eaa7,#f1edaa,#cbdba6,#73dbf3,#75a4f3,#7260f4,#a360f4,#d07eb0,#da828a,#e3937c,#ebb577,#eebf76,#f4dd7c,#ece680,#bad083,#4ad0ef,#4c88ef,#4e38ef,#8a38ef,#c75a9c,#d35c67,#dd7253,#e89f4d,#ebac4b,#efd154,#e8df56,#a9c75e,#22c4ea,#246dea,#2b11ea,#7211ea,#c0348a,#ce3543,#da522b,#e68a22,#e99a20,#eac52d,#e5db2c,#99c039,#00b8e2,#0054e4,#1900d1,#5d00d1,#aa2175,#c21726,#cf370b,#de7600,#df8700,#e5ba07,#e5d801,#85ac23,#0097b9,#0045bb,#1400a8,#4b00a8,#8c165f,#a10e1c,#ae2b05,#b56000,#b66e00,#c39d00,#beb400,#6d8f17,#007692,#003793,#0f0081,#3a0081,#6e0d49,#810812,#8b1f00,#8d4b00,#8e5600,#9b7d00,#968e00,#55710f,#00586d,#00296e,#0a005d,#2a005d,#4f0734,#60030b,#661600,#693700,#693f00,#765e00,#716a00,#3d5208,#ffffff,#e9e9e9,#d4d4d4,#bfbfbf,#aaaaaa,#959595,#808080,#6a6a6a,#555555,#404040,#2b2b2b,#161616";

    var colors = ui_color_swatch.split(",");
    var out = '<div class="color_title">Search Cliparts by Keywords or Color</div>';
    out += '<div id="swatch_box">';
    for(var i = 0; i < colors.length; ++i)
    {
      out += '<a class="pull-left palette" style="background:'+ colors[i] +'"  title="'+ colors[i] +'" href="javascript:void(0)" onclick="colorsearch(\'' + colors[i] + '\')"></a>';
    }
    out += '</div>';
    out += '<div id="checkbox"><input type="checkbox" name="save_search_check" value="save_search_check" '+ checked +' onclick="handle_checkbox();">Remember My Search</div>';

    var el = document.getElementById("results");
    el.innerHTML=out;
}

function handle_checkbox()
{    
    var checked = getCookie("save_search");
    if(checked == 'checked')
    {
        clearCookies();
        checked = '';
    }
    else // if null, no cookie is set
    {
        checked = 'checked';   
    }
    setCookie("save_search", checked);
}

function colorsearch(color)
{
    document.forms[0].searchQuery.value = color.replace('#', '~');
    i2clipartDialog.search();
}

function pagination(page_no, nPages)
{  
    var max_visible_pages = 7;
    var side_visible_pages = (max_visible_pages - 1) / 2;

    var begin = 1;
    var end  = Math.min(max_visible_pages, nPages);

    if(Math.floor(page_no / max_visible_pages) >  0)
    {
        begin = Math.max(1, page_no - side_visible_pages);
        end  = Math.min(page_no + side_visible_pages, nPages);
    }

    var page_links = '';
    for(i = begin; i <= end; ++i)
    {
        var style = '';
        if(i == page_no)
        {
            style = "class='active'";
        }
        page_links += "<li " + style + "><a href='javascript:void(0)' onclick='i2clipartDialog.access(\"" + i + "\")'>" + i + "</a></li>";
    }

    var o = '';
    o += "<div class='pagination'>";
        o += "<ul>";
          o += "<li><a href='javascript:void(0)' onclick='i2clipartDialog.begin()' title='First Page'>&laquo;</a></li>";
          o += "<li><a href='javascript:void(0)' onclick='i2clipartDialog.prev()' title='Previous Page'><b>&#x25C0;</b></a></li>";
            o += page_links;
          o += "<li><a href='javascript:void(0)' onclick='i2clipartDialog.next()' title='Next Page'><b>&#x25B6;</b></a></li>";
          o += "<li><a href='javascript:void(0)' onclick='i2clipartDialog.end()' title='Last Page'>&raquo;</a></li>";
        o += "</ul>";
    o += "</div>";
    return o;
}

function colorFan(imgUrl, imgKey) 
{   
    var pathArray = imgUrl.split( '/' );
    var imgRelUrl = pathArray[3];

    var myxmlHttp = GetAJAXObject();
    
    myxmlHttp.onreadystatechange=function()
    {
        var el = document.getElementById("results");

        if (myxmlHttp.readyState == 4)
        {      
            xml = myxmlHttp.responseText;
            if(xml.search("\n") != -1)
            {
                rows = xml.split("\n");

                var out = '';
                var cols = 0;
                var block = '';
                var hue_exist = 0;
                for(i = 0; i < rows.length; ++i)
                {
                    var r = rows[i].split(",");
                    var imgSmall  = r[0];
                    var imgMedium = r[1];

                    if(imgSmall != '' && imgMedium != '')
                    {
                        hue_exist = 1;
                        var imgTitle = '';

                        var small = "<a href='" + imgUrl + "'target='_blank'><img style='float:left;border:0;margin:5px;' src='" + imgSmall + "' title='" + imgTitle + "'/></a>";
                        small = Base64.encode(small);

                        var medium = "<a href='" + imgUrl + "'target='_blank'><img style='float:left;border:0;margin:5px;' src='" + imgMedium + "' title='" + imgTitle + "'/></a>";
                        medium = Base64.encode(medium);

                        block += pinColorWheel(small, medium, imgMedium, imgTitle);
                        ++cols;
                        if(cols == imgPerLine)
                        {
                            out += "<div class='row-fluid pull-up-20'>" + block + "</div>";
                            block = '';
                            cols = 0;
                        }
                    }
                }

                if(!hue_exist)
                {
                    out += "<div class='alert-info pull-up-20'>No color variations for selected image yet</div>";
                    out += "<input class='cbtn' style='position:absolute; top:140px; left:360px; width:60px;' value='&#x25C0; Back' onclick='i2clipartDialog.search();' />";
                }
                else
                {
                    if(block != '')
                    {
                        out += "<div class='row-fluid pull-up-20'>" + block + "</div>";
                    }
                    out += '<div class="clearfix"></div>';
                    out += "<input class='cbtn' style='margin:30px auto 0 auto; display:block; text-align:center; width:60px;' value='&#x25C0; Back' onclick='i2clipartDialog.search();' />";                    
                }
                el.innerHTML=out;
            }
            else
            {
                el.innerHTML=xml;
            }
        }
        document.getElementById("wait").style.display = 'none';
    }
   
    document.getElementById("wait").style.display = 'block';
    var url = "search.php?limit=" + limit + "&page=" + String(page) + "&query=" + document.forms[0].searchQuery.value + "&key=" + imgKey + "&url=" + imgRelUrl;
    myxmlHttp.open("GET", url, true);
    myxmlHttp.send(null);

    delete myxmlHttp;
}

function init_search()
{
    page  = 1;
    pages = 0;    
}

var i2clipartDialog = {
 init : function() {
    var f = document.forms[0];

    // Get the selected contents as text and place it in the input
    f.someval.value = tinyMCEPopup.editor.selection.getContent({format : 'text'});
    f.somearg.value = tinyMCEPopup.getWindowArg('some_custom_arg');
  },

 inserturl : function(url){
    tinyMCEPopup.editor.execCommand('mceInsertContent', false, Base64.decode(url));
    tinyMCEPopup.close();
  },

 insert : function() {
    // Insert the contents from the input into the document
    tinyMCEPopup.editor.execCommand('mceInsertContent', false, document.forms[0].someval.value);
    tinyMCEPopup.close();
  },

 begin : function() {
    page = 1;
    this.search();
  },

 prev : function() {
    page -= 1;
    if (page < 1) page = 1;
    this.search();
  },

 next : function() {
    page += 1;
    if (page > pages) page = pages;
    this.search();
  },

 end : function() {
    page = pages;
    this.search();
  },
 access : function(p) {
    page = p;
    this.search();
  },  

 search : function() {

    var myxmlHttp = GetAJAXObject();
    myxmlHttp.onreadystatechange=function()
    {           
        var el = document.getElementById("results");
        if (myxmlHttp.readyState == 4)
        {      
            xml = myxmlHttp.responseText;
            if(xml.search("\n") != -1)
            {
                rows = xml.split("\n");
                
                var hits = rows[0]-0;
                pages    = rows[1]-0;
                page     = rows[2]-0;

                var out = '';
                out+= pagination(page, pages);

                var cols = 0;
                var block = '';
                for(i = 0; i < rows.length - 3; ++i)
                {
                    if (rows[i+3].length < 3) continue;

                    // every line is the image metadata separated by commas
                    var r = rows[i+3].split(",");
                    var imgKey    = r[0];
                    var imgUrl    = r[1];
                    var imgTitle  = r[2];
                    var imgSmall  = r[3];
                    var imgMedium = r[4];
                    var imgLarge  = r[5];
                    var imgXLarge = r[6];

                    var small = "<img style='float:left;border:0px;margin:5px;' src='" + imgSmall + "' title='" + imgTitle + "' alt='" + imgTitle + "'/>";
                    small = Base64.encode(small);

                    var medium = "<img style='float:left;border:0px;margin:5px;' src='" + imgMedium + "' title='" + imgTitle + "' alt='" + imgTitle + "'/>";
                    medium = Base64.encode(medium);

                    var large = "<img style='float:left;border:0px;margin:5px;'  src='" + imgLarge + "' title='" + imgTitle + "' alt='" + imgTitle + "'/>";
                    large = Base64.encode(large);

                    var xlarge = "<img style='float:left;border:0px;margin:5px;'  src='" + imgXLarge + "' title='" + imgTitle + "' alt='" + imgTitle + "'/>";
                    xlarge = Base64.encode(xlarge);

                    block += pin(small, medium, large, xlarge, imgMedium, imgTitle, imgUrl, imgKey);
                    ++cols;
                    if(cols == imgPerLine)
                    {
                        out += "<div class='row-fluid pull-up-20'>" + block + "</div>";
                        block = '';
                        cols = 0;
                    }
                }
                if(block != '')
                {
                    out += "<div class='row-fluid pull-up-20'>" + block + "</div>";
                }
                el.innerHTML=out;
            }
            else
            {
                el.innerHTML=xml;
            }
        }
        document.getElementById("wait").style.display = 'none';
    }
    
    document.getElementById("wait").style.display = 'block';
    var query = document.forms[0].searchQuery.value;
    var url = "search.php?limit=" + limit + "&page=" + String(page) + "&query=" + query + "&key=" + "&url=";
    myxmlHttp.open("GET", url, true);
    myxmlHttp.send(null);

    save_search = getCookie("save_search"); 
    if(save_search == 'checked' && query != '')
    {
        setCookie("query", query);
        setCookie("page", page);
    }
    delete myxmlHttp;
  }
};

tinyMCEPopup.onInit.add(i2clipartDialog.init, i2clipartDialog);