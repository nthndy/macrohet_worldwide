document.addEventListener('DOMContentLoaded', () => {
    initializeStaticMedia();
    initializePlots();
    setupGlobalEscapeKey();
    initializeHoverSystem();
    initializeTitleFlip();
    initializeInlineTables();
    initializeSidebarTOC(); 
    initializeEasterEgg();
});


function initializeTitleFlip() {
    const flipContainer = document.querySelector('.title-card-flip-container');
    if (!flipContainer) return;

    // Build TOC from heading hierarchy
    const tocNav = document.getElementById('toc-nav');
    if (tocNav) {
        const headings = document.querySelectorAll(
            'section > .glass-heading, section h3, .results-section h3'
        );

        headings.forEach((heading, i) => {
            const text = heading.textContent.trim();
            if (!text) return;

            if (!heading.id) {
                // Generate a unique, URL-safe slug based on the heading text
                const slug = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                heading.id = `nav-${slug}-${i}`;
            }

            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = text;

            const tag = heading.tagName.toLowerCase();
            link.classList.add(tag === 'h2' ? 'toc-h2' : 'toc-h3');

            // Close the flip on TOC link click, then scroll
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                flipContainer.classList.remove('flipped');
                // Removed the sidebar hiding logic here
            });

            tocNav.appendChild(link);
        });
    }

    // Toggle flip on click (but not on TOC link clicks)
    flipContainer.addEventListener('click', (e) => {
        if (e.target.closest('.toc-nav a')) return;
        flipContainer.classList.toggle('flipped');
        // Removed the sidebar toggling logic here
    });
}

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
    { id: 'plot-1H', jsonPath: 'figures/dynamic/F1H_plot_data.json', type: 'image-hover' },
    { id: 'plot-2A', jsonPath: 'figures/dynamic/F2A_plot_data.json', type: 'image-hover' },
    { id: 'plot-2B', jsonPath: 'figures/dynamic/F2B_plot_data.json', type: 'image-hover' },
    { id: 'plot-2C', jsonPath: 'figures/dynamic/F2C_plot_data.json', type: 'image-hover' },
    { id: 'plot-2D', jsonPath: 'figures/dynamic/F2D_plot_data.json', type: 'video-hover' }
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

    const containers = document.querySelectorAll(`.F1-container > div, .F2A-container, .F2B-container, .F2C-container, .F4A-container, .S1A-container, .S1B-container, .S1C-container`);
    containers.forEach(container => {
        if (container.classList.contains('F2-growth-plot') || container.classList.contains('interactive-plot-container') || container.id.includes('plot')) return;
        const img = container.querySelector('img');
        const video = container.querySelector('video');
        if(!img && !video) return;

        const move = (evt) => { tooltip.style.left = (evt.clientX + 15) + 'px'; tooltip.style.top = (evt.clientY + 15) + 'px'; };

        container.addEventListener('mouseenter', (e) => {
            if(document.querySelector('.image-popup[style*="flex"]') || document.querySelector('.video-popup[style*="flex"]')) return;
            let label = "Click to zoom";
            if (container.classList.contains('F2') || video) label = "Click to play video";
            if (container.classList.contains('F1A-container') || container.id === 'F1A') label = "Jump to Methods";
            if (container.classList.contains('F1D-container') || container.id === 'F1D') label = "Jump to Methods";
            if (container.classList.contains('F4A-container') || container.id === 'F4A') label = "Jump to Methods";
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

function initializeInlineTables() {
    const tableLinks = document.querySelectorAll('a[href^="#ST"]');
    
    tableLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetTable = document.getElementById(targetId);
            const targetCaption = targetTable ? targetTable.nextElementSibling : null;
            
            if (!targetTable) return;

            // Find the parent paragraph so we don't break the sentence/brackets
            const parentParagraph = link.closest('p');
            
            // Create a unique ID for the wrapper so we can toggle it easily
            const wrapperId = 'inline-wrapper-' + targetId;
            let inlineWrapper = document.getElementById(wrapperId);

            // If the table is already open under this paragraph, toggle it
            if (inlineWrapper) {
                inlineWrapper.style.display = inlineWrapper.style.display === 'none' ? 'block' : 'none';
                return;
            }

            // Create the inline container
            inlineWrapper = document.createElement('div');
            inlineWrapper.id = wrapperId;
            inlineWrapper.className = 'inline-table-wrapper';
            
            // Add a close button
            const closeBtn = document.createElement('div');
            closeBtn.className = 'inline-table-close';
            closeBtn.innerHTML = '&times; Close Table';
            closeBtn.onclick = () => inlineWrapper.style.display = 'none';
            
            // Clone the table
            const tableClone = targetTable.cloneNode(true);
            tableClone.style.marginBottom = '0'; 
            
            inlineWrapper.appendChild(closeBtn);
            inlineWrapper.appendChild(tableClone);
            
            // Clone the caption if it exists
            if (targetCaption && targetCaption.tagName.toLowerCase() === 'figcaption') {
                const captionClone = targetCaption.cloneNode(true);
                inlineWrapper.appendChild(captionClone);
            }

            // Insert immediately after the paragraph to keep the text flow intact
            if (parentParagraph) {
                parentParagraph.parentNode.insertBefore(inlineWrapper, parentParagraph.nextSibling);
            } else {
                // Fallback just in case the link isn't in a paragraph
                link.parentNode.insertBefore(inlineWrapper, link.nextSibling);
            }
        });
    });
}

