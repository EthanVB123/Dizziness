
var page = 1;
var maxPage = 11;
var numMeds = 1;
var numAllergies = 1;
document.getElementById("addmed").addEventListener("click", addmed);
document.getElementById("addallergy").addEventListener("click", addallergy);
document.getElementById("removemed").addEventListener("click", removemed);
document.getElementById("removeallergy").addEventListener("click", removeallergy);

function validateForm(pageNo) {
    var inputs = Array.from(document.getElementsByTagName("input"));
    var selects = Array.from(document.getElementsByTagName("select"));
    if (pageNo > 0 && pageNo <= maxPage) {
        inputs = inputs.filter((inputItem) => findPage(inputItem) == pageNo);
        selects = selects.filter((inputItem) => findPage(inputItem) == pageNo);
    }
    for (i = 0; i < selects.length; i++) {
        if (selects[i].value == "-1" && !selects[i].classList.contains("off")) {
            alert(`Please complete the following question:\nPage ${findPage(selects[i])}\n${document.querySelector(`label[for="${selects[i].id}"]`).innerHTML}`)
            return false;
        }
    }


    for (i = 0; i < inputs.length; i++) {
        // If question is dependent and not required based on current input (i.e. "off"), skip
        if (inputs[i].classList.contains("off")) {
            continue;
        }
        // Check for unfilled "required" inputs
        if (inputs[i].classList.contains("required") && inputs[i].value == "") {
            alert(`Please complete the following question:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
            return false;
        }
        // Check for unfilled "choice" inputs
        if (inputs[i].classList.contains("choice")) {
            var choices = document.querySelectorAll(`[name=${inputs[i].name}]`)
            var chosen = false;
            for (j = 0; j < choices.length; j++) {
                if (choices[j].checked) {
                    chosen = true;
                }
            }
            if (!chosen) {
                alert(`Please complete the following question:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            }
        }
        // Check for integer
        if (inputs[i].classList.contains("integer")) {
            if (Math.floor(inputs[i].value) != inputs[i].value) {
                console.log(`${inputs[i].value}`)
                alert(`Please answer with a whole number:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            }
        }
        // Check for at least one in each "check"
        if (inputs[i].classList.contains("check")) {
            var classes = inputs[i].classList;
            var targetClass = "";
            for (j = 0; j < classes.length; j++) {
                if (classes[j].length>5 && classes[j].slice(0,5)=="check") {
                    targetClass = classes[j];
                    break;
                }
            }
            var checkGroup = document.getElementsByClassName(targetClass);
            var checked = false;
            for (j = 0; j < checkGroup.length; j++) {
                if (checkGroup[j].checked) {
                    checked = true;
                }
            }
            if (!checked) {
                alert(`Please select at least one box:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            }
        }
        // Check for legal dated (between 1/1/1900 and today)
        if (inputs[i].classList.contains("date")) {
            console.log(`The date was '${inputs[i].value}'`);
            if (inputs[i].value == '') {
                alert(`Please complete the following question:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            } else if (new Date(inputs[i].value) > new Date()) {
                alert(`Please pick a date in the past, or if this event has not happened, pick today's date:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            } else if (new Date(inputs[i].value) < new Date("1900-01-01")) {
                alert(`Please pick a date between 1900 and today:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            }
        }
    }
    return true;

}

function findPage(element) { // return the page number
    if (element.parentNode.tagName == "DIV" && element.parentNode.classList.contains("page")) {
        return parseInt(element.parentNode.id.slice(2), 10);
    }
    return findPage(element.parentNode);
}

function pdfTest(toPutOnThePDF) {
    const doc = new jspdf.jsPDF();
    for (var i = 0; i < toPutOnThePDF.length; i++) {
        doc.text(`${toPutOnThePDF[i]}`, 10, 10);
        doc.addPage();
    }
    //doc.text("One more time",15,25);
    doc.save("results.pdf");
    //console.log(doc.getFontList())
}

function submitTable() {
    var allInformation = document.querySelectorAll("[data-question]");
    console.log(allInformation.length);
    var outputString = "";
    var output = [];
    var inCheckboxGroup = false;
    for (var i = 0; i < allInformation.length; i++) {
        console.log(allInformation[i].type);
        if (allInformation[i].type == "text" || allInformation[i].type == "date" || allInformation[i].type == "time" || allInformation[i].type == "number") {
            if (inCheckboxGroup) {
                outputString += ` ${allInformation[i].value}`
            } else {
                outputString += /*`${i} - */`${allInformation[i].dataset.question}: ${allInformation[i].value}\n`;
            }
        } else if (allInformation[i].type == "checkbox") {
            if (!inCheckboxGroup) {
                inCheckboxGroup = true;
                outputString += /*`${i} - */`${allInformation[i].dataset.question}:`;
            }
            if (allInformation[i].checked) {
                outputString += `\n${allInformation[i].value}`;
            }
            if (allInformation[i].hasAttribute("data-checkbox-end")) {
                inCheckboxGroup = false;
                outputString += "\n";
            }
        } else if (allInformation[i].type == "radio") {
            if (allInformation[i].checked) {
                outputString += /*`${i} - */`${allInformation[i].dataset.question}: ${allInformation[i].value}\n`
            }
        }

        if (i % 40 == 39) {
            output.push(outputString);
            outputString = "";
        }
    }
    output.push(outputString);
    pdfTest(output);
    //downloadResults("results.txt", outputString);
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
    var dependents = document.getElementsByClassName(idToChange);
    if (document.getElementById(idToCheck).checked) {
        document.getElementById(idToChange).classList.remove("hidden");
        for (i = 0; i < dependents.length; i++) {
            dependents[i].classList.remove("off");
        }
    } else {
        document.getElementById(idToChange).classList.add("hidden");
        for (i = 0; i < dependents.length; i++) {
            dependents[i].classList.add("off");
        }
    }
}
function addmed() {
    numMeds++;
    const newMed = document.createElement("div");
    newMed.id = `med${numMeds}`;
    newMed.innerHTML = `
    <li>
        <label for="med${numMeds}-1">${numMeds}. Name</label>
        <input type="text" id="med${numMeds}-1" name="med${numMeds}-1" data-question="Medicine ${numMeds} Name">
        <br>
        <label for="med${numMeds}-2"> Dosage</label>
        <input type="text" id="med${numMeds}-2" name="med${numMeds}-2" data-question="Medicine ${numMeds} Dosage">
        <br>
        <label for="med${numMeds}-3"> Frequency</label>
        <input type="text" id="med${numMeds}-3" name="med${numMeds}-3" data-question="Medicine ${numMeds} Frequency">
        <br>
        <label for="med${numMeds}-4"> Start Date</label>
        <input type="date" id="med${numMeds}-4" name="med${numMeds}-4" data-question="Medicine ${numMeds} Start Date">
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
    <input type="text" id="allergy${numAllergies}-1" name="allergy${numAllergies}-1" data-question="Allergen ${numAllergies} Name">
    <label for="allergy${numAllergies}-2">Reaction(s) to Allergen</label>
    <input type="text" id="allergy${numAllergies}-2" name="allergy${numAllergies}-2" data-question="Allergen ${numAllergies} Reaction">
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
    if (validateForm(page)) {
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
