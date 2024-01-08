console.log("Hi");

function submitForm() {
    var outputString = "";
    // Name
    var name = document.getElementById('name').value;
    outputString += "Your name is " + name + "\n";
    // Age
    var age = document.getElementById('age').value;
    outputString += "You are " + age + " years old\n";
    // Main Problem
    outputString += "Main Problem(s):\n"
    var dizziness = document.getElementById('dizziness').checked;
    console.log(dizziness);
    outputString += dizziness ? "Dizziness\n" : "";
    var imbalance = document.getElementById('imbalance').checked;
    console.log(imbalance);
    outputString += imbalance ? "Imbalance\n" : "";
    
    var earSymptoms = document.getElementById('earSymptoms').checked;
    outputString += earSymptoms ? "Ear Symptoms\n": "";
    outputString += "\n";
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