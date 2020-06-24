//const { Document } = require("mongoose");

function Cust_validateAndSend(){
   var request = new XMLHttpRequest();
    var Cust_name = document.getElementById('Cust-name').value.trim();
    var Cust_last_name= document.getElementById('Cust_last_name').value.trim();
    var Cust_email=document.getElementById('Cust_email').value.trim();
    var Cust_phone_number=document.getElementById('Cust_phone_number').value.replace(/\s+/g, '');
    var Cust_address=document.getElementById('Cust_address').value.trim();
    var pwd1=document.getElementById('pwd1').value;
    var pwd2=document.getElementById('pwd2').value;
    var phn_err=document.getElementById('phone_err');
    var pass_err = document.getElementById('pass_err');
   
    if(Cust_phone_number.length > 10){
        //alert("Number could not be greater than 10 digits");
        phn_err.innerHTML = "*Number could not be greater than 10 digits";
        return false;
    } 
    if(Cust_phone_number.length===10){
        phn_err.innerHTML="";
        Cust_phone_number= Number(Cust_phone_number);
    }
     if(Cust_phone_number.length<10){
        phn_err.innerHTML = "*Number should be atleast of 10 digits";
        return false;
    }
    if(isNaN(Cust_phone_number)){
        phn_err.innerHTML = "*This field can only contain numeric values";
        return false;
    }
     if(pwd1!==pwd2){
        pass_err.innerHTML = "Passwords do not match!!";
        return false;
    }
    else if(pwd1===pwd2){
        pass_err.innerHTML = "";
    }    
     return true;
}

//capatializes first letter
function capitalize(textboxid, str) {
    // string with alteast one character
    if (str && str.length >= 1)
    {       
        var firstChar = str.charAt(0);
        var remainingStr = str.slice(1);
        str = firstChar.toUpperCase() + remainingStr;
    }
    document.getElementById(textboxid).value = str;
}
/*merchant form validation*/
function merc_validateAndSend(){
    var mer_name=document.getElementById('Mer_name').value.trim();
    var mer_last_name=document.getElementById('Mer_last_name').value.trim();
    var mer_email=document.getElementById('Mer_email').value.trim();
    var mer_phn_err=document.getElementById('mer_phn_err');
    var pwd_err=document.getElementById('pwd_err');
    var mer_phn_num=document.getElementById('Mer_phone_number').value.replace(/\s+/g, '');
    var company_name=document.getElementById('Company_name').value.trim();
    var mer_address=document.getElementById('Mer_address').value.trim();
    var mpwd1 = document.getElementById('mpwd1').value;
    var mpwd2=document.getElementById('mpwd2').value;
    if(mer_phn_num.length>10){
        mer_phn_err.innerHTML="*Number could not be greater than 10 digits";
        return false;
    }
    if(mer_phn_num.length<10){
        mer_phn_err.innerHTML="*Number should be atleast of 10 digits";
        return false;
    }
    if(mer_phn_num.length===10){
        mer_phn_err.innerHTML="";
    }
    if(isNaN(mer_phn_num)){
        mer_phn_err.innerHTML = "*This field can only contain numeric values";
        return false;
    }
     if(mpwd1!==mpwd2){
        pwd_err.innerHTML = "*Passwords do not match";
        return false;
    }
    if(mpwd1===mpwd2){
        pwd_err.innerHTML="";
    }
    return true;
}
function showPassword(){
    var x = document.getElementById("login_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}
function merchant_req(){
    document.getElementById("user_info").innerHTML = "Displaying: Merchant Record"
    var table = document.getElementById("table_data");
    table.innerHTML="";
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          data = JSON.parse(this.responseText);
          var i=1;
          data.forEach(function(user){
              var tr = document.createElement('tr');
              var no = document.createElement('th');
              no.setAttribute("scope","row");
              var name = document.createElement('td');
              var email = document.createElement('td');
              var phone = document.createElement('td');
              var address = document.createElement('td');
              var action = document.createElement('td');
              var no_data = document.createTextNode(i);
              var name_data = document.createTextNode(user.name+" "+user.lastName);
              var email_data = document.createTextNode(user.email);
              var phone_data = document.createTextNode(user.number);
              var address_data = document.createTextNode(user.address);
              var delete_button = document.createElement('input');
              delete_button.setAttribute("type","button");
              delete_button.setAttribute("class","btn btn-danger");
              delete_button.setAttribute("style","margin:3px 3px 3px 3px;");
              delete_button.setAttribute("value","Delete");
              delete_button.setAttribute("onclick","Cust_delete_record()");
              var edit_button = document.createElement('input');
              edit_button.setAttribute("type","button");
              edit_button.setAttribute("class","btn btn-warning");
              edit_button.setAttribute("value","Edit");
              edit_button.setAttribute("onclick","Cust_edit_record()");
              
              no.appendChild(no_data);
              name.appendChild(name_data);
              email.appendChild(email_data);
              phone.appendChild(phone_data);
              address.appendChild(address_data);
              action.appendChild(delete_button);
              action.appendChild(edit_button);
              tr.appendChild(no);
              tr.appendChild(name);
              tr.appendChild(email);
              tr.appendChild(phone);
              tr.appendChild(address);
              tr.appendChild(action);
              table.appendChild(tr);
              i++;
          })
        }
    }
      
    xhttp.open('GET','/merchant_data');
    xhttp.send();
}
function customer_req(){
    document.getElementById("user_info").innerHTML = "Displaying: Customer Record"
    var table = document.getElementById("table_data");
    table.innerHTML="";
    var xhttp = new XMLHttpRequest;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          data = JSON.parse(this.responseText);
          var i=1;
          data.forEach(function(user){
              var tr = document.createElement('tr');
              var no = document.createElement('th');
              no.setAttribute("scope","row");
              var name = document.createElement('td');
              var email = document.createElement('td');
              var phone = document.createElement('td');
              var address = document.createElement('td');
              var action = document.createElement('td');
              var no_data = document.createTextNode(i);
              var name_data = document.createTextNode(user.name+" "+user.lastName);
              var email_data = document.createTextNode(user.email);
              var phone_data = document.createTextNode(user.number);
              var address_data = document.createTextNode(user.address);
              var delete_button = document.createElement('input');
              delete_button.setAttribute("type","button");
              delete_button.setAttribute("class","btn btn-danger");
              delete_button.setAttribute("style","margin:3px 3px 3px 3px;");
              delete_button.setAttribute("value","Delete");
              delete_button.setAttribute("onclick","Cust_delete_record()");
              var edit_button = document.createElement('input');
              edit_button.setAttribute("type","button");
              edit_button.setAttribute("class","btn btn-warning");
              edit_button.setAttribute("value","Edit");
              edit_button.setAttribute("onclick","Cust_edit_record()");
              
              no.appendChild(no_data);
              name.appendChild(name_data);
              email.appendChild(email_data);
              phone.appendChild(phone_data);
              address.appendChild(address_data);
              action.appendChild(delete_button);
              action.appendChild(edit_button);
              tr.appendChild(no);
              tr.appendChild(name);
              tr.appendChild(email);
              tr.appendChild(phone);
              tr.appendChild(address);
              tr.appendChild(action);
              table.appendChild(tr);
              i++;
          })
        }
    }

    xhttp.open('GET','/customer_data');
    xhttp.send();
}
function Cust_delete_record(){
    console.log("delete record");
}
function Cust_edit_record(){
    console.log("edit record");
}