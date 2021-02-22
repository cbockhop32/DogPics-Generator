const list = document.getElementById('list');
const results = document.getElementById('results');
const resultsCount = document.getElementById('results-count');
const container = document.getElementById('container');
const buttonDiv = document.getElementById('button-div');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const loader = document.getElementById('loader');
const btnScroll = document.getElementById('btn-scroll-top');


let imgCount = 12;
let preventLoading = true;
let selectedBreedData;

// DOM related Functions

// Populate 'select' options

function populateSearch(message) {
    const listOfBreeds = Object.keys(message);
    let fullbreedList = [];

    listOfBreeds.forEach(breed => {
        if(message[breed].length > 1) {
            message[breed].forEach(subbreed => 
                fullbreedList.push(`${formatBreed(subbreed)} ${formatBreed(breed)}`)
            )
        } else {
            fullbreedList.push(formatBreed(breed))
        }
    });

    list.innerHTML = `
        <option value="placeholder">Select Breed</option>
        ${fullbreedList.sort().map(breed => `<option value="${breed}">${breed}</option>`).join('')}`;

}


// Populates individual cards/images when breed is selected from dropdown

function populateImages(breedData) {
    results.classList.add('received');
    selectedBreedData = breedData;
    const imgList = breedData.message;
    const imgStop = imgCount > imgList.length ? imgList.length : imgCount;

    results.innerHTML = '';

    for (let i=0; i < imgStop; i++) {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('card');
        imgDiv.innerHTML = `
            <img src="${imgList[i]}" class="img-item">
        `;

        results.appendChild(imgDiv);
    }

    imgCount += 8;

    imgStop === imgList.length ? preventLoading = true : preventLoading = false;
    addResultsEventListeners();
} 





// Show Modal with clicked img

function showModal(src) {
    modal.classList.add('show');
    modalImg.src = `${src}`;
}

// Formats Lettering for Breed Name
function formatBreed(breed) {
    const formBreed = breed.charAt(0).toUpperCase() + breed.substr(1);
    return formBreed;
}


// Adds event listeners to  results

function addResultsEventListeners() {
    const imgList = document.querySelectorAll('.img-item');
   
    imgList.forEach(img => {
        img.addEventListener('click', e => showModal(e.target.src))
    });
}

// Show loader
function showLoading() {
    loader.classList.add('show');

    setTimeout(() => {
        loader.classList.remove('show');

        setTimeout(() => {
            populateImages(selectedBreedData);
        })
    }, 1000);
}








// API Related Functions

    // Fetches breed list
    async function getSearchList() {
        try {
            const res = await fetch('https://dog.ceo/api/breeds/list/all');
            if(!res.ok) throw new Error('Problem getting search list')
            const data = await res.json();
            populateSearch(data.message)
        } catch(err) {
            alert(err.message)
        }
    }


    async function getImagesByBreed(breed) {
        const splitBreed = breed.split(' ');
        imgCount = 12; //resets number of images loaded when a new breed is selected
    
        if(breed == 'placeholder') {
        alert('Please select a different breed to populate images')
        } else {
            try{
                if(splitBreed.length > 1) {
                    const subBreed = splitBreed[0].toLowerCase();
                    const mainBreed = splitBreed[1].toLowerCase();
                    const res = await fetch(`https://dog.ceo/api/breed/${mainBreed}/${subBreed}/images`);
                    if(!res.ok) throw new Error('Problem getting images for that selected breed');
                    const data = await res.json();
                    
                    populateImages(data)
        
                    resultsCount.innerHTML = `<strong>${data.message.length}</strong> results for <strong>${formatBreed(subBreed)} ${formatBreed(mainBreed)}</strong>`;

                } else {
                    const res = await fetch(`https://dog.ceo/api/breed/${breed.toLowerCase()}/images`);
                    if(!res.ok) throw new Error('Problem getting images for that selected breed');
                    const data = await res.json();

                    populateImages(data)

                    resultsCount.innerHTML = `<strong>${data.message.length}</strong> results for <strong>${formatBreed(breed)}</strong>`;
                }
            } catch (err) {
                alert(err.mesage)
                }
   
        }

    }




// Event Listeners

    list.addEventListener('change', e => getImagesByBreed(list.value))

    window.addEventListener('click', e => e.target == modal ? modal.classList.remove('show') : false);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
    


        if(scrollTop + clientHeight >= scrollHeight - 5 && preventLoading === false) {
            showLoading();
        }
        
    })

    btnScroll.addEventListener('click', () => {
        // window.scrollTo(0, 0);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    })



    getSearchList(); //Fetches breed list data and then this function initializes the populate search 