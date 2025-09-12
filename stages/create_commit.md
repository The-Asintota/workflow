# 🔹 1. Creación de un commit

El uso de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) permite mantener un historial de cambios claro, consistente y fácil de entender en cualquier entorno de trabajo colaborativo. Adoptar esta convención aporta varios beneficios:

- 📖 **Claridad:** cada commit deja explícito si se trata de una nueva funcionalidad, una corrección, un cambio en la documentación, una tarea de mantenimiento, entre otros.
- 🤝 **Colaboración:** al utilizar un mismo lenguaje y formato, todas las personas que contribuyen entienden rápidamente la naturaleza de cada cambio.
- ⚙️ **Automatización:** muchas herramientas pueden generar automáticamente changelogs, manejar versionado semántico (semver) y crear notas de lanzamiento a partir de los commits.
- 🔍 **Trazabilidad:** resulta más sencillo identificar cuándo y dónde se introdujo una funcionalidad, una mejora de rendimiento o la corrección de un error.
- 🚀 **Escalabilidad:** cuanto mayor es el número de personas involucradas, más útil resulta contar con un estándar común que evite confusiones y mantenga ordenado el flujo de trabajo.

En resumen, **Conventional Commits** no solo define un formato de mensajes, sino que funciona como una guía de comunicación técnica que facilita el trabajo en equipo en cualquier tipo de proyecto. La estructura de un commit es la siguiente:

```txt
<tipo>(<scope>): <descripción corta>

<opcional cuerpo>

<opcional notas al pie>
```

