# Fast-growing intracellular *Mycobacterium tuberculosis* populations evade antibiotic treatment

This repository contains the interactive research manuscript and supplementary data visualisations for the study on Mtb replication dynamics by Nathan J. Day *et al.* (The Francis Crick Institute).

## Overview
This interactive web-based manuscript presents a high-throughput, live-cell imaging approach used to quantify *M. tuberculosis* replication within human macrophage populations at single-cell resolution. The interface is built using HTML, CSS, and vanilla JavaScript, and features:
- High-resolution, zoomable imaging data.
- Interactive, dynamic single-cell data visualisations generated with Plotly.js.
- Embedded supplementary videos of live-cell timelapse acquisitions.

## Local Viewing
To view the interactive manuscript locally, clone the repository and serve the directory using a local web server (e.g., using Python).

```bash
python3 -m http.server 8000
```

Then navigate to http://localhost:8000/index.html in your browser.

Data Availability
The code required for image tiling, macrophage segmentation, tracking, and intracellular Mtb doubling time analyses is maintained in a separate repository available at: github.com/nthndy/macrohet.

Authors
Nathan J. Day, Host-Pathogen Interactions in Tuberculosis Laboratory, The Francis Crick Institute

Maximiliano G. Gutierrez (Corresponding Author)

Please refer to the manuscript for the complete list of authors and affiliations.