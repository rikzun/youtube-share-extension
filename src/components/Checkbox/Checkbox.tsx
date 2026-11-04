import "./Checkbox.css"

interface CheckboxProps {
    checked?: boolean
    onChange?: (checked: boolean) => void
}

export function Checkbox(props: CheckboxProps) {
    return (
        <input
            type="checkbox"
            checked={props.checked}
            onChange={
                props.onChange
                    ? (e) => props.onChange!(e.currentTarget.checked)
                    : undefined
            }
        />
    )
}