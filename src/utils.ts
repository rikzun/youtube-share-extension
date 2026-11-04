export class ShareButton {
    element: HTMLElement

    constructor(root: Element) {
        this.element = root.querySelector("button")!
    }

    isPresent() {
        return this.element != null
    }

    setClick(cb: () => void) {
        this.element.onclick = cb
    }

    resolve() {
        this.element.style.backgroundColor = "green"
        this.element.style.transition = "background-color 300ms ease-out"
        
        setTimeout(() => {
            this.element.style.backgroundColor = ""
            this.element.style.transition = "background-color 200ms ease-in-out"
        }, 500)
    }

    reject() {
        this.element.style.backgroundColor = "red"
        this.element.style.transition = "background-color 300ms ease-out"
        
        setTimeout(() => {
            this.element.style.backgroundColor = ""
            this.element.style.transition = "background-color 200ms ease-in-out"
        }, 500)
    }
}