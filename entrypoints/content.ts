import { Storage } from "@/storage"

const SHORT_URL = "https://youtu.be/"

function makeShortLink(keepTimestamp: boolean, keepList: boolean) {
    const url = new URL(location.href)

    const id = url.searchParams.get("v")
    const final = new URL(SHORT_URL + id)

    if (keepList) {
        const list = url.searchParams.get("list")
        
        if (list) {
            final.searchParams.set("list", list)
        }
    }

    if (keepTimestamp) {
        let timestamp = url.searchParams.get("t")

        if (timestamp) {
            if (timestamp.endsWith("s")) {
                timestamp = timestamp.slice(0, -1)
            }

            final.searchParams.set("t", timestamp)
        }
    }

    return final.toString()
}

export default defineContentScript({
    matches: [
        "*://youtube.com/watch*",
        "*://www.youtube.com/watch*",
        "*://youtu.be/*"
    ],
    
    main: () => {
        let findShareButtonAttempts = 0
        Storage.replaceShare.getValue().then((replaceShareButton) => {
            if (!replaceShareButton) return

            const intervalID = setInterval(() => {
                try {
                    const shareButton = document.querySelector("yt-button-view-model.ytd-menu-renderer")
                    
                    findShareButtonAttempts += 1
                    if (findShareButtonAttempts > 50) {
                        clearInterval(intervalID)
                        throw Error()
                    }

                    if (!shareButton) return
                    clearInterval(intervalID)

                    const cloneElement = shareButton.cloneNode(true) as Element
                    shareButton.replaceWith(cloneElement)
                    
                    const iconElement = cloneElement.querySelector<HTMLElement>(".ytSpecButtonShapeNextIcon")
                    if (!iconElement) throw Error()
                    
                    iconElement.style.display = "none"

                    const childButton = cloneElement.querySelector<HTMLElement>("button")
                    if (!childButton) throw Error()
                    
                    cloneElement.addEventListener("click", async() => {
                        const keepTimestamp = await Storage.keepTimestamp.getValue()
                        const keepList = await Storage.keepList.getValue()

                        const link = makeShortLink(keepTimestamp, keepList)
                        navigator.clipboard.writeText(link)
                        
                        childButton.style.backgroundColor = "green"
                        childButton.style.transition = "background-color 300ms ease-out"
                        
                        setTimeout(() => {
                            childButton.style.backgroundColor = ""
                            childButton.style.transition = "background-color 200ms ease-in-out"
                        }, 500)
                    })
                } catch {
                    Storage.errors.getValue().then((errors) => {
                        Storage.errors.setValue(errors.add("share-button"))
                    })
                }
            }, 50)
        })

        document.addEventListener("copy", async() => {
            const value = window.getSelection()?.toString()
            if (!value) return
            if (!value.startsWith(SHORT_URL)) return

            const keepTimestamp = await Storage.keepTimestamp.getValue()
            const keepList = await Storage.keepList.getValue()
                
            const link = makeShortLink(keepTimestamp, keepList)
            navigator.clipboard.writeText(link)
        })
    }
})