/**
 * SBF Schedule Editor - Rebuilt Logic
 * Class-based architecture for stability and modularity.
 */

// Debug: Catch global errors to help identify issues on remote devices/GitHub
window.onerror = function (msg, url, line, col, error) {
    // Ignore harmless resizing errors or extensions
    if (msg.includes('ResizeObserver')) return;
    alert(`Error: ${msg}\nLine: ${line}\nCol: ${col}`);
};

class ScheduleApp {
    constructor() {
        // Configuration
        this.CONFIG = {
            startHour: 9,
            endHour: 22,
            pixelsPerHour: 300,
            snapMinutes: 5,
            storageKey: 'timetable_state'
        };

        // Default State
        this.state = {
            "config": {
                "startHour": 9,
                "endHour": 22
            },
            "stages": [
                {
                    "id": "stage-1",
                    "name": "Day1"
                },
                {
                    "id": "stage-2",
                    "name": "Day2"
                }
            ],
            "acts": [
                {
                    "id": "act-1",
                    "stageId": "stage-1",
                    "name": "Pioniereリハーサル",
                    "startTime": "10:45",
                    "endTime": "11:30",
                    "color": "#3b82f6",
                    "category": "Pioniere"
                },
                {
                    "id": "act-1767264350836",
                    "stageId": "stage-1",
                    "name": "Dream Quartet練習会",
                    "category": "Dream Quartet",
                    "startTime": "12:00",
                    "endTime": "13:30",
                    "color": "#ff0000"
                },
                {
                    "id": "act-1767264392253",
                    "stageId": "stage-1",
                    "name": "Dream Quartet練習会②",
                    "category": "Dream Quartet",
                    "startTime": "13:30",
                    "endTime": "15:00",
                    "color": "#ff0000"
                },
                {
                    "id": "act-1767264445479",
                    "stageId": "stage-1",
                    "name": "OPコーラス全体合わせ",
                    "category": "Pioniere, Orca Rhapsodia, After Times, Exits, Ultra L, Squash!, HanaYashiki, Harmonix Junction, Full City, Sugarlight, Snappy's, Tokyo Vocal Express, Coiffeur, Malwoofer, しなもん",
                    "startTime": "15:30",
                    "endTime": "16:00",
                    "color": "#10b981"
                },
                {
                    "id": "act-1767265793673",
                    "stageId": "stage-1",
                    "name": "第1ステージ SBF Showcase",
                    "category": "Vocal Tompectrum, Exits, Orca Rhapsodia, Squash!, 渡邉歌劇団, Ultra L, F.F.",
                    "startTime": "18:32",
                    "endTime": "19:10",
                    "color": "#8b5cf6"
                },
                {
                    "id": "act-1767265903313",
                    "stageId": "stage-1",
                    "name": "第2ステージ　Mixed&College",
                    "category": "Harmonix Junction, Hamo Hamo Mix, Sugarlight, Brens Beats Quartet, HanaYashiki, Full City",
                    "startTime": "19:10",
                    "endTime": "19:56",
                    "color": "#f59e0b"
                },
                {
                    "id": "act-1767266014354",
                    "stageId": "stage-1",
                    "name": "第3ステージ New Quartet",
                    "category": "Snappy's, ちゃるめら企画, うなぎやカルテット",
                    "startTime": "20:11",
                    "endTime": "20:55",
                    "color": "#3b82f6"
                },
                {
                    "id": "act-1767266064720",
                    "stageId": "stage-1",
                    "name": "第4ステージ　Chorus Stage",
                    "category": "Pioniere, Tokyo Vocal Express",
                    "startTime": "20:55",
                    "endTime": "21:15",
                    "color": "#ec4899"
                },
                {
                    "id": "act-1768392426956",
                    "stageId": "stage-2",
                    "name": "Dream Quartet発表会@戦災復興記念館",
                    "category": "Dream Quartet",
                    "startTime": "13:00",
                    "endTime": "15:00",
                    "color": "#f73b45"
                },
                {
                    "id": "act-1768392481261",
                    "stageId": "stage-2",
                    "name": "OP, EDコーラス練習",
                    "category": "Pioniere, Orca Rhapsodia, After Times, Exits, Ultra L, Squash!, HanaYashiki, Harmonix Junction, Full City, Sugarlight, Snappy's, Tokyo Vocal Express",
                    "startTime": "15:00",
                    "endTime": "16:00",
                    "color": "#f59e0b"
                },
                {
                    "id": "act-1768392675314",
                    "stageId": "stage-2",
                    "name": "開演・挨拶",
                    "category": "Pioniere, Orca Rhapsodia, After Times, Exits, Ultra L, Squash!, HanaYashiki, Harmonix Junction, Full City, Sugarlight, Snappy's, Tokyo Vocal Express, Coiffeur, Malwoofer",
                    "startTime": "18:30",
                    "endTime": "18:45",
                    "color": "#10b981"
                }
            ],
            "members": [
                {
                    "id": "mem-1768373600342",
                    "name": "あさの",
                    "teams": [
                        "渡邉歌劇団",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768372678177",
                    "name": "ふみちゃん",
                    "teams": [
                        "F.F.",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768373837687",
                    "name": "ふなけん",
                    "teams": [
                        "Harmonix Junction",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768373765425",
                    "name": "ハルヒ",
                    "teams": [
                        "Harmonix Junction",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768373735337",
                    "name": "ひかる",
                    "teams": [
                        "渡邉歌劇団",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768372693834",
                    "name": "到",
                    "teams": [
                        "F.F.",
                        "Pioniere",
                        "Full City"
                    ]
                },
                {
                    "id": "mem-1768373677681",
                    "name": "泉",
                    "teams": [
                        "渡邉歌劇団",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768373785598",
                    "name": "Junk",
                    "teams": [
                        "Harmonix Junction",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768372135638",
                    "name": "かとぱい",
                    "teams": [
                        "Vocal Tompectrum",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768372661898",
                    "name": "シャイニー",
                    "teams": [
                        "F.F.",
                        "Pioniere",
                        "Sugarlight"
                    ]
                },
                {
                    "id": "mem-1768372633183",
                    "name": "てんぴー",
                    "teams": [
                        "Vocal Tompectrum",
                        "Pioniere",
                        "Blends Beats Quartet",
                        "Hamo Hamo Mix",
                        "Full City"
                    ]
                },
                {
                    "id": "mem-1768372180638",
                    "name": "おぼぼ",
                    "teams": [
                        "Vocal Tompectrum",
                        "Pioniere",
                        "Sugarlight"
                    ]
                },
                {
                    "id": "mem-1768372578749",
                    "name": "yst",
                    "teams": [
                        "Vocal Tompectrum",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768373689529",
                    "name": "ざと",
                    "teams": [
                        "渡邉歌劇団",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768374528293",
                    "name": "せびー",
                    "teams": [
                        "Orca Rhapsodia",
                        "Blends Beats Quartet"
                    ]
                },
                {
                    "id": "mem-1768374543476",
                    "name": "ねーさん",
                    "teams": [
                        "Orca Rhapsodia",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768374562344",
                    "name": "なるなる",
                    "teams": [
                        "Orca Rhapsodia"
                    ]
                },
                {
                    "id": "mem-1768374597584",
                    "name": "べみ",
                    "teams": [
                        "Orca Rhapsodia",
                        "Blends Beats Quartet"
                    ]
                },
                {
                    "id": "mem-1768374693973",
                    "name": "ちゃるめら",
                    "teams": [
                        "After Times",
                        "ちゃるめら企画"
                    ]
                },
                {
                    "id": "mem-1768374765055",
                    "name": "コバック",
                    "teams": [
                        "After Times"
                    ]
                },
                {
                    "id": "mem-1768374777890",
                    "name": "まーちん",
                    "teams": [
                        "After Times"
                    ]
                },
                {
                    "id": "mem-1768374790201",
                    "name": "ひでひで",
                    "teams": [
                        "After Times"
                    ]
                },
                {
                    "id": "mem-1768374828449",
                    "name": "Joe",
                    "teams": [
                        "F.F.",
                        "Pioniere",
                        "Hamo Hamo Mix"
                    ]
                },
                {
                    "id": "mem-1768392966002",
                    "name": "ハルキ",
                    "teams": [
                        "東北大B1(仮)"
                    ]
                },
                {
                    "id": "mem-1768392973394",
                    "name": "たかひと",
                    "teams": [
                        "東北大B1(仮)"
                    ]
                },
                {
                    "id": "mem-1768392984651",
                    "name": "円谷",
                    "teams": [
                        "東北大B1(仮)"
                    ]
                },
                {
                    "id": "mem-1768393037914",
                    "name": "昆野",
                    "teams": [
                        "Harmonix Junction"
                    ]
                },
                {
                    "id": "mem-1768393078066",
                    "name": "いわみず",
                    "teams": [
                        "Exits"
                    ]
                },
                {
                    "id": "mem-1768393087566",
                    "name": "出口",
                    "teams": [
                        "Exits"
                    ]
                },
                {
                    "id": "mem-1768393166438",
                    "name": "ニック",
                    "teams": [
                        "Squash!",
                        "Exits"
                    ]
                },
                {
                    "id": "mem-1768393178554",
                    "name": "ひろむ",
                    "teams": [
                        "Squash!"
                    ]
                },
                {
                    "id": "mem-1768393204719",
                    "name": "らじえる",
                    "teams": [
                        "Squash!"
                    ]
                },
                {
                    "id": "mem-1768393222666",
                    "name": "Daiki",
                    "teams": [
                        "Squash!"
                    ]
                },
                {
                    "id": "mem-1768393268170",
                    "name": "Teru",
                    "teams": [
                        "Vagabonds"
                    ]
                },
                {
                    "id": "mem-1768393275059",
                    "name": "さとあつ",
                    "teams": [
                        "Vagabonds"
                    ]
                },
                {
                    "id": "mem-1768393287393",
                    "name": "けんと",
                    "teams": [
                        "Vagabonds"
                    ]
                },
                {
                    "id": "mem-1768393298941",
                    "name": "シイナ",
                    "teams": [
                        "Vagabonds"
                    ]
                },
                {
                    "id": "mem-1768393327711",
                    "name": "はまはま",
                    "teams": [
                        "Ultra L"
                    ]
                },
                {
                    "id": "mem-1768393346495",
                    "name": "Marina",
                    "teams": [
                        "Ultra L"
                    ]
                },
                {
                    "id": "mem-1768393355658",
                    "name": "とくちゃん",
                    "teams": [
                        "Ultra L"
                    ]
                },
                {
                    "id": "mem-1768393369766",
                    "name": "めろこ",
                    "teams": [
                        "Ultra L",
                        "Tokyo Vocal Express"
                    ]
                },
                {
                    "id": "mem-1768393406727",
                    "name": "清水",
                    "teams": [
                        "HanaYashiki"
                    ]
                },
                {
                    "id": "mem-1768393438849",
                    "name": "やっしー",
                    "teams": [
                        "HanaYashiki"
                    ]
                },
                {
                    "id": "mem-1768393570936",
                    "name": "花岡",
                    "teams": [
                        "HanaYashiki"
                    ]
                },
                {
                    "id": "mem-1768393615589",
                    "name": "のっぺ",
                    "teams": [
                        "Hamo Hamo Mix",
                        "Full City",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768393619711",
                    "name": "富田",
                    "teams": [
                        "Full City"
                    ]
                },
                {
                    "id": "mem-1768393741589",
                    "name": "ほのか",
                    "teams": [
                        "しなもん"
                    ]
                },
                {
                    "id": "mem-1768393751961",
                    "name": "ななこ",
                    "teams": [
                        "しなもん"
                    ]
                },
                {
                    "id": "mem-1768393768076",
                    "name": "かのん",
                    "teams": [
                        "しなもん"
                    ]
                },
                {
                    "id": "mem-1768393780342",
                    "name": "このは",
                    "teams": [
                        "しなもん"
                    ]
                },
                {
                    "id": "mem-1768393846589",
                    "name": "えっこ",
                    "teams": [
                        "Snappy's",
                        "Tokyo Vocal Express"
                    ]
                },
                {
                    "id": "mem-1768393853977",
                    "name": "みちゃこ",
                    "teams": [
                        "Snappy's"
                    ]
                },
                {
                    "id": "mem-1768393926763",
                    "name": "ゆいてぃん",
                    "teams": [
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768393981074",
                    "name": "みっちー",
                    "teams": [
                        "Coiffuer"
                    ]
                },
                {
                    "id": "mem-1768394007773",
                    "name": "たっきー",
                    "teams": [
                        "Coiffeur"
                    ]
                },
                {
                    "id": "mem-1768394120128",
                    "name": "純",
                    "teams": [
                        "Coiffuer"
                    ]
                },
                {
                    "id": "mem-1768394131555",
                    "name": "もじゃ",
                    "teams": [
                        "Coiffuer"
                    ]
                },
                {
                    "id": "mem-1768394151054",
                    "name": "おかちゃん",
                    "teams": [
                        "Tokyo Vocal Express",
                        "Pioniere"
                    ]
                },
                {
                    "id": "mem-1768394188421",
                    "name": "うなぎや",
                    "teams": [
                        "うなぎやカルテット"
                    ]
                }
            ]
        };

        // Cache DOM Elements
        this.dom = {
            timeLabels: document.getElementById('time-labels'),
            stagesContainer: document.getElementById('stages-container'),
            modals: {
                edit: document.getElementById('edit-modal'),
                settings: document.getElementById('settings-modal'),
                teamExport: document.getElementById('team-export-modal'),
                members: document.getElementById('members-modal'),
                individualExport: document.getElementById('individual-export-modal')
            },
            forms: {
                act: document.getElementById('act-form'),
                settings: document.getElementById('settings-form'),
                teamExport: document.getElementById('team-export-form'),
                member: document.getElementById('add-member-form'),
                individualExport: document.getElementById('individual-export-form')
            },
            buttons: {
                addAct: document.getElementById('add-act-btn'),
                addStage: document.getElementById('add-stage-btn'),
                members: document.getElementById('manage-members-btn'),
                export: document.getElementById('export-btn'),
                exportTeam: document.getElementById('export-team-btn'),
                exportMember: document.getElementById('export-member-btn'),
                settings: document.getElementById('settings-btn'),
                save: document.getElementById('save-project-btn'),
                load: document.getElementById('load-project-btn'),
                reset: document.getElementById('reset-btn')
            },
            inputs: {
                upload: document.getElementById('project-upload')
            }
        };

        this.dragState = {
            actId: null,
            offsetY: 0
        };

        this.init();
    }

    async init() {
        console.log('Initializing Schedule App...');
        await this.loadState();
        this.applyConfig();
        this.renderAll();
        this.checkReadOnly();
        this.bindEvents();
        console.log('Initialization Complete.');
    }

    // --- State Management ---

    async loadState() {
        // Check URl for read-only json load
        const urlParams = new URLSearchParams(window.location.search);
        this.isReadOnly = urlParams.get('view') === 'public';

        if (this.isReadOnly) {
            try {
                const res = await fetch('./schedule.json');
                if (res.ok) {
                    const json = await res.json();
                    this.state = { ...this.state, ...json };
                }
            } catch (e) {
                console.warn('Read-only: Failed to load schedule.json', e);
            }
        } else {
            // Local Storage
            const saved = localStorage.getItem(this.CONFIG.storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Merge deeply to ensure new fields are present if missing in save
                    this.state = {
                        ...this.state,
                        ...parsed,
                        config: { ...this.state.config, ...parsed.config }, // Ensure config structure
                    };
                    // Ensure arrays exist
                    if (!this.state.members) this.state.members = [];
                    if (!this.state.stages) this.state.stages = [];
                    if (!this.state.acts) this.state.acts = [];
                } catch (e) {
                    console.error('Failed to parse state:', e);
                }
            }
        }
    }

    saveState() {
        if (this.isReadOnly) return;
        this.state.config.startHour = this.CONFIG.startHour;
        this.state.config.endHour = this.CONFIG.endHour;
        localStorage.setItem(this.CONFIG.storageKey, JSON.stringify(this.state));
    }

    applyConfig() {
        if (this.state.config) {
            this.CONFIG.startHour = this.state.config.startHour;
            this.CONFIG.endHour = this.state.config.endHour;
        }
    }

    checkReadOnly() {
        if (this.isReadOnly) {
            document.body.classList.add('read-only');
        }
    }

    // --- Rendering ---

    renderAll() {
        this.renderTimeLabels();
        this.renderStages();
        this.renderActs();
    }

    renderTimeLabels() {
        const container = this.dom.timeLabels;
        container.innerHTML = '';
        const totalHours = this.CONFIG.endHour - this.CONFIG.startHour;
        const totalHeight = totalHours * this.CONFIG.pixelsPerHour;

        // Parent container height needs to match
        // But time-axis-container is sticky. The content inside needs height.
        container.style.height = `${totalHeight}px`;

        for (let h = 0; h <= totalHours; h++) {
            const hour = this.CONFIG.startHour + h;
            const el = document.createElement('div');
            el.className = 'time-marker';
            el.style.top = `${h * this.CONFIG.pixelsPerHour}px`;
            el.textContent = `${hour}:00`;
            container.appendChild(el);
        }
    }

    renderStages() {
        const container = this.dom.stagesContainer;
        container.innerHTML = '';
        const totalHeight = (this.CONFIG.endHour - this.CONFIG.startHour) * this.CONFIG.pixelsPerHour;

        this.state.stages.forEach(stage => {
            const col = document.createElement('div');
            col.className = 'stage-column';
            col.id = stage.id;
            col.style.height = `${totalHeight}px`;

            const header = document.createElement('div');
            header.className = 'stage-header';
            header.textContent = stage.name;

            if (!this.isReadOnly) {
                header.style.cursor = 'pointer';
                header.title = 'Click to rename';
                header.onclick = () => this.renameStage(stage.id);
                // Drag Drop Listeners
                col.addEventListener('dragover', (e) => this.handleDragOver(e));
                col.addEventListener('drop', (e) => this.handleDrop(e, stage.id));
            }

            col.appendChild(header);
            container.appendChild(col);
        });
    }

    renderActs() {
        // Clear existing acts from DOM
        document.querySelectorAll('.act-card').forEach(el => el.remove());

        this.state.acts.forEach(act => {
            const stageCol = document.getElementById(act.stageId);
            if (!stageCol) return;

            const card = this.createActCard(act);
            stageCol.appendChild(card);
        });
    }

    createActCard(act) {
        const card = document.createElement('div');
        card.className = 'act-card';
        card.id = act.id;
        card.draggable = !this.isReadOnly;
        card.textContent = act.name;
        card.style.backgroundColor = act.color;

        // Position
        const [startH, startM] = act.startTime.split(':').map(Number);
        const [endH, endM] = act.endTime.split(':').map(Number);

        const startTotalMin = startH * 60 + startM;
        const endTotalMin = endH * 60 + endM;
        const configStartMin = this.CONFIG.startHour * 60;

        const offsetMin = startTotalMin - configStartMin;
        const durationMin = endTotalMin - startTotalMin;

        const topPx = (offsetMin / 60) * this.CONFIG.pixelsPerHour;
        const heightPx = (durationMin / 60) * this.CONFIG.pixelsPerHour;

        card.style.top = `${topPx}px`;
        card.style.height = `${heightPx}px`;

        // Content
        let categoriesHtml = '';
        if (act.category) {
            const cats = act.category.split(',').map(c => c.trim()).filter(Boolean);
            if (cats.length) {
                categoriesHtml = `<div class="act-categories-wrapper">${cats.map(c => `<div class="act-category">${c}</div>`).join('')}</div>`;
            }
        }

        card.innerHTML = `
            <div class="act-title">${act.name}</div>
            <div class="act-time">${act.startTime} - ${act.endTime}</div>
            ${categoriesHtml}
        `;

        // Interaction
        if (!this.isReadOnly) {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e, act));
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditModal(act);
            });
        }

        return card;
    }

    // --- Actions ---

    renameStage(stageId) {
        const stage = this.state.stages.find(s => s.id === stageId);
        if (!stage) return;
        const newName = prompt('Enter new stage name:', stage.name);
        if (newName && newName.trim()) {
            stage.name = newName.trim();
            this.saveState();
            this.renderStages();
            this.renderActs(); // Re-render acts to attach to new DOM elements
        }
    }

    addStage() {
        const name = prompt('Stage Name:', `Stage ${this.state.stages.length + 1}`);
        if (name) {
            this.state.stages.push({
                id: `stage-${Date.now()}`,
                name: name
            });
            this.saveState();
            this.renderStages();
            this.renderActs();
        }
    }

    // --- Drag & Drop ---

    handleDragStart(e, act) {
        this.dragState.actId = act.id;
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';

        const rect = e.target.getBoundingClientRect();
        this.dragState.offsetY = e.clientY - rect.top;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e, stageId) {
        e.preventDefault();
        const draggedEl = document.getElementById(this.dragState.actId);
        if (draggedEl) draggedEl.style.opacity = '1';

        if (!this.dragState.actId) return;

        const stageRect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - stageRect.top - this.dragState.offsetY;

        // Calculate time
        const minutesFromStart = (relativeY / this.CONFIG.pixelsPerHour) * 60;
        const snappedMinutes = Math.round(minutesFromStart / this.CONFIG.snapMinutes) * this.CONFIG.snapMinutes;

        const act = this.state.acts.find(a => a.id === this.dragState.actId);
        if (!act) return;

        // Current Duration
        const [cH, cM] = act.startTime.split(':').map(Number);
        const [eH, eM] = act.endTime.split(':').map(Number);
        const durationMin = (eH * 60 + eM) - (cH * 60 + cM);

        const newStartTotalMin = (this.CONFIG.startHour * 60) + snappedMinutes;

        // Clamp
        const globalStartMin = this.CONFIG.startHour * 60;
        const globalEndMin = this.CONFIG.endHour * 60;

        const clampedStartMin = Math.max(globalStartMin, Math.min(newStartTotalMin, globalEndMin - durationMin));
        const clampedEndMin = clampedStartMin + durationMin;

        act.stageId = stageId;
        act.startTime = this.formatTime(clampedStartMin);
        act.endTime = this.formatTime(clampedEndMin);

        this.saveState();
        this.renderActs();
        this.dragState.actId = null;
    }

    formatTime(totalMin) {
        let h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        if (h >= 24) h = h % 24;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // --- Modals ---

    openEditModal(act = null) {
        const m = this.dom.modals.edit;
        m.classList.remove('hidden');
        if (act) {
            document.getElementById('act-id').value = act.id;
            document.getElementById('act-name').value = act.name;
            document.getElementById('act-category').value = act.category || '';
            document.getElementById('act-start').value = act.startTime;
            document.getElementById('act-end').value = act.endTime;
            document.getElementById('act-color').value = act.color;
            document.getElementById('modal-delete').style.display = 'block';
        } else {
            document.getElementById('act-id').value = '';
            document.getElementById('act-name').value = 'New Act';
            document.getElementById('act-category').value = '';
            document.getElementById('act-start').value = '12:00';
            document.getElementById('act-end').value = '13:00';
            document.getElementById('act-color').value = this.getRandomColor();
            document.getElementById('modal-delete').style.display = 'none';
        }
    }

    closeModal(modalName) {
        if (this.dom.modals[modalName]) {
            this.dom.modals[modalName].classList.add('hidden');
        }
    }

    getRandomColor() {
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // --- Form Handlers ---

    handleActSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('act-id').value;
        const data = {
            name: document.getElementById('act-name').value,
            category: document.getElementById('act-category').value,
            startTime: document.getElementById('act-start').value,
            endTime: document.getElementById('act-end').value,
            color: document.getElementById('act-color').value
        };

        if (id) {
            const act = this.state.acts.find(a => a.id === id);
            if (act) Object.assign(act, data);
        } else {
            this.state.acts.push({
                id: `act-${Date.now()}`,
                stageId: this.state.stages[0].id,
                ...data
            });
        }
        this.saveState();
        this.renderActs();
        this.closeModal('edit');
    }

    handleActDelete() {
        const id = document.getElementById('act-id').value;
        if (id && confirm('Delete?')) {
            this.state.acts = this.state.acts.filter(a => a.id !== id);
            this.saveState();
            this.renderActs();
            this.closeModal('edit');
        }
    }

    handleSettingsSubmit(e) {
        e.preventDefault();
        const start = parseInt(document.getElementById('setting-start-hour').value, 10);
        const end = parseInt(document.getElementById('setting-end-hour').value, 10);

        if (start >= end) {
            alert('Start hour must be less than End hour');
            return;
        }

        this.CONFIG.startHour = start;
        this.CONFIG.endHour = end;
        this.saveState();
        this.renderAll();
        this.closeModal('settings');
    }

    openSettings() {
        document.getElementById('setting-start-hour').value = this.CONFIG.startHour;
        document.getElementById('setting-end-hour').value = this.CONFIG.endHour;
        this.dom.modals.settings.classList.remove('hidden');
    }

    // --- Member Management ---

    openMembersModal() {
        this.renderMembersList();
        this.clearMemberForm();
        this.dom.modals.members.classList.remove('hidden');
    }

    renderMembersList() {
        const tbody = document.getElementById('members-list-body');
        tbody.innerHTML = '';
        this.state.members.forEach(member => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
            tr.innerHTML = `
                <td style="padding: 10px;">${member.name}</td>
                <td style="padding: 10px; font-size: 0.85rem; color: #9ca3af;">${member.teams.join(', ')}</td>
                <td style="padding: 10px; text-align: right;">
                    <button class="btn outline edit-member-trigger" data-id="${member.id}" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach listeners dynamically
        tbody.querySelectorAll('.edit-member-trigger').forEach(btn => {
            btn.onclick = () => this.editMember(btn.dataset.id);
        });
    }

    editMember(id) {
        const member = this.state.members.find(m => m.id === id);
        if (!member) return;
        document.getElementById('member-id').value = member.id;
        document.getElementById('member-name').value = member.name;
        document.getElementById('member-teams').value = member.teams.join(', ');
        document.getElementById('member-delete').style.display = 'inline-flex';
    }

    clearMemberForm() {
        document.getElementById('member-id').value = '';
        document.getElementById('member-name').value = '';
        document.getElementById('member-teams').value = '';
        document.getElementById('member-delete').style.display = 'none';
    }

    handleMemberSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('member-id').value;
        const name = document.getElementById('member-name').value;
        const teams = document.getElementById('member-teams').value.split(',').map(t => t.trim()).filter(Boolean);

        if (id) {
            const m = this.state.members.find(m => m.id === id);
            if (m) {
                m.name = name;
                m.teams = teams;
            }
        } else {
            this.state.members.push({
                id: `mem-${Date.now()}`,
                name: name,
                teams: teams
            });
        }
        this.saveState();
        this.renderMembersList();
        this.clearMemberForm();
    }

    handleMemberDelete() {
        const id = document.getElementById('member-id').value;
        if (id && confirm('Delete member?')) {
            this.state.members = this.state.members.filter(m => m.id !== id);
            this.saveState();
            this.renderMembersList();
            this.clearMemberForm();
        }
    }

    // --- Exports ---

    async handleGlobalExport() {
        const btn = this.dom.buttons.export;
        btn.textContent = 'Generating...';
        document.body.classList.add('exporting');

        try {
            // Clone DOM for clean export
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'absolute', top: '-9999px', left: '0',
                width: 'fit-content', minWidth: '100%',
                background: getComputedStyle(document.body).background,
                color: '#f8fafc', padding: '40px',
                fontFamily: getComputedStyle(document.body).fontFamily
            });

            // Title
            const title = document.querySelector('.logo').cloneNode(true);
            title.style.marginBottom = '20px';
            const h1 = title.querySelector('h1');
            h1.style.background = 'linear-gradient(to right, #818cf8, #c4b5fd)';
            h1.style.webkitBackgroundClip = 'text';
            h1.style.webkitTextFillColor = 'transparent';
            container.appendChild(title);

            // Workspace
            const workspace = document.getElementById('capture-target').cloneNode(true);
            workspace.style.background = 'transparent';
            container.appendChild(workspace);

            document.body.appendChild(container);

            const canvas = await html2canvas(container, {
                backgroundColor: null,
                scale: 2
            });

            this.downloadImage(canvas, `SBF_Full_Schedule`);
            document.body.removeChild(container);
        } catch (e) {
            console.error(e);
            alert('Export Failed');
        } finally {
            btn.textContent = 'Export Image';
            document.body.classList.remove('exporting');
        }
    }

    openTeamExport() {
        const select = document.getElementById('export-team-select');
        select.innerHTML = '<option value="">-- Select Team --</option>';

        const teams = new Set();
        this.state.acts.forEach(act => {
            if (act.category) act.category.split(',').forEach(c => teams.add(c.trim()));
        });

        Array.from(teams).filter(Boolean).sort().forEach(t => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = t;
            select.appendChild(opt);
        });

        this.dom.modals.teamExport.classList.remove('hidden');
    }

    handleTeamExportSubmit(e) {
        e.preventDefault();
        const team = document.getElementById('export-team-select').value;
        if (!team) return;

        const acts = this.state.acts.filter(a => {
            if (!a.category) return false;
            return a.category.split(',').map(c => c.trim()).includes(team);
        });

        this.generateSpecializedExport(acts, team, 'Schedule for');
        this.closeModal('teamExport');
    }

    openIndividualExport() {
        const select = document.getElementById('export-member-select');
        select.innerHTML = '<option value="">-- Select Member --</option>';

        this.state.members.sort((a, b) => a.name.localeCompare(b.name)).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name;
            select.appendChild(opt);
        });

        this.dom.modals.individualExport.classList.remove('hidden');
    }

    handleIndividualExportSubmit(e) {
        e.preventDefault();
        const memId = document.getElementById('export-member-select').value;
        const member = this.state.members.find(m => m.id === memId);
        if (!member) return;

        const acts = this.state.acts.filter(a => {
            if (!a.category) return false;
            const cats = a.category.split(',').map(c => c.trim());
            return member.teams.some(team => cats.includes(team));
        });

        this.generateSpecializedExport(acts, member.name, 'Schedule for', `Teams: ${member.teams.join(', ')}`);
        this.closeModal('individualExport');
    }

    async generateSpecializedExport(acts, title, subtitle, extraInfo = '') {
        // Sort
        acts.sort((a, b) => {
            // Primary Sort: Stage Index (Day 1, Day 2...)
            const stageIndexA = this.state.stages.findIndex(s => s.id === a.stageId);
            const stageIndexB = this.state.stages.findIndex(s => s.id === b.stageId);

            if (stageIndexA !== stageIndexB) {
                return stageIndexA - stageIndexB;
            }

            // Secondary Sort: Time
            const [aH, aM] = a.startTime.split(':').map(Number);
            const [bH, bM] = b.startTime.split(':').map(Number);
            return (aH * 60 + aM) - (bH * 60 + bM);
        });

        const card = document.createElement('div');
        card.className = 'team-export-card';

        let actsHtml = acts.length ? '' : '<div style="text-align:center; padding: 20px; opacity:0.5">No acts found.</div>';

        acts.forEach(act => {
            const stage = this.state.stages.find(s => s.id === act.stageId)?.name || 'Unknown';
            actsHtml += `
                <div class="team-act-item">
                    <div class="team-act-time">${act.startTime} - ${act.endTime}</div>
                    <div class="team-act-info">
                        <div class="team-act-name">${act.name}</div>
                        <div class="team-act-stage">${stage}</div>
                        <div style="font-size:0.7em; opacity:0.7; margin-top:4px">${act.category}</div>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="team-export-header">
                <div class="team-export-title">Sendai Barbershop Festival</div>
                <div class="team-export-subtitle">${subtitle} <strong>${title}</strong></div>
                ${extraInfo ? `<div style="font-size:0.8rem; opacity:0.7; margin-top:4px">${extraInfo}</div>` : ''}
            </div>
            <div class="team-act-list">${actsHtml}</div>
            <div class="team-export-footer">Generated on ${new Date().toLocaleDateString()}</div>
        `;

        card.style.position = 'absolute';
        card.style.top = '-9999px';
        document.body.appendChild(card);

        try {
            const canvas = await html2canvas(card, { backgroundColor: null, scale: 2 });
            this.downloadImage(canvas, `SBF_Schedule_${title}`);
        } catch (e) {
            console.error(e);
            alert('Gen failed');
        } finally {
            document.body.removeChild(card);
        }
    }

    downloadImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // --- Project Data ---

    handleSaveProject() {
        const json = JSON.stringify(this.state, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `SBF_Project_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        link.href = url;
        link.click();
    }

    handleLoadProjectTrigger() {
        this.dom.inputs.upload.click();
    }

    handleLoadProjectFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm('Replace current data?')) {
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const parsed = JSON.parse(evt.target.result);
                this.state = parsed;
                this.saveState();
                this.applyConfig();
                this.renderAll();
                alert('Project Loaded.');
            } catch (e) {
                alert('Invalid File');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    }

    handleReset() {
        if (confirm('Reset EVERYTHING? this cannot be undone.')) {
            localStorage.removeItem(this.CONFIG.storageKey);
            location.reload();
        }
    }

    // --- Wiring ---

    bindEvents() {
        if (this.isReadOnly) return;

        // Buttons
        this.dom.buttons.addAct.onclick = () => this.openEditModal(null);
        this.dom.buttons.addStage.onclick = () => this.addStage();
        this.dom.buttons.settings.onclick = () => this.openSettings();
        this.dom.buttons.members.onclick = () => this.openMembersModal();

        this.dom.buttons.export.onclick = () => this.handleGlobalExport();
        this.dom.buttons.exportTeam.onclick = () => this.openTeamExport();
        this.dom.buttons.exportMember.onclick = () => this.openIndividualExport();

        this.dom.buttons.save.onclick = () => this.handleSaveProject();
        this.dom.buttons.load.onclick = () => this.handleLoadProjectTrigger();
        this.dom.buttons.reset.onclick = () => this.handleReset();

        this.dom.inputs.upload.onchange = (e) => this.handleLoadProjectFile(e);

        // Modals
        this.dom.forms.act.onsubmit = (e) => this.handleActSubmit(e);
        document.getElementById('modal-cancel').onclick = () => this.closeModal('edit');
        document.getElementById('modal-delete').onclick = () => this.handleActDelete();

        this.dom.forms.settings.onsubmit = (e) => this.handleSettingsSubmit(e);
        document.getElementById('settings-cancel').onclick = () => this.closeModal('settings');

        // Team Export
        this.dom.forms.teamExport.onsubmit = (e) => this.handleTeamExportSubmit(e);
        document.getElementById('team-export-cancel').onclick = () => this.closeModal('teamExport');

        // Individual Export
        this.dom.forms.individualExport.onsubmit = (e) => this.handleIndividualExportSubmit(e);
        document.getElementById('individual-export-cancel').onclick = () => this.closeModal('individualExport');

        // Members
        this.dom.forms.member.onsubmit = (e) => this.handleMemberSubmit(e);
        document.getElementById('member-delete').onclick = () => this.handleMemberDelete();
        document.getElementById('member-clear').onclick = () => this.clearMemberForm();
        document.getElementById('members-close').onclick = () => this.closeModal('members');
    }
}

// Start Application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ScheduleApp();
});
