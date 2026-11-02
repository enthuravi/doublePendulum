document.addEventListener('resize',(e)=>{e.preventDefault();})
var rating= document.getElementById("rating");
let r=20;
let sr= ((Math.sin(Math.PI/5)*r*2)*Math.cos(Math.PI/5)-(Math.sin(Math.PI/5)*r)/Math.cos(Math.PI/5))/Math.sin(Math.PI/5);
function rate(num){
while(rating.childElementCount!=0){
    rating.removeChild(rating.firstChild)
}
for(let i=0; i<5; i++){
let star=document.createElement("canvas");
star.width="100"; star.height="100";
let context= star.getContext("2d");
context.scale(2,2);
if(i<=num){context.fillStyle="gold"}
else{context.fillStyle="rgba(0,0,0,0.0)"}
context.beginPath();
context.lineJoin='round';
for(let k=0; k<5; k++){
context.save();
context.translate(25,25)
context.rotate(k*Math.PI/5*2)
context.lineTo(sr*Math.sin(Math.PI/-5),sr*Math.cos(Math.PI/5)*-1)
context.lineTo(0,-1*r)
context.lineTo(sr*Math.sin(Math.PI/5),sr*Math.cos(Math.PI/5)*-1)
context.restore();
}
context.closePath();
context.fill();
context.stroke();
star.classList.add('child');
rating.appendChild(star);
}
}

var src;
var prof = document.querySelectorAll('.profile')[0];
  var canvas= prof.querySelector('canvas');
  var ctx= canvas.getContext('2d');

function draw(){
  var upload = document.querySelector('input[type=file]').files[0]
  if(!!upload){
  let source = URL.createObjectURL(upload)
  var img = new Image;
  img.src=source;
  console.log('Source',src)}
  else{var img = new Image; img.src='./avatar.png'
  console.log(img)}
  img.onload=function(){
  ctx.drawImage(img,0,0,128,128);
  src = canvas.toDataURL('image/png')};
}
draw();

prof.addEventListener('click',(e)=>{
if(e.target.classList.value=='profile'){
  document.querySelector('input[type=file]').click();
}
})

var name="Anonymous", email="Anonymous",thoughts;
let name_input = document.querySelector('input[type=text]');
let email_input = document.querySelector('input[type=email]');
let thoughts_input = document.querySelector('textarea');
function update(){
  if(name_input.value){name=name_input.value}else{name="Anonymous"}
  if(email_input.value){email=email_input.value}else{email="Anonymous"}
  if(thoughts_input.value){thoughts=thoughts_input.value}else{thoughts=''}
}
var index=-1;
rate(-1);

rating.addEventListener('click',(e)=>{
if(e.target.classList.contains('child')){
index=0
sibling=e.target.previousElementSibling
while (sibling){
index++;
sibling=sibling.previousElementSibling}
rate(index)
console.log(index)}
})

var submit=async(e)=>{
if(index<0){
  alert("Select a valid star rating")
  return;
}
const data = {
        name: name,
        email: email,
        rating:index+1,
        feedback:thoughts,
        profile: src
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycbwEzWQYFhP9-pGVmGqts9WrAkELHi9I0u2qjisRGznFwIicUDKNPuJgFJqOATio6KNFQg/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      alert("Form submitted successfully!");
}

var ratings=[];

async function loadSpreadsheetData(){
  try{
    const response = await fetch('https://script.google.com/macros/s/AKfycbwEzWQYFhP9-pGVmGqts9WrAkELHi9I0u2qjisRGznFwIicUDKNPuJgFJqOATio6KNFQg/exec',{
      method: 'GET',
      redirect:"follow"
    });
    const result = await response.json();

    if(result.status ==="success"){ratings = result.data; display();}
    else{console.log("Error")}

  }
  catch(error){
    console.log("Fetch error:",error);
  }
}

loadSpreadsheetData();

//=====================responses==================
var star_total=[]
function display(){
  star_total=[]
document.querySelectorAll('.responses')[0].innerHTML='';
ratings.forEach((i)=>{
  var feed = document.createElement("div");
  feed.setAttribute("class",'feed');
  
  var header = document.createElement('div');
  header.setAttribute('class','feed-header');
  feed.appendChild(header)

  var profile = new Image;
  profile.src=i.Profile;
  header.appendChild(profile)
  
  var name = document.createElement('p');
  name.innerHTML = i.Name;
  header.appendChild(name)

  var stars = document.createElement('div');
  stars.innerHTML='&starf;'.repeat(i.Rating)
  header.appendChild(stars);

  var feedback = document.createElement("div");
  feedback.setAttribute('class','message');
  feedback.innerHTML=i.Feedback;
  feed.appendChild(feedback)

  document.querySelectorAll('.responses')[0].appendChild(feed);
  star_total.push(i.Rating);
})
}