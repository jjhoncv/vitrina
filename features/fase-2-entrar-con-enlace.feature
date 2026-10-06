# language: es
# Datos de prueba: los usuarios vienen de un fixture y los correos se simulan (ADR 0001).
# @smoke: corre también contra producción; solo escenarios que no dependen de datos de prueba ni envían correos.
Característica: Entrar con enlace por correo
  Un usuario de la hoja pide un enlace que vence en 15 minutos, entra con él y puede salir.

  @fase-2
  Escenario: Pedir el enlace de entrada
    Dado que "ana@ejemplo.com" está en la hoja de usuarios
    Cuando escribo "ana@ejemplo.com" y pido el enlace
    Entonces veo "Te enviamos un enlace a ana@ejemplo.com"

  @fase-2 @smoke
  Escenario: Correo sin acceso
    Dado que "otro@ejemplo.com" no está en la hoja de usuarios
    Cuando escribo "otro@ejemplo.com" y pido el enlace
    Entonces veo "Este correo no tiene acceso"

  @fase-2
  Escenario: Entrar con el enlace
    Dado que Ana pidió su enlace
    Cuando abre el enlace
    Entonces ve "Hola, Ana" en la cabecera

  @fase-2
  Escenario: Enlace vencido
    Dado que Ana pidió su enlace hace más de 15 minutos
    Cuando abre el enlace
    Entonces ve "El enlace venció, pide uno nuevo"

  @fase-2
  Escenario: Salir
    Dado que Ana entró
    Cuando hace clic en "Salir"
    Entonces ve "Entrar" en la cabecera
