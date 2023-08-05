const geoButton = document.getElementById("btn");
const homeContainer = document.getElementById("home-container");
const addressContainer = document.getElementById("address-details-container");
const officeContainer = document.getElementById("Post-office-container");
const searchItem = document.getElementById("search-input");

window.onload = function () {

    const userIP = fetch("https://api64.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            document.getElementsByClassName('ip-address')[0].innerText = data.ip;
            return data.ip;
        })
        .catch((error) => {
            document.getElementsByClassName('ip-address')[0].innerText = "0.0.0.0";
            console.error('Error fetching data:', error);
            throw error;
        });

    // createPostCard function
    function createPostCard(postOfficeBranches) {
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

    // PostOffice function
    function searchPostOffice(data) {
        let searchText = searchItem.value.trim().toLowerCase();
        if (searchText === '') {
            createPostCard(data);
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
        createPostCard(data);
    }

    // geoButton Listener
    geoButton.addEventListener("click", async () => {

        homeContainer.style.display = "none";
        addressContainer.style.display = "block";
        try {
            const responseIP = await userIP;
            const data = await fetch(`https://ipinfo.io/${responseIP}?token=4ecca9628f9433`);
            const locationData = await data.json();
            const postOfficeData = await fetch(`https://api.postalpincode.in/pincode/${locationData.postal}`);
            const branches = await postOfficeData.json();

            document.getElementsByClassName('ip-address')[1].innerText = locationData.ip;
            let lattiude = locationData.loc.split(',')[0];
            let longitude = locationData.loc.split(',')[1];
            document.getElementById('region').innerText = locationData.region;
            document.getElementById('lat').innerText = lattiude;
            document.getElementById('lon').innerText = longitude;
            document.getElementById('city').innerText = locationData.city;
            document.getElementById('organization').innerText = locationData.org;

            document.getElementById('host').innerText = locationData.org.split(' ')[0];
            const mapLocation = document.getElementById('map-frame');

            mapLocation.setAttribute("src", `https://www.google.com/maps/embed/v1/place?q=${lattiude},${longitude}&key=AIzaSyDU3QvuVFlZ9PcWIU2JYAaO0il88WNa-V0`);
            document.getElementById('time-zone').innerText = locationData.timezone;

            let datetime_string = new Date().toLocaleString("en-US", { timeZone: locationData.timezone });
            document.getElementById('date-time-zone').innerText = datetime_string;
            document.getElementById('pincode').innerText = locationData.postal;
            document.getElementById('message').innerText = branches[0].Message;

            const postOffice = branches[0].PostOffice;
            createPostCard(postOffice);

            searchItem.addEventListener('input', (event) => {
                searchPostOffice(postOffice);
            })
        } catch (err) {
            console.log('data failed to load...', err);
        }
    })
}