/**
 * Concert Timetable Editor
 */

// Configuration Defaults
let CONFIG = {
    startHour: 9, // 9:00 AM
    endHour: 22,  // 10:00 PM
    pixelsPerHour: 300,
    snapMinutes: 5 // Allow 5 minute intervals for finer control
};
// State
let state = {
    // We store config in state now to persist it
    config: {
        startHour: 9,
        endHour: 22
    },
    stages: [
        { id: 'stage-1', name: 'Main Stage' },
        { id: 'stage-2', name: 'Second Stage' }
    ],
    acts: [
        {
            id: 'act-1',
            stageId: 'stage-1',
            name: 'Opening Act',
            startTime: '10:00',
            endTime: '11:00',
            color: '#3b82f6'
        }
    ]
};

// DOM Elements
const stagesContainer = document.getElementById('stages-container');
const timeLabelsContainer = document.getElementById('time-labels');
const editModal = document.getElementById('edit-modal');
const settingsModal = document.getElementById('settings-modal');
const actForm = document.getElementById('act-form');
const settingsForm = document.getElementById('settings-form');

// Initialization
const urlParams = new URLSearchParams(window.location.search);
const isReadOnly = urlParams.get('view') === 'public';

async function init() {
    await loadState(); // modified to be async

    // Apply loaded config to global CONFIG
    if (state && state.config) {
        CONFIG.startHour = state.config.startHour;
        CONFIG.endHour = state.config.endHour;
    }

    renderTimeLabels();
    renderStages();
    renderActs();

    if (isReadOnly) {
        enableReadOnlyMode();
    } else {
        setupEventListeners();
    }
}

async function loadState() {
    // If in read-only mode, try to fetch schedule.json first
    if (isReadOnly) {
        try {
            const response = await fetch('./schedule.json');
            if (response.ok) {
                const json = await response.json();
                state = { ...state, ...json };
                console.log('Loaded from schedule.json');
                return;
            }
        } catch (e) {
            console.warn('Could not load schedule.json, falling back to local storage', e);
        }
    }

    // Fallback to LocalStorage
    const saved = localStorage.getItem('timetable_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };

        // Ensure config exists
        if (!state.config) {
            state.config = { startHour: 9, endHour: 22 };
        }
    }
}

function enableReadOnlyMode() {
    document.body.classList.add('read-only');
    console.log('Read-Only Mode Enabled');
    // Header actions are hidden via CSS given the .read-only class
}

function saveState() {
    state.config.startHour = CONFIG.startHour;
    state.config.endHour = CONFIG.endHour;
    localStorage.setItem('timetable_state', JSON.stringify(state));
}

/**
 * Rendering
 */
function renderTimeLabels() {
    timeLabelsContainer.innerHTML = '';
    const totalHours = CONFIG.endHour - CONFIG.startHour;

    const totalHeight = totalHours * CONFIG.pixelsPerHour;
    timeLabelsContainer.style.height = `${totalHeight}px`;

    for (let h = 0; h <= totalHours; h++) {
        const hour = CONFIG.startHour + h;
        const el = document.createElement('div');
        el.className = 'time-marker';
        el.style.top = `${h * CONFIG.pixelsPerHour}px`;
        el.textContent = `${hour}:00`;
        timeLabelsContainer.appendChild(el);
    }
}

function renderStages() {
    stagesContainer.innerHTML = '';
    state.stages.forEach(stage => {
        const col = document.createElement('div');
        col.className = 'stage-column';
        col.id = stage.id;

        const totalHeight = (CONFIG.endHour - CONFIG.startHour) * CONFIG.pixelsPerHour;
        col.style.height = `${totalHeight}px`;

        const header = document.createElement('div');
        header.className = 'stage-header';
        header.textContent = stage.name;
        header.title = 'Click to rename';
        header.style.cursor = 'pointer';

        if (!isReadOnly) {
            // Simple rename functionality
            header.addEventListener('click', () => {
                const newName = prompt('Enter new stage name (or leave empty to keep):', stage.name);
                if (newName && newName.trim() !== '') {
                    stage.name = newName.trim();
                    saveState();
                    renderStages();
                }
            });
        }

        col.appendChild(header);
        stagesContainer.appendChild(col);

        if (!isReadOnly) {
            col.addEventListener('dragover', handleDragOver);
            col.addEventListener('drop', (e) => handleDrop(e, stage.id));
        }
    });
}

