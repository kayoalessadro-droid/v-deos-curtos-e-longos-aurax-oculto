"""Local deterministic export. Requires Python Playwright and FFmpeg, no service fees.
Usage: python3 scripts/export_leo.py --audio /path/original.mp3 --output /path/leo.mp4
Run while the local review app is available on port 8080.
"""
import argparse,asyncio,base64,math,subprocess
from pathlib import Path
from playwright.async_api import async_playwright
DURATION=83.128095
async def main(args):
    global DURATION
    DURATION=args.duration
    output=Path(args.output)
    output.parent.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        page=await browser.new_page(viewport={"width":1280,"height":1800})
        await page.goto('http://localhost:8080'+args.path,wait_until='networkidle')
        await page.wait_for_selector('.render-only')
        css=await page.evaluate("""() => [...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].map(r=>r.cssText)}catch{return []}}).join('\\n')""")
        await page.evaluate("css => window.leoExportCss=css",css)
        cmd=['ffmpeg','-y','-v','error','-f','image2pipe','-framerate',str(args.fps),'-i','pipe:0','-ss',str(args.start),'-i',args.audio,'-map','0:v','-map','1:a','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t',str(DURATION-args.start),'-movflags','+faststart',str(output)]
        process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
        try:
            for i in range(round(args.start*args.fps),math.ceil(DURATION*args.fps)):
                data=await page.evaluate("""async ({t,width,height}) => {
                  window.dispatchEvent(new CustomEvent('leo-render-frame',{detail:t}));
                  const svg=document.querySelector('.animation-canvas').cloneNode(true);
                  svg.setAttribute('width',width);svg.setAttribute('height',height);
                  if(svg.classList.contains('suspense-scene')) { const heading=svg.querySelector('.scene-heading'); if(heading) heading.setAttribute('style','fill: '+getComputedStyle(document.querySelector('.animation-canvas')).getPropertyValue('--cloud')+' !important'); }
                  const style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent=window.leoExportCss;svg.prepend(style);
                  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
                  const img=new Image();img.src=url;await img.decode();
                  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
                  canvas.getContext('2d').drawImage(img,0,0,width,height);URL.revokeObjectURL(url);
                  return canvas.toDataURL('image/png').split(',')[1];
                }""",{'t':i/args.fps,'width':1080,'height':1920})
                if process.stdin is None: raise RuntimeError('Encoder input unavailable')
                process.stdin.write(base64.b64decode(data))
                if i%args.fps==0: print(f'{i/args.fps:.0f}/{DURATION:.0f} s',flush=True)
            if process.stdin:process.stdin.close()
            if process.wait()!=0:raise RuntimeError('FFmpeg export failed')
        finally:
            if process.poll() is None:process.kill()
            await browser.close()
    print(f'Exported {output}',flush=True)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--audio',required=True);parser.add_argument('--output',required=True);parser.add_argument('--fps',type=int,default=24);parser.add_argument('--start',type=float,default=0);parser.add_argument('--path',default='/?render=1');parser.add_argument('--duration',type=float,default=83.128095)
    asyncio.run(main(parser.parse_args()))
