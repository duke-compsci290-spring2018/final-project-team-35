<template>
  <div id = 'places'> 
    <div id='category-selector'>
      <div class='checkbox-header'>
        <p id = 'filter'><span class="glyphicon glyphicon-filter"></span> Categories:</p>
      </div>
      <div class='checkbox'>
        <label class="checkbox-inline"><input type="checkbox" value="">Indoor</label>
        <label class="checkbox-inline"><input type="checkbox" value="">Outdoor</label>
        <label class="checkbox-inline"><input type="checkbox" value="">West Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="">East Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="">Central Campus</label>
        <label class="checkbox-inline"><input type="checkbox" value="">Food</label>
        <label class="checkbox-inline"><input type="checkbox" value="">Education</label>
        <label class="checkbox-inline"><input type="checkbox" value="">Entertainment</label>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-md-4" v-for="place in places">
        <div class="thumbnail">
          <img v-bind:src="place.imgUrl" v-bind:alt="place.name">
          <div class="caption">
            <h3>{{place.name}}</h3>
            <p><i class="fa fa-map-marker"></i> {{place.address}}</p>
            <p><a href="#" class="btn btn-danger" role="button">starred</a></p>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var placesJSON = require('../assets/places.json');
export default {
    name: 'final-forum',
  data() {
    return {
      places: placesJSON.places
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

.checkbox {
    margin: 3%;
}
</style>
