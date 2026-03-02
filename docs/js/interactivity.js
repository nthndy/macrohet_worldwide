document.addEventListener('DOMContentLoaded', () => {
    initializeStaticMedia();
    initializePlots();
    setupGlobalEscapeKey();
    initializeHoverSystem();
});

// ===========================================
// 0. GLOBAL ESCAPE KEY (New Feature)
// ===========================================
function setupGlobalEscapeKey() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Find all popups (images and videos)
            const popups = document.querySelectorAll('.image-popup, .video-popup');
            
            popups.forEach(popup => {
                // If it's visible, close it
                if (window.getComputedStyle(popup).display !== 'none') {
                    popup.style.display = 'none';
                    
                    // If it contains a video, pause it immediately
                    const video = popup.querySelector('video');
                    if (video) video.pause();
                }
            });
        }
    });
}

// ===========================================
// 1. CONFIGURATION
// ===========================================
const PLOT_CONFIG = [
    { id: 'plot-1H', jsonPath: 'figures/data/F1H_plot_data.json', type: 'image-hover' },
    { id: 'plot-2A', jsonPath: 'figures/data/F2A_plot_data.json', type: 'image-hover' },
    { id: 'plot-2B', jsonPath: 'figures/data/F2B_plot_data.json', type: 'image-hover' },
    { id: 'plot-2C', jsonPath: 'figures/data/F2C_plot_data.json', type: 'image-hover' },
    { id: 'plot-2D', jsonPath: 'figures/data/dt_plot_data.json', type: 'video-hover' }
];

// ===========================================
// 2. PLOT LOADING SYSTEM
// ===========================================
function initializePlots() {
    const loadedPlots = [];

    PLOT_CONFIG.forEach(config => {
        const container = document.getElementById(config.id);
        if (!container) return;

        fetch(config.jsonPath)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(data => {
                const existingLegend = data.layout.legend || {};
                const layout = { 
                    ...data.layout, 
                    responsive: true,
                    autosize: true,
                    font: { family: '"Helvetica Neue", "Helvetica", "Arial", sans-serif', size: 14, color: '#333' },
                    // RESTORE STANDARD BEHAVIOR
                    legend: {
                        ...existingLegend,           
                        itemclick: 'toggle',         // SINGLE CLICK = Hide/Show Trace
                        itemdoubleclick: 'toggleothers' // DOUBLE CLICK = Isolate Trace
                    }
                };
                if(config.type === 'sankey') layout.width = (data.layout.width || 450) * 1.45;

                return Plotly.newPlot(config.id, data.data, layout, { responsive: true, displayModeBar: false });
            })
            .then((plotDiv) => {
                loadedPlots.push(plotDiv);
                if (config.type === 'image-hover') setupImageHoverForPlot(plotDiv);
                if (config.type === 'video-hover') setupVideoHoverForPlot(plotDiv);
            })
            .catch(err => console.error(`Failed to load ${config.id}:`, err));
    });

    // Single debounced resize handler for all plots
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            loadedPlots.forEach(plot => Plotly.Plots.resize(plot));
        }, 150);
    });
}

// ===========================================
// 3. MEDIA POPUPS (UPDATED FOR FLEXBOX)
// ===========================================
function initializeStaticMedia() {
    setupImagePopup(document.querySelectorAll('.F1B-container, .F1C-container, .F1F-container'));
    setupVideoPopup(document.querySelectorAll('.video-trigger')); 
    setupStaticHoverPreviews();
}



