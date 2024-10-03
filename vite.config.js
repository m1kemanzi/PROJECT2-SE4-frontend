import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import dns from "dns";
dns.setDefaultResultOrder("verbatim");

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "/2024/project2/t7";

  return defineConfig({
    plugins: [vue(),],

    server: {
      host: "localhost",
      port: 8081,
    },

    base: baseURL,
  });
};