import "@wxt-dev/auto-icons"
import { defineConfig } from "wxt"
import { resolve } from "path"

const SRC_DIR = "src"
const ICON_PATH = resolve(SRC_DIR, "public/icon.svg")

export default defineConfig({
    srcDir: SRC_DIR,

    modules: [
        "@wxt-dev/module-solid",
        "@wxt-dev/auto-icons"
    ],

    autoIcons: {
        baseIconPath: ICON_PATH,
        sizes: [16, 32, 48, 96, 128]
    },

    manifestVersion: 3,
    manifest: {
        permissions: ["storage"],

        browser_specific_settings: {
            gecko: {
                id: "rik.zunqq@gmail.com",
                data_collection_permissions: {
                    required: ["none"]
                }
            }
        }
    }
})
