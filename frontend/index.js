import env_variables from './config.js'
function loadDropDowns() {
    const jsonStates = JSON.parse(usaStates)
    const stateDropDown = document.getElementById("state")
    for (let keyState in jsonStates) {
        let option = document.createElement("option")
        option.value = keyState
        option.innerHTML = `${keyState} - ${jsonStates[keyState]}`
        stateDropDown.appendChild(option)
    }
    const jsonPlans = JSON.parse(plans)
    const planDropDown = document.getElementById("plan")
    for (let plan in jsonPlans) {
        let option = document.createElement("option")
        option.value = jsonPlans[plan]
        option.innerHTML = jsonPlans[plan]
        planDropDown.appendChild(option)
    }
}
function getAgeFromDateOfBirth() {
    const birthDateInput = document.getElementById('dateOfBirth')
    const ageInput = document.getElementById('age')
    birthDateInput.addEventListener("change", (e) => {
        const birthDate = new Date(birthDateInput.value)
        const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'UTC' }))
        const month = today.getMonth() - birthDate.getMonth()
        let age = today.getFullYear() - birthDate.getFullYear()
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--
        ageInput.value = age
    })
}

function submitForm() {
    const submitForm = document.getElementById('calculatorForm')

    submitForm.addEventListener("submit", (e) => { retrieveCalculatorData(e) })
}
function retrieveCalculatorData(e) {
    e.preventDefault();
    const ageInput = document.getElementById('age')
    const resultContainer = document.getElementById('rows')
    const form = document.getElementById("calculatorForm")
    const periodInput = document.getElementById("periods")
    ageInput.disabled = false
    const queryString = $('#calculatorForm').serialize()
    const host = form.action
    $.ajax({
        method: "GET",
        url: `${host}?${queryString}`,
        datatype: 'json'
    }).done((data) => {
        resultContainer.innerHTML = ''
        console.log(data)
        if (data.length > 0) {
            for (let row in data) {
                resultContainer.innerHTML += `<div class='row'>
                <input type="text" disabled="readonly" value=${data[row].carrier}>
                <input type="text" disabled="readonly" value=${data[row].premium}>
                <input type="text" class='annual' disabled="readonly" value=${annualToPeriod(data[row].premium, periodInput.value)}>
                <input type="text" class='monthly' disabled="readonly" value=${monthlyToPeriod(data[row].premium, periodInput.value)}>
                </div>
                `
            }
        } else {
            resultContainer.innerHTML += `<div class='result'>No Data</div>`
        }
    })
    ageInput.disabled = true
}
function configPages() {
    const form = document.getElementById("calculatorForm")
    form.action = `${env_variables.HOST}/api/calculator/`
}
function annualToPeriod(value, period) {
    switch (period) {
        case 'monthly':
            return value * 12
        case 'quarterly':
            return value * 4
        case 'semi-annual':
            return value * 2
        case 'annual':
            return value
    }
}
function monthlyToPeriod(value, period) {
    switch (period) {
        case 'monthly':
            return value
        case 'quarterly':
            return Math.round((value / 3.0) * 100) / 100
        case 'semi-annual':
            return Math.round((value / 6.0) * 100) / 100
        case 'annual':
            return Math.round((value / 12.0) * 100) / 100
    }
}
configPages()
loadDropDowns()
getAgeFromDateOfBirth()
submitForm()