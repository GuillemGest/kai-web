/**
 * Diccionario de traducciones ES de los recursos.
 * Los `id` son estables y coinciden con los del InMemoryResourceRepository.
 */
export const categoryOrderEs = [
  'Primeros pasos',
  'Instalación y requisitos',
  'Cuenta y planes',
  'Búsqueda e indexado',
  'Uso del plugin e integración NLE',
  'Privacidad, seguridad y soporte',
]

export const resourceTranslations: Record<
  string,
  { title: string; body: string; category: string }
> = {
  'what-is-kai': {
    title: '¿Qué es KAI?',
    body: 'KAI es un plugin de IA para equipos de producción y postproducción audiovisual. Indexa material en bruto, permite buscar momentos con lenguaje natural y convierte esas selecciones en material listo para seguir editando.',
    category: 'Primeros pasos',
  },
  'basic-workflow': {
    title: '¿Cuál es el flujo básico de trabajo con KAI?',
    body: 'El flujo general es: subes o conectas tu material, lo indexas, buscas momentos con lenguaje natural, revisas los resultados y exportas la selección a tu editor. El objetivo es reducir el tiempo de revisión manual manteniendo al equipo creativo al mando.',
    category: 'Primeros pasos',
  },
  'who-uses-kai': {
    title: '¿Para quién está pensado KAI?',
    body: 'Para cualquiera que trabaje con mucho vídeo: equipos de producción y postproducción, story editors, realizadores, editores, asistentes de edición y responsables de contenido. Resulta especialmente útil cuando encontrar el momento exacto consume demasiado tiempo.',
    category: 'Primeros pasos',
  },
  'login-required': {
    title: '¿Necesito iniciar sesión para usar KAI?',
    body: 'Sí. Necesitas una cuenta activa en la web de KAI para gestionar tu plan y acceder a los recursos disponibles. El acceso puede depender del plan, la licencia o la configuración acordada para tu producción.',
    category: 'Primeros pasos',
  },
  'check-compatibility': {
    title: '¿Cómo sé si mi entorno de trabajo es compatible?',
    body: 'Depende de tu editor, de cómo esté configurado el proyecto y del tipo de despliegue. Antes de activar KAI en un entorno profesional, revisa los requisitos indicados en tu cuenta o consulta con el equipo de soporte.',
    category: 'Instalación y requisitos',
  },
  'supported-formats': {
    title: '¿Qué formatos de archivo puedo usar con KAI?',
    body: 'KAI trabaja con material audiovisual profesional, pero los formatos, códecs y configuraciones concretas deben validarse producción por producción. Si utilizas un flujo técnico particular, confirma la compatibilidad antes de indexar grandes volúmenes de material.',
    category: 'Instalación y requisitos',
  },
  'access-account': {
    title: '¿Cómo accedo a mi cuenta?',
    body: 'Inicia sesión en la web de KAI con el correo asociado a tu cuenta o a tu equipo. Desde ahí puedes consultar tu acceso, tu plan y las opciones disponibles para tu producción.',
    category: 'Cuenta y planes',
  },
  'change-plan': {
    title: '¿Puedo cambiar mi plan?',
    body: 'Sí. Los planes están diseñados para adaptarse a distintos tipos de uso y producción. Las opciones de cambio, ampliación o ajuste dependen de tu suscripción actual y de las condiciones asociadas a tu cuenta.',
    category: 'Cuenta y planes',
  },
  'more-capacity': {
    title: '¿Qué hago si necesito más capacidad para una producción?',
    body: 'Si vas a trabajar con más horas de material, más usuarios o necesidades técnicas concretas, ponte en contacto con el equipo de KAI. Podemos revisar el caso y adaptar la licencia o la configuración al ritmo real de tu producción.',
    category: 'Cuenta y planes',
  },
  'billing-info': {
    title: '¿Dónde consulto mis facturas y datos de facturación?',
    body: 'Gestionas los datos de facturación y la información de tu plan desde tu cuenta, donde esa opción esté disponible. Si te falta una factura o necesitas cambiar datos administrativos, ponte en contacto con soporte.',
    category: 'Cuenta y planes',
  },
  'what-is-indexing': {
    title: '¿Qué significa indexar material?',
    body: 'Indexar consiste en analizar tu contenido para convertirlo en información buscable. KAI se apoya en elementos como transcripciones, etiquetas y el contexto del material para que después puedas localizar momentos concretos con lenguaje natural.',
    category: 'Búsqueda e indexado',
  },
  'indexing-time': {
    title: '¿Cuánto tarda el indexado?',
    body: 'Depende del volumen de material, la duración de los clips, el tipo de análisis y la configuración técnica del proyecto. En producciones con mucho contenido revisamos el rendimiento antes de definir el flujo de trabajo.',
    category: 'Búsqueda e indexado',
  },
  'natural-language-search': {
    title: '¿Cómo hago una búsqueda en lenguaje natural?',
    body: 'Describe lo que buscas como se lo plantearías a otra persona del equipo: una frase, una situación, un tema, una reacción o una intervención concreta. Cuanto más contexto aportes, más fácil será obtener resultados útiles.',
    category: 'Búsqueda e indexado',
  },
  'reuse-searches': {
    title: '¿Puedo guardar o reutilizar una búsqueda?',
    body: 'Sí. KAI trabaja con sesiones y conversaciones que puedes recuperar y reutilizar dentro del proyecto, lo que ayuda a mantener el contexto, evitar búsquedas repetidas y compartir los hallazgos con el equipo.',
    category: 'Búsqueda e indexado',
  },
  'review-results': {
    title: '¿Puedo revisar los resultados antes de exportar?',
    body: 'Sí. Puedes revisar los clips encontrados, comprobar si se ajustan a lo que buscabas y afinar la selección antes de que llegue al editor. KAI está pensado para respaldar tu decisión editorial, no para sustituirla.',
    category: 'Uso del plugin e integración NLE',
  },
  'order-clips': {
    title: '¿Puedo ordenar los clips antes de exportarlos?',
    body: 'Sí. KAI permite trabajar con selecciones y playlists para organizar los clips antes de enviarlos al flujo de edición, lo que ayuda a pasar de una búsqueda dispersa a una estructura narrativa más clara.',
    category: 'Uso del plugin e integración NLE',
  },
  'nle-integration': {
    title: '¿Con qué editores se integra KAI?',
    body: 'KAI está orientado a la edición no lineal profesional. Actualmente se integra con Adobe Premiere Pro mediante un panel nativo, el único entorno NLE compatible de forma nativa por ahora. Se trata, no obstante, del punto de partida: iremos incorporando editores de forma progresiva, según las necesidades de los equipos y la evolución de cada flujo, con la compatibilidad y el método de exportación adaptados a cada uno.',
    category: 'Uso del plugin e integración NLE',
  },
  'what-exports-to-nle': {
    title: '¿Qué se exporta al editor?',
    body: 'KAI exporta las selecciones, estructuras o playlists preparadas a partir de los clips encontrados, para que el equipo retome el montaje en su propio editor. El formato y la compatibilidad exactos dependen de la configuración disponible en cada entorno.',
    category: 'Uso del plugin e integración NLE',
  },
  'processing-location': {
    title: '¿Dónde se procesa mi material?',
    body: 'Depende del plan, la infraestructura y las necesidades de la producción. KAI contempla flujos en la nube y configuraciones adaptadas a entornos profesionales, por lo que definimos el modelo concreto contigo antes de activar el servicio.',
    category: 'Privacidad, seguridad y soporte',
  },
  'content-access': {
    title: '¿Quién puede acceder al material de mi producción?',
    body: 'El acceso al material debe limitarse a los usuarios y equipos autorizados del proyecto. Si tu producción tiene requisitos concretos de control, permisos o confidencialidad, revisa la configuración con el equipo de KAI antes de empezar.',
    category: 'Privacidad, seguridad y soporte',
  },
  'slow-performance': {
    title: '¿Qué hago si KAI va lento o tarda en responder?',
    body: 'El rendimiento puede verse afectado por el volumen de material, el estado del indexado, la conexión, la infraestructura o el tipo de búsqueda. Comprueba primero que el material esté indexado y, si el problema persiste, contacta con soporte indicando el proyecto y el comportamiento observado.',
    category: 'Privacidad, seguridad y soporte',
  },
  'contact-support': {
    title: '¿Cómo contacto con soporte?',
    body: 'Puedes contactar con el equipo de KAI desde el botón de soporte o contacto de la web. Para agilizar la ayuda, indícanos qué problema tienes, a qué proyecto afecta, qué editor utilizas y cualquier mensaje de error disponible.',
    category: 'Privacidad, seguridad y soporte',
  },
}
