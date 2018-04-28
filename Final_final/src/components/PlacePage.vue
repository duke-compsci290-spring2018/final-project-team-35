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
      <div class="col-sm-6 col-md-4">
        <div class="thumbnail">
          <img src="/src/assets/Duke_01.png" alt="chapel">
          <div class="caption">
            <h3>Duke Chapel</h3>
            <p><i class="fa fa-map-marker"></i> 401 Chapel Dr, Durham, NC 27708</p>
            <p><a href="#" class="btn btn-danger" role="button">starred</a></p>
          </div>
        </div>
        
        <div class="thumbnail">
	  <img src="/src/assets/Duke_04.jpg" alt="chapel">
	  <div class="caption">
	    <h3>Duke Chapel</h3>
            <p><i class="fa fa-map-marker"></i> 401 Chapel Dr, Durham, NC 27708</p>
            <p><a href="#" class="btn btn-danger" role="button">starred</a></p>
	  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
