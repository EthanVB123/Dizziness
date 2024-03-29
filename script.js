
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
    var textareas = Array.from(document.getElementsByTagName("textarea"));
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
    for (i = 0; i < textareas.length; i++) {
        if (textareas[i].value == "" && !textareas[i].classList.contains("off") && textareas[i].classList.contains("required")) {
            alert(`Please complete the following question:\nPage ${findPage(textareas[i])}\n${document.querySelector(`label[for="${textareas[i].id}"]`).innerHTML}`)
            return false;
        }
    }

    for (i = 0; i < inputs.length; i++) {
        // If question is dependent and not required based on current input (i.e. "off"), skip
        if (inputs[i].classList.contains("off") || (isElementOrAncestorHiddenByClass(inputs[i], "wrongpage") && pageNo != -1)) {
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
                //console.log(`${inputs[i].value}`)
                alert(`Please answer with a whole number:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            } else if (inputs[i].value < 0) {
                alert(`Please answer with a positive number:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
                return false;
            }
        }
        // Check for +ve number
        if (inputs[i].classList.contains("positive")) {
            if (inputs[i].value < 0) {
                alert(`Please answer with a positive number:\nPage ${findPage(inputs[i])}\n${document.querySelector(`label[for="${inputs[i].id}"]`).innerHTML}`)
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
            //console.log(`The date was '${inputs[i].value}'`);
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
    doc.setFontSize(10);
    for (var i = 0; i < toPutOnThePDF.length; i++) {
        if (i != 0) {
            doc.addPage();
        }
        doc.text(`${toPutOnThePDF[i]}`, 10, 10);
    }
    //doc.text("One more time",15,25);
    doc.save("results.pdf");
    //console.log(doc.getFontList())
}

function reportPDF(headings, strings) {
    const doc = new jspdf.jsPDF();
    doc.setFontSize(10);
    var y = 10;
    for (i = 0; i < headings.length; i++) {
        doc.setFont('helvetica','bold');
        doc.text(headings[i], 10, y);
        console.log(doc.getTextDimensions(headings[i]))
        y += doc.getTextDimensions(headings[i]).h + 5;

        doc.setFont('helvetica','normal');
        var lines = doc.splitTextToSize(strings[i],doc.internal.pageSize.width-20);
        for (j = 0; j < lines.length; j++) {
            console.log(lines[j])
            console.log(y)
            doc.text(lines[j], 10, y);
            y += doc.getTextDimensions(lines[j]).h;
        }
        y += 5;
    }
    doc.save("report.pdf")
}

function submitTable() {
    if (validateForm(-1)) {
        var numLinesThisPage = 0;
        var allInformation = document.querySelectorAll("[data-question]");
        //console.log(allInformation.length);
        var outputString = "";
        var output = [];
        var inCheckboxGroup = false;
        for (var i = 0; i < allInformation.length; i++) {
            if (isElementOrAncestorHiddenByClass(allInformation[i], "hidden") || allInformation[i].value == "") {
                //console.log(`Skipped ${allInformation[i].id}`)
                continue;
            } else if (allInformation[i].tagName == "H2") {
                outputString += `\n\n${allInformation[i].innerHTML}\n`;
                numLinesThisPage += 3;
            } else if (allInformation[i].tagName == "SELECT") {
                outputString += `${allInformation[i].dataset.question}: ${allInformation[i].value}\n`;
            } else if (allInformation[i].type == "text" || allInformation[i].type == "date" || allInformation[i].type == "time" || allInformation[i].type == "number") {
                if (inCheckboxGroup) {
                    //outputString += ` ${allInformation[i].value} ${numLinesThisPage}`
                    if (allInformation[i].hasAttribute("data-checkbox-end")) {
                        inCheckboxGroup = false;
                        outputString += "\n";
                        numLinesThisPage++;
                    }
                    //console.log(`inCheckboxGroup REMAINS TRUE - ${allInformation[i].dataset.question}`)
                } else {
                    outputString += /*`${i} - */`${allInformation[i].dataset.question}: ${allInformation[i].value}\n`;
                    numLinesThisPage++;
                }
            } else if (allInformation[i].type == "checkbox") {
                if (!inCheckboxGroup) {
                    inCheckboxGroup = true;
                    //console.log(`inCheckboxGroup TRUE - ${allInformation[i].dataset.question}`)
                    outputString += /*`${i} - */`${allInformation[i].dataset.question}:`;
                    numLinesThisPage++;
                }
                if (allInformation[i].checked) {
                    //console.log(`inCheckboxGroup REMAINS TRUE - ${allInformation[i].dataset.question}`)
                    outputString += `\n${allInformation[i].value}`;
                    numLinesThisPage++;
                }
                if (allInformation[i].hasAttribute("data-checkbox-end")) {
                    inCheckboxGroup = false;
                    //console.log(`inCheckboxGroup FALSE - ${allInformation[i].dataset.question}`)
                    outputString += "\n";
                    numLinesThisPage++;
                }
            } else if (allInformation[i].type == "radio") {
                if (allInformation[i].checked) {
                    outputString += /*`${i} - */`${allInformation[i].dataset.question}: ${allInformation[i].value}\n`
                    numLinesThisPage++;
                }
            }


            if (allInformation[i].hasAttribute("data-break")) {
                outputString += "\n";
                numLinesThisPage++;
                if (numLinesThisPage >= 55) {
                    numLinesThisPage = 0;
                    output.push(outputString);
                    outputString = "";
                }
            }
            if (numLinesThisPage >= 70) {
                numLinesThisPage = 0;
                output.push(outputString);
                outputString = "";
            }
        }
        output.push(outputString);
        pdfTest(output);
        generateLifestyleText();
        nextPage(override);
        //downloadResults("results.txt", outputString);
    }
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
        <input type="text" id="med${numMeds}-1" name="med${numMeds}-1" data-question="Medicine ${numMeds} Name" class="required">
        <br>
        <label for="med${numMeds}-2"> Dosage</label>
        <input type="text" id="med${numMeds}-2" name="med${numMeds}-2" data-question="Medicine ${numMeds} Dosage" class="required">
        <br>
        <label for="med${numMeds}-3"> Frequency</label>
        <input type="text" id="med${numMeds}-3" name="med${numMeds}-3" data-question="Medicine ${numMeds} Frequency" class="required">
        <br>
        <label for="med${numMeds}-4"> Start Date</label>
        <input type="date" id="med${numMeds}-4" name="med${numMeds}-4" data-question="Medicine ${numMeds} Start Date" class="required date">
        <br>
        <label for="med${numMeds}-5"> Helpfulness</label>
        <select id="med${numMeds}-5" name="med${numMeds}-5" data-break="1" class="required" data-question="Helpfulness of Medication">
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
    <input type="text" id="allergy${numAllergies}-1" name="allergy${numAllergies}-1" data-question="Allergen ${numAllergies} Name" class="required">
    <label for="allergy${numAllergies}-2">Reaction(s) to Allergen</label>
    <input type="text" id="allergy${numAllergies}-2" name="allergy${numAllergies}-2" data-question="Allergen ${numAllergies} Reaction" data-break="1" class="required">
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
function nextPage(override = false) {
    if (override || validateForm(page)) {
        document.getElementById(`pg${page}`).classList.add('wrongpage');
        page++;
        if (override) {
            page = maxPage + 1;
        }
        document.getElementById(`pg${page}`).classList.remove('wrongpage');
        updatePageNumber();
        if (page == maxPage) {
            document.getElementById("nextpage").classList.add('hidden');
            document.getElementById("finish").classList.remove("hidden");
        }
        if (page == 2) {
            document.getElementById(`prevpage`).classList.remove('hidden');
        }
        if (override) {
            document.getElementById("bottomButtons").classList.add('hidden');
        }
    }
}
function prevPage() {
    document.getElementById(`pg${page}`).classList.add('wrongpage');
    page--;
    document.getElementById(`pg${page}`).classList.remove('wrongpage');
    updatePageNumber();
    if (page == 1) {
        document.getElementById("prevpage").classList.add('hidden');
    }
    if (page == maxPage - 1) {
        document.getElementById(`nextpage`).classList.remove('hidden');
        document.getElementById("finish").classList.add("hidden");
    }
}
function updatePageNumber() {
    document.getElementById('pagenumber').innerHTML = page > maxPage ? "Survey complete!" : `Page ${page} of ${maxPage}`;
}


// Useful for checking "hidden"
function isElementOrAncestorHiddenByClass(element, className) {
    let currentElement = element;
    while (currentElement) {
        if (currentElement.classList.contains(className)) {
            return true; // Element or an ancestor has the specified class
        }
        currentElement = currentElement.parentElement;
    }
    return false; // Element and its ancestors don't have the specified class
}

function generateLifestyleText() { // Attempts to generate section "Social History" in the written report.
    var pronoun = document.getElementById("female").checked ? "She" : "He";
    var drinkingStatus = document.getElementById("standardDrinks").value == 0 ? "was a non-drinker" : `drank ${document.getElementById("standardDrinks").value} standard drinks of alcohol a week`;
    var smokingStatus;
    if (document.getElementById("smoker").checked) {
        if (dateString() == document.getElementById("smokerStop").value) {
            smokingStatus = `is currently a smoker, who started smoking on ${document.getElementById("smokerStart").value /* human readable? */} and smokes ${document.getElementById("smokerQuantity").value} cigarettes a day`
        } else {
            smokingStatus = `was an ex-smoker, who smoked from ${document.getElementById("smokerStart").value /* human readable? */} to ${document.getElementById("smokerStop").value /* human readable? */} and smoked ${document.getElementById("smokerQuantity").value} cigarettes a day`            
        }
    } else {
        smokingStatus = "has never smoked"
    }
    var maritalStatus = "unknown";
    if (document.getElementById("single").checked) {
        maritalStatus = "single";
    } else if (document.getElementById("married").checked) {
        maritalStatus = "married";
    } else if (document.getElementById("defacto").checked) {
        maritalStatus = "in a de facto relationship";
    }
    var occupation = document.getElementById("occupation").value;
    var occupationAorAn = ['a','e','i','o','u'].includes(occupation.charAt(0)) ? "an" : "a";
    var airTravelFrequency = document.getElementById("airplane").options[document.getElementById("airplane").selectedIndex].innerHTML.replace("your","their");
    airTravelFrequency = airTravelFrequency[0].toLowerCase() + airTravelFrequency.slice(1);
    var litigationStatus = "made it unclear whether litigation was being planned";
    if (document.getElementById("litigate").checked) {
        litigationStatus = "is currently in litigation"
    } else if (document.getElementById("litigateplan").checked) {
        litigationStatus = "was planning litigation"
    } else if (document.getElementById("litigateno").checked) {
        litigationStatus = "was not in litigation or planning litigation"
    }
    var disability = document.getElementById("disabled").checked ? "did" : "did not";
    var drivingStatus = document.getElementById("drive").checked ? "drove" : "did not drive";
    var numPillows = document.getElementById("pillow").value;
    var pillowSingularOrPlural = numPillows == 1 ? "pillow" : "pillows";
    var pronounPossessive = document.getElementById("female").checked ? "Her" : "His";
    var sleepingPosition;
    switch (document.getElementById("sleepPosition").value) {
        case "-1":
            sleepingPosition = "(unknown)";
            break;
        case "On their back":
            sleepingPosition = "back";
            break;
        case "On their stomach":
            sleepingPosition = "stomach";
            break;
        case "With their left side down":
            sleepingPosition = "left";
            break;
        case "With their right side down":
            sleepingPosition = "right";
            break;
        case "With no regular position":
            sleepingPosition = "sides/back/front with no regular position";
            break;
        default:
            console.log("switch sleepPosition unknown");
            sleepingPosition = "(unknown)";
            break;
    }
    var menstrualString;
    if (pronoun == "He") {
        menstrualString = "";
    } else {
        menstrualString = ` She ${document.getElementById("menstrual").value.toLowerCase()}${document.getElementById("menstrual").value == "Is Menopausal" ? ` \
(became menopausal at ${document.getElementById("menopause").value} years)` : ""}, was ${document.getElementById("contraceptive").value.toLowerCase()}, and is ${document.getElementById("pregnancy").value.toLowerCase()}.`;
    }

    output =  `${pronoun} ${drinkingStatus} and ${smokingStatus}. ${pronoun} was ${maritalStatus}. \
${pronoun} was ${occupationAorAn} ${occupation}. ${pronoun} travelled by air ${airTravelFrequency}. \
${pronoun} ${litigationStatus} regarding ${pronounPossessive.toLowerCase()} symptoms. \
${pronoun} ${disability} consider ${pronoun == "He" ? "him" : "her"}self disabled. ${pronoun} ${drivingStatus}. ${pronoun} slept on ${numPillows} ${pillowSingularOrPlural} at \
night on ${pronounPossessive.toLowerCase()} ${sleepingPosition}.${menstrualString}` 
    
    reportPDF(["Social History","Second Heading"],[output, "Lorem ipsum dolor sit amet"]);
    return output;
}

function dateString() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// If submitForm() required, check older commits (removed 16:25 17/01/2024)