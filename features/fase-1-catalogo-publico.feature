# language: es
# Datos de prueba: los productos vienen de un fixture, no de la hoja real (ADR 0001).
# @smoke: corre también contra producción; solo escenarios que no dependen de productos específicos.
Característica: Catálogo público
  Portada con todos los productos y una landing por producto, con SEO y sitemap, leídos de la hoja.

  @fase-1
  Escenario: Ver el catálogo
    Dado que la hoja tiene los productos "Taza de cerámica" y "Libreta A5"
    Cuando entro a la portada
    Entonces veo los dos productos con su foto, nombre y precio

  @fase-1
  Escenario: Abrir la landing de un producto
    Dado que la hoja tiene el producto "Taza de cerámica" con slug "taza-de-ceramica"
    Cuando hago clic en "Taza de cerámica"
    Entonces estoy en "/productos/taza-de-ceramica"
    Y veo su descripción, precio y proveedor

  @fase-1
  Escenario: Título para buscadores
    Cuando entro a "/productos/taza-de-ceramica"
    Entonces el título de la página es "Taza de cerámica | Vitrina"

  @fase-1 @smoke
  Escenario: Producto que no existe
    Cuando entro a "/productos/no-existe"
    Entonces veo "Producto no encontrado"

  @fase-1
  Escenario: Sitemap con los productos
    Cuando entro a "/sitemap.xml"
    Entonces veo la URL "/productos/taza-de-ceramica"
