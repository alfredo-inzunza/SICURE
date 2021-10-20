function doGet() {
  return HtmlService.createTemplateFromFile('index.html').evaluate();
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function buscarActualizacion(version){
var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('update');
  var versionNew = hoja.getRange(1,1).getValue();
  var result = (version == versionNew)
  return result;
}

function buscarVersion(){
var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('update');
  var versionNew = hoja.getRange(1,1).getValue();
  return versionNew;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);

}

function consultar_empleados(){
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja_empleados=libro.getSheetByName('Empleados');
  var NoF_empleados=hoja_empleados.getLastRow();
  var registros_empleados=hoja_empleados.getRange(2,1,NoF_empleados,3).getValues();
  return registros_empleados;
}

function sendConsulta(){
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('Contenedor');
  var NoF=hoja.getLastRow();
  if(NoF>1) {
  var registros=hoja.getRange(2,1,NoF-1,9).getValues();
  for(var i=0;i<=registros.length-1;i++){
    registros[i][0]=registros[i][1]+" - "+registros[i][3]+" :  [ "+registros[i][4]+" "+registros[i][5]+" ]   [ "+registros[i][6]+" ]";
    registros[i].splice(1,8);
  }
  return registros;
  }else  throw new Error("Actualmente no hay unidades registradas. Intenta mas tarde."); 
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
  GmailApp.sendEmail("alfredo.inzunza@gmail.com", "[Nuevo mensaje SICURE] "+titulo+" de "+remitente, mensaje);
  }

