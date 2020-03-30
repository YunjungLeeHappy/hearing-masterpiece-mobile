var kor = "Korean Female";
var eng = "US English Female";

var language = eng;

var username = "user_1";

var log_array = [];

var log_count = 0;

var desc_mode = 0;

function change_desc_mode(){
    if(desc_mode == 0){ //default
        return 1;
    }
    else if(desc_mode == 1){
        return 0;
    }
}

function get_objects_list(annotations){
    result_list = []
    objects_list = [];

    var counts = {};

    for(var i=annotations.length-1;i>=0;i--){
        if(annotations[i].category != "배경" && annotations[i].category != "background")
            objects_list.push(annotations[i].category);
    }
    objects_list = Array.from(objects_list);
    objects_list.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

    for(var key in counts){
        result_list.push(key+"("+String(counts[key])+")");
    }

    return result_list;
  }

function list_contains(list, elem){
    for(var i=0;i<list.length;i++){
        if(list[i] == elem){
            return true
        }
    }
    return false
}

function draw_polygon(mode){

    svg.selectAll("polygon").remove();

    if(mode == "m" || mode == "label"){ //fine(polygon mode)
        img_file = image_data_m;

        not_parts_object = []

        for(var i=0;i<image_data_m.annotation.object.length;i++){
            if(image_data_m.annotation.object[i]['parts']['ispartof'] == null){

                not_parts_object.push(image_data_m.annotation.object[i]);
            }

        }

        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(not_parts_object)
        .enter().append("polygon")
        .attr("id", function(d){
            return d['id'];
        })
        .attr("points", function(d) {
            if(d['deleted'] == "0"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }});
        ;
    }

    else if(mode == "m" && lan == "k"){ //fine(polygon mode)
        img_file = image_data_k;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] == "0"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    else if(mode == "p" && lan == "e"){ //rough(bbox mode)
        img_file = image_data_p_e;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] != "1"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    else if(mode == "p" && lan == "k"){ //rough(bbox mode)
        img_file = image_data_p;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] != "1"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    //polygon opacity, fill color(random)
  svg.selectAll("polygon")
  .style("fill-opacity", .000001)
  .style("stroke-width", 5)
  .style("fill-opacity", .0)
  .style("stroke",function() {
    return "hsl(" + Math.random() * 360 + ",100%,50%)";
  })

  .attr("category", function(d){
    d.name = d.name.replace('.', '');
    return d.name;})
    .on("touchstart", function(){
        responsiveVoice.cancel();
    })
    .dblTap(function(d) {
        if(mode == "label" && d.parts.hasparts != null){
            mode = "parts";
            draw_parts(d.parts.hasparts);
        }
    })
    .on("click", function(d){
        responsiveVoice.cancel();
        setTimeout(function(){responsiveVoice.speak(d.attributes, language);}, 2000);
    })
    .append("svg:title")
    .text(function(d) {
        d.name = d.name.replace('.', '');
        if(mode == "p"){ //part mode
            return d.name + ".." + d.attributes;
        }
        else if(mode == "m"){ //mturk mode(object mode)
            var cat = d.name + "..";
            if(d.remains != "" && typeof d.remains != "undefined" && attr_exp == "1"){
                cat = cat + d.remains;
            }
            if(d.color != "" && typeof d.color != "undefined" && attr_color == "1"){
                if(lan == "e"){
                    cat = cat + ", the color is "+d.color;
                }
                else if(lan == "k"){
                     cat = cat + ", 색깔은 "+d.color;
                }

            }
            if(d.location !="" && typeof d.location != "undefined" && attr_loc == "1"){
                if(lan == "e"){
                    cat = cat + ", the location is " + d.location;
                }
                else if(lan == "k"){
                    cat = cat + ", 위치는 " + d.location;
                }
            }
            if(d.size !="" && typeof d.size != "undefined" && attr_size == "1"){
                if(lan == "e"){
                    cat = cat + ", the size is " + d.size;
                }
                else if(lan == "k"){
                    cat = cat + ", 크기는 " + d.size;
                }
            }
            return cat;
        }
        else if(mode == "label"){ //only label of the polygon
            return d.name;
        }
        else if(mode == "attr"){ //only attributes of the polygon
            return d.attributes;
        }
     })
    ;
}

