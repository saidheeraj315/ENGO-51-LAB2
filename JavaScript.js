          var b_p;
          var markers = L.markerClusterGroup();

          $(function() {
            var start = moment().subtract(29, 'days');
            var end = moment();
            function cb(start, end) {
              $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

              var str = "issueddate > '" + start.format('YYYY-MM-DD') + "' and issueddate < '" + end.format('YYYY-MM-DD')+"'";

              axios.get("https://data.calgary.ca/resource/c2es-76ed.geojson", {
              params: {
                $where: str
                    }
                  })

              .then(function(b_p) {
                markers.clearLayers();
                  for (var i = 0; i < b_p.data.features.length; i++) {
                  var calgary = b_p.data.features[i];
                  var issue= calgary.properties.issueddate;
                  var work = calgary.properties.workclassgroup;
                  var contract = calgary.properties.contractorname;
                  var community = calgary.properties.communityname;
                  var address = calgary.properties.originaladdress;
                  var geo = calgary.geometry;
                  // If the coordinates don't exist, skip them
                  if (geo == null){
                    continue;
                  }
                  var a = calgary.geometry.coordinates[1];
                  var b = calgary.geometry.coordinates[0];
                  var marker = L.marker(new L.LatLng(a, b));
                  marker.bindPopup("Issued Date: " + issue + "<br>" + "Work Class Group: " + work + "<br>" + "Contractor Name: " + contract + "<br>" + "Community Name: " + community + "<br>" + "Original Address: " + address)
                  markers.addLayer(marker);
                }
                cmap.addLayer(markers);
              })

            }
            $('#reportrange').daterangepicker({
              startDate: start,
              endDate: end,
              ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
              }
            }, cb);

          });
            var cmap = L.map('map').setView([51.0447, -114.0719], 13);
           L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            maxZoom: 20,
             id: 'mapbox/streets-v11',
             tileSize: 512,
             zoomOffset: -1,
             accessToken: 'pk.eyJ1IjoiZXJpY2hvMTk5OCIsImEiOiJjazdhdDRlMm4wNHF1M2VwcHNudXUxd3czIn0.Z8rFAU1xQUax9N5qrnfoFg'
              }).addTo(cmap);
