import { createSignal, For, Show } from "solid-js";
import Button from "./Button";
import { cn } from "../../twUtil";

export const Notes = (props: {
  notes?: {
    title: string;
    content: string;
    id: number;
  }[];
  selectedNoteIndex: number|null;
  setSelectedNoteIndex: (value:number|null)=>void;
  onRequestDeleteNote: (id: number) => void;
  onNewNote: ()=>void;
}) => {


  return (
    <div class="w-full h-full p-4 relative ">
      <div class="absolute bottom-0 right-0 flex pr-4 pb-4 gap-4">
        <Show when={props.selectedNoteIndex != null}>
          <Button onClick={()=>{
            const index = props.selectedNoteIndex;
            if(index==null || !props.notes)return;
            props.onRequestDeleteNote( props.notes[index].id);
            props.setSelectedNoteIndex(null);
          }} class="bg-red-500">Delete Note</Button>
        </Show>
        <Button onClick={()=>{props.onNewNote(); props.setSelectedNoteIndex(null)}}>New Note</Button>
      </div>

      <div class=" h-full overflow-y-auto">
        <For each={props.notes}>
          {(note, index) => (
            <div
              onClick={() =>
                props.setSelectedNoteIndex(props.selectedNoteIndex == index() ? null : index())
              }
              class={cn(
                "p-2 hover:bg-gray-100 rounded-md",
                props.selectedNoteIndex == index() && "bg-gray-200 hover:bg-gray-200"
              )}
            >
              <p class="font-semibold pb-2">{note.title}</p>
              <p>{note.content}</p>
            </div>
          )}
        </For>
      </div>

    </div>
  );
};
