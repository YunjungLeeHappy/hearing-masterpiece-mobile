var kor = "Korean Female";
var eng = "US English Female";

var language = eng;

var username = "user_1";

var log_array = [];

var log_count = 0;

var desc_mode = 0;

function change_desc_mode(){
    if(desc_mode === 0){ //default
        return 1;
    }
    else if(desc_mode === 1){
        return 0;
    }
}

function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data === null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

function download_csv(args) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: log_array
        });
        if (csv === null) return;

        filename = args || username+"_log.csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


function collect_log(username, point_x, point_y){
    current_log = {};
    current_log['username'] = username;
    current_log['point_x'] = event.pageX;
    current_log['point_y'] = event.pageY;

    log_array.push(current_log);
    /*
    if(log_array.length %10 === 0 && log_array.length >= 10){

        localStorage.setItem('myStorage', JSON.stringify(log_array));

        JSON.parse(localStorage.getItem('myStorage'));

    }
    */
}

function get_log_file(){
    var result = convertArrayOfObjectsToCSV(log_array);
    download_csv(result);
}

function find_by_file_id(image_data, img_id){
    for(var i=0;i<image_data.images.length;i++){
        if(image_data.images[i].id === img_id){
            return image_data.images[i];
        }
    }
    return -1;
  }

function hasNumber(myString) {
  return /\d/.test(myString);
}

function get_objects_list(annotations){
    result_list = []
    objects_list = [];

    var counts = {};

    for(var i=annotations.length-1;i>=0;i--){
        if(annotations[i].category !== "배경" && annotations[i].category !== "background")
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
        if(list[i] === elem){
            return true
        }
    }
    return false
}

