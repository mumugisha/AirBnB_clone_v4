// This script handles filtering and displaying places, 
// as well as checking API status, using jQuery and AJAX requests.

$('document').ready(function () {
  const HOST = "http://127.0.0.1:5001";
  const amenities = {};
  const cities = {};
  const states = {};

  $('ul li input[type="checkbox"]').on("change", (e) => {
    const el = e.target;
    const tt = { state_filter: states, city_filter: cities, amenity_filter: amenities }[el.id];
    
    if (el.checked) {
      tt[el.dataset.name] = el.dataset.id;
    } else {
      delete tt[el.dataset.name];
    }
    
    if (el.id === "amenity_filter") {
      $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
    } else {
      $(".locations h4").text(
        Object.keys({ ...states, ...cities }).sort().join(", ")
      );
    }
  });

  // Get status of API
  $.getJSON("http://0.0.0.0:5001/api/v1/status/")
    .done((data) => {
      if (data.status === "OK") {
        $("div#api_status").addClass("available");
      } else {
        $("div#api_status").removeClass("available");
      }
    })
    .fail(() => {
      $("div#api_status").removeClass("available");
    });

  // Fetch data about places
  $.post({
    url: `${HOST}/api/v1/places_search`,
    data: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    success: (data) => {
      let placesHTML = '';
      data.forEach((place) => {
        placesHTML += `<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${
              place.max_guest !== 1 ? "s" : ""
            }</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${
              place.number_rooms !== 1 ? "s" : ""
            }</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
              place.number_bathrooms !== 1 ? "s" : ""
            }</div>
          </div> 
          <div class="description">
            ${place.description}
          </div>
        </article>`;
      });
      $("section.places").append(placesHTML);
    },
    dataType: "json",
  });

  // Search places
  $(".filters button").on("click", places_search);
  places_search();

  // Define the places_search function (assumed from context)
  function places_search() {
    // Your implementation here
  }
});
