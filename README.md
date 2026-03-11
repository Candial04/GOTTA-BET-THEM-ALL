GOTTA BET 'EM ALL
Casino temático Pokémon con sistema de login (roles user/admin), tragaperras con sprites animados de PokéAPI y Showdown, panel de admin para cambiar Pokémon en tiempo real, diseño responsive y sincronización entre admin y juego.
Tecnologías y versiones

React 18
Vite 5
TypeScript
Tailwind CSS
Zustand (store y persistencia)
TanStack Query (react-query)
React Router v6
json-server (backend fake local)

Licencia
MIT
Guía de instalación y ejecución

Clona el repositorio:Bashgit clone https://github.com/Candial04/GOTTA-BET-THEM-ALL.git
cd GOTTA-BET-THEM-ALL
Instala dependencias:Bashnpm install
Inicia el backend fake (json-server):Bashnpm run server(Esto levanta http://localhost:3001 con los datos de db.json)
Inicia el frontend (Vite):Bashnpm run dev
Abre en el navegador: http://localhost:5173

Credenciales de prueba:

User: user / root → va directo a tragaperras
Admin: admin / root → panel de admin para gestionar Pokémon

Enlace al deploy en vivo
https://candial04.github.io/GOTTA-BET-THEM-ALL
Cómo ejecutar el backend y frontend al mismo tiempo
Puedes abrir dos terminales:

Terminal 1: npm run server
Terminal 2: npm run dev

¡Disfruta del casino Pokémon! 🎰🐾