function draw_polygon(mode){

    svg.selectAll("polygon").remove();

    if(mode === "m" || mode === "label"){ //fine(polygon mode)
        img_file = image_data_m;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .attr("id", function(d){
            return d['id'];
        })
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] === "0"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }});
        ;
    }

    else if(mode === "m" && lan === "k"){ //fine(polygon mode)
        img_file = image_data_k;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] === "0"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    else if(mode === "p" && lan === "e"){ //rough(bbox mode)
        img_file = image_data_p_e;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] !== "1"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    else if(mode === "p" && lan === "k"){ //rough(bbox mode)
        img_file = image_data_p;
        d3.selectAll("polygon").remove();
        svg.selectAll("polygon")
        .data(img_file.annotation.object)
        .enter().append("polygon")
        .attr("points", function(d) {
            if(d['deleted'] !== "1"){

                return d.polygon.pt.map(function(d) {
                        //console.log(d);
                        return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
        ;
    }

    //polygon opacity, fill color(random)
  svg.selectAll("polygon")
  //.style("fill-opacity", .000001)
  //.style("stroke-width", 5)
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
        //if(mode === "label" && d.parts.hasparts !== null){
        //    mode = "parts";
        //    draw_parts(d.parts.hasparts);
        //}
          if(mode === "m"){
                mode = "p";
                draw_polygon(mode);
            }
            else {
              mode = "m";
              draw_polygon(mode);
          }
    })
    .on("click", function(d){
        responsiveVoice.cancel();
        setTimeout(function(){responsiveVoice.speak(d.attributes, language);}, 2000);
    })
    .append("svg:title")
    .text(function(d) {
        d.name = d.name.replace('.', '');
        if(mode === "p"){ //part mode
            return d.name + ".." + d.attributes;
        }
        else if(mode === "m"){ //mturk mode(object mode)
            var cat = d.name + "..";
            if(d.remains !== "" && typeof d.remains !== "undefined" && attr_exp === "1"){
                cat = cat + d.remains;
            }
            if(d.color !== "" && typeof d.color !== "undefined" && attr_color === "1"){
                if(lan === "e"){
                    cat = cat + ", the color is "+d.color;
                }
                else if(lan === "k"){
                     cat = cat + ", 색깔은 "+d.color;
                }

            }
            if(d.location !=="" && typeof d.location !== "undefined" && attr_loc === "1"){
                if(lan === "e"){
                    cat = cat + ", the location is " + d.location;
                }
                else if(lan === "k"){
                    cat = cat + ", 위치는 " + d.location;
                }
            }
            if(d.size !=="" && typeof d.size !== "undefined" && attr_size === "1"){
                if(lan === "e"){
                    cat = cat + ", the size is " + d.size;
                }
                else if(lan === "k"){
                    cat = cat + ", 크기는 " + d.size;
                }
            }
            return cat;
        }
        else if(mode === "label"){ //only label of the polygon
            return d.name;
        }
        else if(mode === "attr"){ //only attributes of the polygon
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

    d3.selectAll("polygon").remove();
    svg.selectAll("polygon")
    .data(img_file.annotation.object)
    .enter().append("polygon")
    .attr("id", function(d){
        return d['id'];
    })
    .attr("points", function(d) {
        if(d['deleted'] === "0" && list_contains(parts_list.split(','), d['id'])){

            return d.polygon.pt.map(function(d) {
                    //console.log(d);
                    return [x(String(parseInt(d['x'])*opt)),y(String(parseInt(d['y'])*opt))].join(","); }).join(" "); }})
    ;

    //polygon opacity, fill color(random)
  svg.selectAll("polygon")
  //.style("fill-opacity", .000001)
  //.style("stroke-width", 5)
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
        if(mode === "p"){
            return d.name + ".." + d.attributes;
        }
        else if(mode === "m"){
            var cat = d.name + "..";
            if(d.remains !== "" && typeof d.remains !== "undefined" && attr_exp === "1"){
                cat = cat + d.remains;
            }
            if(d.color !== "" && typeof d.color !== "undefined" && attr_color === "1"){
                if(lan === "e"){
                    cat = cat + ", the color is "+d.color;
                }
                else if(lan === "k"){
                     cat = cat + ", 색깔은 "+d.color;
                }

            }
            if(d.location !=="" && typeof d.location !== "undefined" && attr_loc === "1"){
                if(lan === "e"){
                    cat = cat + ", the location is " + d.location;
                }
                else if(lan === "k"){
                    cat = cat + ", 위치는 " + d.location;
                }
            }
            if(d.size !=="" && typeof d.size !== "undefined" && attr_size === "1"){
                if(lan === "e"){
                    cat = cat + ", the size is " + d.size;
                }
                else if(lan === "k"){
                    cat = cat + ", 크기는 " + d.size;
                }
            }
            return cat;
        }
        else if(mode === "m" && lan === "k" && typeof attr_sound === "undefined"){
        /*
            var cat = d.name + "..";
            if(d.remains !== ""){
                cat = cat + d.remains;
            }
            if(d.color !== ""){
                cat = cat + ", 색깔은 "+d.color;
            }
            if(d.location !==""){
                cat = cat + ", 위치는 " + d.location;
            }
            return cat;
            */
            return d.name + ".." + d.attributes;
        }
        else if(mode === "m" && lan === "k" && attr_sound === "po"){
        /*
            var cat = d.name + "..";
            if(d.remains !== ""){
                cat = cat + d.remains;
            }
            if(d.color !== ""){
                cat = cat + ", 색깔은 "+d.color;
            }
            if(d.location !==""){
                cat = cat + ", 위치는 " + d.location;
            }
            return cat;
            */
            return d.name;
        }
        else if(mode === "label" || mode === "parts"){
            return d.name;
        }
        else if(mode === "attr"){
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
  if(mode === "parts"){
            mode = "label";
            draw_polygon(mode);
        }
    });

 function change_mode(){
    if(mode === "m"){
            mode = "p";
            draw_polygon(mode);
        }
        else{
            mode = "m";
            draw_polygon(mode);
        }
 }


 if(attr_sound === "po"){
    var mode = "p";
 }
 else{
    var mode = "m";
    //var mode = "label";
 }
 var audio_flag = 0;
 var audio = null;

 if(lan === "e")
    var img_file = image_data_m;
 else if(lan === "k")
    var img_file = image_data_k;

  var img_file_name = img_file['annotation']['filename'];

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

 if(img_id === "9"){
    var portion = 1.163;
    var y_start = -100;
  }
  else{
    var portion = 1;
    var y_start = 1;
  }

  var image = svg.append('image')
    .attr('xlink:href', "https://raw.githubusercontent.com/YunjungLeeHappy/hearing-masterpiece-mobile/master/public/sample_image/"+img_file_name)
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

  //svg.call(zoomListener);

/*
var objects =  svg2.append("text")
   .attr("y", 93)//magic number here
   .attr("x", 5)
   .attr("class", "object_list")//easy to style with CSS
   .data([objects_list])
   .text(function(d){
    return(d);
   })
   .on("click", function(d){console.log(d);});
*/
var data = //[{label: "상세설명모드", x: parseInt(img_file.width)+70, y: 30 },
            [{label: "Segmentation Mode", x: 70, y:  parseInt(img_file.height)+70}];
            //{label: "Reset", x: 230, y: 60  }];
/*
var button = d3.button()
    .on('press', function(d, i) {
        if(d.label === "Voice"){
            voice_flag = voice(voice_flag);
        }
        else if(d.label === "Segmentation Mode"){
            seg_mode = change_seg_mode(seg_mode);
            draw_polygon(seg_mode);
        }
        else if(d.label === "Reset"){
            reset();
            this.release();
        }
        else if(d.label === "상세설명모드"){

            svg.selectAll("svg:title").remove();

            desc_mode = change_desc_mode();
            draw_polygon();
        }
    })
    .on('release', function(d, i) {
        if(d.label === "Voice"){
            voice_flag = voice(voice_flag);
        }
        else if(d.label === "Segmentation Mode"){
            seg_mode = change_seg_mode(seg_mode);
            draw_polygon(seg_mode);
        }
        else if(d.label === "상세설명모드"){

            desc_mode = change_desc_mode();
            draw_polygon();

        }
    });

var buttons = svg.selectAll('.button')
    .data(data)
  .enter()
    .append('g')
    .attr('class', 'button')
    .call(button);
    */
/*
function reset() {
    var t = d3.zoomIdentity.translate(0, 0).scale(1)
    svg.call(zoomListener.transform, t)
}

function doc_keyUp(e) {
    if (e.ctrlKey && e.keyCode === 86) { //enable voice (ctrl+v)
        voice_flag = voice(voice_flag);
    }
    else if(e.ctrlKey && e.keyCode === 83){ //change seg mode (ctrl+s)
        seg_mode = change_seg_mode(seg_mode);
        draw_polygon(seg_mode);
    }
    else if(e.ctrlKey && e.keyCode === 68){ //download log file (ctrl+d)
        get_log_file();
    }
    else if(e.keyCode === 39){
        if(sorted_count < sorted_by_point.length-1){
            sorted_count++;
            responsiveVoice.speak(sorted_by_point[sorted_count], language);
        }
        else{
            responsiveVoice.speak(sorted_by_point[sorted_by_point.length-1], language);
        }
    }
    else if(e.keyCode === 37){
        if(sorted_count > 0){
            sorted_count--;
            responsiveVoice.speak(sorted_by_point[sorted_count], language);
        }
        else{
            responsiveVoice.speak(sorted_by_point[0], language);
        }
    }
}
// register the handler
document.addEventListener('keyup', doc_keyUp, false);
*/

function seg_mode_button(seg_mode){
     seg_mode = change_seg_mode(seg_mode);
     draw_polygon(seg_mode);

     return seg_mode;
}


var arrayToModify = [];

var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

function objects_list_to_string(objects_list){
    return String(objects_list);
}