function renderActs() {
    document.querySelectorAll('.act-card').forEach(el => el.remove());

    state.acts.forEach(act => {
        const stageCol = document.getElementById(act.stageId);
        if (!stageCol) return;

        const card = createActCard(act);
        if (card) stageCol.appendChild(card);
    });
}

function createActCard(act) {
    const card = document.createElement('div');
    card.className = 'act-card';
    card.id = act.id;
    card.draggable = true;
    card.textContent = act.name;
    card.style.backgroundColor = act.color;

    // Calculate Position based on Global Config
    const [startH, startM] = act.startTime.split(':').map(Number);
    const [endH, endM] = act.endTime.split(':').map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;
    const configStartMinutes = CONFIG.startHour * 60;

    const startOffsetMinutes = startTotalMinutes - configStartMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    const topPx = (startOffsetMinutes / 60) * CONFIG.pixelsPerHour;
    const heightPx = (durationMinutes / 60) * CONFIG.pixelsPerHour;

    card.style.top = `${topPx}px`;
    card.style.height = `${heightPx}px`;

    // Generate Category Badges
    let categoriesHtml = '';
    if (act.category && act.category.trim() !== '') {
        const categories = act.category.split(',').map(c => c.trim()).filter(c => c !== '');
        categoriesHtml = `<div class="act-categories-wrapper">${categories.map(c => `<div class="act-category">${c}</div>`).join('')}</div>`;
    }

    const content = `
        <div class="act-title">${act.name}</div>
        <div class="act-time">${act.startTime} - ${act.endTime}</div>
        ${categoriesHtml}
    `;
    card.innerHTML = content;

    if (!isReadOnly) {
        card.addEventListener('dragstart', (e) => handleDragStart(e, act));
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(act);
        });
    }

    return card;
}

/**
 * Event Logic (Drag & Drop)
 */
let draggedActId = null;
let dragOffsetY = 0;

function handleDragStart(e, act) {
    draggedActId = act.id;
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';

    const rect = e.target.getBoundingClientRect();
    dragOffsetY = e.clientY - rect.top;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e, stageId) {
    e.preventDefault();
    const draggedEl = document.getElementById(draggedActId);
    if (draggedEl) draggedEl.style.opacity = '1';

    if (!draggedActId) return;

    const stageRect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - stageRect.top - dragOffsetY;

    const minutesFromStart = (relativeY / CONFIG.pixelsPerHour) * 60;
    const snappedMinutes = Math.round(minutesFromStart / CONFIG.snapMinutes) * CONFIG.snapMinutes;

    // Global clamp
    const startTotalMinutes = (CONFIG.startHour * 60) + snappedMinutes;

    const act = state.acts.find(a => a.id === draggedActId);
    if (!act) return;

    const [currentStartH, currentStartM] = act.startTime.split(':').map(Number);
    const [currentEndH, currentEndM] = act.endTime.split(':').map(Number);
    const durationMinutes = (currentEndH * 60 + currentEndM) - (currentStartH * 60 + currentStartM);

    // Clamp to Global Limits
    const newStartTotalMinutes = Math.max(CONFIG.startHour * 60, Math.min(startTotalMinutes, (CONFIG.endHour * 60) - durationMinutes));
    const newEndTotalMinutes = newStartTotalMinutes + durationMinutes;

    const formatTime = (totalMin) => {
        let h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        if (h >= 24) h = h % 24;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    act.stageId = stageId;
    act.startTime = formatTime(newStartTotalMinutes);
    act.endTime = formatTime(newEndTotalMinutes);

    saveState();
    renderActs();
    draggedActId = null;
}

function openEditModal(act) {
    editModal.classList.remove('hidden');
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
        document.getElementById('act-color').value = getRandomColor();
        document.getElementById('modal-delete').style.display = 'none';
    }
}

