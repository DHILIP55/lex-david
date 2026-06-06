import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/lex_david/", // 👈 ADD THIS LINE

  plugins: [react()],

  server: {
    watch: {
      // Force a full reload when the design token file changes
      ignored: ["!**/index.css"],
    },
  },
});
