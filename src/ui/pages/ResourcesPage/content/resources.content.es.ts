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
    body: 'KAI es un plugin de IA para equipos de producción y postproducción audiovisual. Indexa material en bruto, permite buscar momentos en lenguaje natural y ayuda a convertir esas selecciones en material listo para seguir editando.',
    category: 'Primeros pasos',
  },
  'basic-workflow': {
    title: '¿Cuál es el flujo básico de trabajo con KAI?',
    body: 'El flujo general es: subir o conectar el material, indexarlo, buscar momentos con tus propias palabras, revisar los resultados y exportar la selección al editor. KAI está pensado para reducir el tiempo de revisión manual sin quitar control al equipo creativo.',
    category: 'Primeros pasos',
  },
  'who-uses-kai': {
    title: '¿Para quién está pensado KAI?',
    body: 'KAI está pensado para equipos que trabajan con muchas horas de vídeo: producción, postproducción, story editors, realizadores, editores, asistentes de edición y responsables de contenido. Es especialmente útil cuando encontrar el momento exacto consume demasiado tiempo.',
    category: 'Primeros pasos',
  },
  'login-required': {
    title: '¿Necesito iniciar sesión para usar KAI?',
    body: 'Sí. Para gestionar tu plan y acceder a los recursos disponibles, necesitas una cuenta activa en la web de KAI. El acceso puede depender del plan, la licencia o la configuración acordada para tu producción.',
    category: 'Primeros pasos',
  },
  'check-compatibility': {
    title: '¿Cómo sé si mi entorno de trabajo es compatible?',
    body: 'La compatibilidad depende del editor, la configuración del proyecto y el tipo de despliegue. Antes de activar KAI en un entorno profesional, revisa los requisitos indicados en tu cuenta o consulta con el equipo de soporte.',
    category: 'Instalación y requisitos',
  },
  'supported-formats': {
    title: '¿Qué formatos de archivo puedo usar con KAI?',
    body: 'KAI está pensado para trabajar con material audiovisual profesional, pero los formatos, códecs y configuraciones concretas deben validarse según cada producción. Si tienes un flujo técnico específico, consulta la compatibilidad antes de indexar grandes volúmenes de material.',
    category: 'Instalación y requisitos',
  },
  'access-account': {
    title: '¿Cómo accedo a mi cuenta?',
    body: 'Inicia sesión desde la web de KAI con el correo asociado a tu cuenta o a tu equipo. Desde ahí podrás revisar tu acceso, tu plan y las opciones disponibles para tu producción.',
    category: 'Cuenta y planes',
  },
  'change-plan': {
    title: '¿Puedo cambiar mi plan?',
    body: 'Sí, los planes están pensados para adaptarse a distintos tipos de uso y producción. Las opciones de cambio, ampliación o ajuste dependen de tu suscripción actual y de las condiciones asociadas a tu cuenta.',
    category: 'Cuenta y planes',
  },
  'more-capacity': {
    title: '¿Qué hago si necesito más capacidad para una producción?',
    body: 'Si vas a trabajar con más horas de material, más usuarios o necesidades técnicas específicas, contacta con el equipo de KAI. Se puede revisar el caso para adaptar la licencia o la configuración al ritmo real de tu producción.',
    category: 'Cuenta y planes',
  },
  'billing-info': {
    title: '¿Dónde consulto mis facturas y datos de facturación?',
    body: 'Los datos de facturación y la información de tu plan se gestionan desde tu cuenta, cuando esta opción esté disponible. Si no encuentras una factura o necesitas modificar datos administrativos, contacta con soporte.',
    category: 'Cuenta y planes',
  },
  'what-is-indexing': {
    title: '¿Qué significa indexar material?',
    body: 'Indexar significa analizar el contenido para convertirlo en información buscable. KAI puede usar datos como transcripciones, etiquetas y contexto del material para que después puedas encontrar momentos concretos con lenguaje natural.',
    category: 'Búsqueda e indexado',
  },
  'indexing-time': {
    title: '¿Cuánto tarda el indexado?',
    body: 'El tiempo de indexado depende del volumen de material, la duración de los clips, el tipo de análisis y la configuración técnica del proyecto. En producciones con mucho contenido, el rendimiento se revisa antes de definir el flujo de trabajo.',
    category: 'Búsqueda e indexado',
  },
  'natural-language-search': {
    title: '¿Cómo hago una búsqueda en lenguaje natural?',
    body: 'Escribe lo que necesitas como se lo pedirías a otra persona del equipo: una frase, una situación, un tema, una reacción o una intervención concreta. Cuanto más claro sea el contexto, más fácil será revisar resultados útiles.',
    category: 'Búsqueda e indexado',
  },
  'reuse-searches': {
    title: '¿Puedo guardar o reutilizar una búsqueda?',
    body: 'KAI está diseñado para trabajar con sesiones y conversaciones que pueden recuperarse y reutilizarse dentro del proyecto. Esto ayuda a mantener el contexto, evitar búsquedas repetidas y compartir hallazgos con el equipo.',
    category: 'Búsqueda e indexado',
  },
  'review-results': {
    title: '¿Puedo revisar los resultados antes de exportar?',
    body: 'Sí. La idea es que puedas revisar los clips encontrados, comprobar si encajan con la búsqueda y ajustar la selección antes de llevarla al editor. KAI está pensado para apoyar la decisión editorial, no para saltársela.',
    category: 'Uso del plugin e integración NLE',
  },
  'order-clips': {
    title: '¿Puedo ordenar los clips antes de exportarlos?',
    body: 'Sí. KAI permite trabajar con selecciones y playlists para organizar los clips antes de enviarlos al flujo de edición. Esto ayuda a pasar de una búsqueda suelta a una estructura narrativa más clara.',
    category: 'Uso del plugin e integración NLE',
  },
  'nle-integration': {
    title: '¿Con qué editores se integra KAI?',
    body: 'KAI está orientado a flujos profesionales de edición no lineal. Su integración inicial se centra en Adobe Premiere Pro mediante un panel nativo, actualmente el único entorno NLE compatible de forma nativa. Se trata, no obstante, del primer paso de una hoja de ruta de integraciones en expansión: el número de editores compatibles irá creciendo progresivamente, incorporando nuevos entornos NLE según las necesidades de los equipos y la evolución de cada flujo de trabajo, con la compatibilidad y el método de exportación adaptados a cada uno.',
    category: 'Uso del plugin e integración NLE',
  },
  'what-exports-to-nle': {
    title: '¿Qué se exporta al editor?',
    body: 'KAI exporta selecciones, estructuras o playlists preparadas a partir de los clips encontrados, para que el equipo pueda continuar el montaje en su editor. Los detalles de formato y compatibilidad dependen de la configuración disponible para cada entorno.',
    category: 'Uso del plugin e integración NLE',
  },
  'processing-location': {
    title: '¿Dónde se procesa mi material?',
    body: 'El procesamiento puede variar según el plan, la infraestructura y las necesidades de la producción. KAI contempla flujos en la nube y configuraciones adaptadas a entornos profesionales, por lo que el modelo concreto se define antes de activar el servicio.',
    category: 'Privacidad, seguridad y soporte',
  },
  'content-access': {
    title: '¿Quién puede acceder al material de mi producción?',
    body: 'El acceso al material debe quedar limitado a los usuarios y equipos autorizados dentro del proyecto. En producciones con requisitos específicos de control, permisos o confidencialidad, conviene revisar la configuración con el equipo de KAI antes de empezar.',
    category: 'Privacidad, seguridad y soporte',
  },
  'slow-performance': {
    title: '¿Qué hago si KAI va lento o tarda en responder?',
    body: 'El rendimiento puede verse afectado por el volumen de material, el estado del indexado, la conexión, la infraestructura o el tipo de búsqueda. Comprueba primero que el material esté indexado y, si el problema continúa, contacta con soporte indicando el proyecto y el comportamiento observado.',
    category: 'Privacidad, seguridad y soporte',
  },
  'contact-support': {
    title: '¿Cómo contacto con soporte?',
    body: 'Puedes contactar con el equipo de KAI desde el botón de soporte o contacto de la web. Para ayudarte más rápido, incluye una descripción del problema, el proyecto afectado, el editor que estás usando y cualquier mensaje de error disponible.',
    category: 'Privacidad, seguridad y soporte',
  },
}