// Updated Image Popup Logic (Targeting the Container)
function setupImagePopup(containers) {
    containers.forEach(container => {
        const popup = container.querySelector('.image-popup');
        const zoomTarget = popup?.querySelector('.zoomable-image-container');
        const closeBtn = popup?.querySelector('.close-popup');

        if (!popup || !zoomTarget) return;

        let scale = 1, isDragging = false, startX, startY, transX = 0, transY = 0;

        const updateTransform = () => {
            zoomTarget.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
        };

        const imgTrigger = container.querySelector('img:not(.zoomable-image)');
        imgTrigger.addEventListener('click', () => {
            popup.style.display = 'flex'; 
            scale = 1; transX = 0; transY = 0;
            updateTransform();
        });

        const close = () => { popup.style.display = 'none'; };

        closeBtn?.addEventListener('click', (e) => { e.stopPropagation(); close(); });
        popup.addEventListener('click', (e) => {
            if (e.target === popup || e.target.classList.contains('popup-content')) close();
        });

        popup.addEventListener('wheel', (e) => {
            e.preventDefault();
            scale += e.deltaY * -0.001;
            scale = Math.min(Math.max(1, scale), 10);
            updateTransform();
        });

        zoomTarget.addEventListener('mousedown', (e) => {
            isDragging = true; startX = e.clientX - transX; startY = e.clientY - transY;
            zoomTarget.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            transX = e.clientX - startX;
            transY = e.clientY - startY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => { isDragging = false; zoomTarget.style.cursor = 'grab'; });
    });
}

function setupVideoPopup(elements) {
    elements.forEach(el => {
        const container = el.closest('div[class*="-container"]');
        const popup = container?.querySelector('.video-popup');
        const video = popup?.querySelector('video');
        const closeBtn = popup?.querySelector('.close-popup');
        if (!popup || !video) return;

        el.addEventListener('click', () => {
            popup.style.display = 'flex'; 
            video.currentTime = 0;
            video.play();
        });

        const close = () => { popup.style.display = 'none'; video.pause(); };

        closeBtn?.addEventListener('click', (e) => { e.stopPropagation(); close(); });
        popup.addEventListener('click', (e) => {
            if (e.target === popup || e.target.classList.contains('popup-content')) close();
        });
    });
}

// ===========================================
// 4. SHARED PLOT TOOLTIPS
// ===========================================
function setupImageHoverForPlot(plotDiv) {
    let tooltip = document.getElementById('hover-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'hover-tooltip';
        tooltip.style.cssText = `position: fixed; display: none; z-index: 10000; background: white; border: 2px solid #ffffff; padding: 5px; border-radius: 4px; pointer-events: none; box-shadow: 0 4px 6px rgba(113, 113, 113, 0.3);`;
        document.body.appendChild(tooltip);
    }
    plotDiv.on('plotly_hover', function(data) {
        let imgPath = Array.isArray(data.points[0].customdata) ? data.points[0].customdata[0] : data.points[0].customdata;
        if (!imgPath || imgPath === 'nan') return;
        if (!imgPath.startsWith('http') && !imgPath.startsWith('/') && !imgPath.includes('assets/')) imgPath = `assets/${imgPath}`; 
        tooltip.innerHTML = `<img src="${imgPath}" style="max-width: 300px; display: block;">`;
        tooltip.style.display = 'block';
        tooltip.style.left = (data.event.clientX + 15) + 'px';
        tooltip.style.top = (data.event.clientY + 15) + 'px';
    });
    plotDiv.on('plotly_unhover', () => tooltip.style.display = 'none');
}

function setupVideoHoverForPlot(plotDiv) {
    let tooltip = document.getElementById('video-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'video-tooltip';
        tooltip.innerHTML = `<video id="video-tooltip-player" muted loop playsinline></video>`;
        document.body.appendChild(tooltip);
    }
    const videoPlayer = document.getElementById('video-tooltip-player');
    plotDiv.on('plotly_hover', function(data) {
        if (!data.points[0].data.mode || !data.points[0].data.mode.includes('markers')) return;
        let videoPath = Array.isArray(data.points[0].customdata) ? (Array.isArray(data.points[0].customdata[0]) ? data.points[0].customdata[0][0] : data.points[0].customdata[0]) : data.points[0].customdata;
        if (!videoPath || videoPath === 'nan') return;
        if (!videoPath.startsWith('http') && !videoPath.includes('/') && !videoPath.includes('assets')) videoPath = `assets/${videoPath}`;
        if (!videoPlayer.src.endsWith(videoPath)) videoPlayer.src = videoPath;
        videoPlayer.play().catch(e => console.log("Auto-play blocked", e));
        tooltip.style.display = 'block';
        updateTooltipPosition(tooltip, data.event.clientX, data.event.clientY);
    });
    plotDiv.on('plotly_unhover', () => { tooltip.style.display = 'none'; videoPlayer.pause(); });
}

document.addEventListener('mousemove', function(e) {
    const videoTooltip = document.getElementById('video-tooltip');
    if (videoTooltip && videoTooltip.style.display === 'block') updateTooltipPosition(videoTooltip, e.clientX, e.clientY);
    const imageTooltip = document.getElementById('hover-tooltip');
    if (imageTooltip && imageTooltip.style.display === 'block') updateTooltipPosition(imageTooltip, e.clientX, e.clientY);
});

function updateTooltipPosition(el, mouseX, mouseY) {
    let newLeft = mouseX - el.offsetWidth - 20;
    if (newLeft < 0) newLeft = mouseX + 20;
    el.style.left = newLeft + 'px';
    el.style.top = (mouseY - 100) + 'px';
}

function setupStaticHoverPreviews() {
    // Create a single reusable tooltip element instead of one per hover
    const tooltip = document.createElement('div');
    tooltip.className = 'hover-preview-wrapper';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const containers = document.querySelectorAll(`.F1-container > div, .F2A-container, .F2B-container, .F2C-container, .F3A-container, .F3B-container, .F3C-container`);
    containers.forEach(container => {
        if (container.classList.contains('F2-growth-plot') || container.classList.contains('interactive-plot-container') || container.id.includes('plot')) return;
        const img = container.querySelector('img');
        const video = container.querySelector('video');
        if(!img && !video) return;

        const move = (evt) => { tooltip.style.left = (evt.clientX + 15) + 'px'; tooltip.style.top = (evt.clientY + 15) + 'px'; };

        container.addEventListener('mouseenter', (e) => {
            if(document.querySelector('.image-popup[style*="flex"]') || document.querySelector('.video-popup[style*="flex"]')) return;
            let label = "Click to zoom";
            if (container.classList.contains('F2') || container.classList.contains('F3') || video) label = "Click to play video";
            if (container.classList.contains('F1A-container') || container.id === 'F1A') label = "Jump to Methods";
            if (container.classList.contains('F1D-container') || container.id === 'F1D') label = "Jump to Fluorescent Reporter";
            tooltip.textContent = label;
            tooltip.style.display = 'block';
            move(e);
            container.addEventListener('mousemove', move);
        });

        container.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
            container.removeEventListener('mousemove', move);
        });
    });
}


