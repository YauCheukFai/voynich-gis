const MAP = {
    'qo': { type: 'scope', val: 'root' },
    'ot': { type: 'scope', val: 'component' },
    'tor': { type: 'morph', val: 'tuber', asset: 'root-tuber' },
    'kor': { type: 'morph', val: 'bulb', asset: 'root-bulb' },
    'p': { type: 'topo', val: 'container' },
    'chor': { type: 'topo', val: 'core' },
    'dar': { type: 'topo', val: 'appendage', asset: 'roots-fibrous' },
    'daiin': { type: 'struct', val: 'stem', asset: 'stem-basic' },
    'sh': { type: 'attr', val: 'spiky' },
    'ol': { type: 'attr', val: 'round' }
};

const COMBOS = {
    'pchor': 'vase-structure',  // Case 9
    'qotor': 'root-tuber',      // Case 3
    'qokodar': 'root-bulb-fibrous' // Case 1
};

const ASSETS = {
    'pchor': { 
        svg: 'assets/vase.svg', 
        ref: 'assets/ref_pchor.png',
        desc: 'CASE 09: CONTAINER CORE (VASE)'
    },
    'qotor': { 
        svg: 'assets/tuber.svg', 
        ref: 'assets/ref_qotor.png',
        desc: 'CASE 03: TUBER MORPHOLOGY'
    }
};

const input = document.getElementById('gisInput');
const canvas = document.getElementById('canvas');
const reference = document.getElementById('reference');
const btnExec = document.getElementById('btnExecute');
const status = document.querySelector('.status-bar');

function parse(text) {
    const tokens = text.toLowerCase().replace(/\./g, ' ').split(/\s+/);
    const renderQueue = [];
    
    tokens.forEach(t => {
        if (COMBOS[t]) {
            renderQueue.push({ type: 'combo', asset: COMBOS[t] });
        }
    });

    if (renderQueue.length === 0) {
        tokens.forEach(t => {
            if (t.includes('qo') && t.includes('tor')) renderQueue.push({ asset: 'root-tuber' });
            else if (t.includes('p') && t.includes('chor')) renderQueue.push({ asset: 'vase-structure' });
            else if (t.includes('daiin')) renderQueue.push({ asset: 'stem-basic' });
        });
    }

    return renderQueue;
}

function render(cmd) {
    const key = cmd.trim().toLowerCase();
    const data = ASSETS[key];

    canvas.innerHTML = '';
    reference.innerHTML = '';

    if (data) {
        const imgGen = document.createElement('img');
        imgGen.src = data.svg;
        imgGen.style.height = '80%';
        canvas.appendChild(imgGen);

        const imgRef = document.createElement('img');
        imgRef.src = data.ref;
        reference.appendChild(imgRef);

        status.textContent = `STATUS: EXECUTED >> ${data.desc}`;
        status.style.color = '#27c93f';
    } else {
        canvas.innerHTML = '<span class="placeholder" style="color:red">_SYNTAX_ERROR</span>';
        reference.innerHTML = '<span class="placeholder">_NO_MATCH</span>';
        status.textContent = 'STATUS: UNKNOWN_COMMAND';
        status.style.color = '#ff5f56';
    }
}

btnExec.addEventListener('click', () => render(input.value));
btnClear.addEventListener('click', () => {
    input.value = '';
    canvas.innerHTML = '<span class="placeholder">_WAITING_FOR_INSTRUCTION</span>';
    status.textContent = 'STATUS: READY';
});
