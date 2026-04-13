// Elementos DOM
const colorSystemSelect = document.getElementById('color-system');
const inputsDiv = document.getElementById('inputs');
const colorPreview = document.getElementById('color-preview');
const colorCode = document.getElementById('color-code');
const colorTableBody = document.getElementById('color-table').querySelector('tbody');
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear-canvas');
const colorSwatches = document.querySelectorAll('.color-swatch');

// Constantes
const COLOR_SYSTEMS = {
    rgb: { labels: ['R', 'G', 'B'], fullLabels: ['Red', 'Green', 'Blue'], maxValues: [255, 255, 255] },
    cmyk: { labels: ['C', 'M', 'Y', 'K'], fullLabels: ['Cyan', 'Magenta', 'Yellow', 'Black'], maxValues: [100, 100, 100, 100] },
    hsl: { labels: ['H', 'S', 'L'], fullLabels: ['Hue', 'Saturation', 'Lightness'], maxValues: [360, 100, 100] },
    hsv: { labels: ['H', 'S', 'V'], fullLabels: ['Hue', 'Saturation', 'Value'], maxValues: [360, 100, 100] }
};

// Estado atual
let currentSystem = 'rgb';
let currentRgb = { r: 255, g: 0, b: 0 };

// Função auxiliar para RGB para Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Função auxiliar para Hex para RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Conversores de cores
const colorConverters = {
    rgb: {
        toRgb: (r, g, b) => [r, g, b],
        fromRgb: (r, g, b) => [r, g, b]
    },
    cmyk: {
        toRgb: cmykToRgb,
        fromRgb: rgbToCmyk
    },
    hsl: {
        toRgb: hslToRgb,
        fromRgb: rgbToHsl
    },
    hsv: {
        toRgb: hsvToRgb,
        fromRgb: rgbToHsv
    }
};

// Funções de conversão de cores (mantidas para compatibilidade)
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hsvToRgb(h, s, v) {
    h /= 360; s /= 100; v /= 100;
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return [0, 0, 0, 100];
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

function cmykToRgb(c, m, y, k) {
    c /= 100; m /= 100; y /= 100; k /= 100;
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return [Math.round(r), Math.round(g), Math.round(b)];
}

// Atualizar campos de entrada
function updateInputs() {
    inputsDiv.innerHTML = '';
    const system = COLOR_SYSTEMS[currentSystem];
    const values = colorConverters[currentSystem].fromRgb(currentRgb.r, currentRgb.g, currentRgb.b);
    system.labels.forEach((label, index) => {
        const div = document.createElement('div');
        div.className = 'input-group';
        const maxValue = system.maxValues[index];
        const value = values[index] || 0;
        div.innerHTML = `
            <label for="${currentSystem}${index}">${system.fullLabels[index]}:</label>
            <div class="value-display" id="display-${currentSystem}${index}">${value}</div>
            <input type="range" id="slider-${currentSystem}${index}" class="input-slider" min="0" max="${maxValue}" value="${value}">
            <input type="number" id="${currentSystem}${index}" class="input-number" min="0" max="${maxValue}" value="${value}">
        `;
        inputsDiv.appendChild(div);
        
        const slider = div.querySelector('.input-slider');
        const numberInput = div.querySelector('.input-number');
        const display = div.querySelector('.value-display');
        
        // Sincronizar slider com número
        slider.addEventListener('input', () => {
            const val = slider.value;
            numberInput.value = val;
            display.textContent = val;
            updateColor();
        });
        
        // Sincronizar número com slider
        numberInput.addEventListener('input', () => {
            const val = Math.max(0, Math.min(maxValue, numberInput.value));
            slider.value = val;
            numberInput.value = val;
            display.textContent = val;
            updateColor();
        });
    });
}

// Atualizar cor e preview
function updateColor() {
    const inputs = inputsDiv.querySelectorAll('.input-number');
    const values = Array.from(inputs).map(input => parseFloat(input.value) || 0);
    const rgb = colorConverters[currentSystem].toRgb(...values);
    currentRgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
    updateUI();
}

// Atualizar interface
function updateUI() {
    colorPreview.style.backgroundColor = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
    colorCode.value = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
    ctx.strokeStyle = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
    updateTable();
}

// Atualizar tabela
function updateTable() {
    const rgb = [currentRgb.r, currentRgb.g, currentRgb.b];
    const hsl = rgbToHsl(...rgb);
    const hsv = rgbToHsv(...rgb);
    const cmyk = rgbToCmyk(...rgb);
    const systems = {
        RGB: { labels: COLOR_SYSTEMS.rgb.fullLabels, values: rgb },
        CMYK: { labels: COLOR_SYSTEMS.cmyk.fullLabels, values: cmyk },
        HSL: { labels: COLOR_SYSTEMS.hsl.fullLabels, values: hsl },
        HSV: { labels: COLOR_SYSTEMS.hsv.fullLabels, values: hsv }
    };
    colorTableBody.innerHTML = '';
    Object.entries(systems).forEach(([sys, data]) => {
        if (sys.toLowerCase() !== currentSystem) {
            const numComponents = data.labels.length;
            // First row with system spanning
            const firstRow = document.createElement('tr');
            firstRow.innerHTML = `<td rowspan="${numComponents}">${sys}</td><td><strong>${data.labels[0]}</strong></td><td>${data.values[0]}</td>`;
            colorTableBody.appendChild(firstRow);
            // Subsequent rows for other components
            for (let i = 1; i < numComponents; i++) {
                const row = document.createElement('tr');
                row.innerHTML = `<td><strong>${data.labels[i]}</strong></td><td>${data.values[i]}</td>`;
                colorTableBody.appendChild(row);
            }
        }
    });
}

// Selecionar cor do arco-íris
function selectRainbowColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    currentRgb = { r, g, b };
    updateInputs();
    updateUI();
}

// Canvas pintura
let painting = false;
ctx.lineWidth = 4.5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mousemove', paint);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mouseout', stopPainting);
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopPainting);

function startPainting(e) {
    painting = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
}

function paint(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function stopPainting() {
    painting = false;
    ctx.beginPath();
}

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Inicializar
colorSystemSelect.addEventListener('change', (e) => {
    currentSystem = e.target.value;
    updateInputs();
    updateUI();
});

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        const hex = swatch.getAttribute('data-color');
        selectRainbowColor(hex);
    });
});

colorCode.addEventListener('input', (e) => {
    const hex = e.target.value;
    const rgb = hexToRgb(hex);
    if (rgb) {
        currentRgb = rgb;
        updateInputs();
        updateUI();
    }
});

updateInputs();
updateUI();