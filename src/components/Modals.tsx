import { createSignal, JSX, Show } from "solid-js";
import { cn } from "../../twUtil";
import Button from "./Button";
import { createFileUploader, UploadFile } from "@solid-primitives/upload";

export function Modal(props: { children: JSX.Element; class?: string }) {
    return (
      <div class={cn("bg-white py-4 px-8 rounded-md shadow-lg", props.class)}>
        {props.children}
      </div>
    );
  }
  
  export function ConfirmDeleteModal(props: {
    onConfirm: () => void;
    onCancel: () => void;
    children: JSX.Element;
  }) {
    return (
      <Modal>
        <div class="flex flex-col gap-4  items-center">
          <span class="text-xl">{props.children}</span>
          <div class="flex gap-2">
            <Button onClick={props.onConfirm} class="w-32 bg-red-500">
              Confirm
            </Button>
            <Button onClick={props.onCancel} class="w-32 bg-gray-200 text-black">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
  
  export function UploadFileModal(props: {
    onUpload: (file:UploadFile) => void;
    onCancel: () => void;
  }) {
    const { files, selectFiles } = createFileUploader();
  
    return (
      <Modal class="flex flex-col items-center gap-4">
        <Button
          onClick={() => {
            selectFiles((files) => console.log(files));
          }}
        >
          <Show when={files().length > 0} fallback={<span>Select File</span>}>
            <span class="text-lg">{files()[0].name}</span>
          </Show>
        </Button>
  
  
        <Show when={files().length > 0}>
          <div class="flex gap-2">
            <Button
              class="w-28"
              onClick={() => {
                props.onUpload(files()[0]);
              }}
            >
              Upload
            </Button>
            <Button class="w-28 bg-gray-200 text-black" onClick={props.onCancel}>
              cancel
            </Button>
          </div>
        </Show>
      </Modal>
    );
  }
  
  export function AddNoteModal(props: {
    onConfirm: (note: { title: string; content: string }) => void;
    onCancel: () => void;
  }) {
    const [title, setTitle] = createSignal("");
    const [content, setContent] = createSignal("");
  
    return (
      <Modal class="w-[80dvw] h-[80dvh]">
        <div class="flex flex-col gap-4 h-full">
          <span class="text-2xl">New Note:</span>
          <input
            value={title()}
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.target.value);
            }}
            class="p-2 rounded-md border-2 border-gray-200 focus:outline-none"
            placeholder="Title"
          ></input>
          <textarea
            value={content()}
            onChange={(e) => {
              e.preventDefault();
              setContent(e.target.value);
            }}
            class="p-2 rounded-md border-2 border-gray-200 h-full focus:outline-none"
            placeholder="Content"
          ></textarea>
          <div class="w-full flex justify-end gap-2">
            <Button onClick={props.onCancel} class="bg-gray-200 text-black">
              cancel
            </Button>
            <Button
              onClick={() => {
                props.onConfirm({ title: title(), content: content() });
              }}
            >
              add note
            </Button>
          </div>
        </div>
      </Modal>
    );
  }