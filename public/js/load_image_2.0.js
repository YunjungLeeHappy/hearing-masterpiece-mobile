var url_string = window.location.href;
var url = new URL(url_string);
var img_id = url.searchParams.get("img_id");
var lan = url.searchParams.get("lan");

var attr_exp = url.searchParams.get("exp");
var attr_color = url.searchParams.get("color");
var attr_loc = url.searchParams.get("loc");
var attr_size = url.searchParams.get("size");
var attr_sound = url.searchParams.get("sound");

/*
var mode = url.searchParams.get("mode");

if(mode == "m"){
    var data_location = "art_processed/";
    }
else if(mode == "p"){
    var data_location = "art_prof_processed/";
}
*/

var art_src_m = "art_filtered/art_filtered_eng/";
var art_src_p = "art_prof_processed/";
var art_src_p_e = "art_prof_eng/";
var art_src_k = "art_filtered/art_filtered_kor/";

var image_data_m = null;
var image_data_p = null;
var image_data_p_e = null;
var image_data_k = null;

$.ajax({
    'async': false,
    'global': false,
    'url': "./img_data/"+art_src_m+String(img_id)+".json",
    'dataType': "json",
    'success': function (data) {
        image_data_m = data;
    }
});

var img_width;
var img_height;

var img_id_list = ["1", "2", "4", "5", "9", "11", "17", "18", "grande", "2_milano"];
var img_size_list = [[800, 1192], [11141, 8822], [9665, 11367], [1250, 556], [4272,6000], [2880, 3579], [800, 1095], [750, 773], [15596, 10382], [1200, 941]];


if(img_id == "1"){
    var opt = 1;
}
else if(img_id == "2"){
    var opt = 0.085;
}
else if(img_id == "4"){
    var opt = 0.098;
}
else if(img_id == "5"){
    var opt = 0.75;
}
else if(img_id == "9"){
    var opt = 0.22;
}
else if(img_id == "11"){
    var opt = 0.33;
}
else if(img_id == "17"){
    var opt = 1.09;
}
else if(img_id == "18"){
    var opt = 1.28;
}
else if(img_id == "grande"){
    var opt = 0.07;
}
else if(img_id = "2_milano"){
    var opt = 0.8;
}


for(var i=0;i<img_id_list.length;i++){
    if(img_id_list[i] == img_id){
        img_width = img_size_list[i][0];
        img_height = img_size_list[i][1];
    }
}
/*
var art_metadata_kor = null;
var art_metadata_eng = null;

$.ajax({
    'async': false,
    'global': false,
    'url': "./img_data/art_metadata/art_metadata_kor.json",
    'dataType': "json",
    'success': function (data) {
        art_metadata_kor = data;
    }
});

function metadata(id, lan) {

    if (lan == "k")
        var data = art_metadata_kor['idx'];
    else
        var data = art_metadata_eng['idx'];

    for(var i=0;i<data.length;i++){
        if(id == data['idx']){
            var metadata = data[i];
            break;
            }
    }

    document.getElementById(String(id)).innerHTML =
                        ""
                        +"<br>작가: "+metadata['작가']
                        +"<br>연도: "+metadata['연도']
                        +"<br>매체: "+metadata['매체']
                        +"<br>사조: "+metadata['사조']
                        +"<br>장르: "+metadata['장르']
                        +""
                        ;

}
*/