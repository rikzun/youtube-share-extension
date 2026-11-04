import { Storage } from "@/storage"
import { ShareButton } from "@/utils"

const FINAL_URL = "https://youtu.be/"

const COPY_PATTERNS_START = [
    "https://www.youtu.be/",
    "https://youtu.be/",
    "https://www.youtube.com/",
    "https://youtube.com/"
] as const

async function copyLink(origin: string | null) {
    const keepTimestamp = await Storage.keepTimestamp.getValue()
    const keepList = await Storage.keepList.getValue()

    // share button      https://youtu.be/###?si=###
    // contextmenu share https://youtu.be/###?t=0
    // url               https://www.youtube.com/watch?v=###&list=###&start_radio=1
    const url = new URL(origin ?? location.href)

    const id = url.searchParams.get("v")
    const final = new URL(FINAL_URL + id)

    if (keepList) {
        const list = url.searchParams.get("list")
        
        if (list) {
            final.searchParams.set("list", list)
        }
    }

    if (keepTimestamp) {
        const timestamp = url.searchParams.get("t")

        if (timestamp) {
            final.searchParams.set("t", timestamp)
        }
    }

    navigator.clipboard.writeText(final.toString())
}

export default defineContentScript({
    matches: [
        "*://www.youtube.com/watch*",
        "*://youtube.com/watch*",
        "*://youtu.be/*"
    ],
    
    main: () => {
        let findShareButtonAttempts = 0
        Storage.replaceShare.getValue().then((replaceShareButton) => {
            if (!replaceShareButton) return

            const intervalID = setInterval(() => {
                try {
                    const shareButtonRoot = document.querySelector("#top-level-buttons-computed > *:last-child")
                    
                    findShareButtonAttempts += 1
                    if (findShareButtonAttempts > 50) {
                        clearInterval(intervalID)
                        throw Error()
                    }

                    if (!shareButtonRoot) return
                    clearInterval(intervalID)

                    const shareButton = new ShareButton(shareButtonRoot)
                    if (!shareButton.isPresent()) throw Error()

                    shareButton.setClick(() => {
                        copyLink(null)
                            .then(() => shareButton.resolve())
                            .catch(() => shareButton.reject())
                    })
                } catch(e) {
                    Storage.errors.getValue().then((errors) => {
                        Storage.errors.setValue(errors.add("share-button"))
                    })
                }
            }, 50)
        })

        document.addEventListener("copy", (e) => {
            const value = window.getSelection()?.toString()
            if (!value) return

            const matches = COPY_PATTERNS_START.some((v) => value.startsWith(v))
            if (!matches) return

            e.preventDefault()
            copyLink(value)
        })
    }
})