# language: es
# Datos de prueba: productos, usuarios y comentarios vienen de fixtures y los correos se simulan (ADR 0001).
Característica: Comentarios
  Un usuario que entró comenta en la landing; el comentario se guarda en la hoja, se envía por correo al usuario y al proveedor, y se publica.

  @fase-3
  Escenario: Comentar un producto
    Dado que Ana entró y está en la landing de "Taza de cerámica"
    Cuando escribe "¿Viene en azul?" y envía
    Entonces ve "Enviamos tu comentario a ti y al proveedor"
    Y ve su comentario publicado con su nombre y la fecha

  @fase-3
  Escenario: Comentario visible para todos
    Dado que Ana comentó "¿Viene en azul?" en "Taza de cerámica"
    Cuando un visitante sin sesión entra a esa landing
    Entonces ve el comentario de Ana

  @fase-3
  Escenario: Sin sesión no se comenta
    Dado que no entré
    Cuando estoy en la landing de "Taza de cerámica"
    Entonces veo "Entra para comentar" y no veo el formulario

  @fase-3
  Escenario: Comentario vacío
    Dado que Ana entró y está en la landing de "Taza de cerámica"
    Cuando envía un comentario vacío
    Entonces ve "Escribe un comentario"
