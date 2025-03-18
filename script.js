document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([51.505, -0.09], 13); // Set initial view (latitude, longitude, zoom level)

    // Add the OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add the Leaflet draw control for drawing on the map
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    // Handle location search input
    document.getElementById("searchBtnMap").addEventListener("click", function() {
        const location = document.getElementById("searchInput").value;
        if (location) {
            searchLocation(location, map);
        }
    });

    // Handle "Find My Location" button
    document.getElementById("findMe").addEventListener("click", function() {
        findCurrentLocation(map);
    });

    // Function to search for a location and zoom to it on the map
    function searchLocation(location, map) {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        
        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    map.setView([lat, lon], 13);

                    // Add a marker to show the searched location
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${location}</b>`)
                        .openPopup();

                } else {
                    alert("Location not found!");
                }
            })
            .catch(error => console.error("Error fetching location:", error));
    }

    // Function to find and zoom to the user's current location
    function findCurrentLocation(map) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                map.setView([lat, lon], 13);

                // Add a marker for the current location
                L.marker([lat, lon]).addTo(map)
                    .bindPopup("You are here!")
                    .openPopup();
            }, function() {
                alert("Unable to retrieve your location.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
});
