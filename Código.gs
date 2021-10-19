function doGet() {
   return HtmlService.createTemplateFromFile('index.html').evaluate();
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function buscarActualizacion(version){
var libro=SpreadsheetApp.openById('vQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg1ucSZ');
  var hoja=libro.getSheetByName('update');
  var versionNew = hoja.getRange(2,1).getValue();
  var result = (version == versionNew)
  return result;
}

function buscarVersion(){
var libro=SpreadsheetApp.openById('vQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg1ucSZ');
  var hoja=libro.getSheetByName('update');
  var versionNew = hoja.getRange(2,1).getValue();
  return versionNew;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function arrToObj(arr,key,value){
  var res = {};
  for(row of arr){
    res[row[key]] = row[value];
  }
return res;
}

function cargarDatos(){
  var libro=SpreadsheetApp.openById('1ucSZvQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg');
  var hoja=libro.getSheetByName('Contenedor');
  var NoF=hoja.getLastRow();
  var registros=hoja.getRange(2,2,NoF,4).getValues();
  return arrToObj(registros,0,3);
}

function sendConsulta(form){
  var registro = [[new Date(),form.sn_unidad.toUpperCase().trim(),form.emp_no.trim(),form.familia.toUpperCase(),form.reparacion.toUpperCase(),form.detalle.toUpperCase(),form.nombre,form.correo]];
  var libro=SpreadsheetApp.openById('1ucSZvQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg');
  var hoja=libro.getSheetByName('Contenedor');
  var NoF=hoja.getLastRow();
  var NoFMAX=hoja.getMaxRows();
  hoja.getRange(NoF+1, 1,1,8).setValues(registro);
  hoja.getRange(1,9).copyTo(hoja.getRange(NoF+1,9));
  if((NoFMAX-NoF)<=50) hoja.insertRowsAfter(NoF+2,1000);
}

function consultar_empleados(){
  var libro=SpreadsheetApp.openById('1ucSZvQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg');
  var hoja_empleados=libro.getSheetByName('Empleados');
  var NoF_empleados=hoja_empleados.getLastRow();
  var registros_empleados=hoja_empleados.getRange(2,1,NoF_empleados,3).getValues();
  return  [arrToObj(registros_empleados,0,2),arrToObj(registros_empleados,0,1)];
}

function enviarMensaje(form){
  var mensaje = form.mensaje_texto;
  var remitente = form.remitente;
  var titulo = form.titulo;
  switch(titulo){
    case "1": titulo="Reporte de falla";
      break;
      case "2": titulo="Sugerencia";
      break;
      case "3": titulo="Agradecimiento";
      break;
      default:;
      break;
  }
  GmailApp.sendEmail("jose.inzunza@example.com", "[Nuevo mensaje SICURE] "+titulo+" de "+remitente, mensaje);
  }

function regemp_enviarDatos(form){
  var version="2.0";
  var ER=true;
  var ER2=true;
  var yy_out=new Date().getFullYear()-2000;
  var emp_no = form.emp_no;
  var nombre = form.nombre.toUpperCase();
  var tipo = form.tipo;
  if (tipo == "repa"){
  var correo = "jose.inzunza@example.com";
    var registro = [[emp_no,nombre,correo,tipo]];
  var libro=SpreadsheetApp.openById('1ucSZvQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg');
  var hoja=libro.getSheetByName('Empleados');
  var NoF=hoja.getLastRow();
  var registros=hoja.getRange(2,1,NoF,1).getValues();
  for(var i=0;i<=registros.length-1;i++){
    if (registros[i][0]==registro[0][0]){
      //hoja.deleteRow(i+2);
      hoja.getRange(i+2,1,1,4).setValues(registro);
      ER = false;
      break;
    }
  }
   if(ER) hoja.getRange(NoF+1,1,1,4).setValues(registro);
  if(tipo!='repa'){
  var asunto=nombre+" Bienvenid@ a SICURE.";
  var body="Hola <B>"+nombre+"</B> Tu registro ha sido satisfactorio. A partir de ahora recibirás correos del sistema SICURE en los siguientes casos:<BR>-Unidad lista<BR>-Contenedor lleno<BR>-Unidades con tiempo exedente<BR>-Reporte de reparaciones<BR><BR>Favor de reportar cualquier anomalía al correo jose.inzunza@example.com GRACIAS!<br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
  GmailApp.sendEmail(correo, asunto,"",{htmlBody:body ,name:"SICURE"});
  }
  return registro[0][1];
   
  }else {
    var correo = form.correo.toLowerCase();
    var a = Math.random()*(500-1);
    var b = Math.random()*(5-1);
    var ext = Math.floor(Math.pow(a,b));
    var ext2 = new Date().getTime();
    var regid = "1"+ext+ext2+"cienaoptical";
  var registro = [[regid,emp_no,nombre,correo,tipo]];
  var registro2 = [[emp_no,nombre,"under_validation@example.com",tipo]];
  var libro=SpreadsheetApp.openById('Cyo0bsABPiAOhv7AW-ARvtG5PpUygwYIN8HQGogM1EpG'); //libro validaciones
  var libro2=SpreadsheetApp.openById('vQvz4ibi9nVC6PdEBTGMYZQpT2DbvJ9ygXpnHQg1ucSZ'); //libro base de datos
  var hoja=libro.getSheetByName('validaciones');
  var hoja2=libro2.getSheetByName('Empleados');
  var NoF=hoja.getLastRow();
  var NoF2=hoja2.getLastRow();
  var registros=hoja.getRange(2,1,NoF,1).getValues();
  for(var i=0;i<=registros.length-1;i++){
    if (registros[i][1]==registro[0][1]){
      //hoja.deleteRow(i+2);
      hoja.getRange(i+2,1,1,5).setValues(registro);
      ER = false;
      break;
    }
  }
   if(ER) hoja.getRange(NoF+1,1,1,5).setValues(registro);
    
    var registros2=hoja.getRange(2,1,NoF2,1).getValues();
  for(var x=0;x<=registros2.length-1;x++){
    if (registros2[x][0]==registro2[0][0]){
      //hoja.deleteRow(i+2);
      hoja2.getRange(x+2,1,1,4).setValues(registro2);
      ER2 = false;
      break;
    }
  }
   if(ER2) hoja2.getRange(NoF2+1,1,1,4).setValues(registro2);
    
    var url = "https://script.google.com/a/example.com/macros/s/AKfycbwHBblMSVnIG_3UL5Sivt-uWBz0z2NXGyEgZsMhB93SlCTfbFRj/exec?regid="+regid+"&emp_no="+emp_no;

    var asunto= "[SICURE] "+nombre+" Confirma tu dirección de correo aqui.";
    var body="<div style='font-family:sans-serif;'><p style='font-size:140%; padding:5px 20px'>Hola <B style='color:#006699'>"+nombre+"</B>. Tu registro está casi completo.</p> <p style='color:#006699;font-size:125%; padding:5px 30px'>Haz click en el siguiente enlace para confirmar tu direccion de correo electronico: <a href='"+url+"'>"+url+"</a></p><p style='font-size:125%;padding:5px 20px'>Ingresa al vínculo y espera el mensaje de confirmación en la página.<br>Nota: Por favor no respondas este mensaje.</p><br><p style='font-size:75%;padding: 5px 20px;text-align:left'>RegEntrada</p></div>";
  GmailApp.sendEmail(correo, asunto,"",{htmlBody:body ,name:"SICURE"});
  return registro[0][2];
        }
}
