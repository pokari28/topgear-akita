const state={
  step:0,
  region:"",
  insurance:"",
  trouble:[],
  location:""
};

const phoneMap={
  "秋田市":{office:"秋田営業所",phone:"018-827-4945"},
  "能代市":{office:"能代営業所",phone:"0185-53-4951"},
  "横手市":{office:"横手営業所",phone:"0182-32-4955"},
  "湯沢市":{office:"湯沢営業所",phone:"0183-56-7155"},
  "大仙市":{office:"大仙営業所",phone:"0187-73-7550"},
  "新庄市":{office:"新庄営業所",phone:"0233-25-4911"}
};

const qs=[...document.querySelectorAll(".question")];
const prog=[...document.querySelectorAll(".progress span")];
const next=document.getElementById("next");
const back=document.getElementById("back");
const result=document.getElementById("resultBox");

function render(){
  qs.forEach((q,i)=>q.classList.toggle("active-question",i===state.step));
  prog.forEach((p,i)=>p.classList.toggle("active",i<=state.step));
  back.disabled=state.step===0;
  next.textContent=state.step===3?"確認して電話へ →":"次へ進む →";
}

function updateCall(){
  const info=phoneMap[state.region];
  const call=document.getElementById("callLink");
  const office=call.querySelector("small");
  const number=call.querySelector("b");
  if(info){
    office.textContent=info.office;
    number.textContent=info.phone;
    call.href="tel:"+info.phone.replace(/-/g,"");
  }else{
    office.textContent="担当窓口";
    number.textContent="地域を選択してください";
    call.removeAttribute("href");
  }
}

function setSelected(sel, clicked){
  document.querySelectorAll(sel).forEach(x=>x.classList.remove("selected"));
  clicked.classList.add("selected");
}

document.querySelectorAll("[data-region]").forEach(b=>{
  b.addEventListener("click",()=>{
    setSelected("[data-region]",b);
    state.region=b.dataset.region;
    updateCall();
  });
});

document.querySelectorAll("[data-insurance]").forEach(b=>{
  b.addEventListener("click",()=>{
    setSelected("[data-insurance]",b);
    state.insurance=b.dataset.insurance;
  });
});

document.querySelectorAll("[data-trouble]").forEach(b=>{
  b.addEventListener("click",()=>{
    const value=b.dataset.trouble;
    if(state.trouble.includes(value)){
      state.trouble=state.trouble.filter(x=>x!==value);
      b.classList.remove("selected");
    }else{
      state.trouble.push(value);
      b.classList.add("selected");
    }
  });
});

next.addEventListener("click",()=>{
  if(state.step===0 && !state.region){
    alert("地域を選択してください");
    return;
  }
  if(state.step===1 && !state.insurance){
    alert("保険について選択してください");
    return;
  }
  if(state.step===2 && state.trouble.length===0){
    alert("トラブル内容を1つ以上選択してください");
    return;
  }
  if(state.step<3){
    state.step++;
    render();
    return;
  }
  state.location=document.getElementById("location").value.trim();
  document.getElementById("tagRegion").textContent=state.region || "地域未選択";
  document.getElementById("tagInsurance").textContent=state.insurance || "保険未選択";
  document.getElementById("tagTrouble").textContent=state.trouble.length ? state.trouble.join("・") : "トラブル未選択";
  const info=phoneMap[state.region];
  if(info){
    const call=document.getElementById("callLink");
    call.href="tel:"+info.phone.replace(/-/g,"");
    call.querySelector("small").textContent=info.office;
    call.querySelector("b").textContent=info.phone;
  }
  result.classList.add("show");
  result.scrollIntoView({behavior:"smooth",block:"center"});
});

back.addEventListener("click",()=>{
  if(state.step>0){
    state.step--;
    render();
  }
});

document.getElementById("restart").addEventListener("click",()=>{
  state.step=0;
  state.region="";
  state.insurance="";
  state.trouble=[];
  state.location="";
  document.getElementById("location").value="";
  document.querySelectorAll(".selected").forEach(x=>x.classList.remove("selected"));
  result.classList.remove("show");
  updateCall();
  render();
});

document.querySelectorAll("[data-area]").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll("[data-area]").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    const area=b.dataset.area;
    const box=document.getElementById("areaResult");
    const info=phoneMap[area];
    if(info){
      box.innerHTML=`${area}：<strong>${info.phone}</strong>　<a href="tel:${info.phone.replace(/-/g,"")}" style="color:#0b63ce">電話する →</a>`;
    }
  });
});

document.getElementById("lineBtn").addEventListener("click",()=>{
  alert("正式なLINE URL・QRコードを設定すると、ここから接続できます。");
});

updateCall();
render();
