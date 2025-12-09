const ASSETS = {
    'pchor': { 
        svg: 'assets/vase.svg', 
        ref: 'assets/ref_pchor.png', 
        desc: 'CASE 09: CONTAINER CORE (VASE) [MATCH FOUND]'
    },
    'qotor': { 
        svg: 'assets/tuber.svg', 
        ref: 'assets/ref_qotor.png', 
        desc: 'CASE 03: TUBER MORPHOLOGY [MATCH FOUND]'
    }
};

const GRAMMAR = {
    'p': 'MORPHOLOGY DETECTED: CONTAINER / SHEATH (p-)',
    'qo': 'SCOPE DETECTED: ROOT SYSTEM (qo-)',
    'ch': 'TOPOLOGY DETECTED: CORE STRUCTURE (ch-)',
    'to': 'MORPHOLOGY DETECTED: TUBER / NODULE (to-)',
    'or': 'ATTRIBUTE DETECTED: ROUND / BULBOUS (-or)'
};

const input = document.getElementById('gisInput');
const canvas = document.getElementById('canvas');
const reference = document.getElementById('reference');
const btnExec = document.getElementById('btnExecute');
const status = document.querySelector('.status-bar');

function clearVisuals() {
    canvas.innerHTML = '<span class="placeholder">_WAITING_FOR_COMPLETE_COMMAND</span>';
    reference.innerHTML = '<span class="placeholder">_AWAITING_MATCH</span>';
}

function checkInput(val) {
    const cmd = val.trim().toLowerCase();
    
    if (ASSETS[cmd]) {
        const data = ASSETS[cmd];
        
        canvas.innerHTML = '';
        const imgGen = document.createElement('img');
        imgGen.src = data.svg;
        imgGen.style.height = '80%';
        canvas.appendChild(imgGen);

        reference.innerHTML = '';
        const imgRef = document.createElement('img');
        imgRef.src = data.ref;
        reference.appendChild(imgRef);

        status.textContent = `STATUS: ${data.desc}`;
        status.style.color = '#27c93f';
        status.style.fontWeight = 'bold';
        return;
    }

    let feedback = 'STATUS: ANALYZING INPUT STREAM...';
    let color = '#8b949e';

    if (cmd.startsWith('p')) {
        feedback = `>> PARSING: ${GRAMMAR['p']}`;
        color = '#58a6ff';
    } else if (cmd.startsWith('qo')) {
        feedback = `>> PARSING: ${GRAMMAR['qo']}`;
        color = '#58a6ff';
    } else if (cmd.includes('tor')) {
        feedback = `>> PARSING: ${GRAMMAR['to']}`;
        color = '#58a6ff';
    } else if (cmd.length > 0) {
        feedback = 'STATUS: UNKNOWN SEQUENCE';
        color = '#ff5f56';
    }

    clearVisuals();
    status.textContent = feedback;
    status.style.color = color;
    status.style.fontWeight = 'normal';
}

input.addEventListener('input', (e) => {
    checkInput(e.target.value);
});

btnExec.addEventListener('click', () => {
    checkInput(input.value);
    status.style.opacity = '0.5';
    setTimeout(() => status.style.opacity = '1', 100);
});
