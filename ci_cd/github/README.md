# 🔹 Integración Continua y Liberaciones Automáticas

Esta sección contiene una configuración inicial usada y probada por mi para automatizar releases con [GitHub Actions](https://docs.github.com/en/actions) y [semantic-release](https://semantic-release.gitbook.io/semantic-release/usage/getting-started). Puedes agregar estos archivos en la raíz de tu proyecto en GitHub para que la plataforma los detecte automáticamente y así aprovechar toda la configuración que se describe en esta documentación.

## 🔹 1. Archivos de Configuración

Los archivos clave que se explican a continuación son:

| Archivo | Descripción |
|---------|-------------|
| `.github/workflows/publish-release.yml` | Configuración del workflow en GitHub Actions |
| `.github/pull_request_template.md` | Plantilla para Pull Requests |
| `CHANGELOG.md` | Registro de cambios (vacío inicialmente, lo actualiza semantic-release) |
| `release.config.cjs` | Configuración de semantic-release |

### 1.1. `.github/workflows/publish-release.yml`

Define el workflow de CI/CD para la publicación de releases. El flujo se ejecuta cuando hay un push a la rama main:

| Job | Descripción |
|-----|-------------|
| `publish_release` | Un flujo que ejecuta semantic-release para analizar los commits, generar notas de release, actualizar CHANGELOG.md, crear tag y publicar release en GitHub. |

### 1.2. `.github/pull_request_template.md`

- Plantilla que se muestra automáticamente al crear una nueva Pull Request.
- Facilita la documentación de los cambios y mantiene un formato consistente.

### 1.3. `CHANGELOG.md`

- Archivo que documenta los cambios por versión.
- Está vacío en el repositorio porque semantic-release lo actualiza automáticamente cada vez que se publica una nueva release.

### 1.4. `release.config.cjs`

- Configuración de semantic-release. Puntos relevantes:
  - `branches: ['main']`: Solo se liberarán versiones desde la rama main.
  - `repositoryUrl`: Sustituir por la URL real del repositorio.
  - `repositoryUrlCommit`: Sustituir por la URL real de los commits del repositorio.
  - `repositoryUrlMergeRequests`: Sustituir por la URL real de las PR del repositorio.
  - `tagFormat: 'v${version}'`: Formato del tag generado.
  - Plugins configurados:
    - `@semantic-release/commit-analyzer`: Determina si la release es patch/minor/major a partir de los tipos de todos los commit desde el ultimo tag creado.
    - `@semantic-release/release-notes-generator`: Mapea los tipos de commit y genera las notas de la release.
    - `@semantic-release/changelog`: Escribe en CHANGELOG.md.
    - `@semantic-release/git`: Commitea el cambio hecho en el archivo CHANGELOG.md.
    - `@semantic-release/github`: Publica la release en GitHub.

## 🔹 2. Prerrequisitos y Configuración en GitHub

- El workflow utiliza el token `GITHUB_TOKEN` que GitHub proporciona automáticamente. Este token tiene los permisos necesarios para publicar releases y hacer commits.
- Las ramas main y development deben estar configuradas como ramas protegidas en la configuración del repositorio.
- Antes de que semantic-release tome el control, debes crear el primer tag de versión manualmente:
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  ```

> [!IMPORTANT]
> Cuando inicies un proyecto nuevo y agregues los archivos iniciales, crea el tag v0.1.0 para establecer el punto de partida. A partir de ahí, semantic-release se encargará de incrementar las versiones automáticamente.

## 🔹 3. Modificaciones Requeridas

> [!NOTE]
> Este paso es importante porque estas modificaciones determinarán la versión final de los archivos que usarás en tu proyecto, así que presta mucha atención a la siguiente información.

### 3.1. Modificaciones Obligatorias

- Mantener `repositoryUrl`, `repositoryUrlCommit` y `repositoryUrlMergeRequests` actualizado en `release.config.cjs`.

## 🔹 4. Flujo General

> [!NOTE]
> Este flujo asume que se sigue la estrategia de ramas documentada en [Estrategia de Ramas](../../guides/branching_strategy.md).

### 4.1. ¿Qué pasa cuando se abre una PR?

Abrir una PR es el momento en el que el código aún está en revisión y validación, por lo tanto no se realizan publicaciones. El flujo `publish_release` no se ejecuta en este escenario ya que está configurado para ejecutarse solo en la rama main.

**Resultado:** Los cambios quedan listos para revisión humana, pero no se publica ninguna release.

### 4.2. ¿Qué pasa cuando se acepta una PR que tiene como destino la rama development?

La rama development es el entorno de desarrollo y pruebas, donde se validan cambios antes de promoverlos a main. Las PR hacia development deben aceptarse usando **squash merge** con un mensaje de commit que use un prefijo reservado (`feat`, `fix`, `perf`). No se publican releases ni se crean tags desde development.

1. GitHub combina todos los commits de la rama en un único commit en la rama development.
2. El workflow `publish_release` no se ejecuta en este escenario, este flujo está configurado para la rama main.

**Resultado:** Los cambios fueron integrados a development, no se crea ningún tag, no se publica una release y `CHANGELOG.md` no se modifica.

### 4.3. ¿Qué pasa cuando se acepta una PR que tiene como destino la rama main?

Las PR hacia main (ya sea desde development o desde una rama de hotfix) deben aceptarse usando **rebase** para preservar todos los commits individuales. Esto es esencial porque `semantic-release` necesita analizar cada commit para determinar la versión y generar las release notes. Una vez aceptada una PR usando **rebase**:

1. GitHub aplica los commits en main.
2. GitHub Actions detecta el push a main y ejecuta el workflow `publish_release`.
3. `semantic-release` analiza los commits desde el último tag publicado o todo el historial si no existe un tag.
4. Decide el tipo de versión (patch, minor, major) según los tipos de commit y convenciones.
5. Genera notas de release formateadas según lo definido en `release.config.cjs`.
6. Actualiza `CHANGELOG.md`.
7. Crea el tag y publica la release en GitHub.

**Resultado:** El proyecto tiene un nuevo tag, una nueva release y `CHANGELOG.md` está actualizado con las notas de la release.