function eliminarRegistro(form){
  var libro=SpreadsheetApp.openById('1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4');
  var hoja=libro.getSheetByName('Contenedor');
  var hoja_supers = libro.getSheetByName("Supers");
  var database=libro.getSheetByName('Database');
  var PERMITIR_REG = true;
  var retry = false;
  var version = "v2.0";
  var fechaout = new Date();
  var yy_out = fechaout.getFullYear()-2000;  
  var ONE_DAY = 1000 * 60 * 60 * 24;
  var fecha1 = new Date(1899,11,30).getTime();
  var fecha2 = fechaout.getTime();
  var difference_ms = Math.abs(fecha1 - fecha2);
  var datevalue = (difference_ms/ONE_DAY);
  var strings = form.unidades.split("*");
  var serial = strings[0];
  var reparacion = strings[1];
  var ER=true;
  var nombre = form.nombre;
  var rep = form.emp_no;
  var detalle = form.detalle;
  var no = form.reparada;
  var laser = form.laser;
  var medicion = form.medicion;
  var conteo_super = hoja_supers.getRange(1,8).getValue();
  var correo_turno=hoja_supers.getRange(2,8,conteo_super).getDisplayValues();
  var conteo_superx = hoja_supers.getRange(1,13).getValue();
  var NoF=hoja.getLastRow();
  var MAX = database.getMaxRows();
  var NoFDB=database.getLastRow()+1;
  if(PERMITIR_REG){
  var seriales=hoja.getRange(2,2,NoF-1,4).getValues();
  for(var i=0;i<=seriales.length-1;i++){
    if(seriales[i][0]==serial&&seriales[i][3]==reparacion){
      //SpreadsheetApp.flush();
      var registro=hoja.getRange(i+2,1,1,9).getValues();
      registro[0].push(rep);
      registro[0].push(nombre);
      //hoja.getRange(i+2,10).setValue(rep);
      //hoja.getRange(i+2,11).setValue(nombre);
      //
      //Utilities.sleep(10);
      //var registro=hoja.getRange(i+2,1,1,9).getValues();
      /*for(var y=6;y<=10;y++){
        if(registro[y]=='') retry= true;
      }
      if(retry){
        Utilites.sleep(200);
        var mensaje = registro;
        registro=hoja.getRange(i+2,1,1,11).getValues();
        GmailApp.sendEmail("alfredo.inzunza@gmail.com","Error en registro",mensaje+" "+registro);
      }*/
      registro[0].push(detalle);
      registro[0].push(no);
      registro[0].push(fechaout);
      registro[0].push(datevalue);
      registro[0].push(laser);
      registro[0].push(medicion);
      database.getRange(NoFDB,1,1,registro[0].length).setValues(registro);
     
      ER=false;
      var hh = registro[0][0].getHours();
      var mm = registro[0][0].getMinutes();
      if(hh<10) hh='0'+hh;
      if(mm<10) mm='0'+mm;
      
      if(registro[0][3]=="DEIMOS") var deimos = "<br>¿Se realizó ensamble de Laser?: <b>"+laser.toUpperCase()+"</b><br>¿Se tomó medición con Multimetro después del ensamble de Laser?: <b>"+medicion.toUpperCase()+"</b><br>";
      else var deimos = "";
      
      var body="Hola <B>"+registro[0][6]+"</B><BR> Te informamos que tu unidad <b>"+registro[0][1]+" - "+registro[0][3]+"</b> que llevaste a reparar por <b>"+registro[0][4]+" "+registro[0][5]+"</b> está lista."+deimos+"<BR>Hora de entrada: <b>"+hh+":"+mm+"Hrs</b><br>Tiempo en minutos: <b>"+registro[0][8]+" Minutos</b><br>Reparador: <b>"+registro[0][10]+"</b><br>Comentarios: <b>"+registro[0][11]+"</b><br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
          var asunto="Tu unidad: "+registro[0][1]+" está lista";
          if(registro[0][7]=="alfredo.inzunza@gmail.com"){
            registro[0][7]=correo_turno;
            asunto="Usuario no registrado. Unidad "+registro[0][1]+".";
            body="Hola, la persona <B>"+registro[0][6]+"</B> no se encuentra registrada en el sistema SICURE, favor de dar de alta en el <a href=\"https://sites.google.com/a/sanmina.com/sicure/registro-usuario\">Formulario de Registro de Empleados</a> para que reciba proximas notificaciones<br><br>Unidad <b>"+registro[0][1]+" - "+registro[0][3]+"</b><br>Reparación <b>"+registro[0][4]+" "+registro[0][5]+"</b><BR>Hora de entrada: <b>"+hh+":"+mm+"Hrs</b><br>Tiempo en minutos: <b>"+registro[0][8]+"</b><br>Reparador: <b>"+registro[0][10]+"</b><br>Comentarios: <b>"+registro[0][11]+"</b><br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
          }
           if(registro[0][12]=="no"&&registro[0][7]!="alfredo.inzunza@gmail.com"){
            asunto="Tu unidad: "+registro[0][1]+" No fue reparada.";
            body="Hola <B>"+registro[0][6]+"</B><BR> Te informamos que tu unidad <b>"+registro[0][1]+" - "+registro[0][3]+"</b> que llevaste a reparar por <b>"+registro[0][4]+" "+registro[0][5]+"</b> no pudo ser reparada."+deimos+"<br>Los siguientes comentarios fueron agreados: \""+registro[0][11]+"\".<BR>Hora de entrada: <b>"+hh+":"+mm+"Hrs</b><br>Tiempo en minutos: <b>"+registro[0][8]+"</b><br>Reparador: <b>"+registro[0][10]+"</b><br>Comentarios: <b>"+registro[0][11]+"</b><br><br><br><br>--------<br>All rights reserved 20"+yy_out+"<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble";
          }
      //GmailApp.sendEmail(registro[0][7], asunto+" - MENSAJE DE PRUEBA","",{htmlBody:body ,name:"SICURE"});
      hoja.deleteRow(i+2);
      try{
        if(registro[0][7]!="under_validation@example.com") GmailApp.sendEmail(registro[0][7], asunto,"",{htmlBody:body ,name:"SICURE"});
      }
      catch(e){
        GmailApp.sendEmail("alfredo.inzunza@gmail.com", "Error en Eliminar registro","Ocurrió un error al enviar el correo "+e);
      }
      /*finally{
      }*/
      break;
    }
    
  }
  if(MAX-NoFDB<=50) database.insertRowsAfter(NoFDB+2, 1000);
  if(ER) throw new Error("Atención, el serial "+serial+" posiblemente ya fue removido por otro usuario."); 
  }
  if(!PERMITIR_REG) throw new Error("No ha sido posible remover el serial "+serial+", por favor intenta de nuevo en un momento."); 
  if(NoFDB%100==0){
    try{
    important.generarregId();
    }
    catch(e){
      GmailApp.sendEmail("alfredo.inzunza@gmail.com", "Error en Generar ID", "Error:"+e) ;
    }
  }
}


