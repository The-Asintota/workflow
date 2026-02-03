# 🔹 Guía de Creación de Commits

El uso de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) permite mantener un historial de cambios claro, consistente y fácil de entender en cualquier entorno de trabajo colaborativo. Conventional Commits no solo define un formato de mensajes, sino que funciona como una guía de comunicación técnica que facilita el trabajo en equipo en cualquier tipo de proyecto.

## 🔹 1. Beneficios

Adoptar esta convención aporta varios beneficios:

- 📖 **Claridad:** Cada commit deja explícito si se trata de una nueva funcionalidad, una corrección, un cambio en la documentación, una tarea de mantenimiento, entre otros.
- 🤝 **Colaboración:** Al utilizar un mismo lenguaje y formato, todas las personas que contribuyen entienden rápidamente la naturaleza de cada cambio.
- ⚙️ **Automatización:** Muchas herramientas pueden generar automáticamente changelogs, manejar versionado semántico ([semver](https://semver.org/lang/es/)) y crear notas de lanzamiento a partir de los commits.
- 🔍 **Trazabilidad:** Resulta más sencillo identificar cuándo y dónde se introdujo una funcionalidad, una mejora de rendimiento o la corrección de un error.
- 🚀 **Escalabilidad:** Cuanto mayor es el número de personas involucradas, más útil resulta contar con un estándar común que evite confusiones y mantenga ordenado el flujo de trabajo.


## 🔹 2. Estructura del Commit

La estructura de un commit sigue el siguiente formato:

```txt
<tipo>(<scope>): <descripción>

<opcional cuerpo>

<opcional notas al pie>
```

| Elemento | Descripción |
|----------|-------------|
| `<tipo>` | Indica la naturaleza del cambio realizado. |
| `<scope>` | (opcional) Señala el ámbito o área afectada por el cambio. |
| `<descripción>` | Frase nominal que describe el cambio. Máximo 72 caracteres. |
| `<cuerpo>` | Detalles adicionales, razones del cambio, contexto o diferencias con la versión anterior. Útil cuando la descripción no es suficiente. |
| `<notas de pie>` | Información especial como referencias a incidencias, tickets o cambios que rompen compatibilidad (BREAKING CHANGE). |

## 🔹 3. Estilo de Redacción

### 3.1. ¿Por qué frases nominales?

Este proyecto utiliza [semantic-release](https://semantic-release.gitbook.io/semantic-release) para automatizar la publicación de releases. Los mensajes de commit se extraen directamente para generar las notas de la release. Por eso, la forma en que escribimos los commits afecta directamente cómo se leen las notas públicas del proyecto.

> [!IMPORTANT]
> Los mensajes de commit deben escribirse como **frases nominales descriptivas**, no como comandos imperativos. Esto garantiza que las release notes sean profesionales y legibles.

### 3.2. El Problema con el Imperativo

El estándar original de Conventional Commits sugiere usar modo imperativo ("Agregar", "Corregir", "Implementar"). Sin embargo, esto genera release notes que parecen una lista de órdenes:

```markdown
## Funcionalidades
- Agregar botón de login
- Implementar autenticación OAuth
- Crear endpoint de productos
```

Al usar **frases nominales** (sustantivos y descripciones), las release notes se leen de forma fluida y profesional:

```markdown
## Funcionalidades
- Botón de login con opciones de redes sociales
- Autenticación con Google OAuth
- Endpoint de creación de productos (POST /products)

## Correcciones
- Corrección de overflow en tarjetas móviles
- Manejo de expiración de tokens JWT
```

| ❌ Imperativo (NO usar) | ✅ Frase Nominal (usar) |
|------------------------|------------------------|
| `Agregar login con Google` | `Login con Google OAuth` |
| `Corregir overflow en cards` | `Corrección de overflow en tarjetas móviles` |
| `Implementar lazy loading` | `Carga diferida para imágenes de productos` |
| `Crear endpoint de productos` | `Endpoint de creación de productos` |
| `Actualizar dependencias` | `Actualización de dependencias de seguridad` |
| `Eliminar código deprecado` | `Limpieza de código deprecado` |
| `Refactorizar servicio de usuario` | `Refactorización del servicio de usuario` |

### 3.5. Reglas de Redacción

| Regla | Descripción |
|-------|-------------|
| **Sin verbos al inicio** | No empieces con "Agregar", "Corregir", "Crear", etc. |
| **Usa sustantivos** | Describe QUÉ es el cambio, no qué hacer. |
| **Máximo 72 caracteres** | Mantén la descripción concisa. |
| **Sin punto final** | No termines con punto. |

## 🔹 4. Prefijos Reservados

Este proyecto utiliza **squash merge** para integrar Pull Requests hacia `development`. Esto significa que todos los commits de una rama se combinan en un único commit al fusionar.

> [!IMPORTANT]
> Los prefijos `feat`, `fix` y `perf` están **reservados** para el commit final del squash merge, ya que impactan directamente el versionado semántico.

Imagina que estás creando un nuevo endpoint `POST /products`:

```txt
# Durante el desarrollo (en tu feature branch)
add(products): Modelo Product con campos base
add(products): ProductRepository con métodos CRUD
add(products): CreateProductService
add(products): Endpoint POST en ProductController
add(products): Middleware de validación de entrada
test(products): Tests unitarios y de integración

# Al hacer squash merge (mensaje final del PR)
feat(api): Endpoint de creación de productos (POST /products)
```

## 🔹 5. Tipos de Commit

Los tipos clasifican los cambios de manera uniforme y permiten que cualquier persona del equipo entienda rápidamente la intención del commit sin tener que revisar el código.

### 5.1. `feat` - Nueva Funcionalidad ⚡

> [!NOTE]
> Este prefijo está **reservado para squash merge**.

**Qué es:** Funcionalidad completa visible para el usuario/cliente, lista para producción.

**✅ Cuándo usarlo:**
- Como mensaje final del squash merge cuando la PR agrega una nueva capacidad.
- La funcionalidad está completa, probada y lista para usuarios.

**❌ Cuándo NO usarlo:**
- En commits intermedios durante el desarrollo (usa `add`).
- Para cambios parciales o trabajo en progreso.

**Ejemplos (mensaje de squash merge):**
```txt
# Backend
feat(usuarios): Endpoint de creación de clientes (POST /customers)
feat(facturación): Generación automática de facturas electrónicas
feat(autenticación): Login con Google OAuth 2.0

# Frontend
feat(productos): Componente de búsqueda con filtros avanzados
feat(carrito): Vista previa del pedido antes de confirmar
feat(dashboard): Gráficos interactivos de ventas mensuales

# Móvil / Desktop
feat(notificaciones): Notificaciones push en tiempo real
feat(offline): Modo sin conexión con sincronización automática
```

### 5.2. `fix` - Corrección de Bug ⚡

> [!NOTE]
> Este prefijo está **reservado para squash merge**.

**Qué es:** Corrección completa de un bug, incluyendo todos los cambios necesarios.

**✅ Cuándo usarlo:**
- Como mensaje final del squash merge cuando la PR corrige un bug.
- La corrección está completa y verificada.

**❌ Cuándo NO usarlo:**
- En commits intermedios durante el desarrollo (usa `add`).
- Para cambios meramente estéticos o refactorizaciones.

**Ejemplos (mensaje de squash merge):**
```txt
# Backend
fix(facturación): Corrección de cálculo de IVA en productos exentos
fix(autenticación): Manejo de tokens JWT expirados
fix(reportes): Corrección de filtro de fechas en exportación

# Frontend
fix(formularios): Validación de campos requeridos en registro
fix(tabla): Paginación incorrecta al filtrar resultados
fix(modal): Cierre inesperado al hacer clic fuera del área

# General
fix(api): Respuesta 500 al enviar payload vacío
fix(permisos): Acceso denegado a usuarios con rol administrador
```

### 5.3. `perf` - Mejora de Rendimiento ⚡

> [!NOTE]
> Este prefijo está **reservado para squash merge**.

**Qué es:** Optimización completa con impacto medible en rendimiento.

**✅ Cuándo usarlo:**
- Como mensaje final del squash merge cuando la PR mejora rendimiento.
- La optimización está completa y su impacto ha sido medido.

**❌ Cuándo NO usarlo:**
- En commits intermedios durante el desarrollo (usa `add`).
- Si el objetivo fue reorganizar código sin foco en rendimiento.

**Ejemplos (mensaje de squash merge):**
```txt
# Backend
perf(reportes): Optimización de consulta de ventas (60% más rápido)
perf(api): Paginación de resultados en endpoint /products
perf(cache): Caché Redis para datos de catálogo

# Frontend
perf(imágenes): Carga diferida (lazy loading) en galería
perf(bundle): División de código para carga inicial más rápida
perf(tabla): Virtualización de filas en listados grandes

# Base de datos
perf(db): Índices para búsquedas por fecha y cliente
perf(consultas): Reducción de N+1 en listado de pedidos
```

### 5.4. `add` - Bloque de Construcción 🔨

**Qué es:** Commit intermedio que forma parte de una funcionalidad, corrección u optimización más grande.

**✅ Cuándo usarlo:**
- Agregas un modelo, servicio, repositorio o componente que será parte de una feature.
- Implementas una parte de la solución a un bug.
- Cualquier paso intermedio hacia un objetivo mayor.

**❌ Cuándo NO usarlo:**
- Para el commit final de squash merge (usa `feat`, `fix` o `perf`).
- Para cambios que son completos y autónomos.

**Ejemplos:**
```txt
# Backend
add(clientes): Modelo Customer con validaciones
add(clientes): CustomerRepository con métodos CRUD
add(api): Middleware de validación de permisos

# Frontend
add(formularios): Componente InputField reutilizable
add(tabla): Lógica de ordenamiento por columnas
add(estilos): Variables CSS para tema oscuro

# Testing
add(mocks): Mock de servicio de pagos para tests
add(fixtures): Datos de prueba para módulo de facturación
```

### 5.5. `wip` - Trabajo en Progreso 🔨

**Qué es:** Checkpoint temporal para guardar trabajo incompleto.

**✅ Cuándo usarlo:**
- Necesitas cambiar de rama/tarea urgentemente.
- Quieres hacer un checkpoint antes de un cambio arriesgado.
- Al final del día para no perder cambios locales.
- Guardas progreso para compartir con el equipo.

**❌ Cuándo NO usarlo:**
- No debe llegar a la rama principal (`main`/`master`).
- Debe reescribirse o convertirse en commits `add` antes del squash.

> [!WARNING]
> Los commits `wip` son temporales. Deben ser reescritos o eliminados antes de crear el PR final.

**Ejemplos:**
```txt
wip: Avance en formulario de registro
wip(autenticación): Implementación parcial de OAuth2
wip: Checkpoint antes de refactor mayor
wip(reportes): Gráficos a medio terminar
wip: Guardando cambios antes de cambiar de rama
```

### 5.6. `docs` - Documentación

**Qué es:** Cambios en documentación escrita, guías, README, comentarios de código, especificaciones o documentación del código.

**✅ Cuándo usarlo:**
- Actualizar README, añadir guía de contribución, corregir typos en documentación, mejorar comentarios de código que explican algoritmo.
- El cambio es solo texto, imágenes u otros activos de documentación y no modifica código de producción ni pruebas.
- Cuando agregas cualquier tipo de documentación del proyecto.

**❌ Cuándo NO usarlo:**
- No usar para cambios que modifiquen código o comportamiento.

**Ejemplos:**
```txt
# Documentación de proyecto
docs: Actualización de README con instrucciones de instalación
docs: Guía de contribución para nuevos desarrolladores
docs: Manual de usuario para módulo de facturación

# Documentación técnica
docs(api): Especificación OpenAPI para endpoints de productos
docs(arquitectura): Diagramas de flujo del sistema
docs(código): JSDoc en funciones de utilidades
```

### 5.7. `style` - Formato de Código

**Qué es:** Cambios que afectan la apariencia del código (formato) sin cambiar la lógica: indentación, espacios, formato, punto y coma, linter autofix.

**✅ Cuándo usarlo:**
- Aplicar prettier/eslint autofix o cualquier herramienta que sólo cambia formato del código.
- Cambios en comentarios de estilo (no su contenido explicativo).

**❌ Cuándo NO usarlo:**
- Si el cambio en formato implicó ajustar código para que funcione diferente o arreglar un bug.

**Ejemplos:**
```txt
style: Aplicación de reglas de ESLint en todo el proyecto
style: Formateo con Prettier
style(componentes): Corrección de indentación en archivos JSX
style(api): Reordenamiento de imports según convención
style: Eliminación de espacios en blanco innecesarios
```

### 5.8. `refactor` - Refactorización

**Qué es:** Cambios en el código que no alteran la funcionalidad observable pero mejoran estructura, legibilidad o mantenibilidad.

**✅ Cuándo usarlo:**
- Renombrar variables, extraer funciones, mover módulos, reorganizar archivos, simplificar lógica sin cambiar comportamiento.
- Cambios arquitectónicos internos donde no cambian comportamientos internos.

**❌ Cuándo NO usarlo:**
- Si introduces una nueva funcionalidad.
- Si mejoras rendimiento notablemente.

**Ejemplos:**
```txt
# Backend
refactor(servicios): Extracción de lógica común a clase base
refactor(api): División de controlador grande en módulos
refactor(db): Migración de queries raw a ORM

# Frontend
refactor(componentes): Conversión de clases a hooks
refactor(estado): Migración de Redux a Zustand
refactor(estilos): Reorganización de archivos CSS por módulo
```

### 5.9. `test` - Pruebas

**Qué es:** Añadir, modificar o arreglar pruebas automatizadas.

**✅ Cuándo usarlo:**
- Añadir tests para nueva funcionalidad, arreglar tests rotos, mejorar cobertura de prueba, cambiar configuración de test runner.

**❌ Cuándo NO usarlo:**
- No uses para añadir nuevos mocks o fakes que también cambien la lógica de producción.

**Ejemplos:**
```txt
# Tests unitarios
test(servicios): Tests para CustomerService
test(utilidades): Tests para funciones de formateo

# Tests de integración
test(api): Tests de integración para endpoint /orders
test(autenticación): Tests de flujo OAuth completo

# Tests E2E
test(checkout): Suite E2E para flujo de compra
test(registro): Tests automatizados de formulario de registro

# Configuración de tests
test: Configuración de Jest para tests asíncronos
test: Corrección de mocks desactualizados
```

### 5.10. `chore` - Mantenimiento

**Qué es:** Tareas de mantenimiento que no afectan código de producción ni pruebas directamente (scripts, tareas administrativas, limpieza).

**✅ Cuándo usarlo:**
- Actualizar dependencias de desarrollo (no de producción), scripts build auxiliares, tareas de mantenimiento sin impacto en runtime.
- El cambio no modifica la lógica ejecutada en producción.
- No introduce ni arregla comportamiento que usuarios o sistemas externos percibirían.
- No es una tarea de CI/CD que afecte cómo se construye/despliega el artefacto final.

**❌ Cuándo NO usarlo:**
- No uses para actualizar dependencias que cambian comportamiento de producción.
- Corrige funcionalidades.
- Reescrituras de código o reorganizaciones con impacto en la mantenibilidad/performance.

**Ejemplos:**
```txt
# Dependencias de desarrollo
chore: Actualización de ESLint a versión 9
chore: Actualización de TypeScript a 5.x

# Scripts y herramientas
chore: Script de limpieza de caché de desarrollo
chore: Configuración de Husky para pre-commit hooks

# Limpieza
chore: Eliminación de archivos temporales del repositorio
chore: Actualización de .gitignore
```

### 5.11. `ci` - Integración Continua

**Qué es:** Cambios en la configuración de integración continua / pipelines / workflows.

**✅ Cuándo usarlo:**
- Modificar GitHub Actions, GitLab CI, Travis, pipelines de despliegue, variables de CI/CD, jobs de build/test.

**❌ Cuándo NO usarlo:**
- Si el cambio modifica build tools o dependencias del proyecto.

**Ejemplos:**
```txt
# GitHub Actions
ci: Workflow para tests en paralelo
ci: Job de análisis de código con SonarQube
ci: Automatización de releases con semantic-release

# Pipelines
ci: Optimización del tiempo de build (caché de dependencias)
ci: Stage de despliegue a entorno de staging

# Calidad
ci: Integración de reporte de cobertura con Codecov
ci: Escaneo de vulnerabilidades en dependencias
```

### 5.12. `build` - Sistema de Build

**Qué es:** Cambios que afectan el sistema de compilación, empaquetado o dependencias que influyen en el artefacto final.

**✅ Cuándo usarlo:**
- Cambiar, actualizar dependencias de producción, modificar Dockerfile que afecta la imagen final.
- Actualizas dependencias cuyos cambios podrían afectar el comportamiento en producción.

**❌ Cuándo NO usarlo:**
- El cambio es exclusivamente sobre pipelines/CI (jobs, secrets, matrix de ejecución) y no modifica el artefacto en sí.

**Ejemplos:**
```txt
# Dependencias de producción
build: Actualización de React a versión 19
build: Actualización de Django por parche de seguridad
build: Migración de axios a fetch nativo

# Configuración de build
build(webpack): Configuración para tree-shaking
build(vite): Optimización de chunks para lazy loading
build: Configuración de minificación de CSS

# Docker
build(docker): Dockerfile multistage para imagen más ligera
build(docker): Actualización de imagen base por seguridad
```

### 5.13. `revert` - Revertir Cambios

**Qué es:** Revertir un commit previo.

**✅ Cuándo usarlo:**
- Revertir un cambio que introdujo un bug o que no debe permanecer por razones operativas, manteniendo historial claro.

**❌ Cuándo NO usarlo:**
- No usar para deshacer trabajo en progreso — si aún no se hizo push, puedes reescribir localmente.

**Ejemplos:**
```txt
revert: Reversión de "feat(auth): Login con Google"

This reverts commit <hash>.
```

## 🔹 6. Scope

El `scope` indica qué parte del sistema se ve afectada por el cambio. En este proyecto, el scope tiene un rol especial: **se usa como título de categoría en las notas de la release**.

> [!IMPORTANT]
> El scope es **obligatorio** en commits finales (`feat`, `fix`, `perf`) y **opcional** en los casos restantes.

### 6.1. ¿Por qué es importante el Scope?

Cuando semantic-release genera las notas de la release, agrupa los cambios por scope. Por ejemplo:

**Commits:**
```txt
feat(usuarios): Funcionalidad para crear clientes
feat(usuarios): Filtros avanzados en listado
fix(productos): Corrección de precio con descuento
feat(reportes): Exportación a PDF
```

**Release Notes generadas:**
```markdown
## Usuarios
- Funcionalidad para crear clientes
- Filtros avanzados en listado

## Productos
- Corrección de precio con descuento

## Reportes
- Exportación a PDF
```

### 6.2. Reglas de Formato

| Regla | Descripción | Ejemplo |
|-------|-------------|---------|
| **Idioma** | En español | `usuarios`, `productos`, `reportes` |
| **Formato** | Sustantivo en minúsculas | `facturación`, `autenticación` |
| **Singular o plural** | Usa el que suene más natural como título | `usuarios` (no `usuario`) |
| **Sin artículos** | No uses "el", "la", "los" | `clientes` (no `los-clientes`) |
| **Kebab-case si es compuesto** | Para nombres de dos palabras | `notas-credito`, `tipos-documento` |

## 🔹 7. Breaking Change

Cuando un cambio rompe la compatibilidad o modifica el comportamiento esperado, se debe usar la nota **BREAKING CHANGE**. Esto indica que el cambio realizado no es retrocompatible y que, por lo tanto, quienes usen el sistema, librería o servicio deberán adaptar su código o procesos para evitar errores.

> [!IMPORTANT]
> Este tipo de nota implica incrementos de **versión mayor** en el esquema de [versionado semántico (semver)](https://semver.org/lang/es/).

### 7.1. Regla Decisiva

Añade `BREAKING CHANGE` si y solo si el cambio exige alguna de estas tres cosas:

| Criterio | Ejemplo |
|----------|---------|
| Consumidores necesitan cambiar su código/config para seguir funcionando | Cambio en parámetros requeridos |
| La forma, nombre o semántica de una API/contrato cambió | Renombrar campos de respuesta |
| Se eliminó o reemplazó un comportamiento/endpoint/archivo | Eliminar endpoint deprecado |

### 7.2. ¿Dónde y Cómo Indicarlo?

1. **Footer del commit:** Siempre agrega la sección `BREAKING CHANGE: <explicación>`.
2. **Marca el asunto con `!`:** (opcional pero recomendable) `feat(api)!: Cambio en estructura de respuesta`. Herramientas automáticas lo detectan mejor.
3. **Incluye en el body:** Una explicación corta del cambio y en el footer las instrucciones de migración detalladas.

```txt
feat(api)!: Cambio en estructura de respuesta del endpoint /usuarios

Unificación de nomenclatura de campos y eliminación de wrappers de metadata.

BREAKING CHANGE: el campo "id_usuario" pasa a llamarse "userId".
Pasos de migración:
1. Actualizar cliente para leer userId en lugar de id_usuario.
2. Recompilar y desplegar cliente X antes de desplegar servicio Y.
```

Es recomendable acompañar el **BREAKING CHANGE** con una explicación clara de:
- Qué ha cambiado.
- Por qué era necesario modificarlo.
- Qué pasos deben seguir las personas usuarias o el equipo para adaptarse al nuevo comportamiento.

## 🔹 8. Errores Comunes

Evita estos errores frecuentes al escribir commits:

### 8.1. Errores de Redacción

| ❌ Incorrecto | ✅ Correcto | Razón |
|--------------|-------------|-------|
| `Agregar login con Google` | `Integración de login con Google` | Usa frase nominal, no imperativo |
| `Corregir el bug de overflow` | `Corrección de bug de overflow` | Evita artículos y verbos al inicio |
| `Implementar lazy loading` | `Implementación de carga diferida` | Describe QUÉ es, no QUÉ hacer |
| `Actualizar dependencias.` | `Actualización de dependencias` | Sin punto final |

### 8.2. Errores de Tipo de Commit

| ❌ Incorrecto | ✅ Correcto | Razón |
|--------------|-------------|-------|
| `feat: Creación de modelo Product` | `add: Modelo Product` | Es un paso intermedio, no la feature completa |
| `fix: Cambio de color de botón` | `style: Ajuste de color de botón` | Cambio estético, no es un bug |
| `feat: Actualización de dependencias` | `build: Actualización de dependencias` | No es funcionalidad nueva |
| `chore: Corrección de test roto` | `test: Corrección de test unitario` | Es específico de testing |
| `fix: Refactorización de función` | `refactor: Reorganización de función` | No había bug que corregir |
| `feat: Mejora de rendimiento` | `perf: Optimización de consultas` | No es funcionalidad, es optimización |

### 8.3. Otros Errores a Evitar

- ❌ **Descripciones vagas:** `fix: Corrección de bug`, `feat: Cosas nuevas`
- ❌ **Commits muy grandes:** Un commit debe hacer una sola cosa
- ❌ **Mezclar tipos:** No combines `feat` + `fix` en el mismo commit
- ❌ **Usar verbos imperativos:** Usa `Adición de` en lugar de `Agregar`
- ❌ **Exceder 72 caracteres:** Mantén la descripción concisa
- ❌ **Terminar con punto:** No uses puntuación final
