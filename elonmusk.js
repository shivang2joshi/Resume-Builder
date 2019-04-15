function AddSkill3(){
    var skillset = document.getElementById('skillset');
    var skill = document.getElementById('inputskill').value;

    skillset.innerHTML += '<span class="skill">'+skill+'</span>';
}
function Addinterest3(){
    var interestset = document.getElementById('interestset');
    var interest = document.getElementById('inputinterest').value;

    interestset.innerHTML += '<span class="interest">'+interest+'</span>';
}

var workexperienceformat=
'<div class="row"><div class="row side-design-2"><h4 id="position-name" class="w-100" contenteditable="true" onclick="selectAll()"><b>Role at the Company</b></h4><h5 id="company" contenteditable="true" onclick="selectAll()">Company Name</h5><div class="space-between text-12"><span id="work-time" class="color-1" contenteditable="true" onclick="selectAll()"><i>06/2002-Present</i></span><span id="work-location" class="color-1" contenteditable="true" onclick="selectAll()"><i>Company Location</i></span></div></div><div class="pl-75  text-12"><span class="color-1"><i>Accomplishments</i></span><ul class="accomplishments" contenteditable="true" onclick="selectAll()"><li>List of accomplishments here...</li></ul></div></div>';

function addWork(){
    var lastrowindex = document.getElementById('work-experience').rows.length - 1;
    var newrow = document.getElementById('work-experience').insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.innerHTML = workexperienceformat;
}

function removeWork(){
    var workexp =document.getElementById('work-experience');
    var lastrowindex = workexp.rows.length - 2;
    workexp.deleteRow(lastrowindex);
    
}