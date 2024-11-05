import { createClient } from "@supabase/supabase-js";
import { createResource, For } from "solid-js";
import { Database } from "./supabase";

const supabaseUrl = "https://dkvklmynteexpaxgpnwl.supabase.co";
const supabase = createClient<Database>(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdmtsbXludGVleHBheGdwbndsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDU2MjQ0MiwiZXhwIjoyMDQ2MTM4NDQyfQ.JZsBlcVDQq7coEkjT_SA3Y4qxD7-nRXYugIBqQfv4sM"
);

export async function getFamilies() {
  const { data } = await supabase.from("Family").select();
  return data;
}

export async function getFamilyByID(id: number) {
  
  let {data} = await supabase
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
