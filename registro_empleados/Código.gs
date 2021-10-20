function doGet() {
    return HtmlService.createTemplateFromFile('index.html').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
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
  var correo = "alfredo.inzunza@gmail.com";
    var registro = [[emp_no,nombre,correo,tipo]];
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
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
  var body="Hola <B>"+nombre+"</B> Tu registro ha sido satisfactorio. A partir de ahora recibirás correos del sistema SICURE en los siguientes casos:<BR>-Unidad lista<BR>-Contenedor lleno<BR>-Unidades con tiempo exedente<BR>-Reporte de reparaciones<BR><BR>Favor de reportar cualquier anomalía al correo jose.inzunza@sanmina.com GRACIAS!<br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
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
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('validaciones');
  var hoja2=libro.getSheetByName('Empleados');
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
    
    var url = "https://script.google.com/macros/s/AKfycbyTrlwIzI40v7rJJ-dTYPSc63_0ZNR1Z-Sz_3C4TU7xCJw2Y6Kzc2k613Cw3BiTAYhC/exec?regid="+regid+"&emp_no="+emp_no;
    var asunto= "[SICURE] "+nombre+" Confirma tu dirección de correo aqui.";
  //var body="Hola <B>"+nombre+"</B> Tu registro ha sido satisfactorio. A partir de ahora recibirás correos del sistema SICURE en los siguientes casos:<BR>-Unidad lista<BR>-Contenedor lleno<BR>-Unidades con tiempo exedente<BR>-Reporte de reparaciones<BR><BR>Favor de reportar cualquier anomalía al correo jose.inzunza GRACIAS!<br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
    var body="<div style='font-family:sans-serif;'><p style='font-size:140%; padding:5px 20px'>Hola <B style='color:#006699'>"+nombre+"</B>. Tu registro está casi completo.</p> <p style='color:#006699;font-size:125%; padding:5px 30px'>Haz click en el siguiente enlace para confirmar tu direccion de correo electronico: <a href='"+url+"'>"+url+"</a></p><p style='font-size:125%;padding:5px 20px'>Ingresa al vínculo y espera el mensaje de confirmación en la página.<br>Nota: Por favor no respondas este mensaje.</p><br><p style='font-size:75%;padding: 5px 20px;text-align:left'>RegMDS</p></div>";
    GmailApp.sendEmail(correo, asunto,"",{htmlBody:body ,name:"SICURE"});
    return registro[0][2];
        }
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
  GmailApp.sendEmail("jose.inzunza@sanmina.com", "[Nuevo mensaje SICURE] "+titulo+" de "+remitente, mensaje);
  }
