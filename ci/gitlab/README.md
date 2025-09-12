# 🔹 1. Integración continua y liberaciones automáticas
Esta sección contiene una configuración inicial usada y probada por mi para desplegar entornos y automatizar `releases` con [GitLab CI](https://docs.gitlab.com/ci/) y [semantic-release](https://semantic-release.gitbook.io/semantic-release/usage/getting-started). Puedes agregar estos archivos en la **raíz** de tu proyecto en GitLab para que la plataforma los detecte automáticamente y así aprovechar toda la configuración que se describe en esta documentación. Los archivos clave que se explican a continuación son:

- `.gitlab-ci.yml`: Configuración de la `pipeline` en GitLab.
- `CHANGELOG.md`: Registro de cambios (vacío inicialmente, lo actualiza `semantic-release`).
- `release.config.js`: Configuración de `semantic-release`.

# 🔹 2. Propósito de cada archivo
### `.gitlab-ci.yml`
Define la `pipeline` de CI/CD con tres etapas principales:

- `tests`:
  - Un flujo que ejecutará pruebas en cada modificación del código para identificar fallas en una etapa temprana.

- `deploy`:
  - `deploy_development_env` un flujo pensado para despliegues desde la rama `develop`.
  - `deploy_production_env` un flujo pensado para despliegues desde la rama `main`.

- `release`:
  - `publish_release` un flujp que ejecuta `semantic-release` para:
    - Analizar los `commits`.
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
    - `@semantic-release/commit-analyzer` con preset `conventionalcommits`: Determina si la release es `patch/minor/major` a partir de los tipos de `commit`.
    - `@semantic-release/release-notes-generator` con `presetConfig` personalizado: Mapea tipos de `commit` a secciones en el changelog.
    - `@semantic-release/changelog`: Escribe en `CHANGELOG.md`.
    - `@semantic-release/git`: Commitea `CHANGELOG.md` (mensaje: `'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'`). El `[skip ci]` evita loops de `pipeline` por el `commit` que `semantic-release` crea.
    - `@semantic-release/gitlab`: Publica la `release` en GitLab.

# 🔹 3. Prerrequisitos y configuración en GitLab
- Crea una variable de entorno protegida en CI llamada `GITLAB_TOKEN` o `CI_JOB_TOKEN` con las siguientes opciones habilitadas `Masked`, `Protect variable` y `Expand variable reference`, esta variable tendra como valor un token de acceso con los permisos `api`, `read_repository`, `write_repository`. `@semantic-release/gitlab` necesita credenciales para publicar la release y `@semantic-release/git` para empujar cambios. Para crear y configurar el token de accesso puede consultar la siguiente documentación [aquí](https://docs.gitlab.com/user/project/settings/project_access_tokens/) y para crear y configurar la variable de entorno puede consultar la siguiente documentación [aquí](https://docs.gitlab.com/ci/variables/).
- Cualquier rama que tenga como objetivo realizar una `MR` hacia la rama `main` debe ser una rama protegida. En algunos casos no conviene proteger la rama para trabajar mejor con ella. Considere proteger la rama en el momento en que se vaya a revisar o aceptar la `MR` y mantenerla desprotegido mientras se trabaja en ella.

## 🔹 3.1. Rellenar secciónes
> [!NOTE]
> Este paso es importante porque estas modificaciones determinaran la versión final del archivo `.gitlab-ci.yml` que usaras en tu proyecto, así que presta mucha atención a la siguiente información.

**Modificaciones obligatorias**
- Mantener `repositoryUrl` actualizado en `release.config.js`.
- En el archivo `.gitlab-ci.yml` debes indicar la `image` global que se usará para ejecutar el `pipeline`. Esta `image` debe ser la apropiada para el stack de tu proyecto (Python, Javascript, Java, etc).

**Modificaciones para proyectos Python**
- En el archivo `.gitlab-ci.yml` agrega al inicio la siguiente imagen recomendada.

  ```txt
  image: python:3.12-slim-bookworm
  ```

- En el archivo `.gitlab-ci.yml` agrega la etapa `tests` en la sección de `stages` justo antes de la etapa `deploy` si tu proyecto posee pruebas.

  ```txt
  stages:
    # ...
    - test
    - deploy
    # ...
  ```

- Si en tu proyecto usas `requirements.txt` para gestionar las dependencias y posee pruebas, realiza las siguientes modificaciones en el archivo `.gitlab-ci.yml`:
  - Agrega las secciones `variables` y `default` justo despues de la sección `stages`. De esta manera se declara primero dos variables de entorno usadas por los flujos. `DEPS_CACHE` apunta a una carpeta raíz dentro del workspace del runner (`$CI_PROJECT_DIR/.cache/deps`) donde se agrupan caches para distintos gestores, y `PIP_WHEELHOUSE` es su subdirectorio específico para almacenar las ruedas Python que se generan o se consumen. A continuación se configura un cache global que guarda o recupera el contenido bajo `$DEPS_CACHE/pip` y cuya `key` se reconstruye a partir del contenido de `requirements.txt`, esto significa que GitLab solo invalidará y regenerará esa caché cuando cambie realmente el fichero de dependencias, evitando invalidaciones innecesarias; la `policy: pull-push` indica que el runner intentará recuperar la caché al inicio del flujo y la actualizará al final, de modo que las nuevas ruedas generadas queden disponibles para pipelines posteriores.

    ```text
    variables:
      # Base folder of cached dependencies for different managers.
      DEPS_CACHE: "$CI_PROJECT_DIR/.cache/deps"
      # Specific subfolder where we save the Python wheels.
      PIP_WHEELHOUSE: "$DEPS_CACHE/pip/wheelhouse"
    
    default:
      cache:
        # A single global cache is defined based on the Python dependency file.
        # The key is regenerated only if "files" changes, which avoids invalidating the cache unnecessarily.
        - key:
            files: ["requirements.txt"]
          paths: [ $DEPS_CACHE/pip ]
          policy: pull-push   # Retrieves cache at startup and updates it at startup.
    ```

  - Agrega la etapa `tests` e indica los comandos de tu proyecto que ejecutan sus pruebas, de esta manera se instalaran las dependencias utilizando el sistema de caché que ayuda a mejorar los tiempos de ejecución del `pipeline` y se ejecutaran todas sus pruebas.

    ```text
    tests:
      stage: tests
      before_script:
        # Prepare your project for test execution (install dependencies, configurations, etc).
        - |
          if python -m pip install --no-index --find-links "$PIP_WHEELHOUSE" -r requirements.txt; then
            echo "Dependencies installed from wheelhouse successfully."
          else
            echo "Some wheels are missing, downloading and installing missing wheels ..."
            python -m pip wheel -r requirements.txt -w "$PIP_WHEELHOUSE"
            python -m pip install --no-index --find-links "$PIP_WHEELHOUSE" -r requirements.txt
          fi
        # Add more commands if you require additional configurations.
        # ...
      script:
        # Add the commands you need for test execution.
        # ...
      rules:
        # This job will only run if all of these conditions are met:
        # 1. The action that triggered the pipeline is a 'push'.
        # 2. The action that triggered the pipeline is a 'merge request'.
        # 2. Only when the commit branch is NOT 'main'.
        # 3. When this commit has a valid previous commit, a SHA of zeros indicates that no previous commit existed, indicating that 
        # a branch has been created and does not yet contain any changes. With this condition we avoid executing the job in those initial situations.
        - if: $CI_COMMIT_BRANCH != "main" && $CI_PIPELINE_SOURCE == "merge_request_event" && $CI_COMMIT_BEFORE_SHA != "0000000000000000000000000000000000000000"
          # Indicates that the flow always runs, regardless of whether flows in previous stages failed.
          when: always
        - if: $CI_PIPELINE_SOURCE == "merge_request_event"
          # Indicates that the flow always runs, regardless of whether flows in previous stages failed.
          when: always
        # If the conditions are not met, the job never runs.
        - when: never
    ```

- Si en tu proyecto usas [Poetry](https://python-poetry.org/docs/) para gestionar las dependencias y posee pruebas, realiza las siguientes modificaciones en el archivo `.gitlab-ci.yml`:

  - Agrega las secciones `variables` y `default` justo despues de la sección `stages`. De esta manera se declara primero dos variables de entorno usadas por los flujos. `DEPS_CACHE` apunta a una carpeta raíz dentro del workspace del runner (`$CI_PROJECT_DIR/.cache/deps`) donde se agrupan caches para distintos gestores, y `PIP_WHEELHOUSE` es su subdirectorio específico para almacenar las ruedas Python que se generan o se consumen. A continuación se configura un cache global que guarda o recupera el contenido bajo `$DEPS_CACHE/pip` y cuya `key` se reconstruye a partir del contenido de `requirements.txt`, esto significa que GitLab solo invalidará y regenerará esa caché cuando cambie realmente el fichero de dependencias, evitando invalidaciones innecesarias; la `policy: pull-push` indica que el runner intentará recuperar la caché al inicio del flujo y la actualizará al final, de modo que las nuevas ruedas generadas queden disponibles para pipelines posteriores.

    ```text
    variables:
      # Base folder of cached dependencies for different managers.
      DEPS_CACHE: "$CI_PROJECT_DIR/.cache/deps"
      # Specific subfolder where we save the Python wheels.
      PIP_WHEELHOUSE: "$DEPS_CACHE/pip/wheelhouse"
      POETRY_VERSION: "2.0.0"
    
    default:
      cache:
        # A single global cache is defined based on the Python dependency file.
        # The key is regenerated only if "files" changes, which avoids invalidating the cache unnecessarily.
        - key:
            files: ["pyproject.toml", "poetry.lock"]
          paths: [ $DEPS_CACHE/pip ]
          policy: pull-push
        - key: "poetry-$POETRY_VERSION"
          paths:
            - $DEPS_CACHE/pipx
          policy: pull-push
    ```
  - Agrega la etapa `tests` e indica los comandos de tu proyecto que ejecutan sus pruebas, de esta manera se instalaran las dependencias utilizando el sistema de caché que ayuda a mejorar los tiempos de ejecución del `pipeline` y se ejecutaran todas sus pruebas.

    ```text
    tests:
      variables:
        # PIPX_HOME / PIPX_BIN_DIR redirects where pipx creates its venvs and binaries.
        # We point these directories to DEPS_CACHE so we can cache them between pipelines.
        PIPX_HOME: "$DEPS_CACHE/pipx"
        PIPX_BIN_DIR: "$DEPS_CACHE/pipx/bin"
        # Prevents Poetry from automatically creating per-project virtualenvs.
        POETRY_VIRTUALENVS_CREATE: "false"
        # Poetry specific cache.
        POETRY_CACHE_DIR: "$DEPS_CACHE/pip/poetry_cache"
      stage: tests
      before_script:
        - export PATH="$PIPX_BIN_DIR:$PATH"
        # Install Poetry.
        - |
          if [ -x "$PIPX_BIN_DIR/poetry" ]; then
            echo "Poetry is already installed."
          else
            echo "Installing Poetry version $POETRY_VERSION ..."
            python -m pip install --upgrade pip setuptools wheel
            python -m pip install --upgrade pipx
            python -m pipx ensurepath || true
            python -m pipx install "poetry==$POETRY_VERSION"
          fi
        # Install the Poetry plugin required to create the requirements.txt file.
        - |
          if poetry self show plugins 2>/dev/null | grep -q 'poetry-plugin-export'; then
            echo "poetry-plugin-export is already installed."
          else
            echo "Installing poetry-plugin-export ..."
            poetry self add poetry-plugin-export
          fi
        - poetry export -f requirements.txt --without-hashes -o requirements.txt --all-groups
        # Prepare your project for test execution (install dependencies, configurations, etc).
        - |
          if python -m pip install --no-index --find-links "$PIP_WHEELHOUSE" -r requirements.txt; then
            echo "Dependencies installed from wheelhouse successfully."
          else
            echo "Some wheels are missing, downloading and installing missing wheels..."
            python -m pip wheel -r requirements.txt -w "$PIP_WHEELHOUSE"
            python -m pip install --no-index --find-links "$PIP_WHEELHOUSE" -r requirements.txt
          fi
        # Add more commands if you require additional configurations.
        # ...
      script:
        # Add the commands you need for test execution.
        # ...
      rules:
        # This job will only run if all of these conditions are met:
        # 1. The action that triggered the pipeline is a 'push'.
        # 2. The action that triggered the pipeline is a 'merge request'.
        # 2. Only when the commit branch is NOT 'main'.
        # 3. When this commit has a valid previous commit, a SHA of zeros indicates that no previous commit existed, indicating that 
        # a branch has been created and does not yet contain any changes. With this condition we avoid executing the job in those initial situations.
        - if: $CI_COMMIT_BRANCH != "main" && $CI_PIPELINE_SOURCE == "merge_request_event" && $CI_COMMIT_BEFORE_SHA != "0000000000000000000000000000000000000000"
          # Indicates that the flow always runs, regardless of whether flows in previous stages failed.
          when: always
        - if: $CI_PIPELINE_SOURCE == "merge_request_event"
          # Indicates that the flow always runs, regardless of whether flows in previous stages failed.
          when: always
        # If the conditions are not met, the job never runs.
        - when: never
    ```

# 🔹 Flujo general
### ¿Qué pasa cuando se abre una `MR`?
Abrir una `MR` es el momento en el que el código aún está en revisión y validación, por lo tanto no se realizan publicaciones ni despliegues en este punto. Si configuraste la etapa `tests` en el archivo `.gitlab-ci.yml`, el objetivo principal de este flujo será ejecutar pruebas automáticas que respalden la calidad del cambio antes de que sea aprobado y fusionado, si no configuraste la etapa `tests` no se ejecutara ningún flujo en este escenario. Si configuraste la etapa `tests` y una vez abierta una `MR`:

1. GitLab CI evalúa `.gitlab-ci.yml`. Si la regla `tests` coincide, se ejecuta el flujo que inicia las pruebas del proyecto.
    > La etapa `tests` solo se ejecuta si existe al menos un `commit` con cambios en la rama. Si la `MR` se abre sin ningún cambio, entonces no se ejecuta la etapa.
2. Cada vez que se haga un nuevo `commit` o `push` a la rama de la `MR`, GitLab volverá a evaluar las reglas y, si corresponden, las pruebas se ejecutarán nuevamente. Esto asegura que todos los cambios introducidos durante la revisión sean validados automáticamente.
3. La etapa `publish_release` no se ejecuta en este escenario, este flujo está configurado para la rama `main`, por lo que no se generan `tags` ni `releases` desde la rama `develop` y es importante que los mensajes de los `commits` respeten el estándar  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), porque cuando los cambios lleguen a la rama `main` serán esos mensajes los que `semantic-release` analizará para determinar la versión.
4. Las etapas de `deploy_production_env` y `deploy_development_env` no se ejecutan en este escenario, estos flujo están configurados para ejecutarse después de que una `MR` hacia `develop` o `main` ha sido aceptada.

**Resultado:** Los cambios fueron verificados con pruebas automáticas y quedan listos para revisión humana, pero no se publica ninguna `release` ni se realiza un despliegue.

### ¿Qué pasa cuando se acepta una `MR` a `main`?
Publicar después de que una `MR` se ha fusionado en `main` es ideal porque ese momento indica que los cambios han sido revisados, testeados y aprobados. La `MR` es el punto de control humano + CI que valida la calidad del cambio, por eso `semantic-release` se ejecuta en el `pipeline` que se dispara tras el `push` resultante de la fusión a `main` y justo despues de realizar un despliegue a `producción`. Una vez aprobada una `MR`:

1. GitLab crea el `commit` resultante en `main` y dispara la `pipeline` de CI por ese `push`.
2. GitLab CI evalúa `.gitlab-ci.yml`. Si la regla de `deploy_production_env` coincide, se ejecuta el flujo encargado de realizar el despliegue a producción del proyecto.
3. Luego, Si la regla de `publish_release` coincide, se ejecuta el flujo encargado de realizar la publicación de la `release` y determinar la versión.
4. `semantic-release` analiza los `commits` desde el último `tag` publicado o todo el historial de `commits` hasta ese momento si no existe un `tag`.
5. Decide el tipo de versión (patch, minor, major) según los tipos de `commit` y convenciones.
6. Genera notas de release formateadas según lo definido en `release.config.js`.
7. Actualiza `CHANGELOG.md`.
8. Crea el `tag` (vX.Y.Z) y publica la `release` en GitLab.
9. La etapa `tests` no se ejecuta en este escenario, este flujo está configurado para ejecutarse en cualquier rama diferente a `main` y cuando una `MR` esté abierta y posea cambios.

**Resultado:** El proyecto fue desplegado a producción, tiene un nuevo `tag`, una nueva `release` y `CHANGELOG.md` está actualizado con las notas de la `release`.

### ¿Qué pasa cuando se acepta una `MR` a `develop`?
La rama `develop` se usa como entorno de desarrollo y de pruebas, es el lugar donde se validan cambios antes de promoverlos a `main`. Por diseño no se publican `releases` ni se crean `tags` desde `develop`, en su lugar se ejecuta el flujo encargado de desplegar a un entorno de desarrollo. Una vez aprobada una `MR`:

1. GitLab crea el `commit` resultante en `develop` y dispara la `pipeline` de CI por ese `push`.
2. GitLab CI evalúa `.gitlab-ci.yml`. Si la regla de `deploy_development_env` coincide, se ejecuta el flujo que realiza el despliegue al entorno de desarrollo.
3. `publish_release` no se ejecuta en este escenario, este flujo está configurado para la rama `main`, por lo que no se generan `tags` ni `releases` desde la rama `develop` y es importante que los mensajes de los `commits` respeten el estándar  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), porque cuando los cambios lleguen a la rama `main` serán esos mensajes los que `semantic-release` analizará para determinar la versión.
4. La etapa `tests` no se ejecuta en este escenario, este flujo está configurado para ejecutarse en cualquier rama diferente a `main` y cuando una `MR` esté abierta y posea cambios.

**Resultado:** El proyecto fue desplegado al entorno de desarrollo, no se crea ningún `tag`, no se publica una `release` y `CHANGELOG.md` no se modifica.
