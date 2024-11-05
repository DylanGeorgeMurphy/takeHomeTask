import { createSignal, For, Show } from "solid-js";
import Button from "./Button";
import { cn } from "../../twUtil";

export const Notes = (props: {
  notes?: {
    title: string;
    content: string;
    id: number;
  }[];

  onRequestDeleteNote: (id: number) => void;
  onRequestNewNote: ()=>void;
}) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = createSignal<number | null>(null);

  return (
    <div class="w-full h-full p-4 relative">
      <div class="absolute bottom-0 right-0 flex pr-4 pb-4 gap-4">
        <Show when={selectedNoteIndex() != null}>
          <Button onClick={()=>{
            const index = selectedNoteIndex();
            if(index==null || !props.notes)return;
            props.onRequestDeleteNote( props.notes[index].id);
            setSelectedNoteIndex(null);
          }} class="bg-red-500">Delete Note</Button>
        </Show>

        <Button onClick={()=>{props.onRequestNewNote(); setSelectedNoteIndex(null)}}>New Note</Button>
      </div>

      <For each={props.notes}>
        {(note, index) => (
          <div
            onClick={() =>
              setSelectedNoteIndex((prev) => (prev == index() ? null : index()))
            }
            class={cn(
              "p-2 hover:bg-gray-100 rounded-md",
              selectedNoteIndex() == index() && "bg-gray-200 hover:bg-gray-200"
            )}
          >
            <p class="font-semibold pb-2">{note.title}</p>
            <p>{note.content}</p>
          </div>
        )}
      </For>
    </div>
  );
};
