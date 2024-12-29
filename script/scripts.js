// Variables
const consoleElement = document.getElementById('console');
let inputBuffer = "";
const articles = [];
let commandHistory = [];
let historyIndex = -1;

// Cargar artículos desde JSON
fetch('./data/articles.json')
  .then((response) => response.json())
  .then((data) => {
    articles.push(...data);
  })
  .catch((error) => console.error('Error al cargar artículos:', error));

// Simulación de inicio (Boot Sequence)
function bootSequence() {
  consoleElement.innerHTML = "";
  const bootText = [
    "100 MSX BASIC version 1.0",
    "Copyright 2024 by Óscar Martínez",
    "MEMORY SIZE: 32768 BYTES",
    "Type HELP for a list of commands.",
    "OK"
  ];
  let index = 0;

  const interval = setInterval(() => {
    if (index < bootText.length) {
      consoleElement.innerHTML += `${bootText[index]}<br>`;
      index++;
    } else {
      clearInterval(interval);
      initializeCursor(); // Mostrar el cursor después de la secuencia
    }
  }, 1000); // Intervalo de 1 segundo entre líneas
}

bootSequence(); // Ejecutar la secuencia de inicio

// Mostrar el cursor inicial
function initializeCursor() {
  const existingCursor = document.getElementById('cursor-line');
  if (!existingCursor) {
    const cursorLine = document.createElement('p');
    cursorLine.id = 'cursor-line';
    cursorLine.innerHTML = `> <span id="cursor" class="cursor-blink">_</span>`;
    consoleElement.appendChild(cursorLine);
  }
}

// Manejo de entrada del teclado
document.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    processCommand(inputBuffer.trim());
    commandHistory.push(inputBuffer.trim()); // Guardar en el historial
    historyIndex = commandHistory.length; // Actualizar el índice
    inputBuffer = ""; // Limpiar el buffer después de procesar el comando
  } else if (event.key === "Backspace") {
    inputBuffer = inputBuffer.slice(0, -1);
    updateCursor();
  } else if (event.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      inputBuffer = commandHistory[historyIndex];
      updateCursor();
    }
  } else if (event.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputBuffer = commandHistory[historyIndex];
      updateCursor();
    } else {
      historyIndex = commandHistory.length;
      inputBuffer = "";
      updateCursor();
    }
  } else if (event.key.length === 1) {
    inputBuffer += event.key;
    updateCursor();
  }
});

// Procesar comandos
function processCommand(command) {
  // Eliminar el cursor actual antes de procesar
  const existingCursorLine = document.getElementById('cursor-line');
  if (existingCursorLine) existingCursorLine.remove();

  // Mostrar el comando ingresado en la consola
  consoleElement.innerHTML += `\n> ${command}\n`;

  if (command.toLowerCase() === "list") {
    if (articles.length === 0) {
      consoleElement.innerHTML += "No articles available. Please check your data source.\nOK\n";
    } else {
      consoleElement.innerHTML += "Available Articles:\n";
      articles.forEach((article, index) => {
        consoleElement.innerHTML += `${index + 1}. ${article.title}\n`;
      });
      consoleElement.innerHTML += "OK\n";
    }
  } else if (command.toLowerCase().startsWith("run ")) {
    // Validar si el índice proporcionado es válido
    const inputParts = command.split(" ");
    if (inputParts.length < 2 || isNaN(parseInt(inputParts[1], 10))) {
      consoleElement.innerHTML += "Error: Please provide a valid article number. Use LIST to view available articles.\n";
    } else {
      const articleIndex = parseInt(inputParts[1], 10) - 1;

      // Validar que el índice esté dentro del rango
      if (articleIndex >= 0 && articleIndex < articles.length) {
        simulateCassetteLoading(() => {
          // Abrir el artículo en una nueva pestaña
          window.open(articles[articleIndex].link, "_blank");
          consoleElement.innerHTML += `\nArticle "${articles[articleIndex].title}" Opened\nOK\n`;
          initializeCursor(); // Asegurarse de que el cursor aparece solo una vez
        });
      } else {
        consoleElement.innerHTML += "Error: Article number out of range. Use LIST to see available articles.\n";
      }
    }
  } else if (command.toLowerCase() === "help") {
    consoleElement.innerHTML += "Commands:\nLIST - Show articles\nRUN [number] - Open article\nAUTHOR - Show author info\nPOLICY - View privacy policy\nCLEAR - Clear console\nABOUT - Show project info\nFULLSCREEN - Toggle fullscreen mode\nHELP - Show commands\n";
  } else if (command.toLowerCase() === "policy") {
    displayPrivacyPolicy();
  } else if (command.toLowerCase() === "author") {
    displayAuthorInfo();
  } else if (command.toLowerCase() === "about") {
    displayAboutInfo();
  } else if (command.toLowerCase() === "clear") {
    clearConsole();
  } else if (command.toLowerCase() === "fullscreen") {
    toggleFullScreen();
  } else {
    consoleElement.innerHTML += "Syntax Error\n";
  }

  consoleElement.scrollTop = consoleElement.scrollHeight; // Desplazar al final
  initializeCursor(); // Añadir un nuevo cursor al final
}

