"""
Downloads instrument samples, compresses them and writes public/samples/manifest.json.

Sources (both CC-BY 3.0):
  - Salamander Grand Piano (Alexander Holm) via tonejs.github.io
  - tonejs-instruments (Nicholas Brosowsky), public-domain recordings edited by the author
Run: python3 scripts/fetch-samples.py
"""
import json, os, re, subprocess, sys, time, urllib.request

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'samples')
LIB = 'https://nbrosowsky.github.io/tonejs-instruments/samples/'
SAL = 'https://tonejs.github.io/audio/salamander/'
PC = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}

def midi(n):
    m = re.match(r'([A-G]#?)(-?\d)', n)
    return (int(m.group(2)) + 1) * 12 + PC[m.group(1)]

# instrument -> (lowest, highest) range we keep, min gap in semitones between samples
WANT = {
    'violin': ('G3', 'C7', 4), 'cello': ('C2', 'C5', 4), 'contrabass': ('C1', 'G3', 4),
    'flute': ('C4', 'C7', 4), 'clarinet': ('D3', 'C6', 4), 'bassoon': ('A1', 'C5', 4),
    'trumpet': ('E3', 'C6', 4), 'french-horn': ('A1', 'F5', 4), 'harp': ('C2', 'C7', 5),
    'guitar-acoustic': ('E2', 'D5', 4), 'guitar-electric': ('E2', 'C6', 4),
    'bass-electric': ('E1', 'G4', 3), 'organ': ('C2', 'C6', 4),
}

def lib_notes():
    js = urllib.request.urlopen('https://raw.githubusercontent.com/nbrosowsky/tonejs-instruments/master/Tonejs-Instruments.js').read().decode()
    res = {}
    for inst in WANT:
        block = re.search(r"'%s'\s*:\s*\{(.*?)\}" % re.escape(inst), js, re.S).group(1)
        res[inst] = dict(re.findall(r"'([A-G]#?\d)'\s*:\s*'([^.]+)\.", block))
    return res

def pick(notes, lo, hi, gap):
    items = sorted((midi(n), n, f) for n, f in notes.items() if midi(lo) <= midi(n) <= midi(hi))
    chosen, last = [], -99
    for m, n, f in items:
        if m - last >= gap:
            chosen.append((n, f)); last = m
    return chosen

def fetch(url, dst, seconds):
    tmp = dst + '.src'
    for attempt in range(6):
        try:
            urllib.request.urlretrieve(url, tmp); break
        except Exception:
            if attempt == 5: raise
            time.sleep(2 ** attempt)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-t', str(seconds), '-ac', '1', '-ar', '44100',
                    '-af', f'afade=t=out:st={seconds - 0.6}:d=0.6', '-b:a', '80k', dst], check=True)
    os.remove(tmp)

def main():
    manifest = {}
    os.makedirs(OUT, exist_ok=True)
    # piano: Salamander, every minor third from A1 to C7
    pdir = os.path.join(OUT, 'piano'); os.makedirs(pdir, exist_ok=True)
    manifest['piano'] = {}
    for o in range(1, 8):
        for name, file in (('C', 'C'), ('D#', 'Ds'), ('F#', 'Fs'), ('A', 'A')):
            note = f'{name}{o}'
            if not (midi('A1') <= midi(note) <= midi('C7')): continue
            dst = os.path.join(pdir, f'{file}{o}.mp3')
            if not os.path.exists(dst): fetch(f'{SAL}{file}{o}.mp3', dst, 3.5)
            manifest['piano'][note] = f'{file}{o}.mp3'
    for inst, notes in lib_notes().items():
        lo, hi, gap = WANT[inst]
        d = os.path.join(OUT, inst); os.makedirs(d, exist_ok=True)
        manifest[inst] = {}
        for note, file in pick(notes, lo, hi, gap):
            dst = os.path.join(d, f'{file}.mp3')
            if not os.path.exists(dst): fetch(f'{LIB}{inst}/{file}.mp3', dst, 3.0)
            manifest[inst][note] = f'{file}.mp3'
        print(inst, len(manifest[inst]), 'samples', file=sys.stderr)
    with open(os.path.join(OUT, 'manifest.json'), 'w') as fh:
        json.dump(manifest, fh, indent=1, sort_keys=True)

main()
