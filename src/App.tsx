import './App.css'
import { createSignal } from 'solid-js'
// @ts-expect-error Unable to infer type at the moment
import solidLogo from './assets/solid.svg'
import { getPages, insertPage } from "./db.ts";

async function test() {
  "use server";
  return "Hello, World!";
}

function App() {
  const [msg, setMsg] = createSignal("");
  const [count, setCount] = createSignal(0)

  return (
    <div class="App">
      <img src="/vite-deno.svg" alt="Vite with Deno" />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      {msg()}
      <button onClick={(e) => {
        getPages().then((res) => {
          setMsg(""+res.length);
        })
        // test().then((res) => {
          
        //   setMsg(res);
        // });
      }}>
        List pages in database
      </button>
      <button onClick={(e) => {
        insertPage();
      }}>
        Insert page
      </button>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </div>
  )
}

export default App