function getRandomColor() {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

actForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('act-id').value;
    const name = document.getElementById('act-name').value;
    const category = document.getElementById('act-category').value;
    const start = document.getElementById('act-start').value;
    const end = document.getElementById('act-end').value;
    const color = document.getElementById('act-color').value;

    if (id) {
        const act = state.acts.find(a => a.id === id);
        if (act) {
            act.name = name;
            act.category = category;
            act.startTime = start;
            act.endTime = end;
            act.color = color;
        }
    } else {
        const newAct = {
            id: `act-${Date.now()}`,
            stageId: state.stages[0].id,
            name: name,
            category: category,
            startTime: start,
            endTime: end,
            color: color
        };
        state.acts.push(newAct);
    }
    saveState();
    renderActs();
    editModal.classList.add('hidden');
});

document.getElementById('modal-delete').addEventListener('click', () => {
    const id = document.getElementById('act-id').value;
    if (id && confirm('Delete this act?')) {
        state.acts = state.acts.filter(a => a.id !== id);
        saveState();
        renderActs();
        editModal.classList.add('hidden');
    }
});
document.getElementById('modal-cancel').addEventListener('click', () => editModal.classList.add('hidden'));

// Settings Modal
document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('setting-start-hour').value = CONFIG.startHour;
    document.getElementById('setting-end-hour').value = CONFIG.endHour;
    settingsModal.classList.remove('hidden');
});
document.getElementById('settings-cancel').addEventListener('click', () => settingsModal.classList.add('hidden'));

settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newStart = parseInt(document.getElementById('setting-start-hour').value, 10);
    const newEnd = parseInt(document.getElementById('setting-end-hour').value, 10);

    if (newStart >= newEnd) {
        alert('Start hour must be before End hour.');
        return;
    }

    CONFIG.startHour = newStart;
    CONFIG.endHour = newEnd;
    saveState();
    renderTimeLabels();
    renderStages();
    renderActs();
    settingsModal.classList.add('hidden');
});

function setupEventListeners() {
    document.getElementById('add-act-btn').onclick = () => openEditModal(null);
    document.getElementById('add-stage-btn').onclick = () => {
        const name = prompt('Enter Stage Name:', `Stage ${state.stages.length + 1}`);
        if (name) {
            const newStage = {
                id: `stage-${Date.now()}`,
                name: name
            };
            state.stages.push(newStage);
            saveState();
            renderStages();
            renderActs();
        }
    };

    document.getElementById('reset-btn').onclick = () => {
        if (confirm('Reset all data?')) {
            localStorage.removeItem('timetable_state');
            location.reload();
        }
    };

    // Ensure Settings btn is visible
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.style.display = 'inline-flex';

    // Save Project
    const saveBtn = document.getElementById('save-project-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveProject);

    // Load Project
    const loadBtn = document.getElementById('load-project-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            document.getElementById('project-upload').click();
        });
    }

    const uploadInput = document.getElementById('project-upload');
    if (uploadInput) uploadInput.addEventListener('change', loadProject);
}

function saveProject() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `SBF_Schedule_${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
}

function loadProject(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('Loading a project will replace all current data. Continue?')) {
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const json = JSON.parse(evt.target.result);

            // Basic validation
            if (!json.stages || !json.acts) {
                throw new Error('Invalid project file format');
            }

            state = json;
            saveState(); // Save to local storage

            // Apply config if present
            if (state.config) {
                CONFIG.startHour = state.config.startHour;
                CONFIG.endHour = state.config.endHour;
            } else {
                CONFIG.startHour = 9;
                CONFIG.endHour = 22;
            }

            renderTimeLabels();
            renderStages();
            renderActs();

            alert('Project loaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to load project: ' + err.message);
        }
        e.target.value = '';
    };
    reader.readAsText(file);
}

document.getElementById('export-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-btn');
    btn.textContent = 'Exporting...';
    document.body.classList.add('exporting');
    await new Promise(r => setTimeout(r, 100));

    try {
        const exportContainer = document.createElement('div');
        Object.assign(exportContainer.style, {
            position: 'absolute', top: '-9999px', left: '0',
            width: 'fit-content', minWidth: '100%',
            background: getComputedStyle(document.body).background,
            color: '#f8fafc', padding: '40px',
            fontFamily: getComputedStyle(document.body).fontFamily
        });

        const titleClone = document.querySelector('.logo').cloneNode(true);
        titleClone.style.marginBottom = '20px';
        const h1 = titleClone.querySelector('h1');
        h1.style.background = 'linear-gradient(to right, #818cf8, #c4b5fd)';
        h1.style.webkitBackgroundClip = 'text';
        h1.style.webkitTextFillColor = 'transparent';
        exportContainer.appendChild(titleClone);

        const tableClone = document.getElementById('capture-target').cloneNode(true);
        tableClone.style.backgroundColor = 'transparent';
        exportContainer.appendChild(tableClone);

        document.body.appendChild(exportContainer);

        const canvas = await html2canvas(exportContainer, {
            backgroundColor: null, scale: 2, logging: false, useCORS: true,
            windowWidth: exportContainer.scrollWidth + 100,
            windowHeight: exportContainer.scrollHeight + 100
        });

        const link = document.createElement('a');
        link.download = `SendaiBarbershopFestival-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        document.body.removeChild(exportContainer);
    } catch (err) {
        console.error(err);
        alert('Export failed');
    } finally {
        btn.textContent = 'Export Image';
        document.body.classList.remove('exporting');
    }
});

