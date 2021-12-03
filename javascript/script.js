let isPredicted = false;
let lastPrediction;

// filter entered character
function nameInputChange(event) {
    if (!((event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode == 32))) {
        event.preventDefault();
        return false;
    }

    if (event.target.value.length > 254) {
        event.preventDefault();
        return false;
    }
}


// use to send request to server
async function api(name) {

    const BASE_URL = `https://api.genderize.io/?name=${name}`;

    console.log(BASE_URL);

    let response = await fetch(BASE_URL,
        {
            method: "GET",
        })

    return response.json();
}


// save name in local storage
function savePrediction() {
    if (isPredicted) {
        const gender = selectedGender();

        const name = document.getElementById('name').value;

        if (gender === false) {
            localStorage.setItem(lastPrediction.name, lastPrediction.gender);
        } else {
            localStorage.setItem(name, gender);
        }
    } else {
        const message = 'please predict first then save the result';
        alert(message);
    }
}


// load local storage for a name
function loadPrediction(name) {
    let saved = localStorage.getItem(name);

    if (saved)
    {
        const nameUi = document.getElementById('name-saved');
        const genderUi = document.getElementById('gender-prediction-saved');

        nameUi.innerText = name;
        genderUi.innerText = saved;
    }
    else
    {
        const message = 'no item is stored';
        alert(message);
    }
}


// clear local storage for specific name
function clearPrediction() {
    const name = document.getElementById('name-saved');
    localStorage.removeItem(name.innerText);

    const nameUi = document.getElementById('name-saved');
    const genderUi = document.getElementById('gender-prediction-saved');

    nameUi.innerText = '';
    genderUi.innerText = '';
}


// get the selected gender (selected radio buttons)
function selectedGender() {
    const gender = document.getElementsByName('gender');

    if (gender[0].checked) {
        return gender[0].value;
    }
    if (gender[1].checked) {
        return gender[1].value;
    }
    return false;
}


// this function run when form is submitted
function submitForm(event) {

    event.preventDefault();

    const name = document.getElementById('name').value;
    if (name === '')
        return;

    loadPrediction(name);

    api(name)
        .then(response => {
            console.log(response)
            const genderPrediction = document.getElementById('gender-prediction');
            const probabilityPrediction = document.getElementById('probability-prediction');

            if (response.gender === null)
            {
                const errorAlert = document.getElementById('error');
                errorAlert.classList.remove('d-none');
                genderPrediction.innerText = '!!!!!';
                probabilityPrediction.innerText = response.probability;

                isPredicted = false;
                lastPrediction = undefined;
            }
            else
            {
                genderPrediction.innerText = response.gender;
                probabilityPrediction.innerText = response.probability;

                isPredicted = true;
                lastPrediction = response;
            }
        })
        .catch(error => {
            console.log(error);
            const errorAlert = document.getElementById('internet-error');
            errorAlert.classList.remove('d-none');
        })
}


// just hide error dialog
function hideError() {
    const errorAlert = document.getElementById('error');
    errorAlert.classList.add('d-none');
}