# TAMADOGGY

TAMADOGGY es un juego web de animales virtual, inspirado en el clásico Tamagotchi, que fue desarrollado como proyecto para el bootcamp "Albañiles Digitales".

El proyecto nace con un propósito social: conectar a quienes juegan con perros y perras reales que necesitan ser adoptados en protectoras de animales de Navarra.

## La idea del proyecto

La visión de TAMADOGGY es crear una plataforma donde cada animal virtual esté asociado a un perro real en adopción. La idea es que, a través del juego, los usuarios puedan conocer la historia de estos animales y contribuir a su bienestar y a encontrarles un hogar definitivo.

Aunque esta primera versión sienta las bases del juego, el objetivo a largo plazo era integrar funcionalidades para apoyar directamente a las protectoras.

## Características principales

* **Juego de cuidado de un compañero virtual:** El jugador o jugadora debe mantener a su perro feliz atendiendo a sus necesidades de hambre, diversión, limpieza y afecto.
* **Sistema de estados:** El perrito virtual  cambia de estado (feliz, triste, hambrienta) dependiendo de sus niveles de necesidad.
* **Concienciación sobre la adopción:** La página principal incluye información y enlaces directos a protectoras de animales de Navarra para fomentar la adopción responsable.
* **Interfaz multidioma:** La aplicación permite cambiar entre español e inglés.

## Tecnologías utilizadas

Este proyecto es una aplicación web sencilla construida con las siguientes tecnologías:

* **Frontend:** HTML5, CSS3 y JavaScript puro (Vanilla JS) para toda la lógica del juego y la interactividad.
* **Backend:** Un servidor simple creado con **Node.js** y **Express** para gestionar las puntuaciones de los jugadores.
* **Herramientas de desarrollo:** Se utilizó **Nodemon** para facilitar el desarrollo del servidor.

## Cómo ejecutar el proyecto

Para ejecutar este proyecto en un entorno de desarrollo local, sigue estos pasos:

1.  Clona el repositorio en tu máquina:
    ```
    git clone [https://github.com/MariaShiva79/TAMADOGGY.git](https://github.com/MariaShiva79/TAMADOGGY.git)
    ```
2.  Navega a la carpeta del proyecto:
    ```
    cd TAMADOGGY
    ```
3.  Instala las dependencias del servidor:
    ```
    npm install
    ```
4.  Inicia el servidor de desarrollo:
    ```
    npm run dev
    ```
5.  Abre el archivo `index.html` en tu navegador para empezar a jugar.
