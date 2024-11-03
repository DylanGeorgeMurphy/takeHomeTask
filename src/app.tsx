import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createSignal, Show, Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

// export default function App() {
//   return (
//     <Router
//       root={props => (
//         <>
//           <Nav />
//           <Suspense>{props.children}</Suspense>
//         </>
//       )}
//     >
//       <FileRoutes />
//     </Router>
//   );
// }

import { createClient } from "@supabase/supabase-js";
import { createResource, For } from "solid-js";

const supabaseUrl = 'https://dkvklmynteexpaxgpnwl.supabase.co'
const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdmtsbXludGVleHBheGdwbndsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDU2MjQ0MiwiZXhwIjoyMDQ2MTM4NDQyfQ.JZsBlcVDQq7coEkjT_SA3Y4qxD7-nRXYugIBqQfv4sM")

async function getFamilies() {
  const { data } = await supabase.from("Family").select();
  return data;
}
// async function getFamilies() {
//   const { data } = await supabase.from("Family").select("id");
//   return data;
// }

async function getFamilyByID(id:number){

  console.log(id);
  const { data } = await supabase.from("Family").select(`
    name,
    id,
    Person(
      name,
      role_id
    ),
    Notes(
      title,
      content
    )
    `).eq('id', id);
  return data;
}

function App() {

  const [currentFamilyID, setCurrentFamilyID] = createSignal(0);
  const [families] = createResource(currentFamilyID, getFamilyByID);

  return (
    <main>
      <p>Families</p>

      <Show when={!families.loading} fallback={<p>Loading...</p>}>
      <ul>
      <For each={families()}>{(family) => <li>{JSON.stringify(family)}</li>}</For>
      </ul>
      </Show>
      

      <button onClick={()=>{setCurrentFamilyID(
        prev=>prev+1
      )}} class="p-1 bg-gray-300 rounded-sm">increase</button>
    </main>
    
  );
}

export default App;