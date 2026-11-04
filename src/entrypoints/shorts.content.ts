import { Storage } from "@/storage"
import { ShareButton } from "@/utils"

const FINAL_URL = "https://youtube.com/shorts/"

const COPY_PATTERNS_START = [
    "https://www.youtube.com/shorts/",
    "https://youtube.com/shorts/",
] as const

async function copyLink(origin: string | null) {
    const keepTimestamp = await Storage.keepTimestamp.getValue()
    const keepShareFeature = await Storage.keepShareFeature.getValue()

    // share button      https://youtube.com/shorts/###?si=###
    // contextmenu share https://www.youtube.com/shorts/###?t=0&feature=share
    // url               https://www.youtube.com/shorts/###
    const url = new URL(origin ?? location.href)

    const parts = url.pathname.split("/")
    const id = parts[parts.length - 1]

    const final = new URL(FINAL_URL + id)

    if (keepTimestamp) {
        const timestamp = url.searchParams.get("t")

        if (timestamp) {
            final.searchParams.set("t", timestamp)
        }
    }

    if (keepShareFeature) {
        const isPresent = url.searchParams.has("feature", "share")

        if (isPresent) {
            final.searchParams.set("feature", "share")
        }
    }

    navigator.clipboard.writeText(final.toString())
}

export default defineContentScript({
    matches: [
        "*://www.youtube.com/shorts*",
        "*://youtube.com/shorts*"
    ],
    
    main: () => {
        let findShareButtonAttempts = 0
        Storage.replaceShare.getValue().then((replaceShareButton) => {
            if (!replaceShareButton) return

            const intervalID = setInterval(() => {
                try {
                    const buttons = [...document.querySelectorAll("button-view-model.ytwReelActionBarViewModelHostDesktopActionButton")]
                    
                    findShareButtonAttempts += 1
                    if (findShareButtonAttempts > 50) {
                        clearInterval(intervalID)
                        throw Error()
                    }

                    if (!buttons.length) return
                    const shareButtonRoot = buttons[1]

                    if (!shareButtonRoot) return
                    clearInterval(intervalID)

                    const shareButton = new ShareButton(shareButtonRoot)
                    if (!shareButton.isPresent()) throw Error()
                    
                    shareButton.setClick(() => {
                        copyLink(null)
                            .then(() => shareButton.resolve())
                            .catch(() => shareButton.reject())
                    })
                } catch {
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