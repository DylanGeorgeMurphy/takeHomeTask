import {

  createMemo,
  createResource,
  createSignal,
  For,
  JSX,
  JSXElement,
  Show,
  Switch,
} from "solid-js";
import "./app.css";
import { cn } from "../twUtil";
import {
  addNote,
  deleteFile,
  deleteNote,
  downloadFile,
  getFamilies,
  getFamilyByID,
  getFiles,
  uploadFile,
} from "../db";
import { Notes } from "./components/Notes";
import { Files } from "./components/Files";
import Button from "./components/Button";
import { createFileUploader, UploadFile } from "@solid-primitives/upload";

function Modal(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={cn("bg-white py-4 px-8 rounded-md shadow-lg", props.class)}>
      {props.children}
    </div>
  );
}

function ConfirmDeleteModal(props: {
  onConfirm: () => void;
  onCancel: () => void;
  children: JSXElement;
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

function UploadFileModal(props: {
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

function AddNoteModal(props: {
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

function App() {
  type Ttabs = "Notes" | "Files";

  const [selectedTab, setSelectedTab] = createSignal<Ttabs>("Notes");
  const [selectedFamilyID, setSelectedFamilyID] = createSignal<number>(0);

  const [familyData, { refetch: refetchFamilyData }] = createResource(
    selectedFamilyID,
    getFamilyByID
  );
  const [files, { refetch: refetchFiles }] = createResource(
    selectedFamilyID,
    getFiles
  );

  const [currentModal, setCurrentModal] = createSignal<JSX.Element>(null);

  const parentNames = createMemo(() =>
    familyData()?.Parents.map((p) => p.name)
  );
  const childrenNames = createMemo(() =>
    familyData()?.Children.map((c) => c.name)
  );
  const workerNames = createMemo(() =>
    familyData()?.WorkerFamilyRelationship.map((r) => {
      if (!r.Workers) return null;
      return r.Workers.name;
    })
  );

  const [families] = createResource(getFamilies);

  function onAddNote() {
    setCurrentModal(
      <AddNoteModal
        onConfirm={(note) => {
          const newNote = { ...note, family_id: selectedFamilyID() };
          addNote(newNote).then(refetchFamilyData);
          setCurrentModal(null);
        }}
        onCancel={() => {
          setCurrentModal(null);
        }}
      />
    );
  }

  function onRequestDeleteNote(id: number) {
    setCurrentModal(
      <ConfirmDeleteModal
        onCancel={() => setCurrentModal(null)}
        onConfirm={() => {
          deleteNote(id).then(refetchFamilyData);
          setCurrentModal(null);
        }}
      >
        Delete Note?
      </ConfirmDeleteModal>
    );
  }

  function onRequestUploadFile() {
    setCurrentModal(
      <UploadFileModal
        onCancel={() => setCurrentModal(null)}
        onUpload={(file) => {
          uploadFile(file.file, selectedFamilyID(), file.name).then(refetchFiles);
          setCurrentModal(null);
        }}
      />
    );
  }

  function onRequestDeleteFile(filename: string) {
    setCurrentModal(
      <ConfirmDeleteModal
        onCancel={() => setCurrentModal(null)}
        onConfirm={() => {
          deleteFile(selectedFamilyID(), filename).then(refetchFiles);
          setCurrentModal(null);
        }}
      >
        Delete File?
      </ConfirmDeleteModal>
    );
  }

  return (
    <main class="w-[100dvw] h-[100dvh] flex relative">
      {/* MODAL */}
      <Show when={currentModal() != null}>
        <div class="absolute w-full h-full z-10 flex items-center justify-center">
          {/* shadow background */}
          <div
            onClick={() => setCurrentModal(null)}
            class="w-full h-full bg-black opacity-70 absolute"
          ></div>
          {/* modal content */}
          <div class="absolute">{currentModal()}</div>
        </div>
      </Show>

      {/* FAMILY LIST */}
      <div class="w-52 h-full flex-shrink-0 p-4 pt-0 flex flex-col overflow-y-auto border-r-2 border-gray-100">
        {/* header */}
        <p class="font-medium pl-2 py-4 sticky top-0 bg-white">Families</p>

        {/* list of families */}
        <div class="flex flex-col gap-1">
          <For each={families()}>
            {({ id, name }) => (
              <>
                <button
                  onClick={() => {
                    setSelectedFamilyID(id);
                  }}
                  class={cn(
                    "px-2 py-1 rounded-md hover:bg-gray-100 text-left capitalize",
                    id == selectedFamilyID() && "bg-gray-200 hover:bg-gray-200"
                  )}
                >
                  {name}
                </button>
                <div class="h-[1px] bg-gray-200" />
              </>
            )}
          </For>
        </div>
      </div>
      {/* MAIN SCREEEN */}
      <div class="h-full w-full flex flex-col p-4 gap-4">
        {/* Family name */}
        <h1 class="text-4xl font-semibold">{familyData()?.name}</h1>

        {/* Family Details */}
        <div class="flex gap-3">
          <p>
            <span class="font-bold mr-1">Foster Parents:</span>
            <span class="capitalize">{parentNames()?.join(", ")}</span>
          </p>
          <p>
            <span class="font-bold mr-1">Children:</span>
            <span class="capitalize">{childrenNames()?.join(", ")}</span>
          </p>
          <p>
            <span class="font-bold mr-1">Support Workers:</span>
            <span class="capitalize">{workerNames()?.join(", ")}</span>
          </p>
        </div>

        {/* Tab Selector */}
        <div>
          <For each={["Notes", "Files"] as Ttabs[]}>
            {(tab) => (
              <button
                onClick={() => {
                  setSelectedTab(tab);
                }}
                class={cn(
                  "capitalize py-2 px-4 rounded-md font-medium",
                  selectedTab() == tab && "bg-gray-100"
                )}
              >
                {tab}
              </button>
            )}
          </For>
        </div>

        <div class="w-full  min-h-0 h-full rounded-md shadow-lg border-2 border-gray-100">
          <Show
            when={selectedTab() == "Notes"}
            fallback={
              <Files
                onRequestDeleteFile={onRequestDeleteFile}
                onUploadFile={onRequestUploadFile}
                onDownloadFile={(name) =>
                  downloadFile(selectedFamilyID(), name)
                }
                fileNames={files()}
              />
            }
          >
            <Notes
              onNewNote={onAddNote}
              onRequestDeleteNote={onRequestDeleteNote}
              notes={familyData()?.Notes}
            />
          </Show>
        </div>
      </div>
    </main>
  );
}

export default App;
