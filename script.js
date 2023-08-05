const geoBtn = document.getElementById("btn");
const home = document.getElementById("home-container");
const addressContainer = document.getElementById("address-details-container");
const officeContainer = document.getElementById("Post-office-container");
const searchInput = document.getElementById("search-input");
window.onload = function () {

    const userIP = fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            // set ip address to our page   
            document.getElementsByClassName('ip_addr')[0].innerText = data.ip;
            return data.ip;
        })
        .catch((error) => {
            document.getElementsByClassName('ip_addr')[0].innerText = "0.0.0.0";
            console.error('Error fetching data:', error);
            throw error;
        });

    function createPostalCard(postOfficeBranches) {
        officeContainer.innerHTML = '';
        postOfficeBranches.forEach(branch => {

            const card = document.createElement('div');
            card.setAttribute('class', 'post-card');
            card.innerHTML = `
            <p>Name: <span>${branch.Name}</span></p>
            <p>Branch Type: <span>${branch.BranchType}</span></p>
            <p>Delivery Status: <span>${branch.DeliveryStatus}</span></p>
            <p>District: <span>${branch.District}</span></p>
            <p>Division: <span>${branch.Division}</span></p>
            `
            officeContainer.append(card);
        })
    }
    function searchPostOffice(data) {
        let searchText = searchInput.value.trim().toLowerCase();
        // m e n s
        // Mens Casual Premium Slim Fit T-Shirts
        if (searchText === '') {
            createPostalCard(data);
        }
        else {
            data = data.filter((office) => {
                const officeName = office.Name.trim().toLowerCase();
                const branchType = office.BranchType.trim().toLowerCase();

                if (officeName.includes(searchText) || searchText === officeName) {
                    return office;
                }
                if (branchType.includes(searchText) || searchText === branchType) {
                    return office;
                }
            })
        }
        createPostalCard(data);
    }
    geoBtn.addEventListener("click", async () => {

        home.style.display = "none";
        addressContainer.style.display = "block";
        try {
            // Get user's IP address
            const ipResponse = await userIP;
            // Get user's location information from API
            const response = await fetch(`https://ipinfo.io/${ipResponse}?token=4ecca9628f9433`);
            const locationData = await response.json();
            const postOfficeResponse = await fetch(`https://api.postalpincode.in/pincode/${locationData.postal}`);
            const branches = await postOfficeResponse.json();

            document.getElementsByClassName('ip_addr')[1].innerText = locationData.ip;
            console.log(locationData);
            let lattiude = locationData.loc.split(',')[0];
            let longitude = locationData.loc.split(',')[1];
            document.getElementById('lat').innerText = lattiude;
            document.getElementById('lon').innerText = longitude;
            document.getElementById('city').innerText = locationData.city;
            document.getElementById('reg').innerText = locationData.region;
            document.getElementById('org').innerText = locationData.asn.name;
            document.getElementById('host').innerText = locationData.hostname;
            const mapLocation = document.getElementById('map-frame');
            mapLocation.setAttribute("src", `https://www.google.com/maps/embed/v1/place?q=${lattiude},${longitude}&key=AIzaSyDU3QvuVFlZ9PcWIU2JYAaO0il88WNa-V0`);
            document.getElementById('time-zone').innerText = locationData.timezone;
            // datetime in "America/Chicago" timezone in the "en-US" locale
            let chicago_datetime_str = new Date().toLocaleString("en-US", { timeZone: locationData.timezone });
            document.getElementById('date-time-zone').innerText = chicago_datetime_str;
            document.getElementById('pincode').innerText = locationData.postal;
            document.getElementById('message').innerText = branches[0].Message;
            const postOffice = branches[0].PostOffice;
            createPostalCard(postOffice);
            searchInput.addEventListener('input', (event) => {
                searchPostOffice(postOffice);
            })
        } catch (error) {
            console.error('data failed to load...', error);
        }
    })
}