// ...
// Start
init();

// --- Team Export Logic ---

const teamExportModal = document.getElementById('team-export-modal');
const teamExportSelect = document.getElementById('export-team-select');

// Open Modal & Populate Teams
document.getElementById('export-team-btn').addEventListener('click', () => {
    // Extract unique categories (Teams)
    const teams = new Set();
    state.acts.forEach(act => {
        if (act.category && act.category.trim() !== '') {
            // Split by comma
            act.category.split(',').forEach(c => {
                if (c.trim()) teams.add(c.trim());
            });
        }
    });

    // Populate Select
    teamExportSelect.innerHTML = '<option value="">-- Select Team --</option>';
    Array.from(teams).sort().forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamExportSelect.appendChild(option);
    });

    teamExportModal.classList.remove('hidden');
});

document.getElementById('team-export-cancel').addEventListener('click', () => {
    teamExportModal.classList.add('hidden');
});

document.getElementById('team-export-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedTeam = teamExportSelect.value;
    if (!selectedTeam) return;

    // Filter acts for this team (Partial match check for comma separated list)
    const teamActs = state.acts.filter(act => {
        if (!act.category) return false;
        const categories = act.category.split(',').map(c => c.trim());
        return categories.includes(selectedTeam);
    });

    // Sort by start time (Minutes)
    teamActs.sort((a, b) => {
        const [aH, aM] = a.startTime.split(':').map(Number);
        const [bH, bM] = b.startTime.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
    });

    // Generate UI for capture
    const card = document.createElement('div');
    card.className = 'team-export-card';

    // Build Content
    let actsHtml = '';
    teamActs.forEach(act => {
        const stage = state.stages.find(s => s.id === act.stageId);
        const stageName = stage ? stage.name : 'Unknown Stage';

        actsHtml += `
            <div class="team-act-item">
                <div class="team-act-time">${act.startTime} - ${act.endTime}</div>
                <div class="team-act-info">
                    <div class="team-act-name">${act.name}</div>
                    <div class="team-act-stage">${stageName}</div>
                </div>
            </div>
        `;
    });

    card.innerHTML = `
        <div class="team-export-header">
            <div class="team-export-title">Sendai Barbershop Festival</div>
            <div class="team-export-subtitle">Schedule for <strong>${selectedTeam}</strong></div>
        </div>
        <div class="team-act-list">
            ${actsHtml}
        </div>
        <div class="team-export-footer">
            Generated on ${new Date().toLocaleDateString()}
        </div>
    `;

    // Position off-screen
    card.style.position = 'absolute';
    card.style.top = '-9999px';
    card.style.left = '-9999px';
    document.body.appendChild(card);

    // Capture & Download
    try {
        const btn = e.submitter;
        const originalText = btn.textContent;
        btn.textContent = 'Generating...';

        const canvas = await html2canvas(card, {
            backgroundColor: null,
            scale: 2 // High res
        });

        const link = document.createElement('a');
        const safeTeamName = selectedTeam.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `SBF_Schedule_${safeTeamName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        teamExportModal.classList.add('hidden');
        btn.textContent = originalText;
    } catch (err) {
        console.error(err);
        alert('Failed to generate image');
    } finally {
        document.body.removeChild(card);
    }
});
