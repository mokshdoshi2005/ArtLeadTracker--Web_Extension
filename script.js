// ===== DOM Elements =====
const artistInput = document.getElementById('artistInput');
const addArtistBtn = document.getElementById('addArtistBtn');
const artistSelect = document.getElementById('artistSelect');
const linkInput = document.getElementById('linkInput');
const addLinkBtn = document.getElementById('addLinkBtn');
const saveTabBtn = document.getElementById('saveTabBtn');
const artistsList = document.getElementById('artistsList');
const jsonDisplay = document.getElementById('jsonDisplay');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

// Moodboard elements
const moodboardGrid = document.getElementById('moodboardGrid');
const moodboardEmpty = document.getElementById('moodboardEmpty');
const filterArtist = document.getElementById('filterArtist');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// ===== State =====
let artists = {};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadArtists();
    setupTabs();
});

// ===== Tab Navigation =====
function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update button states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${targetTab}-tab`).classList.add('active');

            // Refresh moodboard when switching to it
            if (targetTab === 'moodboard') {
                renderMoodboard();
            }
        });
    });
}

// ===== Event Listeners =====

// Add new artist
addArtistBtn.addEventListener('click', () => {
    const artistName = artistInput.value.trim();
    if (artistName) {
        addArtist(artistName);
        artistInput.value = '';
    }
});

artistInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const artistName = artistInput.value.trim();
        if (artistName) {
            addArtist(artistName);
            artistInput.value = '';
        }
    }
});

// Add link to selected artist
addLinkBtn.addEventListener('click', () => {
    const selectedArtist = artistSelect.value;
    const link = linkInput.value.trim();

    if (selectedArtist && link) {
        addLinkToArtist(selectedArtist, link);
        linkInput.value = '';
    } else if (!selectedArtist) {
        showToast('Please select an artist first!', 'error');
    }
});

linkInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const selectedArtist = artistSelect.value;
        const link = linkInput.value.trim();

        if (selectedArtist && link) {
            addLinkToArtist(selectedArtist, link);
            linkInput.value = '';
        }
    }
});

// Save current tab URL
saveTabBtn.addEventListener('click', () => {
    const selectedArtist = artistSelect.value;

    if (!selectedArtist) {
        showToast('Please select an artist first!', 'error');
        return;
    }

    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                addLinkToArtist(selectedArtist, tabs[0].url);
                showToast('Tab URL saved!');
            }
        });
    } else {
        showToast('Tab saving only works in extension mode', 'error');
    }
});

// Copy JSON to clipboard
copyJsonBtn.addEventListener('click', () => {
    const jsonText = JSON.stringify(artists, null, 2);
    navigator.clipboard.writeText(jsonText).then(() => {
        showToast('JSON copied to clipboard!');
    });
});

// Export JSON as file
exportBtn.addEventListener('click', () => {
    const jsonText = JSON.stringify(artists, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artists_data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON exported!');
});

// Clear all data
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all artists and links?')) {
        artists = {};
        saveArtists();
        renderAll();
        showToast('All data cleared!');
    }
});

// Filter moodboard by artist
filterArtist.addEventListener('change', () => {
    renderMoodboard();
});

// ===== Functions =====

function addArtist(name) {
    if (artists.hasOwnProperty(name)) {
        showToast('Artist already exists!', 'error');
        return;
    }

    artists[name] = [];
    saveArtists();
    renderAll();
    showToast(`Added artist: ${name}`);
}

function deleteArtist(name) {
    if (confirm(`Delete artist "${name}" and all their links?`)) {
        delete artists[name];
        saveArtists();
        renderAll();
        showToast(`Deleted: ${name}`);
    }
}

function addLinkToArtist(artistName, link) {
    if (!artists.hasOwnProperty(artistName)) {
        showToast('Artist not found!', 'error');
        return;
    }

    if (artists[artistName].includes(link)) {
        showToast('Link already exists for this artist!', 'error');
        return;
    }

    artists[artistName].push(link);
    saveArtists();
    renderAll();
    showToast('Link added!');
}

function removeLink(artistName, linkIndex) {
    artists[artistName].splice(linkIndex, 1);
    saveArtists();
    renderAll();
}

function saveArtists() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ artists: artists });
    } else {
        localStorage.setItem('artists', JSON.stringify(artists));
    }
}

function loadArtists() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['artists'], (result) => {
            artists = result.artists || {};
            renderAll();
        });
    } else {
        const stored = localStorage.getItem('artists');
        artists = stored ? JSON.parse(stored) : {};
        renderAll();
    }
}

function renderAll() {
    renderArtistSelect();
    renderArtistsList();
    renderJsonDisplay();
    renderFilterSelect();
    renderMoodboard();
}

function renderArtistSelect() {
    const artistNames = Object.keys(artists);
    const currentValue = artistSelect.value;

    artistSelect.innerHTML = '<option value="">Select artist...</option>';

    artistNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        artistSelect.appendChild(option);
    });

    if (artistNames.includes(currentValue)) {
        artistSelect.value = currentValue;
    }
}

function renderFilterSelect() {
    const artistNames = Object.keys(artists);
    const currentValue = filterArtist.value;

    filterArtist.innerHTML = '<option value="all">All Artists</option>';

    artistNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        filterArtist.appendChild(option);
    });

    if (currentValue === 'all' || artistNames.includes(currentValue)) {
        filterArtist.value = currentValue;
    } else {
        filterArtist.value = 'all';
    }
}

function renderArtistsList() {
    const artistNames = Object.keys(artists);

    if (artistNames.length === 0) {
        artistsList.innerHTML = '<div class="empty-state">No artists added yet. Add your first artist above!</div>';
        return;
    }

    artistsList.innerHTML = artistNames.map(name => {
        const links = artists[name];
        const linksHtml = links.length > 0
            ? links.map((link, index) => {
                const displayUrl = formatUrl(link);
                return `
            <span class="link-tag">
              <a href="${escapeHtml(link)}" target="_blank" title="${escapeHtml(link)}">${displayUrl}</a>
              <button class="remove-link" onclick="removeLink('${escapeHtml(name)}', ${index})" title="Remove">×</button>
            </span>
          `;
            }).join('')
            : '<span class="no-links">No links yet</span>';

        return `
      <div class="artist-card">
        <div class="artist-header">
          <span class="artist-name">${escapeHtml(name)}</span>
          <div class="artist-actions">
            <button onclick="deleteArtist('${escapeHtml(name)}')" class="delete-artist" title="Delete artist">🗑️</button>
          </div>
        </div>
        <div class="links-list">
          ${linksHtml}
        </div>
      </div>
    `;
    }).join('');
}

function renderJsonDisplay() {
    jsonDisplay.textContent = JSON.stringify(artists, null, 2);
}

// ===== Moodboard Rendering =====
function renderMoodboard() {
    const selectedArtist = filterArtist.value;
    let images = [];

    // Collect all images based on filter
    if (selectedArtist === 'all') {
        Object.entries(artists).forEach(([artistName, links]) => {
            links.forEach(link => {
                if (isImageUrl(link)) {
                    images.push({ artistName, link });
                }
            });
        });
    } else if (artists[selectedArtist]) {
        artists[selectedArtist].forEach(link => {
            if (isImageUrl(link)) {
                images.push({ artistName: selectedArtist, link });
            }
        });
    }

    // Show/hide empty state
    if (images.length === 0) {
        moodboardGrid.innerHTML = '';
        moodboardEmpty.classList.add('show');
        return;
    }

    moodboardEmpty.classList.remove('show');

    // Shuffle for variety
    images = shuffleArray(images);

    // Render images
    moodboardGrid.innerHTML = images.map(({ artistName, link }) => `
    <div class="moodboard-item" onclick="window.open('${escapeHtml(link)}', '_blank')">
      <img src="${escapeHtml(link)}" alt="${escapeHtml(artistName)}'s work" 
           onerror="this.parentElement.classList.add('error'); this.style.display='none';">
      <div class="artist-label">${escapeHtml(artistName)}</div>
    </div>
  `).join('');
}

// ===== Utility Functions =====

function isImageUrl(url) {
    // Check if URL likely points to an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerUrl = url.toLowerCase();

    // Check file extensions
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
        return true;
    }

    // Check common image hosting patterns
    const imageHosts = ['imgur', 'i.redd.it', 'pbs.twimg', 'instagram', 'artstation', 'deviantart', 'pixiv', 'behance', 'dribbble', 'unsplash', 'pexels'];
    if (imageHosts.some(host => lowerUrl.includes(host))) {
        return true;
    }

    return false;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatUrl(url) {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.split('/').pop() || urlObj.hostname;
        return path.length > 15 ? path.substring(0, 15) + '...' : path;
    } catch {
        return url.length > 15 ? url.substring(0, 15) + '...' : url;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#c4785c' : '#3d3833';
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
