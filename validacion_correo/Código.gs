function doGet(e) {
  var params = JSON.stringify(e);
  return HtmlService.createTemplate("<?!= include('head'); ?><script>var hola = "+params+";console.log("+params+");var regId = hola['parameter']['regid'];if(hola['parameter']['emp_no']) var emp_no = hola['parameter']['emp_no']; else var emp_no = 'Desconocido';</script><?!= include('body'); ?>").evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function validar(regId){
  var encontrado = false;
  var resultado = "";
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('validaciones');
  var NoF=hoja.getLastRow();
  var datos = hoja.getRange(1,1,NoF+1,5).getDisplayValues();
  for(var i = 0;i<=datos.length-1;i++){
    if(datos[i][0]==regId) {
      encontrado = true;
      var fila = i;
      var num_emp = datos[i][1];
      var nombre = datos[i][2];
      var correo = datos[i][3];
      var tipo = datos[i][4];
      break;
      }
  }
    if(encontrado){
      var yy_out = "2020";
      var version = "2.1";
      var ER = true;
      var registro = [[num_emp,nombre,correo,tipo]];
      var libro2=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja2=libro2.getSheetByName('Empleados');
  var NoF=hoja2.getLastRow();
  var registros=hoja2.getRange(2,1,NoF,1).getValues();
  for(var i=0;i<=registros.length-1;i++){
    if (registros[i][0]==registro[0][0]){
      //hoja.deleteRow(i+2);
      hoja2.getRange(i+2,1,1,4).setValues(registro);
      ER = false;
      break;
    }
  }
      if(ER) hoja2.getRange(NoF+1,1,1,4).setValues(registro);
        var asunto=nombre+" Bienvenid@ a SICURE.";
      var style = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">';
      var body=style+"<div class='mx-auto'><p class='h4'>Hola <B>"+nombre+"</B> Tu registro ha sido satisfactorio.</p><p class='h5'>A partir de ahora recibirás correos del sistema SICURE en los siguientes casos:<ul><li>Unidad lista<li>Contenedor lleno<li>Unidades con tiempo exedente<li>Reporte de reparaciones</ul><BR>Favor de reportar cualquier anomalía al correo jose.inzunza GRACIAS!</p><br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
  
  GmailApp.sendEmail(correo, asunto,"",{htmlBody:body ,name:"SICURE"});
      
   
      
      hoja.getRange(fila+1,1,1,5).clear();
      return nombre;
    }else  throw new Error("No se ha encontrado la validación para este empleado, probablemente ya se encuentra confirmado. ");
 
}
