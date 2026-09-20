import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import JSZip from 'jszip';
import './style.css';

const starter = {
  'index.html': `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Website</title><link rel="stylesheet" href="style.css"></head><body><div class="hero"><h1>My Website</h1><p>Built with BuildAI</p><button>Get Started</button></div></body></html>`,
  'style.css': `body{margin:0;font-family:Arial,sans-serif;background:#f5f7fb;color:#111}.hero{min-height:100vh;display:grid;place-content:center;text-align:center}.hero h1{font-size:52px;margin:0 0 12px}.hero p{font-size:20px}.hero button{padding:14px 24px;border:0;border-radius:12px;background:#111;color:white}`,
};

function App(){
  const [prompt,setPrompt]=useState('');
  const [files,setFiles]=useState(starter);
  const [active,setActive]=useState('index.html');
  const [tab,setTab]=useState('preview');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('Ready');

  const generate=()=>{
    if(!prompt.trim()) return;
    setBusy(true); setMessage('Generating project...');
    setTimeout(()=>{
      const p=prompt.trim();
      setFiles({
        'index.html': `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${p}</title><link rel="stylesheet" href="style.css"></head><body><nav><b>BuildAI</b><a href="#home">Home</a><a href="#about">About</a><a href="#contact">Contact</a></nav><main id="home"><section class="hero"><span class="badge">AI Generated</span><h1>${p}</h1><p>A responsive website generated from your prompt.</p><button>Explore</button></section><section id="about" class="card"><h2>About</h2><p>Edit this project with BuildAI.</p></section><section id="contact" class="card"><h2>Contact</h2><p>Add your contact details here.</p></section></main></body></html>`,
        'style.css': `*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f4f7fb;color:#111}nav{height:64px;background:white;display:flex;align-items:center;gap:26px;padding:0 7%;box-shadow:0 1px 8px #0001}nav b{margin-right:auto;font-size:20px}nav a{text-decoration:none;color:#555}.hero{min-height:65vh;display:grid;place-content:center;text-align:center;padding:40px}.hero h1{font-size:clamp(34px,6vw,70px);max-width:900px;margin:16px auto}.hero p{font-size:19px;color:#666}.badge{display:inline-block;padding:8px 12px;border-radius:999px;background:#e9eefc;color:#315bdc}.hero button{margin:20px auto;padding:14px 25px;border:0;border-radius:12px;background:#111;color:white;font-size:16px}.card{max-width:850px;margin:25px auto;padding:35px;background:white;border-radius:20px;box-shadow:0 5px 25px #0000000d}`,
      });
      setActive('index.html'); setTab('preview'); setBusy(false); setMessage('Project generated');
    },700);
  };

  const download=async()=>{
    const zip=new JSZip();
    Object.entries(files).forEach(([name,content])=>zip.file(name,content));
    const blob=await zip.generateAsync({type:'blob'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='buildai-project.zip'; a.click();
    setMessage('ZIP downloaded');
  };

  const previewDoc=files['index.html']?.replace('<link rel="stylesheet" href="style.css">', `<style>${files['style.css']||''}</style>`) || '';

  return <div className="app">
    <header><div className="brand">⚡ BuildAI</div><div className="small">{message}</div><button onClick={download}>Download ZIP</button></header>
    <section className="prompt">
      <h1>Build an app or website with AI</h1>
      <p>Describe what you want to create.</p>
      <div className="promptbox"><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Example: Create a modern supermarket website for 1 Stop Shop Kargil..."/><button onClick={generate} disabled={busy}>{busy?'Building...':'Generate'}</button></div>
    </section>
    <main className="workspace">
      <aside><h3>Files</h3>{Object.keys(files).map(f=><button className={active===f?'file active':'file'} onClick={()=>{setActive(f);setTab('code')}} key={f}>{f}</button>)}<div className="tip">Free starter<br/>Connect an open-source model later for real AI code generation.</div></aside>
      <section className="editor">
        <div className="tabs"><button className={tab==='preview'?'sel':''} onClick={()=>setTab('preview')}>Preview</button><button className={tab==='code'?'sel':''} onClick={()=>setTab('code')}>Code</button></div>
        {tab==='preview'?<iframe title="preview" srcDoc={previewDoc}/>:<textarea className="code" value={files[active]||''} onChange={e=>setFiles({...files,[active]:e.target.value})}/>}
      </section>
    </main>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
