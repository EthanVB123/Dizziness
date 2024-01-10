var page = 1;
var maxPage = 11;
var numMeds = 1;
var numAllergies = 1;
document.getElementById("addmed").addEventListener("click", addmed);
document.getElementById("addallergy").addEventListener("click", addallergy);
document.getElementById("removemed").addEventListener("click", removemed);
document.getElementById("removeallergy").addEventListener("click", removeallergy);

function validateForm() {
    var inputs = document.getElementsByTagName("input");
    var requiredInputs = Array.from(document.getElementsByClassName("required"));
    var integerInputs = Array.from(document.getElementsByClassName("integer"));
    var choiceInputs = Array.from(document.getElementsByClassName("choice"));
    var checkInputs = Array.from(document.getElementsByClassName("check"));
    var selects = Array.from(document.getElementsByTagName("select"));
    console.log(`${inputs.length} inputs, ${requiredInputs.length} required, ${choiceInputs.length} choice, ${checkInputs.length} check, ${integerInputs.length} integers, and ${selects.length} selects`);
    
    // Make sure all required inputs have a value
    for (i = 0; i < requiredInputs.length; i++) {
        if (requiredInputs[i].value == "") {
            console.log(`${requiredInputs[i].id} is null!`)
            var labelElement = document.querySelector(`label[for="${requiredInputs[i].id}"]`);
            console.log(`${labelElement.innerHTML} is the offender and the parent be ${findPage(requiredInputs[i])}`)
        } else {
            console.log(`${requiredInputs[i].id} is a cool banana!`)
        }
    }
}

function findPage(element) { // return the page number
    if (element.parentNode.tagName == "DIV" && element.parentNode.classList.contains("page")) {
        return parseInt(element.parentNode.id.slice(2), 10);
    }
    return findPage(element.parentNode);
}






function submitForm() {
    var outputString = "";
    // Name, age, main problem
    var name = document.getElementById('name').value;
    outputString += "The patient's name is " + name + "\n";
    var age = document.getElementById('age').value;
    outputString += "The patient is " + age + " years old\n";
    outputString += "Main Problem(s):\n"
    outputString += document.getElementById('dizziness').checked ? "Dizziness\n" : "";
    outputString += document.getElementById('imbalance').checked ? "Imbalance\n" : "";
    outputString += document.getElementById('earSymptoms').checked ? "Ear Symptoms\n" : "";
    outputString += "\n";
    // Initial dizziness
    var dateStarted = document.getElementById("Started").value;
    outputString += "Symptoms started on " + convertDates(dateStarted) + "\n";

    outputString += "When the dizziness started, it was " + document.getElementById("time").value + " and it lasted for the time period of " + document.getElementById("length").value + "\n";
    outputString += "Patient was doing " + document.getElementById("activity").value + "\nPatient's location was " + document.getElementById("location").value + "\n"
    outputString += `Prior to the dizziness, the patient had the following health issues or changes to medications: "${document.getElementById("priorIssues").value}"\n\n`
    // Dizziness symptoms
    outputString += "When the patient feels dizzy, they get the sensation of:\n"
    var dizzySymptoms = document.getElementsByClassName("dizzysymptom");
    var dizzySymptomsInOrder =
        ["Swaying, spinning, tumbling, cart-wheeling, tilting or rocking",
            "Imbalance, veering to left side",
            "Imbalance, veering to right side",
            "Nausea, vomiting",
            "Double",
            "Blurred",
            "Jumping vision",
            "Light-headedness",
            "Loss of consciousness",
            "Headache",
            "Ear symptoms",
            "Other neurological symptoms"]
    for (var i = 0; i < dizzySymptoms.length; i++) {
        if (dizzySymptoms[i].checked) {
            outputString += dizzySymptomsInOrder[dizzySymptoms[i].id.slice(5) - 1];
            if (dizzySymptoms[i].id.slice(5) == 12) {
                outputString += ` ${document.getElementById("dizzy12-1").value}`
            }
            outputString += "\n";
        }
    }
    // Ongoing Dizziness
    outputString += "\nSince then, the patient's dizziness is "
    outputString += document.getElementById('yes1').checked ? "constant" : "not constant"
    outputString += " and the dizziness "
    outputString += document.getElementById('yes2').checked ? "comes in attacks." : "does not come in attacks." + "\n\n"
    // Dizziness Attacks
    if (document.getElementById('yes2').checked) {
        outputString += ("The attacks occur with the following frequency: " + document.getElementById("attack1").value
            + " and have the following length: " + document.getElementById("attack2").value + "\n")
        outputString += (document.getElementById('attack3').value = '1') ? "Attacks can be provoked by \"" + document.getElementById("attack3-1").value + "\"\n" : "Attacks are not provoked by specific things.\n"
        outputString += document.getElementById('attack4').checked ? "There is a warning that an attack is about to start.\n\n" : "There is no warning that an attack is about to start.\n\n";
    }
    // Overall Trend
    outputString += "The overall trend of the dizziness since initial onset is " + document.getElementById("trend").value.toLowerCase() + ".\n\n"
    // Dizziness Provoked By
    var provokedBy = document.getElementsByClassName("provoke")
    var provokedFactors = ["Turning over in bed to the left",
        "Turning over in bed to the right",
        "Lying down",
        "Going from lying to sitting",
        "Going from sitting to standing",
        "Standing still",
        "Rapid head movements",
        "Walking in a dark room",
        "Elevator",
        "Car travel",
        "Plane travel",
        "Sudden loud noises",
        "Sustained loud noises",
        "Coughing",
        "Blowing nose",
        "Straining",
        "Grocery Stores",
        "Narrow spaces",
        "Wide open spaces",
        "Salt",
        "MSG",
        "Food - which?",
        "Not eating",
        "Looking at moving objects",
        "Heat",
        "Hot showers",
        "Time of day - when?",
        "Seasons, which?",
        "Stress",
        "Alcohol",
        "Menstrual period (if relevant)",
        "Underwater diving",
        "Exercise",
        "Unprovoked/Randomly"]
    outputString += "The vertigo is provoked by:\n"
    for (var i = 0; i < provokedBy.length; i++) {
        if (provokedBy[i].checked) {
            outputString += provokedFactors[provokedBy[i].id.slice(7) - 1];
            if (provokedBy[i].id.slice(7) == 22 || provokedBy[i].id.slice(7) == 27 || provokedBy[i].id.slice(7) == 28) {
                outputString += ` ${document.getElementById("provoke" + provokedBy[i].id.slice(7) + "-1").value}`;
            }
            outputString += "\n";
        }
    }
    // Main Provoking Factors
    outputString += `\nThe main provoking factor is: "${document.getElementById("factor1").value}", and other strong provoking factors are: "${document.getElementById("factor2").value}".\n`


    downloadResults("results.txt", outputString);
}

