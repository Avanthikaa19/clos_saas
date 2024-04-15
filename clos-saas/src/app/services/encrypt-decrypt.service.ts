import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AUTHENTICATED_USER } from './jwt-authentication.service';
@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {
// SET A SECRET KEY TO ENCODE AND DECODE DATA
  encryptSecretKey:string = 'A$B%J#Sr@$^@D*1T5R!M';
  constructor() { }

  //METHOD TO ENCRYPT ORIGINAL DATA TO ENCRYPTED DATA FORMAT
  encryptData(data: any):any{
    try {
      if(data){
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();}
    } catch (e) {
      console.log(e);
    }
  }
  
  //METHOD TO DECRYPT ENCRYPTED DATA TO ORIGINAL DATA FORMAT
  decryptData(data) {
    try {
      if(data){
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }}
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  //METHOD TO GET AC ITEMS DATA AND DECRPT IT TO GET ORIGINAL DATA
  getACItemsFromSession(){
    let accessItems:any={}
    let acItem:any=sessionStorage.getItem('AC')
      try{
      if(acItem){
        let encryptAccess=this.decryptData(acItem) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
        // if(typeof encryptAccess =='object'){
        acItem = JSON.parse(encryptAccess);  // CONVERT DECRYPTED STRING JSON TO JSON FORMAT
        let user=sessionStorage.getItem(AUTHENTICATED_USER) //GET LOGINED USER
        user=this.decryptData(user)
        //TO AVOID MALICIOUS ACTION CHECK LOGIN USER AND ENCRYPTED DATA LOGIN USER SAME
        if(user===acItem.loginUser){
          accessItems=acItem.accessItems
        }
      }}
    // }
    catch(error){
      console.log(error);
    }
    return accessItems
  }
  //METHOD TO GET AC SUPER DATA AND DECRPT IT TO GET ORIGINAL DATA
  getACSuperFromSession(){
   let acSuper:any=sessionStorage.getItem('AC_SUPER')
   try{
    if(acSuper){
      acSuper=this.decryptData(acSuper)
      if(acSuper==='TsSupERUserValId'){
        acSuper=true;
      }
      else{
        acSuper=false;
      }
    }
  }
  catch(error){
    console.log(error);
  }
      return acSuper
}

  //METHOD TO GET PROFILE DATA AND DECRPT IT TO GET ORIGINAL DATA
getProfileFromSession(){
  let profile:any=sessionStorage.getItem('userProfile')
  let profileData:any
try{
  if(profile){
    profileData = JSON.parse(this.decryptData(profile));
  }
}
catch(error){
  console.log(error);
}
  return profileData
}

  //METHOD TO GET RADAR ITEMS DATA AND DECRPT IT TO GET ORIGINAL DATA
getRadarFromSession(){
  let radarItems:any=null;
  try{
    let radarItem:any=sessionStorage.getItem('radarItems')
    radarItems = JSON.parse(this.decryptData(radarItem));
  }
  catch(error){
    console.log(error);
  }
  return radarItems
}
}


