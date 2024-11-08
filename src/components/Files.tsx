import { For, Show, } from "solid-js";
import { cn } from "../../twUtil";
import Button from "./Button";

const DownloadIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792">
      <path
        d="M1120 608q0-12-10-24L791 265q-9-9-23-9t-23 9L425 585q-9 9-9 23 0 13 9.5 22.5T448 640h192v352q0 13 9.5 22.5t22.5 9.5h192q13 0 22.5-9.5T896 992V640h192q14 0 23-9t9-23zm160 32q0 104-40.5 198.5T1130 1002q-69 69-163.5 109.5T768 1152q-104 0-198.5-40.5T406 1002q-69-69-109.5-163.5T256 640q0-104 40.5-198.5T406 278q69-69 163.5-109.5T768 128q104 0 198.5 40.5T1130 278q69 69 109.5 163.5T1280 640zm256 0q0-209-103-385.5T1153.5-25Q977-128 768-128T382.5-25Q206 78 103 254.5T0 640q0 209 103 385.5T382.5 1305Q559 1408 768 1408t385.5-103q176.5-103 279.5-279.5T1536 640z"
        style={{
          fill: "currentColor",
        }}
        transform="matrix(1 0 0 -1 113.898 1293.017)"
      />
    </svg>
  );
};

export const Files = (props: {
  fileNames?: string[];
  onDownloadFile: (fileName: string) => void;
  onRequestDeleteFile: (fileName: string) => void;
  onUploadFile: () => void;
  selectedFileIndex: number|null;
  setSelectedFileIndex: (value:number|null)=>void
}) => {


  return (
    <div class="w-full h-full p-4 relative">

      {/* BUTTONS */}
      <div class="absolute bottom-0 right-0 flex pr-4 pb-4 gap-4">
        <Show when={props.selectedFileIndex != null}>
          <>
            <Button class="bg-red-500" onClick={() => {
                const index = props.selectedFileIndex
                if(!props.fileNames||index==null)return;
                props.onRequestDeleteFile(
                    props.fileNames[index]
                )
                props.setSelectedFileIndex(null);
            }}>
              delete File
            </Button>
            <Button
              onClick={() => {
                const index = props.selectedFileIndex
                if(!props.fileNames||index==null)return;
                props.onDownloadFile(props.fileNames[index]);
                props.setSelectedFileIndex(null);
              }}
            >
              Download File
            </Button>
            
          </>
        </Show>
        <Button onClick={props.onUploadFile}>Upload File</Button>
      </div>

      {/* ALL THE FILES */}

      <div class="w-full flex flex-wrap gap-3 gap-y-3 overflow-y-auto items-start">
        <For each={props.fileNames}>
          {(fileName, index) => (
            <div
              onClick={() =>
                props.setSelectedFileIndex(
                  props.selectedFileIndex == index() ? null : index()
                )
              }
              class={cn(
                "flex flex-col items-center hover:bg-gray-100 p-2 rounded-lg",
                index() == props.selectedFileIndex &&
                  "bg-gray-200 hover:bg-gray-300"
              )}
            >
              <div
                class="w-24 h-28 bg-blue-200 rounded-md flex justify-center items-center"
              >
                <div class="w-16 h-16 opacity-20">
                  <DownloadIcon />
                </div>
              </div>
              <span class="max-w-28 text-ellipsis text-nowrap  overflow-hidden ">
                {fileName}
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
