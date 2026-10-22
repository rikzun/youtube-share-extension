import { defineConfig } from "wxt"

export default defineConfig({
    modules: ["@wxt-dev/module-solid"],
    manifest: {
        permissions: [
            "storage"
        ],

        browser_specific_settings: {
            gecko: {
                id: "rik.zunqq@gmail.com"
            }
        }
    }
})
