import { Storage } from "@/storage"

export default defineBackground(() => {
    Storage.errors.setValue(new Set())
})
