import API_KEYS from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const addressInfo = document.getElementById('address-info');
    const coordinates = document.getElementById('coordinates');

    // Comprehensive error handling
    function handleGeolocationError(error) {
        console.error('Geolocation Error:', error);
        coordinates.textContent = 'Error retrieving location';
        addressInfo.textContent = error.message || 'Unknown geolocation error';
        localStorage.setItem('geolocationApproved', 'false');
    }

    // Simplified geolocation request
    function requestGeolocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Update UI
                    coordinates.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
                    
                    // Fetch address
                    fetchAddress(latitude, longitude);
                    
                    // Remember approval
                    localStorage.setItem('geolocationApproved', 'true');
                },
                handleGeolocationError,
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            coordinates.textContent = 'Geolocation not supported';
            addressInfo.textContent = 'Your browser does not support geolocation';
        }
    }

    // Fetch address using reverse geocoding
    function fetchAddress(latitude, longitude) {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEYS.GOOGLE_MAPS}`;
        
        fetch(geocodeUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'OK' && data.results.length > 0) {
                    const address = data.results[0].formatted_address;
                    addressInfo.textContent = address;
                } else {
                    addressInfo.textContent = `Unable to retrieve address: ${data.status}`;
                }
            })
            .catch(error => {
                console.error('Geocoding Error:', error);
                addressInfo.textContent = `Error retrieving address: ${error.message}`;
            });
    }

    // Trigger geolocation on page load
    requestGeolocation();
});