// ===========================================
// 8. LIVE SIDEBAR TOC
// ===========================================
function initializeSidebarTOC() {
    const sidebarNav = document.getElementById('sidebar-nav');
    const sidebarToc = document.getElementById('sidebar-toc');
    if (!sidebarNav || !sidebarToc) return;

    const headings = Array.from(document.querySelectorAll(
        'section > .glass-heading, section h3, .results-section h3'
    )).filter(h => h.textContent.trim());

    const tocLinks = [];

    headings.forEach((heading, i) => {
        if (!heading.id) {
            heading.id = `heading-auto-${i}`; 
        }
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        link.className = heading.tagName.toLowerCase() === 'h2' ? 'toc-h2' : 'toc-h3';
        
        sidebarNav.appendChild(link);
        tocLinks.push({ link, heading });
    });

    const abstractSection = document.getElementById('abstract');

    const onScroll = () => {
        // 1. Check if we have scrolled past the abstract
        if (abstractSection) {
            const abstractRect = abstractSection.getBoundingClientRect();
            // Show sidebar when the bottom of the abstract is near the top of the viewport
            if (abstractRect.bottom <= 150) {
                sidebarToc.classList.add('show-sidebar');
            } else {
                sidebarToc.classList.remove('show-sidebar');
            }
        }

        // 2. Handle Active Item Highlighting
        let currentActive = null;
        
        for (let i = headings.length - 1; i >= 0; i--) {
            const rect = headings[i].getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.3) {
                currentActive = headings[i];
                break;
            }
        }
        
        if (!currentActive && headings.length > 0) {
            currentActive = headings[0];
        }

        tocLinks.forEach(item => {
            if (item.heading === currentActive) {
                item.link.classList.add('active');
            } else {
                item.link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); 
}

// ===========================================
// 9. EASTER EGG (Mtb-Timer Replication)
// ===========================================
function initializeEasterEgg() {
    const njd = document.getElementById('easter-egg-njd');
    if (!njd) return;

    let replicationCount = 0;

    njd.addEventListener('click', function(e) {
        replicationCount++;

        // Shift 1: Newly synthesised (Green)
        if (replicationCount === 1) {
            this.style.color = '#a6d96a'; 
            this.style.fontWeight = 'bold';
        } 
        // Shift 2: Mature (Magenta)
        else if (replicationCount === 3) {
            this.style.color = '#d01c8b'; 
        }

        // Exponential replication
        if (replicationCount <= 25) {
            this.textContent = this.textContent + " " + this.textContent;
        } 
        // Terminal state: Macrophage rupture
        else {
            this.textContent = this.textContent + " [MACROPHAGE RUPTURED]";
            this.style.color = '#45003e';
            this.style.pointerEvents = 'none'; // Disables further clicking
            this.style.textDecoration = 'none';
        }
    });
}