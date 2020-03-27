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
map = L.map("map", {
  zoom: 6,
  center: [39.98, -83],
  layers: [baseLayer],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 18
});

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
var colorRamp = [-Infinity, 0.25 , 0.5, 0.6, 0.7, 0.8, 0.9, Infinity]
var title = 'Accumulative transaction</br>count'

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
        radius: 30000 * value,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value/1, colorRamp, colorCode)
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "<b>Metro Area: " + stop["Metro Area"] + "</b><br><b>Time: " + new Date(stop.actual_stop_time * 1000) + "</b><br><b>Num_wheelchair: " + stop.num_wheelchair + "</b>")
      point.addTo(map)
    }

  });
});

$("#first-btn").click(function () {
  var colName = "system_info";
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
        radius: 60000 * value,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(value/1, colorRamp, colorCode)
      });
      point.bindPopup("<b>Agency Name: " + stop["Agency Name"] + "<b>Metro Area: " + stop["Metro Area"]+ "</b><br><b>Time: " + new Date(stop.actual_stop_time * 1000) + "</b><br><b>Num_wheelchair: " + stop.num_wheelchair + "</b>")
      point.addTo(map)
    }

  });
});

$("#second-btn").click(function () {
  $.get('http://127.0.0.1:21212/'+ "stop_aggregate_count", function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    
    var colorRamp = [0, 0, 0.5, 1, 2, 5, 10, 100]
    var colorRamp = [0, 10, 20, 50, 100, 200, 500, 1000]
    var colorCode = ['#4575b4','#91bfdb','#e0f3f8','#ffffbf','#fee090','#fc8d59','#d73027']

    for (var i = 0; i < stops.length; i++) {
      stop = stops[i]
      ratio = stop.para_passenger_count / (stop.all_passenger_on_count + stop.all_passenger_off_count +stop.rear_door_on_count) * 100;
      ratio = stop.para_passenger_count
      var cir = L.circle([parseFloat(stops[i].latitude), parseFloat(stops[i].longitude)], {
        radius: 100,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(ratio, colorRamp, colorCode)
      });
      cir.bindPopup("<b>ParaCount: " + stop.para_passenger_count + "</b><br><b>AllCount: " + (stop.all_passenger_on_count + stop.all_passenger_off_count +stop.rear_door_on_count) + "</b><br><b>Num_wheelchair: " + stop.num_wheelchair + "</b>")
      cir.addTo(map)
    }

  });
});

$("#third-btn").click(function () {
  $.get('http://127.0.0.1:21212/'+ "stop_aggregate_count", function (rawstops) {
    stops = rawstops._items
    console.log(stops)
    
    var colorRamp = [0, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
    var colorCode = ['#4575b4','#91bfdb','#e0f3f8','#ffffbf','#fee090','#fc8d59','#d73027']

    for (var i = 0; i < stops.length; i++) {
      stop = stops[i]
      ratio = (stop.all_passenger_on_count + stop.all_passenger_off_count +stop.rear_door_on_count) ;
      var cir = L.circle([parseFloat(stops[i].latitude), parseFloat(stops[i].longitude)], {
        radius: 100,
        stroke: true,
        weight: 0.2,
        color: "#000000",
        fillOpacity: 1,
        info: stops[i],
        fillColor: returnColor(ratio, colorRamp, colorCode)
      });
      cir.bindPopup("<b>ParaCount: " + stop.para_passenger_count + "</b><br><b>AllCount: " + (stop.all_passenger_on_count + stop.all_passenger_off_count +stop.rear_door_on_count) + "</b><br><b>Num_wheelchair: " + stop.num_wheelchair + "</b>")
      cir.addTo(map)
    }

  });
});

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

