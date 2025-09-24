import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
});


// });

//  import { defineConfig } from "vite";
//       import react from "@vitejs/plugin-react";

//       export default defineConfig({
//         plugins: [react()],
//         server: {
//           // host: "localhost", // 이 줄을 제거합니다.
//           proxy: {
//             '/test-proxy': {
//               target: 'http://localhost:8080',
//               changeOrigin: true,
//               rewrite: (path) => path.replace(/^\/test-proxy/, '/posts'),
//             },
//             "/api": {
//               target: "http://localhost:8080",
//               rewrite: (path) => path.replace(/^\/api/, ""),
//               changeOrigin: true,
//             },
//           },
//         },
//       });