/* drawing only parts of the polygon upon double tap(single-finger triple tap while using VoiceOver) */
function draw_parts(parts_list){

    var mode = "parts";
    console.log(mode);

    svg.selectAll("polygon").remove();
    img_file = image_data_m;

    parts_object = []

    for(var i=0;i<image_data_m.annotation.object.length;i++){
        if(list_contains(parts_list.split(','), image_data_m.annotation.object[i]['id'].toString())){

            parts_object.push(image_data_m.annotation.object[i]);
        }

    }


    d3.selectAll("polygon").remove();
    svg.selectAll("polygon")
    .data(parts_object)
    .enter().append("polygon")
    .attr("id", function(d){
        return d['id'];
    })
    .attr("points", function(d) {
        if(d['deleted'] == "0"){

            return d.polygon.pt.map(function(d) {
                    //console.log(d);
                    return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
    ;

    //polygon opacity, fill color(random)
  svg.selectAll("polygon")
  .style("fill-opacity", .000001)
  .style("stroke-width", 5)
  .style("fill-opacity", .0)
  .style("stroke",function() {
    return "hsl(" + Math.random() * 360 + ",100%,50%)";
  })

  .attr("category", function(d){
    d.name = d.name.replace('.', '');
    return d.name;})
    .on("touchstart", function(){
        responsiveVoice.cancel();
    })
    .dblTap(function(d) {

        draw_polygon("label");

    })
    .on("click", function(d){
        responsiveVoice.cancel();
        setTimeout(function(){responsiveVoice.speak(d.attributes, language);}, 2000);
    })
    .append("svg:title")
    .text(function(d) {
        d.name = d.name.replace('.', '');
        if(mode == "p"){
            return d.name + ".." + d.attributes;
        }
        else if(mode == "m"){
            var cat = d.name + "..";
            if(d.remains != "" && typeof d.remains != "undefined" && attr_exp == "1"){
                cat = cat + d.remains;
            }
            if(d.color != "" && typeof d.color != "undefined" && attr_color == "1"){
                if(lan == "e"){
                    cat = cat + ", the color is "+d.color;
                }
                else if(lan == "k"){
                     cat = cat + ", 색깔은 "+d.color;
                }

            }
            if(d.location !="" && typeof d.location != "undefined" && attr_loc == "1"){
                if(lan == "e"){
                    cat = cat + ", the location is " + d.location;
                }
                else if(lan == "k"){
                    cat = cat + ", 위치는 " + d.location;
                }
            }
            if(d.size !="" && typeof d.size != "undefined" && attr_size == "1"){
                if(lan == "e"){
                    cat = cat + ", the size is " + d.size;
                }
                else if(lan == "k"){
                    cat = cat + ", 크기는 " + d.size;
                }
            }
            return cat;
        }
        else if(mode == "label" || mode == "parts"){
            return d.name;
        }
        else if(mode == "attr"){
            return d.attributes;
        }
     })
    ;
}


var margin = {top: 0, right: 20, bottom: 0, left: 50},
    width = 800,
    height = 900;

d3.selection.prototype.dblTap = function(callback) {
      var last = 0;
      return this.each(function() {
        d3.select(this).on("touchstart", function(e) {
            if ((d3.event.timeStamp - last) < 500) {
              return callback(e);
            }
            last = d3.event.timeStamp;
        });
      });
    }

var svg = d3.select(".image").append("svg")
  .attr("id", "svg")
  .attr("width", img_width*opt)
  .attr("height", img_height*opt)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
  .dblTap(function() {
  if(mode == "parts"){
            mode = "label";
            draw_polygon(mode);
        }
    });

 function change_mode(){
    if(mode == "m"){
            mode = "p";
            draw_polygon(mode);
        }
        else{
            mode = "m";
            draw_polygon(mode);
        }
 }


 if(attr_sound == "po"){
    var mode = "p";
 }
 else{
    //var mode = "m";
    var mode = "label";
 }
 var audio_flag = 0;
 var audio = null;

 if(lan == "k")
    var img_file = image_data_k;
 else
    var img_file = image_data_m

  var img_file_name = img_id+".jpg";

  //var objects_list = get_objects_list(img_file.annotations);

  //var sorted_by_point = img_file.sorted_by_point;

  var sorted_count=0;

  var tooltip = d3.select(".image")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("background", "white");

var zoomListener = d3.zoom()
    .scaleExtent([1, 5])
    .on("zoom", zoomed)

function zoomed() {
    if (d3.event.transform.k === 1) d3.event.transform.y = 0;
    if (d3.event.transform.x > 0) d3.event.transform.x = 0;
    svg.attr("transform", d3.event.transform);
    x.call(d3.event.transform.rescaleX(x));
    y.call(d3.event.transform.rescaleY(y));
}

 if(img_id == "9"){
    var portion = 1.163;
    var y_start = -100;
  }
  else{
    var portion = 1;
    var y_start = 1;
  }

  var image = svg.append('image')
    .attr('xlink:href', "https://raw.githubusercontent.com/KwonNH/hearing-masterpiece-mobile/master/public/milano_image/"+img_file_name)
    .attr("x", 1)
    .attr("y", y_start)
    .attr('width', img_width*opt)
    .attr('height', img_height*opt)
    ;

  var x = d3.scaleLinear().range([0, img_width*opt]);
  var y = d3.scaleLinear().range([0, img_height*opt]);

  x.domain([0, img_width*portion*opt]);
  y.domain([0, img_height*portion*opt]);

  draw_polygon(mode);

