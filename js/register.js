const pwInput  = document.getElementById('password');
const segs     = document.querySelectorAll('.strength-seg');
const strengthLabel = document.getElementById('strengthLabel');

function scorePassword(pw){
    let score = 0;
    if(pw.length>=8) score++;
    if(pw.length>=12) score++;
    if(/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if(/[0-9]/.test(pw)) score++;
    if(/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(4, score);
}

const colors = ['#e74c3c','#e67e22','#f1c40f','#27ae60'];
const labels = ['Weak','Fair','Good','Strong'];

function updateStrength(){
    const pw = pwInput.value;
    const score = pw.length===0 ? 0 : scorePassword(pw);
    segs.forEach((seg,i)=>{
        seg.style.background = i<score ? colors[score-1] : '#e8e8e8';
    });
    strengthLabel.textContent = pw.length===0 ? 'Strength level' : labels[score-1]||'Weak';
    strengthLabel.style.color = pw.length===0 ? '#aaa' : colors[score-1];
}

pwInput.addEventListener('input', updateStrength);
// Run once on page load to show strength bar
updateStrength();

// Show/hide course & department based on role
const roleSelect = document.getElementById('role');
const courseField = document.getElementById('courseField');
const departmentField = document.getElementById('departmentField');

roleSelect.addEventListener('change',()=>{
    if(roleSelect.value==='student'){
        courseField.style.display='block';
        departmentField.style.display='none';
    } else if(roleSelect.value==='teacher'){
        courseField.style.display='none';
        departmentField.style.display='block';
    } else{
        courseField.style.display='none';
        departmentField.style.display='none';
    }
});

// Client-side validation
const fields = ['name','email','password','role','campus','course','department']
    .map(id=>document.getElementById(id));

document.getElementById('regForm').addEventListener('submit',function(e){
    let allValid=true;
    fields.forEach(el=>{
        if(el && el.offsetParent!==null){ // only visible
            if(el.value.trim()===''){
                el.classList.add('invalid');
                allValid=false;
            } else {
                if(el.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)){
                    el.classList.add('invalid');
                    allValid=false;
                } else {
                    el.classList.remove('invalid');
                }
            }
        }
    });
    if(!allValid)e.preventDefault();
});