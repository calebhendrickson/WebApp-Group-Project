<template>
  <md-card class="post">
    <md-card-header>
      <div class="md-title">
        {{ title }} <small>{{ when }}</small>
      </div>
      <div class="md-subhead">{{ author }}</div>
    </md-card-header>

    <md-card-content v-if="description">
      {{ description }}
    </md-card-content>

    <md-card-expand>
      <md-card-actions>
        <md-button class="md-raised md-primary">
          <md-icon>check</md-icon> Attend
        </md-button>
        <md-button class="md-raised">
          <md-icon>clear</md-icon> No Thanks
        </md-button>
        <span style="flex: 1"></span>
        <md-icon v-if="location">pin_drop</md-icon>
        <md-button v-if="location" id="dropdownbutton" class="md-icon-button" md-expand-trigger>
          <md-icon>keyboard_arrow_down</md-icon>
        </md-button>
      </md-card-actions>

      <md-card-content v-if="location">
        This will be a map
        <gmap-map
          id="geomap"
          :center="center"
          :zoom="7"
          style="width: 500px; height: 300px"
          >
          <gmap-marker
          :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
    ></gmap-marker>
  </gmap-map>
      </md-card-content>
    </md-card-expand>
  </md-card>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'
  import Vue from 'vue'
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBrfHRJpNBDGHOyy1ra0_91wcBh6vpXjDU',
      v: '3.26'
    }
  })

export default {
  name: 'post',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    datetime: {
      type: Number,
      required: true
    },
    location: {
      type: String
    },
    author: {
      type: String,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      center: {lat: 10.0, lng: 10.0},
      markers: [{
      position: {lat: 10.0, lng: 10.0}
      }, {
      position: {lat: 11.0, lng: 11.0}
      }]
    }
  },
  computed: {
    when () {
      let currentDate = new Date()
      let eventDate = new Date(this.datetime)
      return (
        (eventDate.getDate() === currentDate.getDate() ? 'Today' : 'Tomorrow') +
        ' at ' +
        (eventDate.getHours() % 12 || 12) +
        ':' +
        eventDate.getMinutes() +
        ' ' +
        (eventDate.getHours() < 12 ? 'AM' : 'PM')
      )
    }
  },
  methods: {
  geocodeAddress (geocoder, resultsMap) {
    var address = document.getElementById('location').value
    geocoder.geocode({'location': address}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location)
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        })
      } else {
        alert('Geocode was not successful for the following reason: ' + status)
      }
    })
  },
  initMap () {
  var geocoder = new google.maps.Geocoder()
  document.getElementById('dropdownbutton').addEventListener('click', function() {
    geocodeAddress(geocoder, map)
  })
}
  }
}
</script>

<style>
.post {
  flex: 1 100%;
  margin: 1em;
}
</style>
