<template>
  <div id = 'places'> 
    <div id='category-selector'>
      <div class='checkbox-header'>
        <p id = 'filter'><span class="glyphicon glyphicon-filter"></span> Categories:</p>
      </div>
      <div class='checkbox'>
        <label class="checkbox-inline" >
        <input type="checkbox" value="" v-on:click.stop="addSelected('Indoor')" checked>Indoor
        </label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click.stop="addSelected('Outdoor')" checked>Outdoor</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('West')" checked>West Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('East')" checked>East Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('Central')" checked>Central Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('Dining')" checked>Dining</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('Education')" checked>Education</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('Entertainment')" checked>Entertainment</label>
      </div>
    </div>
    <div class="row" v-show="yes">
      <div class="col-sm-6 col-md-4" v-for="place in data">
        <div class="thumbnail" v-if="checkCategory(selected, place)">
          <img v-bind:src="place.imgUrl" v-bind:alt="place.name">
          <div class="caption">
            <h3>{{place.name}}</h3>
            <p><i class="fa fa-map-marker"></i> {{place.address}}</p>
            <p><button type="button" class="btn btn-danger" v-on:click="add_cart(place)">Add to cart</button></p>
          </div>
        </div>
      </div>
    </div>
    <div id="work"></div>
        <div id="shoppingCart" v-for="list in cart">
            {{list.name}}
            <button type="button" class="btn btn-danger" v-on:click="remove_cart(list), makeLocation()">Remove</button>
        </div>
        <button v-on:click="yes=false, makeLocation()">Generate Map</button>
      <div id="map" v-show="!yes">
          <gmap-map
          :center="center"
          :zoom="zoom"
          style="width:100%;  height: 500px;"
        >
            <gmap-marker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                @click="center=m.position"
              ></gmap-marker>
        </gmap-map>
          
        </div>
  </div>

</template>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFZB_0uAerF2GJSXCxssPRPgNNDzSH4ow&callback=initMap">
</script>
<script>
import Vue from 'vue'
var placesJSON = require('../assets/places.json');
export default {
    name: 'final-forum',
  data() {
    return {
        data: placesJSON.places,
        cart: [],
        yes: true,
        center: { lat: 36.000666664, lng: -78.93666292 },
        zoom: 14,
        markers: [],
        show: true,
        selected: ["Indoor", "Outdoor", "West", "East", "Central", "Dining", "Education", "Entertainment"]
    }
  },
    methods: {
        add_cart(place){
            var count = 0;
            for(var i = 0; i<this.cart.length; i++){
                if(this.cart[i].name === place.name){
                    count ++;
                }
            }
            if (count == 0){
                this.cart.push(place);
            }
        },
        remove_cart(place){
            this.cart.splice(this.cart.indexOf(place), 1);
        },
        makeLocation(){
            for(var i = 0; i < this.cart.length; i++){
                var location = new google.maps.LatLng(this.cart[i].coordinates[0], this.cart[i].coordinates[1]);
                this.markers.push({"position": location});
            }
        },
        addSelected(category){
            var idx = -1;
            for(var i=0; i<this.selected.length; i++){
                if(this.selected[i] === category){
                    idx = i;
                }
            }
            if(idx == -1) {
                this.selected.push(category);
            } else {
                this.selected.splice(idx,1);
                
            }
            console.log(this.selected)
        },
        checkCategory(a, b){
            for (var i = 0; i < a.length; i++){
                for (var j = 0; j<b.categories.length; j++){
                    if(a[i] === b.categories[j]){
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
</script>

<style>
.places {
    margin: 3%;
}
    
.places p {
    color: darkblue;
    border-bottom: solid;
    margin: 2%;
}

#shoppingCart{
    background-color: black;
    width: 30%;
}
    
.checkbox {
    margin: 3%;
}
</style>
