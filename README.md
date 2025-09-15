# 🚀 Flujo de trabajo de desarrollo de software

Esto es una guía estructurada basada en mi experiencia trabajando en equipos de desarrollo, para establecer un flujo de trabajo profesional y automatizado en proyectos de desarrollo de software, desde la creación de ramas hasta la publicación automática de `releases` y ejecución de pruebas y validaciones automaticas.

## 🎯 Propósito de este flujo de trabajo

Este proyecto proporciona un flujo de trabajo completo para implementar mejores prácticas en el desarrollo colaborativo de software. Combina metodologías probadas de gestión de código fuente, convenciones de `commits` estandarizadas y automatización de CI/CD para crear un flujo de trabajo coherente y escalable.

### ¿Qué problemas resuelve?

- **Inconsistencia en el historial de cambios:** Estandariza cómo se documentan las modificaciones.
- **Gestión manual de versiones:** Automatiza la creación de `releases` y `changelogs`.
- **Falta de trazabilidad:** Vincula cada cambio con su propósito específico.
- **Despliegues manuales propensos a errores:** Automatiza el proceso completo de CI/CD.
- **Colaboración desorganizada:** Establece reglas claras para todo el equipo.

### ¿Qué obtienes al implementarlo?

- ✅ **Historial de commits legible y profesional**.
- ✅ **Versionado semántico automático**.
- ✅ **Changelogs generados automáticamente**.
- ✅ **Pipeline de CI/CD lista para usar**.
- ✅ **Despliegues automatizados y confiables**.
- ✅ **Flujo de trabajo escalable para equipos de cualquier tamaño**.

## 🗺️ Flujo de Trabajo

Sigue estos pasos secuenciales para implementar el workflow completo en tu proyecto:

### Paso 1: 🌿 Creación de Ramas de Trabajo
**Cuándo:** Al iniciar el desarrollo de una nueva funcionalidad o corrección.

Aprende a crear ramas de trabajo siguiendo las mejores prácticas y evitando errores comunes como partir de ramas desactualizadas.

📖 **[Guía detallada →](stages/create_work_branch.md)**

### Paso 2: 📝 Creación de Commits
**Cuándo:** Al guardar cambios en tu rama de trabajo.

Implementa convenciones de `commits` que permitan automatizar el versionado y la generación de `changelogs`.

📖 **[Guía detallada →](stages/create_commit.md)**

### Paso 3: 🔄 Configuración de CI/CD
**Cuándo:** Al configurar el repositorio para automatización.

Implementa pipelines de CI/CD que automaticen pruebas, despliegues y publicación de `releases`.

📖 **[Guía detallada →](ci/gitlab/README.md)**
