# 🔹 1. Condiciones para la creación de ramas

La creación de una rama de trabajo debe realizarse únicamente cuando exista una tarea o issue asignado a un desarrollador. Esto significa que no se deben crear ramas de manera anticipada o sin un propósito definido, ya que cada rama representa un esfuerzo de desarrollo vinculado a una necesidad concreta del proyecto. Cada rama debe estar asociada a un issue/tarea único, lo cual permite:

- **Mantener la trazabilidad:** cualquier cambio en el código se puede rastrear directamente hasta el requerimiento que lo originó.
- **Facilitar la gestión del proyecto:** en revisiones de código, despliegues o auditorías es más sencillo identificar qué problema o funcionalidad está siendo atendida.
- **Evitar duplicidad de esfuerzos:** si dos desarrolladores crean ramas para el mismo problema sin coordinación, se generan conflictos innecesarios y retrabajo.
- **Garantizar la responsabilidad clara:** al estar asignada la tarea, siempre se sabe quién o quienes son los responsables de la rama y de su evolución.
- **Mantener el repositorio limpio y organizado:** ramas sin issue asociado tienden a quedar abandonadas y entorpecen la gestión del repositorio.

En resumen, una rama equivale a una tarea viva en desarrollo. Cuando la tarea se completa, la rama debe integrarse al flujo principal (`develop`, `main`, según corresponda) y posteriormente eliminarse, cerrando así el ciclo de vida de la rama junto con el issue que le dio origen.

# 🔹 2. Creación de ramas de trabajo: Métodos recomendados

En un flujo de trabajo basado en ramas (`develop`, `feat/*`, `hotfix/*`, etc.), la creación de ramas correctas es un paso crítico para mantener la estabilidad del código y evitar conflictos innecesarios. Cada nueva rama representa un espacio aislado donde un desarrollador puede trabajar en una tarea, corrección o funcionalidad sin afectar directamente la rama principal o la de desarrollo.

Una rama mal creada, desde `main` en lugar de `develop`, o desde un rama desactualizado puede introducir inconsistencias, dificultar la integración posterior y generar conflictos de merge que pueden ser costosos de resolver. Por ello, es fundamental estandarizar la forma en que se crean las ramas dentro del equipo.

A continuación, se documentan dos enfoques válidos para crear ramas de trabajo:

- El método clásico, que refuerza la disciplina de mantener el repositorio local actualizado.
- Un método más seguro, que garantiza partir siempre de lo último disponible en el repositorio remoto, incluso si el entorno local no está sincronizado.

> [!NOTE]
> Ambos enfoques son correctos y pueden convivir, pero es importante que el equipo elija cuál será la práctica recomendada para asegurar consistencia y reducir errores.

# 🔹 Enfoque 1: Método clásico

- **Paso 1:** Posicionarse en la rama `develop`.
    
    ```bash
    git checkout develop
    ```

    👉 **Propósito:** Asegurarse de estar en la rama base desde donde deben partir todas las ramas de desarrollo.<br>
    ⚠️ **Problema que evita:** Crear la rama accidentalmente desde main u otra rama equivocada o desactualizada.

- **Paso 2:** Actualizar la rama `develop` de tu repositoroio local.

    ```bash
    git pull origin develop
    ```

    👉 **Propósito:** Traer los últimos cambios de la rama remota.<br>
    ⚠️ **Problema que evita:** Empezar la nueva rama con una base desactualizada, lo que generaría conflictos al hacer merge después.

- **Paso 3:** Crear la nueva rama.

    ```bash
    git checkout -b <nombre de la rama nueva>
    ```

    👉 **Propósito:** Crear una nueva rama local, basada en la rama actual (`develop`).<br>
    ⚠️ **Problema que evita:** Tener ramas que no siguen la convención de nombres o que parten de la rama incorrecta.

> [!NOTE]
> El nombre de las ramas deben seguir el estandar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

- **Paso 4:** Publicar la rama en remoto.

    ```bash
    git push -u origin <nombre de la rama nueva>
    ```

    👉 **Propósito:** Subir la rama al repositorio remoto y establecer el “tracking” con la rama remota correspondiente.<br>
    ⚠️ **Problema que evita:** Ramas que solo existen en local, invisibles para el resto del equipo.

✅ **Ventajas de este método:**

- Refuerza la práctica de mantener develop local siempre actualizado.
- Es intuitivo y fácil de recordar.

⚠️ **Riesgo principal:**

- Si el desarrollador olvida hacer git pull antes de crear la rama, puede partir de un develop local desactualizado.

# 🔹 Enfoque 2: Método seguro

- **Paso 1:** Actualizar referencias remotas.

    ```bash
    git fetch --all
    ```

    👉 **Propósito:** Sincronizar todas las referencias remotas en tu repositorio local.<br>
    ⚠️ **Problema que evita:** Crear una rama desde una referencia de develop obsoleta que no incluya los últimos cambios del equipo.

- **Paso 2:** Sin importar en qué rama estés, crear la nueva rama desde `origin/develop`.

    ```bash
    git checkout -b <nombre de la rama nueva> origin/develop
    ```

    👉 **Propósito:** Esto garantiza que la nueva rama contiene exactamente lo último que hay en develop remoto, aunque tu develop local esté desactualizado.<br>
    ⚠️ **Problema que evita:** Reduce los riesgos de arrastrar commits faltantes.

> [!NOTE]
> El nombre de las ramas deben seguir el estandar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

- **Paso 3:** Publicar la rama en remoto.

    ```bash
    git push -u origin <nombre de la rama nueva>
    ```

    👉 **Propósito:** Puede ejecutarse desde cualquier rama en la que estés.<br>
    ⚠️ **Problema que evita:** Reduce los riesgos de arrastrar commits faltantes.

✅ **Ventajas de este método:**

- Más seguro, unca dependes de tener develop local actualizado.
- Puede ejecutarse desde cualquier rama en la que estés.

⚠️ **Riesgo principal:**

- Mas que un riesgo, es una desventaja, ya que te obliga ejecutar periódicamente `git fetch --all` para mantener sincronizadas todas las referencias remotas en tu repositorio local.
