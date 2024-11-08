import {

  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  JSX,
  Show,
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
import { AddNoteModal, ConfirmDeleteModal, UploadFileModal } from "./components/Modals";



function App() {
  type Ttabs = "Notes" | "Files";


  //list of all the families
  const [families] = createResource(getFamilies);

  //file/note tab selection
  const [selectedTab, setSelectedTab] = createSignal<Ttabs>("Notes");

  //current family being selected
  const [selectedFamilyID, setSelectedFamilyID] = createSignal<number>(0);

  //note/tab current selected indexes (null is nothing selected)
  const [selectedFileIndex, setSelectedFileIndex] = createSignal<number | null>(
    null
  );
  const [selectedNoteIndex, setSelectedNoteIndex] = createSignal<number | null>(null);

  //resets the selected note/file indexes to null when the selected family changes. 
  createEffect((prev)=>{
    if(prev!=selectedFamilyID){
      setSelectedFileIndex(null);
      setSelectedNoteIndex(null);
    }
    return selectedFamilyID();
  }, null)

  //current family selected data
  const [familyData, { refetch: refetchFamilyData }] = createResource(
    selectedFamilyID,
    getFamilyByID
  );

  //split the family data into seperate signals
  const parentNames = createMemo(() =>
    familyData()?.Parents.map((p) => p.name)
  );
  const childrenNames = createMemo(() =>
    familyData()?.Children.map((c) => c.name)
  );
  const workerNames = createMemo(() => //this is done because there is a m->m relationship between workers and families
    familyData()?.WorkerFamilyRelationship.map((r) => {
      if (!r.Workers) return null;
      return r.Workers.name;
    })
  );

  //file info about the current family. 
  const [files, { refetch: refetchFiles }] = createResource(
    selectedFamilyID,
    getFiles
  );

  //JSX element containing the modal to be displayed (null if nothing)
  const [currentModal, setCurrentModal] = createSignal<JSX.Element>(null);

  //promps the user to input details on a new file
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

  //prompts the user if they're sure that they want to delete a note. 
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

  //prompts the user on which file they want to upload
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

  //prompts the user on if they're sure that they want to delete a file
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

        {/* show notes or file pages */}
        <div class="w-full  min-h-0 h-full rounded-md shadow-lg border-2 border-gray-100">
          <Show
            when={selectedTab() == "Notes"}
            fallback={
              <Files
              selectedFileIndex={selectedFileIndex()}
              setSelectedFileIndex={setSelectedFileIndex}
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
              selectedNoteIndex={selectedNoteIndex()}
              setSelectedNoteIndex={setSelectedNoteIndex}
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
