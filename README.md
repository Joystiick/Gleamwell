# Gleamwell Smile Co.

*Smile brighter. Smile forever.*

A satirical horror ARG told through a website. Gleamwell looks like a cheerful, family-run toothpaste brand and dental clinic, with a cartoon tooth mascot called Pearl. Dig around and you'll find five hidden digits, a staff login, a grim clinical intranet, and whatever is inside Room 7.

> **This is fiction.** Gleamwell Smile Co. is not a real company, product or organization. Nothing is for sale and nothing you type goes anywhere.
>
> **Content warning:** horror themes, disturbing imagery, implied violence, sudden loud sounds, jumpscares, and flashing or shaking images. The site opens with a warning screen that lets visitors turn off sound and full intensity.

## Play it

Open `index.html` in a browser. That's it. There's no server, no build step and no external images. Every face, illustration and sound is generated in the browser, and fonts load from Google Fonts.

To host it, enable **GitHub Pages** for this repository (Settings → Pages → deploy from branch, root folder). `index.html` at the root is the whole site.

Headphones are recommended.

## How it's built

The source lives in `src/` and is concatenated into one file by `build.sh`:

```bash
bash build.sh
```

This writes two files:

- `index.html`: the standalone page.
- `gleamwell.html`: the same page as a fragment, without the `<html>`/`<head>` wrapper, for hosts that add their own (it's published that way as a claude.ai Artifact).

| File | What it does |
|---|---|
| `src/js/01-util.js` | Helpers, seeded noise and random numbers, storage |
| `src/js/02-face.js` | The procedural face renderer behind every portrait, mugshot and jumpscare |
| `src/js/03-art.js` | Pearl the mascot, the clinic, the product packaging, the old photo |
| `src/js/04-audio.js` | Web Audio synth: ambience, the jingle (and its wrong version), knocks, screams |
| `src/js/05-scare.js` | The jumpscare engine |
| `src/js/06-public.js` | The public website |
| `src/js/07-portal.js` | The hidden staff intranet |
| `src/js/08-barn.js` | Room 7 and the ending |
| `src/js/09-router.js` | Hash routing, the warning gate, site-wide secrets |

Progress is saved in `localStorage`. The warning screen has a **Reset my progress** link once you've logged in.

## Spoilers

<details>
<summary>The staff code and where its digits are hidden</summary>

The code is **47193**. The login is the "Staff login" link in the footer.

1. **4**: Home. Select the text in the teal banner under the hero.
2. **7**: Our Story. Hover over (or press and hold) Dr. Gleam's portrait for about 2.5 seconds.
3. **1**: Products. Open the Forever Smile™ Veneer Kit and read the fine print under Drug Facts.
4. **9**: Smile Tips. Pause or scrub the clinic tour video at 0:17.
5. **3**: Careers. Submit the job application.

</details>

<details>
<summary>Other secrets</summary>

- Click Pearl five times on the home page.
- Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.
- Type `help` or `pearl` anywhere.
- Copy any text from the site.
- Sit idle on the home page for 30 seconds and watch the 7th upstairs window. Click that window too.
- Visit between midnight and 4am your time.
- Read the first letters of the Night Attendant job duties.
- Get the staff code wrong four times.
- Visit a page that doesn't exist.
- Switch to another tab and back.
- In the intranet: open the parking lot camera five times, watch camera 07 for ten seconds, play the morning message, read the last memo, play the recovered tape.
- After Room 7, go back to the public site.

</details>
