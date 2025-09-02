# 🔹 Creación de un commit

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
- `<opcional notas al pie>`: Espacio reservado para inforación especial como referencias a incidencias o tickets, cambios que rompen compatibilidad (usando BREAKING CHANGE:) y notas para despliegues o migraciones.

# 🔹 Tipos de commit

Los tipos más usados son aquellos que cubren la mayoría de los escenarios en el trabajo colaborativo. Estos ayudan a clasificar los cambios de manera uniforme y permiten que cualquier persona del equipo entienda rápidamente la intención del commit sin tener que revisar el código. Usar estos tipos de forma consistente facilita la lectura del historial, mejora la comunicación y sienta las bases para procesos automatizados como la generación de changelogs o la gestión de versiones.

- `feat`: Agrega una nueva funcionalidad.

  ```txt
  feat(auth): implementar login con Google
  ```

- `fix`: Corrige un error.

  ```txt
  fix(api): manejar correctamente errores 404
  ```

- `docs`: Cambios en documentación (guías, comentarios, manuales, etc).

  ```txt
  docs: actualizar guía de contribución
  ```

- `style`: Cambios de formato que no afectan la lógica (espacios, comas, indentación, etc).

  ```txt
  style: aplicar reglas de eslint
  ```

- `refactor`: Cambios en el código que no alteran la funcionalidad.

  ```txt
  refactor(core): optimizar validación de datos
  ```

- `test`: Agregar o modificar pruebas.

  ```txt
  test: añadir pruebas de integración
  ```

- `chore`: Tareas de mantenimiento, configuración o dependencias.

  ```txt
  chore: actualizar librerías
  ```

- `perf`: Mejoras de rendimiento.

  ```txt
  perf(api): optimizar consulta a base de datos
  ```

- `ci`: Cambios en la configuración de integración continua o despliegue.

  ```txt
  ci: actualizar workflow de GitHub Actions
  ```

- `build`: Cambios que afectan el sistema de compilación, dependencias o herramientas externas.

  ```txt
  build: actualizar configuración de webpack
  ```

- `revert`: Revertir un commit anterior.

  ```txt
  revert: volver a versión previa de autenticación
  ```

# 🔹 Scope

El `scope` es opcional, pero recomendable, sirve para indicar de forma clara qué parte del sistema, módulo o componente se ve afectado por el cambio. Esto resulta especialmente útil en equipos grandes o en proyectos con varias áreas de desarrollo, ya que permite identificar rápidamente la zona impactada sin necesidad de revisar el commit completo.

Algunos ejemplos de scope podrían ser: `auth`, `api`, `ui`, `config`, `database`, `docs`, entre otros. También se pueden usar nombres de carpetas, servicios o módulos específicos si eso facilita la organización. La clave es mantener consistencia en el uso del scope dentro del equipo para que sea realmente informativo.

👉 Ejemplo con scope:

```txt
feat(ui): agregar componente de búsqueda
```

👉 Ejemplo sin scope:

```txt
fix: corregir error en configuración de build
```

# 🔹 Breaking change

Cuando un cambio rompe la compatibilidad o modifica el comportamiento esperado, se debe usar la nota **BREAKING CHANGE**. Esto indica que el cambio realizado no es retrocompatible y que, por lo tanto, quienes usen el sistema, librería o servicio deberán adaptar su código o procesos para evitar errores. Este tipo de nota suele implicar incrementos de versión mayor en el esquema de [versionado semántico (semver)](https://semver.org/lang/es/).

Es recomendable acompañar el **BREAKING CHANGE** con una explicación clara de:

- Qué ha cambiado.
- Por qué era necesario modificarlo.
- Qué pasos deben seguir las personas usuarias o el equipo para adaptarse al nuevo comportamiento.

```txt
feat(api): modificar estructura de respuesta en /usuarios

BREAKING CHANGE: el campo "id_usuario" pasa a llamarse "userId".
Los consumidores de la API deberán actualizar sus integraciones.

```
