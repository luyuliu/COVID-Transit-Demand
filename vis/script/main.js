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


var colorCode = ['#4575b4','#91bfdb','#e0f3f8','#ffffbf','#fee090','#fc8d59','#d73027']
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
  var colorRamp = [-Infinity, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, Infinity]
  var title = 'Background value<br> distribution';    
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
      var value = stop.L;
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
        text: stop["Metro Area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>L: " + stop["L"] + "</b><br><b>k: " + stop.k + "</b>")
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
        text: stop["Metro Area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>L: " + stop["L"] + "</b><br><b>k: " + stop.k + "</b>")
      point.addTo(map)
    }

  });
});

$("#second-btn").click(function () {
  var colName = "system_info";
  var colorRamp = [10,   12.5, 15, 17.5, 20, 22.5, 25, Infinity]
  var title = ' distribution';    
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
      var value = stop.x005;
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
        text: stop["Metro Area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>L: " + stop["L"] + "</b><br><b>k: " + stop.k + "</b>")
      point.addTo(map)
    }

  });
});

$("#third-btn").click(function () {
  var colName = "system_info";
  var colorCode = ['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4'];
  var colorRamp = [-Infinity,  -10, -5, -2, 0, 5, 10, Infinity];
  var l = $("#lag-input").val();
  var title = 'Response interval <br> from convergent point<br> (lag = ' + l +')';    
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
        radius: 40000,
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
  var colorRamp = [0, 15 , 17, 19, 21, 23, 25, Infinity]
  var title = '95 percentile date<br> distribution';  
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
      var value = stop.x005;
      var value2 = stop.x0;
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
        fillColor: returnColor(value, colorRamp, colorCode),
        text: stop["metro_area"]
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "</b><br><b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>x005: " + value + "</b><br><b>x0_case: " + value2 + "</b>")
      point.addTo(map)
    }

  });
});


$("#fifth-btn").click(function () {
  var colName = "system_info";
  var field_name = $("#field-input").val()
  // var colorCode = ['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4']
  var colorRamp = [0, 0.4 , 0.5, 0.6, 0.7, 0.8, 1, Infinity]
  var colorRamp = [-Infinity, -1 , -0.5, -0.1, 0.1, 0.5, 1, Infinity] // first
  var colorRamp = [-Infinity, -1.5, -1, -0.75 -0.5, -0.25, 0, 0.25, 0.5] // second

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