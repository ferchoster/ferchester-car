# FERCHOSTER CAR — preparar IPA desde Windows

Este paquete convierte el prototipo web en una app iOS sencilla con WKWebView y fija el despliegue mínimo en iOS 12.0. No se ha compilado en este paquete: el archivo IPA se genera en un servidor macOS de Codemagic.

## Qué contiene
- Proyecto Xcode `FERCHOSTER_CAR/FERCHOSTER_CAR.xcodeproj`
- Interfaz local dentro de `FERCHOSTER_CAR/www/`
- `codemagic.yaml` para generar un IPA sin firma, que luego se puede intentar firmar/instalar con Sideloadly.

## Pasos desde Windows
1. Descomprime este ZIP.
2. Crea una cuenta en GitHub y un repositorio nuevo llamado `ferchester-car`.
3. Sube el CONTENIDO de esta carpeta al repositorio (el archivo `codemagic.yaml` debe quedar en la raíz del repositorio).
4. Crea una cuenta en Codemagic y conecta ese repositorio de GitHub: https://codemagic.io/
5. En Codemagic, selecciona el repositorio y ejecuta el workflow detectado `ferchester-car-unsigned-ipa` desde `codemagic.yaml`.
6. Si la compilación termina correctamente, descarga el artefacto `FERCHOSTER_CAR_unsigned.ipa` desde los artefactos de la compilación.
7. Abre Sideloadly en Windows, conecta el iPhone por USB, selecciona el IPA y tu Apple ID para firmar/instalarlo. No compartas tu contraseña con nadie; introdúcela solo en la aplicación oficial si decides usarla.

## Importante
- Este IPA es unsigned; Sideloadly intentará firmarlo durante la instalación. La instalación puede fallar según el certificado, el Apple ID, la versión de Sideloadly o las particularidades de iOS 12.
- Un Apple ID gratuito suele imponer límites de firma/validez; no es lo mismo que una cuenta Apple Developer de pago.
- El proyecto usa `WKWebView` y apunta a iOS 12.0, pero la compilación aún debe comprobarse en Codemagic. Los servicios cloud pueden cambiar sus versiones de Xcode.
- La interfaz de vídeo y YouTube depende de las restricciones del sitio y de WebKit de iOS 12. No se garantiza reproducción de cualquier vídeo.
- Esto no registra la app como app oficial de CarPlay. Que CarBridge la muestre debe comprobarse en el iPhone con el jailbreak y los ajustes que ya utilizas.
- No instales archivos IPA de fuentes desconocidas ni entregues credenciales a terceros.
