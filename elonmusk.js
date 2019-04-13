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