- `<tipo>`: Indica la naturaleza del cambio realizado.
- `<scope>` (opcional): Señala el ámbito o área afectada por el cambio.
- `<descripción corta>`: Explica de manera breve y concisa el cambio realizado. Debe escribirse en tiempo presente, en modo imperativo y con un máximo de 72 caracteres.
- `<opcional cuerpo>`: Aquí se pueden incluir detalles adicionales: razones del cambio, contexto, diferencias con la versión anterior, etc. Útil cuando la descripción corta no es suficiente.
- `<opcional notas al pie>`: Espacio reservado para inforación especial como referencias a incidencias o tickets, cambios que rompen compatibilidad (usando [BREAKING CHANGE](#breaking-change) y notas para despliegues o migraciones.

# 🔹 2. Tipos de commit

Los tipos más usados son aquellos que cubren la mayoría de los escenarios en el trabajo colaborativo. Estos ayudan a clasificar los cambios de manera uniforme y permiten que cualquier persona del equipo entienda rápidamente la intención del commit sin tener que revisar el código. Usar estos tipos de forma consistente facilita la lectura del historial, mejora la comunicación y sienta las bases para procesos automatizados como la generación de changelogs o la gestión de versiones.

- `feat`<br>
  **Qué es:** Nueva funcionalidad o comportamiento visible para el usuario/cliente.<br>
  **Cuándo usarlo:**
    - Añades una nueva ruta, componente, comando, API pública, opción de configuración o flujo de negocio.
    - Agregas una capacidad nueva que los usuarios pueden usar (aunque sea deshabilitable).
    - Implementas una nueva integración con proveedor externo que cambia el comportamiento del producto.<br>

  **Cuándo NO usarlo:**
    - No sirve para cambios internos que no exponen nueva funcionalidad.
  <br>

  ```txt
  feat(auth): implementar login con Google
  feat(api): endpoint /users/export para exportar CSV
  ```

- `fix`<br>
  **Qué es:** Corrección de un bug que hace que algo falle o bote resultados incorrectos.<br>
  **Cuándo usarlo:**
    - Corriges un error de lógica, cálculo o comportamiento observable y no observable.
    - Reparas una excepción lanzada y que no se manejó correctamente.<br>

  **Cuándo NO usarlo:**
    - No uses `fix` para cambios meramente estéticos o refactorizaciones sin comportamiento erróneo.
  <br>

  ```txt
  fix(api): manejar correctamente errores 404 en /products
  fix(ui): evitar overflow en cards en vista móvil
  ```

- `docs`<br>
  **Qué es:** Cambios en documentación escrita, guías, README, comentarios de código, especificaciones o documentación del código.<br>
  **Cuándo usarlo:**
    - Actualizar README, añadir guía de contribución, corregir typos en documentación, mejorar comentarios de código que explican algoritmo.
    - El cambio es solo texto, imágenes u otros activos de documentación y no modifica código de producción ni pruebas.
    - Cuando agregas cualquier tipo de documentación del proyecto.<br>

  **Cuándo NO usarlo:**
    - No usar para cambios que modifiquen código o comportamiento.
  <br>

  ```txt
  docs: actualizar README con instrucciones de despliegue
  docs(api): documentar parámetros de /orders
  ```

- `style`<br>
  **Qué es:** Cambios que afectan la apariencia del código (formato) sin cambiar la lógica: indentación, espacios, formato, punto y coma, linter autofix.<br>
  **Cuándo usarlo:**
    - Aplicar prettier/eslint autofix o cualquier herramienta que sólo cambia formato del código.
    - Cambios en comentarios de estilo (no su contenido explicativo).<br>

  **Cuándo NO usarlo:**
    - Si el cambio en formato implicó ajustar código para que funcione diferente o arreglar un bug.
  <br>

  ```txt
  style: aplicar reglas de eslint (reformat)
  style(ui): corregir indentación en archivo Button.jsx
  ```

- `refactor`<br>
  **Qué es:** Cambios en el código que no alteran la funcionalidad observable pero mejoran estructura, legibilidad o mantenibilidad.<br>
  **Cuándo usarlo:**
    - Renombrar variables, extraer funciones, mover módulos, reorganizar archivos, simplificar lógica sin cambiar comportamiento.
    - Cambios arquitectónicos internos donde no cambian comportamientos internos.<br>

  **Cuándo NO usarlo:**
    - Si introduces una nueva funcionalidad.
    - Si mejoras rendimiento notablemente.
  <br>

  ```txt
  refactor(core): extraer validaciones a util/validation
  refactor(api): dividir controlador de usuario en servicios
  ```

- `test`<br>
  **Qué es:** Añadir, modificar o arreglar pruebas automatizadas.<br>
  **Cuándo usarlo:**
    - Añadir tests para nueva funcionalidad, arreglar tests rotos, mejorar cobertura de prueba, cambiar configuración de test runner.<br>

  **Cuándo NO usarlo:**
    - No uses para añadir nuevos mocks o fakes que también cambien la lógica de producción.
  <br>

  ```txt
  test(auth): añadir pruebas de integración para refresh token
  test: arreglar mocks en tests unitarios
  ```

- `chore`<br>
  **Qué es:** Tareas de mantenimiento que no afectan código de producción ni pruebas directamente (scripts, tareas administrativas, limpieza).<br>
  **Cuándo usarlo:**
    - Actualizar dependencias de desarrollo (no de producción), scripts build auxiliares, tareas de mantenimiento sin impacto en runtime.
    - El cambio no modifica la lógica ejecutada en producción.
    - No introduce ni arregla comportamiento que usuarios o sistemas externos percibirían.
    - No es una tarea de CI/CD que afecte cómo se construye/despliega el artefacto final.<br>

  **Cuándo NO usarlo:**
    - No uses para actualizar dependencias que cambian comportamiento de producción.
    - Corrige funcionalidades.
    - Reescrituras de código o reorganizaciones con impacto en la mantenibilidad/performance.
  <br>

  ```txt
  chore: actualizar dependencias dev
  chore: agregar script de limpieza de caché
  ```

- `perf`<br>
  **Qué es:** Cambios cuyo objetivo principal es mejorar rendimiento (menor CPU, menos memoria, menos latencia).<br>
  **Cuándo usarlo:**
    - Optimización de consultas a BD, caché, algoritmos que reducen tiempo de ejecución o uso de recursos.
    - Refactor con impacto medible en rendimiento cuando la intención del commit es mejorar rendimiento.<br>

  **Cuándo NO usarlo:**
    - No usar si el objetivo fue exclusivamente reorganizar código o mejorar legibilidad sin foco en rendimiento.
  <br>

  ```txt
  perf(api): agregar índices para acelerar consulta de órdenes
  perf(ui): lazy-load imágenes en lista de productos
  ```

- `ci`<br>
  **Qué es:** Cambios en la configuración de integración continua / pipelines / workflows.<br>
  **Cuándo usarlo:**
    - Modificar GitHub Actions, GitLab CI, Travis, pipelines de despliegue, variables de CI/CD, jobs de build/test.<br>

  **Cuándo NO usarlo:**
    - Si el cambio modifica build tools o dependencias del proyecto.
  <br>

  ```txt
  ci: actualizar workflow de GitHub Actions para tests paralelos
  ci: añadir job de seguridad (dependency scan)
  ```

- `build`<br>
  **Qué es:** Cambios que afectan el sistema de compilación, empaquetado o dependencias que influyen en el artefacto final.<br>
  **Cuándo usarlo:**
    - Cambiar, actualizar dependencias de producción, modificar Dockerfile que afecta la imagen final.
    - Actualizas dependencias cuyos cambios podrían afectar el comportamiento en producción.<br>

  **Cuándo NO usarlo:**
    - El cambio es exclusivamente sobre pipelines/CI (jobs, secrets, matrix de ejecución) y no modifica el artefacto en sí.
  <br>

  ```txt
  build: actualizar configuración de webpack para tree-shaking
  build(docker): optimizar Dockerfile multistage
  ```

- `revert`<br>
  **Qué es:** Revertir un commit previo.<br>
  **Cuándo usarlo:**
    - Revertir un cambio que introdujo un bug o que no debe permanecer por razones operativas, manteniendo historial claro.<br>

  **Cuándo NO usarlo:**
    - No usar para deshacer trabajo en progreso — si aún no se hizo push, puedes reescribir localmente.
  <br>

  ```txt
  revert: revert "feat(auth): añadir login con Google"

  This reverts commit <hash>.
  ```

# 🔹 3. Scope

El `scope` es opcional, pero recomendable, sirve para indicar de forma clara qué parte del sistema, módulo o componente se ve afectado por el cambio. Esto resulta especialmente útil en equipos grandes o en proyectos con varias áreas de desarrollo, ya que permite identificar rápidamente la zona impactada sin necesidad de revisar el commit completo. El scope describe el área técnica afectada, no la intención del cambio. Usa un sustantivo corto (módulo, paquete, servicio, carpeta, componente), en kebab-case y preferiblemente uno solo por commit. Si tocas varias áreas, separa en commits.

- Usa scope cuando el cambio impacta una parte identificable del sistema: `auth`, `api`, `ui`, `model`, `data`, `docker`, `mobile-android`, `cli`, `infra`, `billing`, `docs`, `tests`.
- Omite scope si el cambio es global, trivial o no aplica a una sola área (ej. chore: actualizar prettier o ci: actualizar workflow puede no necesitar scope).
- También se pueden usar nombres de carpetas, servicios o módulos específicos si eso facilita la organización.

👉 Ejemplo con scope:

```txt
feat(ui): agregar componente de búsqueda
```

👉 Ejemplo sin scope:

```txt
fix: corregir error en configuración de build
```

# 🔹 4. Breaking change

Cuando un cambio rompe la compatibilidad o modifica el comportamiento esperado, se debe usar la nota **BREAKING CHANGE**. Esto indica que el cambio realizado no es retrocompatible y que, por lo tanto, quienes usen el sistema, librería o servicio deberán adaptar su código o procesos para evitar errores. Este tipo de nota suele implicar incrementos de versión mayor en el esquema de [versionado semántico (semver)](https://semver.org/lang/es/). Es recomendable acompañar el **BREAKING CHANGE** con una explicación clara de:

- Qué ha cambiado.
- Por qué era necesario modificarlo.
- Qué pasos deben seguir las personas usuarias o el equipo para adaptarse al nuevo comportamiento.

## Regla corta y decisiva

Añade BREAKING CHANGE si y solo si el cambio exige alguna de estas tres cosas:

- Consumidores (usuarios, clientes, servicios) necesitan cambiar su código/config para seguir funcionando.
- La forma, nombre o semántica de una API/contrato/salida cambió (paths, parámetros, tipos, nombres de campos).
- Se eliminó o reemplazó un comportamiento/endpoint/archivo/flag cuya ausencia produce fallo en sistemas que lo consumían.

Si alguna respuesta es SÍ debes indicar BREAKING CHANGE.

## ¿Dónde y cómo indicarlo en el commit?
1. Footer del commit: siempre agrega la sección BREAKING CHANGE: <explicación>.
2. (Opcional pero recomendable) Marca el asunto con !: feat(api)!: cambiar estructura de respuesta. Herramientas automáticas lo detectan mejor.
3. Incluye en el body: una explicación corta del cambio y en el footer las instrucciones de migración detalladas.

```txt
feat(api)!: cambiar estructura de respuesta en /usuarios

Se unificó la nomenclatura de campos y se removieron wrappers de metadata.

BREAKING CHANGE: el campo "id_usuario" pasa a llamarse "userId".
Pasos de migración:
1. Actualizar cliente para leer userId en lugar de id_usuario.
2. Recompilar y desplegar cliente X antes de desplegar servicio Y.
```
