<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The root view is an animation review player, not a marketing site; keep character assets and scene rendering in reusable animation modules to support staged production.
- Drive the reusable vector rig and environments from one deterministic timeline keyed to the original audio currentTime; this prevents playback drift and supports seeking and freeze behavior.
- Export the same SVG frames locally through scripts/export_leo.py and FFmpeg; this yields a vertical H.264/AAC MP4 without paid generation or a Node-only server dependency.