// ===========================================
// 5 & 6. UNIFIED HOVER SYSTEM (Affiliations & Tables)
// ===========================================

const SUPPLEMENTARY_DATA = {
    "TS1": {
        title: "Table S1: Growth Heterogeneity Metrics",
        headers: ["Metric", "Mtb WT", "Mtb ΔRD1"],
        rows: [["Median DT (h)", "25.2", "42.1"], ["CV", "0.45", "0.58"], ["N (cells)", "245", "83"]]
    },
    "TS2": {
        title: "Table S2: Fisher's Exact Test Results",
        headers: ["Comparison", "p-value", "Sig."],
        rows: [["WT vs ΔRD1", "> 0.99", "ns"], ["WT vs RIF EC99", "< 0.0001", "****"]]
    }
};

function initializeHoverSystem() {
    // Create the Tooltip Element if it doesn't exist (styled via CSS #table-tooltip rules)
    if (!document.getElementById('table-tooltip')) {
        const tt = document.createElement('div');
        tt.id = 'table-tooltip';
        document.body.appendChild(tt);
    }

    const tableTooltip = document.getElementById('table-tooltip');
    const allLinks = document.querySelectorAll('a');

    allLinks.forEach(link => {
        const href = link.getAttribute('href') || "";

        // --- TABLE HOVERS ---
        if (href.startsWith('#TS')) {
            link.addEventListener('mouseenter', (e) => {
                const id = href.replace('#', '');
                const data = SUPPLEMENTARY_DATA[id];
                if (!data) return;

                let html = `<span class="table-title">${data.title}</span>`;
                html += `<table><thead><tr>`;
                data.headers.forEach(h => html += `<th>${h}</th>`);
                html += `</tr></thead><tbody>`;
                data.rows.forEach(row => {
                    html += `<tr>`;
                    row.forEach(cell => html += `<td>${cell}</td>`);
                    html += `</tr>`;
                });
                html += `</tbody></table>`;

                tableTooltip.innerHTML = html;
                tableTooltip.style.display = 'block';
            });

            link.addEventListener('mouseleave', () => tableTooltip.style.display = 'none');
            link.addEventListener('mousemove', (e) => {
                tableTooltip.style.left = (e.clientX + 15) + 'px';
                tableTooltip.style.top = (e.clientY + 15) + 'px';
            });
        }

        // --- AFFILIATION HOVERS ---
        if (href.startsWith('#aff')) {
            link.addEventListener('mouseenter', () => {
                const target = document.getElementById(href.replace('#', ''));
                if (target) {
                    target.style.setProperty('color', '#d01c8b', 'important');
                    target.style.setProperty('font-weight', 'bold', 'important');
                    target.classList.add('active-affiliation');
                }
            });
            link.addEventListener('mouseleave', () => {
                const target = document.getElementById(href.replace('#', ''));
                if (target) {
                    target.style.color = '';
                    target.style.fontWeight = '';
                    target.classList.remove('active-affiliation');
                }
            });
        }
    });
}