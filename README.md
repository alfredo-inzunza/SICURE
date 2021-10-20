# SICURE
Sistema de control para unidades que entran a un proceso **X**.

Para el sistema se utilizan las funciones básicas CRUD. Está basado en Javascript con los servicios de Google Apps Script (GAS), utilizando Clases y Métodos propias de GAS para la interacción de los productos empresariales de Google como Gmail, Google Docs, Google Spreadsheets y Web Apps.

Sitio en funcionamiento:
https://sites.google.com/view/sicure
*Nota: El nav-bar externo es el que actualmente funciona, el nav-bar interno se incluye a modo de ejemplo.

# Problema
El órden y registro de un proceso de cola tipo FIFO es necesario para determinar factores como el tiempo que se permanece en ese proceso, el número de unidades que permanecen en cola y el órden en que deben de ser procesadas las unidades para cumplir con FIFO. Anteriormente se utilizaba un control basado en etiquetas adhesivas y un registro en hoja de calculo manipulable por cualquier usuario, este tipo de control no es efectivo pues todo desde la hora de entrada y salida así como el órden de los turnos son alterables, por lo cual no es efectivo para determinar los tiempos del proceso.

# Solución
Esta aplicación se desarrolla para suplir el antiguo sistema de control, la aplicación web consta de 3 vistas:

# Hoja de calculo (Base de datos)
El siguiente archivo es una hoja de calculo en donde se almacena toda la información de este sistema.
https://docs.google.com/spreadsheets/d/1IHa_y_G_UvBjIjGw-PompDJarlRhW0AFEHXxodDRMn4/edit?usp=sharing

# Registro de entrada (para persona fuera del proceso)
https://sites.google.com/view/sicure/registro-de-entrada
Consta de un formulario donde el usuario que lleva una unidad al proceso en cuestión, registra la unidad con su número de empleado, el número de control de la unidad y el tipo de interveción que requiere dicha unidad. Una vez enviado el registro, se almacena en una hoja de calculo en la pestaña "Contenedor", esta hoja de calculo solo es accesible por el administrador.

# Registro de salida (para persona dentro del proceso)
https://sites.google.com/view/sicure/registro-de-salida
Consta de un formulario donde se encuentra la lista de unidades que actualmente se encuentran en el "Contenedor", al cargar la página se ejecuta un script que descarga todos los registros del "Contenedor" y los integra en un campo del tipo Select como una lista desplegable. Al terminar el proceso, se registra la salida, para ello se selecciona la unidad que fue procesada, el número de empleado del operador que la intervino y comentarios adicionales. Cuando se envía este registro, un script toma los datos de esta unidad de la pestaña "Contenedor" y los inserta en la pestaña "DB", esta pestaña contiene todo el histórico de unidades procesadas.

*Script de notificación para usuario:
  En este mismo registro de salida, se ejecuta una función que notifica al usuario que ingresó la unidad al proceso, por medio de un correo electrónico, que su unidad ya se encuentra lista para ser recogida.

# Registro de empleados
https://sites.google.com/view/sicure/registro-de-empleado
Para las funciones de esta aplicación es necesario contar con un registro de los empleados, tanto para quienes ingresan unidades al proceso como aquellos que se encargan de la intervención en dicho proceso. Un formulario de registro de usuarios inserta los datos en una hoja de calculo, pestaña "Empleados". Los diferentes scripts de esta aplicación, toman la información de los empleados de esta pestaña, tomando como ID, su número de empleado.

*Para garantizar la entrega de los mensajes por correo electrónico, se implementa una confirmación de correo. El usuario no aparece activo hasta que confirme un vínculo enviado a su correo electrónico.
