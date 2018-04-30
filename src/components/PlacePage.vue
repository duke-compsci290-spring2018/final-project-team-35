<template>
  <div id = 'places'> 
    <div id='category-selector'>
      <div class='checkbox-header'>
        <div class="choiceCart"><h3>Your Choices</h3>
            <div class="shoppingCart" v-for="list in cart">
                <li class="list">{{list.name}} <button type="button" class="btn btn-danger" v-on:click="remove_cart(list), makeLocation()" v-show="yes">Remove</button></li>
            </div>
              <button v-on:click="yes=false, makeLocation()" class="generateBtn" v-if="yes">Generate Map</button>
              <button v-on:click="savePlaces()" class="generateBtn">Save Trip</button>
          </div>
      </div>
      <div id='myTrips'> 
	<div class='shoppingCart' v-for='(trip, idx) in myTrips' v-on:click='dumpTrip(trip); makeLocation();'>
	  <p> {{ trip[0].name }} .. {{trip[1] ? (trip[1].name + '..'): ''}} {{trip[2] ? (trip[2].name + '..'): ''}} </p>
	  <span v-on:click='deleteTrip(idx)'> <i class='fa fa-ban'></i> </span>
	</div>
      </div>
      <p id = 'filter' v-if="yes"><span class="glyphicon glyphicon-filter"></span> Categories:</p>
      <div class='checkbox' v-if="yes">
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
	    <button type='button' class='btn btn-primary btn-sm' v-for='cat in place.categories'> {{cat}}</button>
            <h5>{{place.description}}</h5>
            <p><i class="fa fa-map-marker"></i> {{place.address}}</p>
            <p><button type="button" class="btn btn-danger" v-on:click="add_cart(place)">Add to cart</button></p>
          </div>
        </div>
      </div>
    </div>
    <div id="work"></div>
      <div id="title" v-if="!yes">Your Visit at Duke</div>
      <div id="map" v-show="!yes">
          <gmap-map
          :center="center"
          :zoom="zoom"
          style="width:100%;  height: 500px; margin-bottom: 3%;"
        >
            <gmap-marker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                @click="center=m.position; showInfo(m)"
              ></gmap-marker>
            <gmap-info-window
                v-for="(m, index) in markers"
		v-if="m.markerOn"
		:position="m.position">
		{{m.name}}
            </gmap-info-window>
        </gmap-map>
          
    </div>
      <footer><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.</footer>
  </div>

</template>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFZB_0uAerF2GJSXCxssPRPgNNDzSH4ow&callback=initMap">
</script>
<script>
import Vue from 'vue'
import {firebase, db} from '../firebase.js'

var placesJSON = require('../assets/places.json');
export default {
  name: 'place-page',
  beforeMount() {
    firebase.auth().onAuthStateChanged( this.userChangeHandler )
  },
  data() {
    return {
      data: placesJSON.places,
      cart: [],
      yes: true,
      center: { lat: 36.000666664, lng: -78.93666292 },
      zoom: 14,
      markers: [],
      show: true,
      selected: ["Indoor", "Outdoor", "West", "East", "Central", "Dining", "Education", "Entertainment"],
      currentUserUUID: '',
      myTrips: []
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
      Vue.set(this, 'markers', []);
      for(var i = 0; i < this.cart.length; i++){
        var location = new google.maps.LatLng(this.cart[i].coordinates[0], this.cart[i].coordinates[1]);
        this.markers.push({"position": location, "name": this.cart[i].name, "markerOn": true});
      }
    },
    deleteTrip(idx) {
      this.myTrips.splice(idx, 1);
      db.ref('/users/'+this.currentUserUUID+'/myTrips').set(this.myTrips);
    },
    savePlaces() {
      var dcCart = []
      for(var i = 0 ; i < this.cart.length ; i ++)
	dcCart.push(JSON.parse(JSON.stringify(this.cart[i])));
      this.myTrips.push(dcCart);
      db.ref('/users/'+this.currentUserUUID+'/myTrips').set(this.myTrips);
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
    },
    dumpTrip(trip) {
      var dcCart = []
      for(var i = 0 ; i < trip.length ; i ++)
	dcCart.push(JSON.parse(JSON.stringify(trip[i])));
      Vue.set(this, 'cart', dcCart)
    },
    checkCategory(a, b){
      for (var i = 0; i < a.length; i++){
        for (var j = 0; j<b.categories.length; j++){
          if(a[i] === b.categories[j]){
            return true;
          }
        }
      } return false;
    },
    showInfo(m) { 
      m.markerOn = !m.markerOn 
    }, 
    userChangeHandler: function(user) {
      Vue.set(this, 'currentUserUUID', user ? user.uid : '');
      if(user) {
        db.ref('/users/'+this.currentUserUUID+'/myTrips').once('value').then(data => {
	  Vue.set(this, 'myTrips', data.val() ? data.val() : []);
        })
      }
    }
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Slabo+30px');
  
  .btn-sm {
    margin-left: 0;
  }

  #places{
    margin: 2%;
    font-family: 'Slabo 30px', serif;
  }
  .thumbnail{        
    width : 100%;
    height: 400px;
    overflow: auto;
}
  
  .thumbnail img {
    height: auto;
    width: 100%;
    display: block;
  }
  
  .places {
      margin: 3%;
  }

  .choiceCart h3{
    margin: 2%;
  
  }

  .shoppingCart{
      background-color:antiquewhite;
      width: 70%;
      color: black;
      font-weight: normal;
      padding: 0.008%;
      margin-left: 3%;
      margin-bottom: 2%;
  }
  
  .list{
      margin: 2%;
      margin-left: 5%;
      font-size: 100%;
      font-weight: bolder;
      list-style: none;
  }    

  .generateBtn{
      background-color: salmon;
      margin-left: 50%;
      margin-bottom: 3%;
      margin-top: 4%;
  }

  #filter {
      color: darkblue;
      border-bottom: solid;
      margin-top: 2%;
  }

  #title{
      font-size: 300%;
      font-weight: bolder;
      text-align: center;
  }    

  .checkbox-header {
    border: inset;
    width: 70%;
  }
  
  footer {
    text-align: center;
    padding: 2%;
  }
  
  footer img {
    border-width: 0;
  }
  
</style>