function downloadResults(filename, text) {
    /*var filename = "results.txt";
    var text = "This is a preliminary test."*/

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
// Utility functions below
function convertDates(isoDate) {
    return isoDate.slice(8) + "/" + isoDate.slice(5, 7) + "/" + isoDate.slice(0, 4);
}

function reveal(idToCheck, idToChange) {
    if (document.getElementById(idToCheck).checked) {
        document.getElementById(idToChange).classList.remove("hidden");
    } else {
        document.getElementById(idToChange).classList.add("hidden");
    }
}
function addmed() {
    numMeds++;
    const newMed = document.createElement("div");
    newMed.id = `med${numMeds}`;
    newMed.innerHTML = `
    <li>
        <label for="med${numMeds}-1">${numMeds}. Name</label>
        <input type="text" id="med${numMeds}-1" name="med${numMeds}-1">
        <br>
        <label for="med${numMeds}-2"> Dosage</label>
        <input type="text" id="med${numMeds}-2" name="med${numMeds}-2">
        <br>
        <label for="med${numMeds}-3"> Frequency</label>
        <input type="text" id="med${numMeds}-3" name="med${numMeds}-3">
        <br>
        <label for="med${numMeds}-4"> Start Date</label>
        <input type="date" id="med${numMeds}-4" name="med${numMeds}-4">
        <br>
        <label for="med${numMeds}-5"> Helpfulness</label>
        <select id="med${numMeds}-5" name="med${numMeds}-5">
            <option value="helpful">Quite helpful</option>
            <option value="somewhat helpful">Somewhat helpful</option>
            <option value="not very helpful">Not very helpful</option>
            <option value="not at all helpful">Not at all helpful</option>
        </select>
    </li>
    <br>`
    document.getElementById("medications").insertBefore(newMed, document.getElementById("addmed"));
}
function addallergy() {
    numAllergies++;
    const newAllergy = document.createElement('div');
    newAllergy.id = `allergen${numAllergies}`;
    newAllergy.innerHTML = `            <li>
    <label for="allergy${numAllergies}-1">${numAllergies}. Name of Allergen</label>
    <input type="text" id="allergy${numAllergies}-1" name="allergy${numAllergies}-1">
    <label for="allergy${numAllergies}-2">Reaction(s) to Allergen</label>
    <input type="text" id="allergy${numAllergies}-2" name="allergy${numAllergies}-2">
</li>
<br>`
    document.getElementById("allergies").insertBefore(newAllergy, document.getElementById("addallergy"));
}
function removemed() {
    if (numMeds > 0) {
        document.getElementById(`med${numMeds}`).remove();
        numMeds--;
    } else {
        alert("There are no medicines to remove.");
    }
}
function removeallergy() {
    if (numAllergies > 0) {
        document.getElementById(`allergen${numAllergies}`).remove();
        numAllergies--;
    } else {
        alert("There are no allergies to remove.");
    }
}
function nextPage() {
    document.getElementById(`pg${page}`).classList.add('hidden');
    page++;
    document.getElementById(`pg${page}`).classList.remove('hidden');
    updatePageNumber();
    if (page == maxPage) {
        document.getElementById("nextpage").classList.add('hidden');
    }
    if (page == 2) {
        document.getElementById(`prevpage`).classList.remove('hidden');
    }
}
function prevPage() {
    document.getElementById(`pg${page}`).classList.add('hidden');
    page--;
    document.getElementById(`pg${page}`).classList.remove('hidden');
    updatePageNumber();
    if (page == 1) {
        document.getElementById("prevpage").classList.add('hidden');
    }
    if (page == maxPage - 1) {
        document.getElementById(`nextpage`).classList.remove('hidden');
    }
}
function updatePageNumber() {
    document.getElementById('pagenumber').innerHTML = `Page ${page} of ${maxPage}`;
}