// Actualizar el cursor y el texto escrito
function updateCursor() {
  const cursorLine = document.getElementById('cursor-line');
  if (cursorLine) {
    cursorLine.innerHTML = `> ${inputBuffer}<span id="cursor" class="cursor-blink">_</span>`;
  }
}

// Comandos adicionales
function clearConsole() {
  consoleElement.innerHTML = "";
  initializeCursor();
}

function displayAboutInfo() {
  consoleElement.innerHTML += "\nABOUT:\n";
  consoleElement.innerHTML += "MSX Interactive Directory v1.0\n";
  consoleElement.innerHTML += "Developed by Óscar Martínez in 2024\n";
  consoleElement.innerHTML += "A tribute to classic computing.\nOK\n";
}

// Mostrar la política de privacidad en la consola
function displayPrivacyPolicy() {
  consoleElement.innerHTML += "\nPrivacy Policy:\n";
  consoleElement.innerHTML += "This website uses cookies to enhance your experience.\n";
  consoleElement.innerHTML += "Functional cookies are necessary for basic operation.\n";
  consoleElement.innerHTML += "Analytics and third-party cookies require your consent.\n";
  consoleElement.innerHTML += "For more details, visit: <a href='/legal/privacy-policy.html' target='_blank'>/legal/privacy-policy.html</a>\n";
  consoleElement.innerHTML += "OK\n";
}

// Mostrar la información del autor
function displayAuthorInfo() {
  consoleElement.innerHTML += "\nAuthor Information:\n";
  consoleElement.innerHTML += "Name: Óscar Martínez\n";
  consoleElement.innerHTML += "Year: 2024\n";
  consoleElement.innerHTML += "LinkedIn: <a href='https://www.linkedin.com/in/oscar-martinez-43327686/' target='_blank'>https://www.linkedin.com/in/oscar-martinez-43327686/</a>\n";
  consoleElement.innerHTML += "OK\n";
}

// Simular la carga del cassette antes de abrir un artículo
function simulateCassetteLoading(callback) {
  // Crear un overlay con las bandas de colores
  const overlay = document.createElement('div');
  overlay.id = 'cassette-loading';
  document.body.appendChild(overlay);

  // Reproducir sonido
  const audio = new Audio('./sonidos/loading.ogg');
  audio.play();

  // Animar bandas durante 6 segundos
  setTimeout(() => {
    document.body.removeChild(overlay); // Eliminar el overlay
    callback(); // Ejecutar la acción de carga (abrir el artículo)
  }, 6000);
}

// Manejo del aviso de cookies
if (!localStorage.getItem('cookiePreferences')) {
  document.getElementById('cookie-popup').classList.remove('hidden');
}

document.getElementById('accept-all').addEventListener('click', () => {
  setCookiePreferences({ functional: true, analytics: true, thirdParty: true });
});

document.getElementById('reject-all').addEventListener('click', () => {
  setCookiePreferences({ functional: true, analytics: false, thirdParty: false });
});

document.getElementById('customize').addEventListener('click', () => {
  document.getElementById('cookie-customize').classList.toggle('hidden');
});

document.getElementById('save-preferences').addEventListener('click', () => {
  const functional = document.getElementById('functional-cookies').checked;
  const analytics = document.getElementById('analytics-cookies').checked;
  const thirdParty = document.getElementById('third-party-cookies').checked;

  setCookiePreferences({ functional, analytics, thirdParty });
});

function setCookiePreferences(preferences) {
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  document.getElementById('cookie-popup').classList.add('hidden');
  console.log('Preferencias guardadas:', preferences);
}
// Función para alternar el modo de pantalla completa
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // Activar pantalla completa
    document.documentElement.requestFullscreen().catch((err) => {
      consoleElement.innerHTML += `\nError trying to enable fullscreen: ${err.message}\nOK\n`;
    });
  } else {
    // Salir de pantalla completa
    document.exitFullscreen().catch((err) => {
      consoleElement.innerHTML += `\nError trying to exit fullscreen: ${err.message}\nOK\n`;
    });
  }
}