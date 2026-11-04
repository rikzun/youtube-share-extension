import "./App.css"
import githubLogoUrl from "@/public/github.svg?url"
import { createSignal } from "solid-js"
import { Checkbox } from "@/components/Checkbox"
import { Storage, type ErrorType } from "@/storage"

export function App() {
    const [state, setState] = createStore({
        keepTimestamp: true,
        keepList: false,
        keepShareFeature: false,
        replaceShare: true,
        errors: new Set<ErrorType>()
    })

    onMount(async() => {
        const [
            keepTimestamp,
            keepList,
            keepShareFeature,
            replaceShare,
            errors
        ] = await Promise.all([
            Storage.keepTimestamp.getValue(),
            Storage.keepList.getValue(),
            Storage.keepShareFeature.getValue(),
            Storage.replaceShare.getValue(),
            Storage.errors.getValue()
        ])

        setState({
            keepTimestamp,
            keepList,
            keepShareFeature,
            replaceShare,
            errors
        })

        Storage.errors.watch((v) => {
            setState("errors", v)
        })
    })

    const haseShareButtonError = () => state.errors.has("share-button")

    return (
        <>
            <div class="title">
                Youtube Share

                <a href="https://github.com/rikzun/youtube-share-extension" target="_blank">
                    <img
                        class="github-logo"
                        src={githubLogoUrl}
                        alt="github logo"
                    />
                </a>
            </div>

            <div class="container">
                <div class="field">
                    <Checkbox
                        checked={state.keepTimestamp}
                        onChange={(v) => {
                            setState("keepTimestamp", v)
                            Storage.keepTimestamp.setValue(v)
                        }}
                    />
                    
                    <span>Keep Timestamp</span>
                </div>

                <div class="field">
                    <Checkbox
                        checked={state.keepList}
                        onChange={(v) => {
                            setState("keepList", v)
                            Storage.keepList.setValue(v)
                        }}
                    />
                    
                    <span>Keep List</span>
                </div>

                <div class="field">
                    <Checkbox
                        checked={state.keepShareFeature}
                        onChange={(v) => {
                            setState("keepShareFeature", v)
                            Storage.keepShareFeature.setValue(v)
                        }}
                    />
                    
                    <span>Keep Share Feature</span>
                </div>

                <div class="field">
                    <Checkbox
                        checked={state.replaceShare}
                        onChange={(v) => {
                            setState("replaceShare", v)
                            Storage.replaceShare.setValue(v)
                        }}
                    />

                    <span>Replace Share button</span>
                    <Show when={haseShareButtonError()}>
                        <div class="error">(broken)</div>
                    </Show>
                </div>
            </div>
        </>
    )
}
