const ASSETS = {
    'qokodar': { 
        id: 'CASE 01', desc: 'PLANT-001: BASIC TOPOLOGY',
        svg: 'assets/plant001_gis.svg', ref: 'assets/plant001_ref.png'
    },
    'dorchorychkar': { 
        id: 'CASE 02', desc: 'PLANT-002: COMPLEX STRUCTURE',
        svg: 'assets/plant002_gis.svg', ref: 'assets/plant002_ref.png'
    },
    'qotor': { 
        id: 'CASE 03', desc: 'PLANT-009: MORPHOLOGY',
        svg: 'assets/plant009_gis.svg', ref: 'assets/plant009_ref.png'
    },
    'pchor': { 
        id: 'CASE 09', desc: 'PLANT-034: THE VASE',
        svg: 'assets/plant034_gis.svg', ref: 'assets/plant034_ref.png'
    },
    'tsholdchy': { 
        id: 'CASE 10', desc: 'PLANT-100: THE MANDRAKE',
        svg: 'assets/plant100_gis.svg', ref: 'assets/plant100_ref.png'
    }
};

const LEXICON_DATA = {
    'CONTEXT (PREFIX)': [
        { token: 'qo-', desc: 'Root System Context' },
        { token: 'p-', desc: 'Container / Sheath Context' },
        { token: 'f-', desc: 'Floral / Whorl Context' }
    ],
    'OPERATORS (ROOTS)': [
        { token: '-chor', desc: 'Core Structure / Main Body' },
        { token: '-tor', desc: 'Tuber / Nodule / Bulb' },
        { token: '-dar', desc: 'Appendage / Extension' },
        { token: '-tshol', desc: 'Bifurcated / Paired Form' }
    ],
    'MODIFIERS (SUFFIX)': [
        { token: '-y', desc: 'Standard Component Marker' },
        { token: '-kar', desc: 'Segmented / Multiple' },
        { token: '-ol', desc: 'Attribute: Round / Whole' }
    ]
};

const input = document.getElementById('gisInput');
const canvas = document.getElementById('canvas');
const reference = document.getElementById('reference');
const status = document.getElementById('statusBar');
const caseList = document.getElementById('caseList');
const lexiconTab = document.getElementById('tab-lexicon');


function init() {
    for (const [cmd, data] of Object.entries(ASSETS)) {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `<span class="item-title">${cmd}</span><span class="item-desc">${data.id}: ${data.desc}</span>`;
        li.onclick = () => runAutoType(cmd);
        caseList.appendChild(li);
    }

    for (const [category, items] of Object.entries(LEXICON_DATA)) {
        const catHeader = document.createElement('div');
        catHeader.className = 'lex-category';
        catHeader.textContent = category;
        lexiconTab.appendChild(catHeader);

        items.forEach(item => {
            const li = document.createElement('div');
            li.className = 'list-item';
            li.innerHTML = `<span class="item-title" style="color:#2ea043">${item.token}</span><span class="item-desc">${item.desc}</span>`;
            li.onclick = () => {
                const cleanToken = item.token.replace(/-/g, '');
                input.value += cleanToken;
                input.focus();
                checkInput(input.value);
            };
            lexiconTab.appendChild(li);
        });
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    if (tabName === 'archives') {
        document.querySelector("button[onclick=\"switchTab('archives')\"]").classList.add('active');
        document.getElementById('tab-archives').classList.add('active');
    } else {
        document.querySelector("button[onclick=\"switchTab('lexicon')\"]").classList.add('active');
        document.getElementById('tab-lexicon').classList.add('active');
    }
}

function runAutoType(text) {
    input.value = '';
    input.focus();
    let i = 0;
    status.textContent = 'STATUS: RECEIVING REMOTE INSTRUCTION...';
    status.style.color = '#58a6ff';
    
    const interval = setInterval(() => {
        input.value += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(interval);
            checkInput(text);
        }
    }, 40);
}

function checkInput(val) {
    const cmd = val.trim().toLowerCase();
    
    if (ASSETS[cmd]) {
        const data = ASSETS[cmd];
        renderSuccess(data);
        return;
    }

    let feedback = '';
    let color = '#8b949e';

    if (cmd.length === 0) {
        feedback = 'STATUS: WAITING_FOR_INPUT';
        clearVisuals();
    } 
    else if (cmd.startsWith('qo')) {
        feedback = `>> CONTEXT IDENTIFIED: ROOT (qo-)\n>> WAITING FOR MORPHOLOGY...\n>> TRY: 'qotor' (Tuber) or 'qokodar' (Primary+Appendage)`;
        color = '#d29922';
    }
    else if (cmd.startsWith('p')) {
        feedback = `>> CONTEXT IDENTIFIED: CONTAINER (p-)\n>> WAITING FOR CORE...\n>> TRY: 'pchor' (Container Core)`;
        color = '#d29922';
    }
    else if (cmd.includes('tor') && !cmd.startsWith('qo')) {
        feedback = `>> WARNING: MORPHOLOGY '-tor' DETECTED WITHOUT CONTEXT.\n>> DID YOU MEAN: 'qotor'?`;
        color = '#ff5f56';
    }
    else if (cmd.includes('chor') && !cmd.startsWith('p') && !cmd.startsWith('dor')) {
            feedback = `>> WARNING: STRUCTURE '-chor' NEEDS CONTEXT.\n>> TRY: 'pchor' or 'dorchorychkar'`;
            color = '#ff5f56';
    }
    else {
        feedback = `>> ERROR: UNKNOWN SEQUENCE '${cmd}'\n>> CHECK LEXICON FOR VALID TOKENS.`;
        color = '#ff5f56';
    }

    status.textContent = feedback;
    status.style.color = color;
    
    if (!ASSETS[cmd]) clearVisuals();
}

function renderSuccess(data) {
    canvas.innerHTML = '';
    const imgGen = document.createElement('img');
    imgGen.src = data.svg;
    imgGen.alt = "GIS Output";
    imgGen.style.height = '80%';
    imgGen.onerror = () => { canvas.innerHTML = '<div class="placeholder-box" style="color:#ff5f56">IMG_ERR</div>'; };
    canvas.appendChild(imgGen);

    reference.innerHTML = '';
    const imgRef = document.createElement('img');
    imgRef.src = data.ref;
    imgRef.alt = "Manuscript Ref";
    imgRef.style.height = '80%';
    imgRef.onerror = () => { reference.innerHTML = '<div class="placeholder-box" style="color:#ff5f56">REF_ERR</div>'; };
    reference.appendChild(imgRef);

    status.textContent = `STATUS: ${data.desc} [MATCH FOUND]`;
    status.style.color = '#27c93f';
}

function clearVisuals() {
    canvas.innerHTML = '<div class="placeholder-box">_WAITING_FOR_COMPLETE_COMMAND</div>';
    reference.innerHTML = '<div class="placeholder-box">_AWAITING_MATCH</div>';
}

input.addEventListener('input', (e) => checkInput(e.target.value));

init();
