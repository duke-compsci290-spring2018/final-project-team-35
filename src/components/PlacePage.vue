<template>
  <div id = 'places'> 
    <div id='category-selector'>
      <ul class='list-group big-items'>
        <li class='list-inline-item list-group-item big-item'>
          <div class='checkbox-header'>
            <div class="choiceCart">
              <h3>Your Choices</h3>
              <ul class="list-group shoppingCart" >
                  <li class="list list-group-item" v-for="list in cart">
                    <span> {{list.name}}</span>
                    <button type="button" class="btn btn-danger btn-sm removeButton" v-on:click="remove_cart(list), makeLocation()" v-show="yes">Remove</button></li>
              </ul>
              <div id='control'>
                <button v-on:click="yes=false, makeLocation()" class="generateBtn" v-if="yes">Generate Map</button>
                <button v-on:click="savePlaces()" class="generateBtn" v-bind:disabled='cart.length === 0'>Save Trip</button>
              </div>  
            </div>
          </div>
        </li>
        <li class='list-inline-item list-group-item big-item'>
          <h3>Saved Trips</h3>
          <ul id='myTrips' class="list-group"> 
            <li class="list-group-item" v-for='(trip, idx) in myTrips'>
              <div class='shoppingCartt' v-on:click='dumpTrip(trip); makeLocation();'>
                <span class="mini"> {{trip[0] ? (trip[0].name + ' '): ''}} {{trip[1] ? (' & ' + trip[1].name): ''}} 
                  {{trip[2] ? (' & ' + trip[2].name + ' & ..'): ''}} </span>
                <span v-on:click='deleteTrip(idx)'> <i class='fa fa-times'></i> </span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      
      
      <p id = 'filter' v-if="yes"><span class="glyphicon glyphicon-filter"></span> Location:</p>
      <div class='checkbox' v-if="yes">
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('West')" checked>West Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('East')" checked>East Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="" v-on:click="addSelected('Central')" checked>Central Campus</label>
      </div>
    </div>

    <div class="row" v-show="yes">
      <div class="col-sm-6 col-md-4" v-for="place in data">
        <div class="thumbnail" v-if="checkCategory(selected, place)">
          <img v-bind:src="place.imgUrl" v-bind:alt="place.name">
          <div class="caption">
            <h3>{{place.name}}</h3>
	            <button type='button' class='btn btn-primary btn-sm'> {{place.categories1}}</button>
                <button type='button' class='btn btn-primary btn-sm'> {{place.categories2}}</button>
            <h5>{{place.description}}</h5>
            <p><i class="fa fa-map-marker"></i> {{place.address}}</p>
            <button type="button" class="btn btn-danger addcartBtn" v-on:click="add_cart(place)">Add to cart</button>
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
      center: { lat: 36.00133 , lng: -78.939209 },
      zoom: 16,
      markers: [],
      show: true,
      selected: ["West", "East", "Central"],
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
          if(a[i] === b.categories1){
            return true;
          }
        }
      return false;
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
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');

  .btn-sm {
    margin-left: 0;
  }

  #places{
    margin: 2%;
    font-family: 'Roboto Slab', serif;

  }
  .thumbnail{        
    width : 100%;
    height: 500px;
    overflow: auto;
}
  
  .thumbnail img {
    width: 100%;
    height: 250px;
    display: block;
  }
  
  .places {
      margin: 3%;
  }

  .choiceCart h3{
    text-align: center;
  }

  .shoppingCart{
      width: 100%;
      color: black;
      font-weight: normal;
  }
  
  .shoppingCartt{
      width: 100%;
      color: black;
      font-weight: normal;
      display: flex;
      justify-content: space-between;
  }
  
  .fa-times {
    cursor: pointer;
    color: red;
  }
  
  .fa-times:hover {
    color: grey;
  }
  
  
  .addcartBtn {
    margin-left:0;
  }
  
  .list{
      width: 94%;
      margin-left: 3%;
      margin-right: 3%;
      margin-top: 1%;
      font-size: 100%;
      font-weight: bolder;
      list-style: none;
      display: flex;
      flex-flow: row, wrap;
      justify-content: space-between;
  }    

  .generateBtn{
    background-color: salmon;
    float: center;
  }
  
  .list-inline {
    height: 100%;
  }
  
  .big-item {
    height: 100%;
    width: 48%;
  }
  
  #filter {
      color: darkblue;
      border-bottom: solid;
      margin-top: 2%;
  }

  .removeButton {
    margin-left: 40%;
  }
  
  #control {
    display: flex;
    justify-content: center;
  }
  
  #control button {
    width: 100px;
  }
  
  .big-items {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    justify-content: space-between;
  }
  
  .big-items h3{
    text-align: center;
  }
  
  button:disabled {
    background: grey;
    color: white;
  }
  
  #title{
      font-size: 300%;
      font-weight: bolder;
      text-align: center;
  }  
  
  footer {
    text-align: center;
    padding: 2%;
  }
  
  footer img {
    border-width: 0;
  }
  
</style>
