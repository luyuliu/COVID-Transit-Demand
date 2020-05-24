$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  $('.mini-submenu').fadeIn();
  return false;
});


$('.mini-submenu').on('click', function () {
  animateSidebar();
  $('.mini-submenu').hide();
})

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
    map.invalidateSize();
  });
}
var baseLayer = L.esri.basemapLayer('DarkGray')


var labelTextCollision = new L.LabelTextCollision({
  collisionFlg : true
});

map = L.map("map", {
  zoom: 5.3,
  center: [39.707186656826565, -100],
  layers: [baseLayer],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 18,
  renderer : labelTextCollision
});

map.on("click", function(e){
  console.log(e)
})

function getColorBlockString(color) {
  var div = '<div class="legendbox" style="padding:0px;background:' + color + '"></div>'
  return div;
}

L.control.scale({ position: "bottomleft" }).addTo(map);
var north = L.control({ position: "topright" });
north.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info");
  div.id = 'north_arrow'
  div.innerHTML = '<img style="height:120px;width:auto;" src="img/north_arrow.png">';
  return div;
}
north.addTo(map);


var colorCode = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594']
// var colorRamp = [0, 7, 14, 28, 70, 140, 280, 600]
// var colorRamp = [0, 7, 14, 28, 70, 140, 280, Infinity]


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {
    xhr = null;

  }
  return xhr;
}

var scooterIcon = L.icon({
  iconUrl: './img/s.svg',
  iconSize: [20, 20], // size of the icon
});

var electronicIcon = L.icon({
  iconUrl: './img/e.png',
  iconSize: [20, 20], // size of the icon
});

$("#add-btn").click(function () {
  $("#time-input").val(parseInt($("#time-input").val()) + 120)
});

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

$("#zero-btn").click(function () {
  var colName = "system_info";
  var colorRamp = [-1.01, -0.84, -0.78, -0.74, -0.71, -0.68, -0.61, -0.37]
  var colorCode = ['#084594','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#eff3ff']
  var title = 'Floor value<br> distribution';    
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);

  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = stop.B;
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat)){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000 ,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value/1, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["name"] + "</b><br><b>Metro Area: " + stop["metro_area"]+ "</b><br><b>B: " + stop["B"] + "</b><br><b>k: " + stop.k + "</b>")
      point.addTo(map)
    }

  });
});

$("#first-btn").click(function () {
  var colName = "system_info";
  var colorRamp = [-Infinity, 0.25 , 0.3, 0.4, 0.5, 0.6, 0.75, Infinity]
  var title = 'Decay rate<br> distribution';    
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = stop.k;
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat)){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value/1, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>L: " + stop["L"] + "</b><br><b>k: " + stop.k + "</b>")
      point.addTo(map)
    }

  });
});

$("#second-btn").click(function () {
  var colName = "system_info";
  var colorRamp = [5.76,   15.9, 17.5, 19.1, 21.0, 23.6, 29.9, 60.7]
  var title = 'Decay duration  <br> (hours) distribution';    
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = 7.327/stop.k;
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat)){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value/1, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>L: " + stop["L"] + "</b><br><b>k: " + stop.k + "</b>")
      point.addTo(map)
    }

  });
});

$("#third-btn").click(function () {
  var colName = "system_info";
  var colorRamp = [-43.8,  -38.2, -4.5, 0.6, 2.8, 5.9, 8.9, 28.3];
  var colorCode = ['#084594','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#eff3ff']
  var l = $("#lag-input").val();
  var title = 'Response interval <br> from cliff point<br> (lag = ' + l +')';    
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = stop.divergent_point;
      var value2 = stop.t0_corona;
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat) || isNaN(value) || isNaN(value2)){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(-value+value2 - l - 24, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["name"] + "</b><br><b>Metro Area: " + stop["metro_area"]+ "</b><br><b>x005: " + value + "</b><br><b>x0_case: " + value2 + "</b>")
      point.addTo(map)
    }

  });
});


$("#fourth-btn").click(function () {
  var colName = "system_info";
  // var colorCode = ['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4']
  var colorRamp = [-Infinity, 10 , 14, 18, 22, 26, 30, Infinity]
  // var title = '95 percentile date<br> distribution';  
  var title = 'Decay duration<br> distribution';  

  // var fieldName = 
  
  // visualization(colName, fieldName, colorRamp, title);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = stop.k;
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat) || isNaN(value)){
        console.log((lat), lon, value)
        continue
      }
      value = 7.33/value;
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>x005: " + value + "</b><br><b>x0_case: " + value + "</b>")
      point.addTo(map)
    }

  });
});


$("#fifth-btn").click(function () {
  var colName = "system_info";
  var field_name = $("#field-input").val()
  var colorCode = ['#084594','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#eff3ff']
  // var colorRamp = [0, 0.4 , 0.5, 0.6, 0.7, 0.8, 1, Infinity] // Procrustes distance
  var colorRamp = [-Infinity, -1 , -0.5, -0.1, 0.1, 0.5, 1, Infinity] // peak shift
  // var colorRamp = [-Infinity, -1.5, -1, -0.75 -0.5, -0.25, 0, 0.25, 0.5] // second peak shift
  // var colorRamp = [0, 10, 13, 16, 19, 22, 25, Infinity] // second
  // var colorRamp = [-Infinity, -3 , -2, -1, -0.5, 0, 0.5, 1] // Working hour

  var title =  $("#title-input").val();    
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      // var value = 3.66 / stop[field_name] * 2 
      // var value = stop[field_name] - stop["first_peak_diff"]
      var value = stop[field_name]
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat) || isNaN(value) ){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["name"] + "</b><br><b>Metro Area: " + stop["metro_area"]+ "</b><br><b>x005: " + value + "</b><br><b>x0_case: "  + "</b>")
      point.addTo(map)
    }

  });
});

// $("#sixth-btn").click(function(){
//   var colName = "system_info";
//   var fieldName = ""
//   var colorRamp = [-Infinity, -1 , -0.5, -0.1, 0.1, 0.5, 1, Infinity]
//   var title =  $("#title-input").val();
//   visualization(colName, fieldName, colorRamp, title);

// })

function returnColor(value, colorRamp, colorCode) {
  for (var i = 1; i < colorRamp.length; i++) {
    if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
      return colorCode[i - 1]
    }
    else {
      continue;
    }
  }
  return
}

function visualization(colName, fieldName, colorRamp, title) {
  var colName = "system_info";
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);
  $.get('http://127.0.0.1:21232/'+ colName, function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    function returnColor(value, colorRamp, colorCode) {
      for (var i = 1; i < colorRamp.length; i++) {
        if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
          return colorCode[i - 1]
        }
        else {
          continue;
        }
      }
      return
    }

    for (var i = 0; i < stops.length; i++) {
      var stop = stops[i];
      var value = stop[field_name]
      var lat = parseFloat(stops[i].lat);
      var lon = parseFloat(stops[i].lon);
      if (isNaN(lat) || isNaN(value) ){
        console.log((lat), lon, value)
        continue
      }
      var point = L.circle([lat, lon], {
        radius: 30000,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>x005: " + value + "</b><br><b>x0_case: "  + "</b>")
      point.addTo(map)
    }

  });
}