function ReporteNew(){
  var libro = SpreadsheetApp.openById("1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4");
  var version="v2.0";
  var hoy = new Date();
  var hh = hoy.getHours();
  if(hh<10)hh='0'+hh;
  var min = hoy.getMinutes();
  if(min<10)min='0'+min;
  var mm = hoy.getMonth()+1;
  if(mm<10)mm='0'+mm;
  var dd = hoy.getDate();
  if(dd<10)dd='0'+dd;
  var yy = hoy.getFullYear()-2000;
  var fecha=dd+"_"+mm+"_"+yy;
  var x = false;
  var nat = false;
 
  if(hh==14&&min>=40&&min<=44){
    var F1='IFERROR(FILTER(Database!A2:O,MONTH(Database!N2:N)&"-"&YEAR(Database!N2:N)=C1,DAY(Database!N2:N)=B1,TIMEVALUE(Database!N2:N)>=TIMEVALUE(D1),TIMEVALUE(Database!N2:N)<=TIMEVALUE(E1),Database!M2:M<>"no"),"")';
    var F2='filter({B2:B,E2:E&" "&F2:F,D2:D,G2:G,I2:I,K2:K,L2:L},I2:I>=0)';
    var F3='FILTER({Database!B2:B,Database!E2:E&" "&Database!F2:F,Database!D2:D,Database!L2:L},MONTH(Database!N2:N)&"-"&YEAR(Database!N2:N)=C1,DAY(Database!N2:N)=B1,TIMEVALUE(Database!N2:N)>=TIMEVALUE(D1),TIMEVALUE(Database!N2:N)<=TIMEVALUE(E1),Database!M2:M="no")';
    var Subject = "Reporte de reparaciones T1 ";
    var TURNO=libro.getSheetByName("T1");
    x = true;
    nat = true;
  }
  if(hh==22&&min>=40&&min<=44){
    var F1='IFERROR(FILTER(Database!A2:O,MONTH(Database!N2:N)&"-"&YEAR(Database!N2:N)=C1,DAY(Database!N2:N)=B1,TIMEVALUE(Database!N2:N)>=TIMEVALUE(D1),TIMEVALUE(Database!N2:N)<=TIMEVALUE(E1),Database!M2:M<>"no"),"")';
    var F2='filter({B2:B,E2:E&" "&F2:F,D2:D,G2:G,I2:I,K2:K,L2:L},I2:I>=0)';
    var F3='FILTER({Database!B2:B,Database!E2:E&" "&Database!F2:F,Database!D2:D,Database!L2:L,TIME(HOUR(Database!A2:A),MINUTE(Database!A2:A),0)},MONTH(Database!N2:N)&"-"&YEAR(Database!N2:N)=C1,DAY(Database!N2:N)=B1,TIMEVALUE(Database!N2:N)>=TIMEVALUE(D1),TIMEVALUE(Database!N2:N)<=TIMEVALUE(E1),Database!M2:M="no")';
    var Subject = "Reporte de reparaciones T2 ";
    var TURNO=libro.getSheetByName("T2");
    x = true;
  }
  if(hh==06&&min>=40&&min<=44){
    var F1='IFERROR(FILTER(Database!A2:O,Database!O2:O>=B1,Database!O2:O<=C1,Database!M2:M<>"no"),"")';
    var F2='filter({B2:B,E2:E&" "&F2:F,D2:D,G2:G,I2:I,K2:K,L2:L},I2:I>=0)';
    var F3='IFERROR(FILTER({Database!B2:B,Database!E2:E&" "&Database!F2:F,Database!D2:D,Database!L2:L,TIME(HOUR(Database!A2:A),MINUTE(Database!A2:A),0)},Database!O2:O>=B1,Database!O2:O<=C1,Database!M2:M="no"),"")';
    var Subject = "Reporte de reparaciones T3 ";
    var TURNO=libro.getSheetByName("T3");
    x = true;
  }
  
  if(x){
    //ABRIR LIBRO Y DECLARAR HOJAS REQUERIDAS
   
    var G1 = libro.getSheetByName("G1");
    var G2 = libro.getSheetByName("G2");
    var G3 = libro.getSheetByName("G3");
    var G4 = libro.getSheetByName("G4");
    var G5 = libro.getSheetByName("NoR");
    var G6 = libro.getSheetByName("HxH");
    var Noracc = libro.getSheetByName("NoR_Acc");
    var Nor = libro.getSheetByName("NoR");
    var hoja_supers = libro.getSheetByName("Supers");    
    
    TURNO.getRange(1,1).setFormula('now()');
    TURNO.getRange(2,1).setFormula(F1);
    TURNO.getRange(2,29).setFormula(F2);
    TURNO.getRange(2,37).setFormula(F3);
    
    //DECLARAR CONTEOS Y UBICACIONES
    var conteo_super = hoja_supers.getRange(1,8).getValue();  //Conteo supervisores del turno
    var conteo_superx = hoja_supers.getRange(1,13).getValue(); //Conteo supervisores premium
    var conteo=TURNO.getRange(1,7).getValue(); //Conteo de reparadas del turno
    var conteof = TURNO.getRange(1,44).getValue(); //Conteo de NO reparadas del turno
    var rep=Noracc.getRange(1,3).getValue(); //Ubicacion de conteo de reparadas
    var norep=Noracc.getRange(1,4).getValue(); //Ubicacion de conteo de noreparadas
    var fila=Noracc.getRange(1,2).getValue(); //Ubicacion de fila de conteo de reparadas
    
    
    
    var correo_turno = hoja_supers.getRange(2,8,conteo_super).getDisplayValues();
    var correo_all = hoja_supers.getRange(2,13,conteo_superx).getDisplayValues();
   
    
   //FIJAR CONTEOS
    Noracc.getRange(fila,rep).setValue(conteo);
    Noracc.getRange(fila,norep).setValue(conteof);
    Nor.getRange(1,2).setValue(conteo);
    Nor.getRange(2,2).setValue(conteof);
  
    var chartBlobs=new Array(5); 
    var emailBody="<p align=\"left\" >Buen dia. A continuación se anexa el "+Subject+".<br> Adjunto a este correo pueden encontrar un archivo con los datos de las unidades reparadas.</p><br>";
    emailBody=emailBody+"<p align=\"center\" style=\"font-size:180%\"><b>"+Subject+"</b></p>";
    var emailImages={};
    
    //COPIAR DATOS PARA GRAFICA 1 A LA HOJA CORRESPONDIENTE
    G1.getRange(1,1,10,3).clear();
    var conteo=TURNO.getRange(1,16).getValue();
    if(conteo!=0){
      var rangoTURNO=TURNO.getRange(2,16,conteo,2);
      var rangoG1=G1.getRange(1,1,conteo,2);
      rangoTURNO.copyTo(rangoG1,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      //Obtener grafica 1
      var charts = G1.getCharts();
      var builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[0]= newchart.getAs('image/png');
      emailBody= emailBody + "<p align='center'><img src='cid:chart0'>";
      emailImages["chart0"]= chartBlobs[0];
    }
    
 //COPIAR DATOS PARA GRAFICA 2 A LA HOJA CORRESPONDIENTE
    G2.getRange(1,1,10,3).clear();
    var conteo=TURNO.getRange(1,16).getValue();
    if(conteo!=0){
      var rangoTURNO=TURNO.getRange(2,16,conteo,1);
      var rangoG2=G2.getRange(1,1,conteo,1);
      rangoTURNO.copyTo(rangoG2,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      var rangoTURNO=TURNO.getRange(2,19,conteo,1);
      var rangoG2=G2.getRange(1,2,conteo,1);
      rangoTURNO.copyTo(rangoG2,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      //Obtener grafica 2
      charts = G2.getCharts();
      builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[1]= newchart.getAs('image/png');
      emailBody= emailBody + "<img src='cid:chart1'>";
      emailImages["chart1"]= chartBlobs[1];
    }
    
    //COPIAR DATOS PARA GRAFICA 3 A LA HOJA CORRESPONDIENTE
    G3.getRange(1,1,10,3).clear();
    var conteo=TURNO.getRange(1,20).getValue();
    if(conteo!=0){
      var rangoTURNO=TURNO.getRange(2,20,conteo,2);
      var rangoG3=G3.getRange(1,1,conteo,2);
      rangoTURNO.copyTo(rangoG3,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      //Obtener grafica 3
      var charts = G3.getCharts();
      var builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[2]= newchart.getAs('image/png');
      emailBody= emailBody + "<img src='cid:chart2'>";
      emailImages["chart2"]= chartBlobs[2];
    }
    //COPIAR DATOS PARA GRAFICA 4 A LA HOJA CORRESPONDIENTE
    G4.getRange(1,1,20,3).clear();
    var conteo=TURNO.getRange(1,24).getValue();
    
    if(conteo!=0){
      var rangoTURNO=TURNO.getRange(2,24,conteo,2);
      var rangoG4=G4.getRange(1,1,conteo,2);
      rangoTURNO.copyTo(rangoG4,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      //Obtener grafica 4
      var charts = G4.getCharts();
      var builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[3]= newchart.getAs('image/png');
      emailBody= emailBody + "<img src='cid:chart3'>";
      emailImages["chart3"]= chartBlobs[3];
    }
    
    //COPIAR DATOS PARA GRAFICA 6 A LA HOJA CORRESPONDIENTE
         G6.getRange(1,2,3,9).clear();
    var conteo=TURNO.getRange(1,7).getValue();
    
    if(conteo!=0){
      var rangoTURNO=TURNO.getRange(28,16,3,9);
      var rangoG6=G6.getRange(1,2,3,9);
      rangoTURNO.copyTo(rangoG6,SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      //Obtener grafica 6
      var charts = G6.getCharts();
      var builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[5]= newchart.getAs('image/png');
      emailBody= emailBody + "<img src='cid:chart6'></p>";
      emailImages["chart6"]= chartBlobs[5];
    }
       
    
    var conteo = TURNO.getRange(1,7).getValue();
      if(conteo!=0){
        var rango = TURNO.getRange(1,28,conteo+1,8).getDisplayValues();
  
        var style = {};
        style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
        style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
        style[DocumentApp.Attribute.FONT_SIZE] = 12;
        style[DocumentApp.Attribute.BOLD] = true;
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#0070C0';
        var emailSubject=Subject+fecha
        
        var style2 = {};
        style2[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
        
        var documento = DocumentApp.create("Reporte "+fecha);
        var destino = documento.getBody();
        var titulo=destino.appendParagraph(emailSubject);
        titulo.setHeading(DocumentApp.ParagraphHeading.TITLE).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        //var imagen1=destino.appendImage(chartBlobs[0]).setAttributes(style2);
        //var imagen2=destino.appendImage(chartBlobs[1]).setAttributes(style2);
        //var imagen3=destino.appendImage(chartBlobs[2]).setAttributes(style2);
        //var imagen4=destino.appendImage(chartBlobs[3]).setAttributes(style2).merge();
        var parrafo1=destino.appendParagraph("Unides Reparadas:");//.setText(emailSubject+"\nUnides Reparadas:");
        parrafo1.setHeading(DocumentApp.ParagraphHeading.HEADING1).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
        var tabla = destino.appendTable(rango);//.insertTable(1, rango);
        var ancho = destino.getPageWidth();
        destino.setPageWidth(ancho+300);
        tabla.getRow(0).setAttributes(style);
        tabla.setColumnWidth(0,30);
        tabla.setColumnWidth(3,70);
        tabla.setColumnWidth(5,60);
       
      }
    //UNIDADES NO REPARADAS
    if(conteof!=0){
      emailBody=emailBody+"<hr>";
      emailBody=emailBody+"<p align='center' style=\"font-size:180%\"><b>Unidades no reparadas.</b></p>";
      //emailBody=emailBody+"<p align='center'>Datos de unidades que no fueron reparadas en el turno:</p>";
      var rango = TURNO.getRange(1,37,conteof+1,4).getDisplayValues();
      //var imagen5=destino.appendImage(chartBlobs[4]).setAttributes(style2);
      var parrafo2=documento.getBody().appendParagraph("Unides No Reparadas:");//.setText(emailSubject+"\nUnides No Reparadas:");
      parrafo2.setHeading(DocumentApp.ParagraphHeading.HEADING1).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      var tabla2=destino.appendTable(rango);//insertTable(2, rango);
      tabla2.getRow(0).setAttributes(style);
      var tabla="<p><table align='center'>";
      for(var f=0;f<=conteof;f++){
        tabla=tabla+"<tr align=\"center\">";
        for(var c=0;c<=3;c++){
          if(f==0) tabla=tabla+"<td style=\"font-size:130%\"><b>"+rango[f][c]+"</b></td>";
          else tabla=tabla+"<td style=\"font-size:120%\">"+rango[f][c]+"</td>";
        }
        tabla=tabla+"</tr>";
      }
      tabla=tabla+"</table></p>";
      emailBody=emailBody+tabla;
       if(conteo!=0){
      //Obtener grafica 4
      var charts = G5.getCharts();
      var builder = charts[0].modify();
      builder.setOption('vAxis.format', '#');
      var newchart = builder.build();
      chartBlobs[4]= newchart.getAs('image/png');
      emailBody= emailBody + "<p align=\"center\"><img src='cid:chart4'></p>";
      emailImages["chart4"]= chartBlobs[4];
    }
    }
   if(conteo!=0){
     var documentoid = documento.getId();
     documento.saveAndClose();
     var documentox = DriveApp.getFileById(documentoid);
     documentox.setTrashed(true);
     
     
     emailBody=emailBody + "<br><br>------<br>All rights reserved 2021<b> SICURE</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble"
     MailApp.sendEmail({
       to: correo_turno+","+correo_all,
       subject: emailSubject,
       htmlBody: emailBody,
       inlineImages:emailImages,
       attachments: [documentox],
       name:"SICURE"});
     
     var dest_turno=TURNO.getRange(2,27,TURNO.getRange(1,27).getValue()).getDisplayValues();
     for(var i=0;i<=TURNO.getRange(1,27).getValue()-1;i++){
      if(dest_turno[i][0]=="alfredo.inzunza@gmail.com"||dest_turno[i][0]=="under_validation@example.com") dest_turno[i][0]="";
    }
    GmailApp.sendEmail(dest_turno, emailSubject, "", {
       htmlBody: emailBody,
       inlineImages:emailImages,
       attachments: [documentox],
       name:"SICURE"});
     //var hoja_entradas = libro.getSheetByName("Entradas");
     //var hoja_salidas = libro.getSheetByName("Salidas");
     //var hoja_fifo = libro.getSheetByName("CONTAINER");
     //var hoja_outbox = libro.getSheetByName("OUTBOX");
     //hoja_entradas.insertRowsAfter(200,conteo+conteof);
     //hoja_fifo.insertRowsAfter(200,conteo+conteof);
     //hoja_outbox.insertRowsAfter(200, conteo+conteof);
     //hoja_salidas.insertRowsAfter(200, conteo+conteof);
   }
    TURNO.getRange(1,1).clear();
    TURNO.getRange(2,1).clear();
    TURNO.getRange(2,29).clear();
    TURNO.getRange(2,37).clear();
   
      TURNO.hideSheet();
      G1.hideSheet();
      G2.hideSheet();
      G3.hideSheet();
      G4.hideSheet();
    }  
}

function Mayor_120(){
 var version="v2.0";
  var libro = SpreadsheetApp.openById("1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4");
  var hoja_contenedor = libro.getSheetByName("120");
  var conteo=hoja_contenedor.getRange(1,14).getValue();
  var hoja_supers = libro.getSheetByName("Supers");
  var conteo_super = hoja_supers.getRange(1,8).getValue();
  var correo_turno=hoja_supers.getRange(2,8,conteo_super).getDisplayValues();
  var conteo_superx = hoja_supers.getRange(1,13).getValue();
  var correo_all=hoja_supers.getRange(2,13,conteo_superx).getDisplayValues();
 
  if(conteo>=1){
    var correos=hoja_contenedor.getRange(2,8,conteo).getDisplayValues();
    for(i=0;i<=conteo-1;i++){
      if(correos[i][0]=="alfredo.inzunza@gmail.com"||correos[i][0]=="under_validation@example.com") correos[i][0]="";
    }
    var datos = hoja_contenedor.getRange(1,2,conteo+1,8).getValues();
    datos[0]=["Serial","Empleado","Familia","Reparación","Detalle","Nombre MDS/FA","Correo","Tiempo"]
    for(var i=0;i<=datos.length-1;i++){
      datos[i].splice(1,1);
      datos[i].splice(5,1);
    }
    var tabla = htmltablewh(datos);
    var mensaje1 = '<div><p>Buen dia,<br>Te notificamos que actualmente hay <b>'+conteo+'</b> unidades con más de 120 minutos en el buffer de reparación.<br>'+tabla+'Toma acciones para evitar el retraso.<br>Esta notificación esta dirigida para el líder o supervisor a cargo del turno.<br><br><br><br>--------<br>All rights reserved 2018<b> SICURE '+version+'</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble</p></div>';
  
    //var notificacion=GmailApp.createDraft(correo_turno+","+correos+","+correo_all, "ATENCION: Actualmente hay "+conteo+" unidad(es) en el buffer de reparación","",{htmlBody: "Buen dia,<BR><br> Te notificamos que actualmente hay <b>"+conteo+"</b> unidad(es) en el buffer de reparación.<table>"+mensaje1+"</table><br>Toma acciones para evitar el retraso.<br>Esta notificación esta dirigida para el líder o supervisor a cargo del turno.<br><br><br><br>--------<br>All rights reserved 2018<b> SICURE "+version+"</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble",name:"SICURE"});
    var notificacion=GmailApp.createDraft(correo_turno+","+correos+","+correo_all, "ATENCION: Actualmente hay "+conteo+" unidad(es) con más de 120 minutos","",{htmlBody: mensaje1,name:"SICURE"}); //"Buen dia,<BR><br> Te notificamos que actualmente hay <b>"+conteo+"</b> unidad(es) en el buffer de reparación.<table>"+mensaje1+"</table><br>Toma acciones para evitar el retraso.<br>Esta notificación esta dirigida para el líder o supervisor a cargo del turno.<br><br><br><br>--------<br>All rights reserved 2018<b> SICURE</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble",name:"SICURE"});
   notificacion.send();
  }
}

function ContenedorLleno(){
  var version="v2.0";
  var libro = SpreadsheetApp.openById("1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4");

  var hoja_contenedor = libro.getSheetByName("Contenedor");
  var conteo=hoja_contenedor.getRange(1,14).getValue();
  var hoja_supers = libro.getSheetByName("Supers");
  var conteo_super = hoja_supers.getRange(1,8).getValue();
  var correo_turno=hoja_supers.getRange(2,8,conteo_super).getDisplayValues();
  var conteo_superx = hoja_supers.getRange(1,13).getValue();
  var correo_all=hoja_supers.getRange(2,13,conteo_superx).getDisplayValues();
  if(conteo>20){
    var correos=hoja_contenedor.getRange(2,8,conteo).getDisplayValues();
    for(i=0;i<=conteo-1;i++){
      if(correos[i][0]=="alfredo.inzunza@gmail.com"||correos[i][0]=="under_validation@example.com") correos[i][0]="";
    }
    var datos = hoja_contenedor.getRange(1,2,conteo+1,8).getValues();
    datos[0]=["Serial","Empleado","Familia","Reparación","Detalle","Nombre MDS/FA","Correo","Tiempo"]
    for(var i=0;i<=datos.length-1;i++){
      datos[i].splice(1,1);
      datos[i].splice(5,1);
    }
    var tabla = htmltablewh(datos);
    var mensaje1 = '<div><p>Buen dia,<br>Te notificamos que actualmente hay <b>'+conteo+'</b> unidades en el buffer de reparación.<br>'+tabla+'Toma acciones para evitar el retraso.<br>Esta notificación esta dirigida para el líder o supervisor a cargo del turno.<br><br><br><br>--------<br>All rights reserved 2018<b> SICURE '+version+'</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble</p></div>';
    var notificacion=GmailApp.createDraft(correo_turno+","+correos+","+correo_all, "ATENCION: Actualmente hay "+conteo+" unidad(es) en el buffer de reparación","",{htmlBody: mensaje1,name:"SICURE"}); // "Buen dia,<BR><br> Te notificamos que actualmente hay <b>"+conteo+"</b> unidad(es) en el buffer de reparación.<table>"+mensaje1+"</table><br>Toma acciones para evitar el retraso.<br>Esta notificación esta dirigida para el líder o supervisor a cargo del turno.<br><br><br><br>--------<br>All rights reserved 2018<b> SICURE</b> - <b>S</b>istema <b>I</b>nterno para el <b>C</b>ontrol de <b>U</b>nidades de <b>R</b>eparación y <b>E</b>nsamble",name:"SICURE"});
    notificacion.send();
  }
}


function htmltablewh(datos){
  var filas=datos.length;
  var cols=datos[0].length;
  Utilities.sleep(10);
  if(filas>1&&cols>1){
    var tabla4="<div style='text-align: left;margin-left: 25px;'><p><table style='border: 0px solid black; border-collapse: collapse'>";
  for(var f=0;f<=filas-1;f++){
    if (f==0) tabla4+='<tr align="center" style="border: 0px; font-size: 120%; margin: 5px 5px 5px 5px; font-weight: bolder; color:white; border-collapse: collapse">';
   else tabla4+='<tr align="center" style="border: 0px;  margin: 5px 5px 5px 5px;  border-collapse: collapse">';
    for(var c=0;c<=cols-1;c++){    
      if (f==0)  tabla4+='<td style="font-size:100%;border: 0px; border-collapse: collapse; padding: 5px 5px 5px 5px; background-color:#006699">'+datos[f][c]+'</td>';
      else if(f%2==0)tabla4+='<td style="font-size:100%;border: 0px; border-collapse: collapse; padding: 5px 5px 5px 5px; background-color:#EAECEE">'+datos[f][c]+'</td>';
          else tabla4+='<td style="font-size:100%;border: 0px; border-collapse: collapse; padding: 5px 5px 5px 5px;">'+datos[f][c]+'</td>';
        }
      
      tabla4+="</tr>";
  }
  tabla4+="</table></p></div><br>";
  }
  else tabla4="<p align='center'>Tabla sin datos</p>"
  return tabla4;
}

function hola(){
  important.generarregId();
}
