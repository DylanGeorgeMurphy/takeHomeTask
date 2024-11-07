import { createClient } from "@supabase/supabase-js";
import { createResource, For } from "solid-js";
import { Database } from "./supabase-types";
import {Database as storageDatabase} from "./supabase-storage-types"

const supabaseUrl = "https://dkvklmynteexpaxgpnwl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdmtsbXludGVleHBheGdwbndsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDU2MjQ0MiwiZXhwIjoyMDQ2MTM4NDQyfQ.JZsBlcVDQq7coEkjT_SA3Y4qxD7-nRXYugIBqQfv4sM"


const _public = createClient<Database>(
  supabaseUrl,
  supabaseKey
);

const storage = createClient<storageDatabase>(
  supabaseUrl,
  supabaseKey,
);

const supabase = {_public: _public, storage};

export async function getFiles(id:number){
  const res = await supabase._public.storage.from("Files").list(id.toString());
  if(!res.data)return undefined;
  const fileNames = res.data.map(x=>x.name).filter(x=>x!=".emptyFolderPlaceholder");
  return fileNames;
}

export async function downloadFile(family_id:number, fileName:string){
  const {data, error} = await supabase._public.storage.from("Files").download(
    `${family_id}/${fileName}`
  );

  if(!data)return;

  const url = URL.createObjectURL(data)
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function deleteFile(family_id:number, fileName:string){
  const {data} = await supabase._public
  .storage
  .from("Files")
  .remove([
    `${family_id}/${fileName}`
  ])
}

export async function getFamilies() {
  const { data } = await supabase._public.from("Family").select();
  return data;
}

export async function deleteNote(id:number){
  const response = await supabase._public
  .from("Notes")
  .delete()
  .eq('id', id);
}

export async function addNote(note:{title:string, content:string, family_id:number}){
  const {error} = await supabase._public
  .from("Notes")
  .insert(note)
}

export async function getFamilyByID(id: number) {
  
  let {data} = await supabase._public
    .from("Family")
    .select(
      `
      name,
      id,
      Notes(
        title, content, id
      ),
      Children(
        name
      ),
      Parents(
        name
      ),
      WorkerFamilyRelationship(
        Workers(
            name
        )
      )
      `
    )
    .eq("id", id);

    if(!data)return null;
    return data[0];
}
