# Integración continua y liberaciones automáticas
Esta sección contiene una configuración inicial usada y probada por mi para desplegar entornos y automatizar `releases` con [GitLab CI](https://docs.gitlab.com/ci/) y [semantic-release](https://semantic-release.gitbook.io/semantic-release/usage/getting-started). Puedes agregar estos archivos en la **raíz** de tu proyecto en GitLab para que la plataforma los detecte automáticamente y así aprovechar toda la configuración que se describe en esta documentación. Los archivos clave que se explican a continuación son:

- `.gitlab-ci.yml`: Configuración de la pipeline en GitLab.
- `CHANGELOG.md`: Registro de cambios (vacío inicialmente, lo actualiza `semantic-release`).
- `release.config.js`: Configuración de `semantic-release`.

## Propósito de cada archivo
### `.gitlab-ci.yml`
Define la pipeline de CI/CD con dos etapas principales:

- `deploy`:
  - `deploy_development_env` un flujo pensado para despliegues desde la rama `develop`.
  - `deploy_production_env` un flujo pensado para despliegues desde la rama `main`.

- `release`:
  - `publish_release` un flujp que ejecuta `semantic-release` para:
    - Analizar los commits (convencional commits).
    - Generar notas de `release`.
    - Actualizar `CHANGELOG.md`.
    - Crear `tag` y publicar `release` en GitLab.

### `CHANGELOG.md`
- Archivo que documenta los cambios por versión.
- Está vacío en el repositorio porque `semantic-release` lo actualiza automáticamente cada vez que se publica una nueva `release`.

### `release.config.js`
- Configuración de `semantic-release`. Puntos relevantes:
  - `branches: ['main']`: Solo se liberarán versiones desde `main`.
  - `repositoryUrl`: Sustituir por la URL real del repositorio.
  - `tagFormat: 'v${version}'`: Formato del tag generado.
  - Plugins configurados:
    - `@semantic-release/commit-analyzer` con preset `conventionalcommits`: Determina si la release es `patch/minor/major` a partir de los tipos de commit.
    - `@semantic-release/release-notes-generator` con `presetConfig` personalizado: Mapea tipos de commit a secciones en el changelog.
    - `@semantic-release/changelog`: Escribe en `CHANGELOG.md`.
    - `@semantic-release/git`: Commitea `CHANGELOG.md` (mensaje: `'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'`). El `[skip ci]` evita loops de pipeline por el commit que `semantic-release` crea.
    - `@semantic-release/gitlab`: Publica la `release` en GitLab.

## Prerrequisitos y configuración en GitLab
- Crea una variable de entorno protegida en CI llamada `GITLAB_TOKEN` o `CI_JOB_TOKEN` con las siguientes opciones habilitadas `Masked`, `Protect variable` y `Expand variable reference`, esta variable tendra como valor un token de acceso con los permisos `api`, `read_repository`, `write_repository`. `@semantic-release/gitlab` necesita credenciales para publicar la release y `@semantic-release/git` para empujar cambios. Para crear y configurar el token de accesso puede consultar la siguiente documentación [aquí](https://docs.gitlab.com/user/project/settings/project_access_tokens/) y para crear y configurar la variable de entorno puede consultar la siguiente documentación [aquí](https://docs.gitlab.com/ci/variables/).
- Cualquier rama que tenga como objetivo realizar una `MR` hacia la rama `main` debe ser una rama protegida. En algunos casos no conviene proteger la rama para trabajar mejor con ella. Considere proteger la rama en el momento en que se vaya a revisar o aceptar la `MR` y mantenerla desprotegido mientras se trabaja en ella.
- Mantener `repositoryUrl` actualizado en `release.config.js`.

## Flujo general 
### ¿Qué pasa cuando haces `push` a `main`?
Publicar después de que una `MR` se ha fusionado en `main` es ideal porque ese momento indica que los cambios han sido revisados, testeados y aprobados. La `MR` es el punto de control humano + CI que valida la calidad del cambio, por eso `semantic-release` se ejecuta en el pipeline que se dispara tras el `push` resultante de la fusión a `main` y justo despues de realizar un despliegue a `producción`. Una vez aprobada la `MR`:

1. GitLab crea el commit resultante en `main` y dispara la pipeline de CI por ese `push`.
2. GitLab CI evalúa `.gitlab-ci.yml`. Si la regla `deploy_production_env` coincide, se ejecuta el flujo encargado de realizar el despliegue a producción del proyecto.
3. Luego, Si la regla `publish_release` coincide, se ejecuta el flujo encargado de realizar la publicación de la `release` y determinar la versión.
4. `semantic-release` analiza los commits desde el último `tag` publicado o todo el historial de commits hasta ese momento si no existe un `tag`.
5. Decide el tipo de versión (patch, minor, major) según los tipos de commit y convenciones.
6. Genera notas de release formateadas según lo definido en `release.config.js`.
7. Actualiza `CHANGELOG.md`.
8. Crea el `tag` (vX.Y.Z) y publica la release en GitLab.

**Resultado:** El proyecto fue desplegado a producción, tiene un nuevo `tag`, una nueva `release` y `CHANGELOG.md` está actualizado con las notas de la `release`.

### ¿Qué pasa cuando haces `push` a `develop`?
La rama `develop` se usa como entorno de desarrollo y de pruebas, es el lugar donde se validan cambios antes de promoverlos a `main`. Por diseño no se publican `releases` ni se crean `tags` desde `develop`, en su lugar se ejecuta el flujo encargado de desplegar a un entorno de desarrollo. Una vez aprobada la `MR`:

1. GitLab crea el commit resultante en `develop` y dispara la pipeline de CI por ese `push`.
2. GitLab CI evalúa `.gitlab-ci.yml`. Si la regla `deploy_development_env` coincide, se ejecuta el flujo que realiza el despliegue al entorno de desarrollo.
3. `semantic-release` no se ejecuta en este flujo, `publish_release` está configurado para la rama `main`, por lo que no se generan `tags` ni `releases` desde la rama `develop` y es importante que los mensajes de los commits respeten el estandar  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), porque cuando los cambios lleguen a la rama `main` serán esos mensajes los que `semantic-release` analizará para determinar la versión

**Resultado:** El proyecto fue desplegado al entorno de desarrollo, no se crea ningún `tag`, no se publica una `release` y `CHANGELOG.md` no se modifica.
