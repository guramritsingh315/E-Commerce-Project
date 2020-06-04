//import { request } from "express";

/*Validating customer form*/

function Cust_validateAndSend(callback){
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
    var cust_form_data = {
        type:"customer",
        name:Cust_name,
        last_name:Cust_last_name,
        email:Cust_email,
        phone:Cust_phone_number,
        address:Cust_address,
        password:pwd2,
    };
     request.open('POST','/customerData');
     request.send(JSON.stringify(cust_form_data));
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
    var request= new XMLHttpRequest();
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
    var mer_form_data = {
        type:"merchant",
        name:mer_name,
        last_name:mer_last_name,
        email:mer_email,
        phone:mer_phn_num,
        company:company_name,
        address:mer_address,
        password:mpwd2,
    };
    request.open('POST','/merchantData');
    request.send(JSON.stringify(mer_form_data));
    return true;
}

function openSignup(){
    var request = new XMLHttpRequest;
    request.open('GET','/signup');
    request.send();
}