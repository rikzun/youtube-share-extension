import "./App.css"
import githubLogoUrl from "/github.svg?url"
import { createSignal } from "solid-js"
import { Checkbox } from "@/components/Checkbox"
import { Storage, type ErrorType } from "@/storage"

export function App() {
    const [keepTimestamp, setKeepTimestamp] = createSignal(true)
    const [keepList, setKeepList] = createSignal(false)
    const [replaceShare, setReplaceShare] = createSignal(true)
    const [errors, setErrors] = createSignal<Set<ErrorType>>(new Set())

    onMount(async() => {
        const keepTimestampStorageValue = await Storage.keepTimestamp.getValue()
        setKeepTimestamp(keepTimestampStorageValue)

        const keepListStorageValue = await Storage.keepList.getValue()
        setKeepList(keepListStorageValue)

        const replaceShareValue = await Storage.replaceShare.getValue()
        setReplaceShare(replaceShareValue)

        const errorsValue = await Storage.errors.getValue()
        setErrors(errorsValue)

        Storage.errors.watch((v) => {
            setErrors(v)
        })
    })

    const haseShareButtonError = () => errors().has("share-button")

    return (
        <>
            <div class="title">
                Youtube Share

                <a href="https://example.com" target="_blank">
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
                        checked={keepTimestamp()}
                        onChange={(v) => {
                            setKeepTimestamp(v)
                            Storage.keepTimestamp.setValue(v)
                        }}
                    />
                    
                    <span>Keep Timestamp</span>
                </div>

                <div class="field">
                    <Checkbox
                        checked={keepList()}
                        onChange={(v) => {
                            setKeepList(v)
                            Storage.keepList.setValue(v)
                        }}
                    />
                    
                    <span>Keep List</span>
                </div>

                <div class="field">
                    <Checkbox
                        checked={replaceShare()}
                        onChange={(v) => {
                            setReplaceShare(v)
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
