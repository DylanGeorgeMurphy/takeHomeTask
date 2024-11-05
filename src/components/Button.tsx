import {children, type JSX} from "solid-js"
import { cn } from "../../twUtil";

const Button = (props:{children:JSX.Element, onClick?:()=>void, class?:string}) => {
    return <button onClick={props.onClick} class={cn("px-4 py-3 w-fit rounded-md bg-slate-700 text-white capitalize", props.class)}>
        {props.children}
    </button>
}

export default Button;