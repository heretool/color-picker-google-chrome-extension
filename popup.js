document.addEventListener('DOMContentLoaded', async () => {
  const $ = (id) => document.getElementById(id);

  $('title').textContent = chrome.i18n.getMessage('title') || 'Color Picker';
  $('pickBtnText').textContent = chrome.i18n.getMessage('pick') || 'Pick Color';
  $('historyTitle').textContent = chrome.i18n.getMessage('history') || 'Color History';

  const colorResult = $('colorResult');
  const colorPreview = $('colorPreview');
  const colorInfoDisplay = $('colorInfoDisplay');
  const hexCode = $('hexCode');
  const rgbCode = $('rgbCode');
  const hslCode = $('hslCode');
  const historyColors = $('historyColors');
  const pickBtn = $('pickBtn');

  let history = [];

  chrome.storage.local.get(['colorHistory'], (result) => {
    if (result.colorHistory) {
      history = result.colorHistory;
      renderHistory();
    }
  });

  function normalizeHex(hex) {
    if (!hex) return '#ffffff';
    let cleaned = hex.trim().replace(/^#/, '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(char => char + char).join('');
    }
    if (cleaned.length !== 6) {
      cleaned = 'ffffff';
    }
    return '#' + cleaned.toLowerCase();
  }

  function hexToHsl(hex) {
    hex = normalizeHex(hex);
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  function getContrastColor(hex) {
    const norm = normalizeHex(hex);
    const r = parseInt(norm.slice(1, 3), 16);
    const g = parseInt(norm.slice(3, 5), 16);
    const b = parseInt(norm.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 135) ? '#0f172a' : '#ffffff'; 
  }

  function showColor(hex) {
    const formattedHex = normalizeHex(hex);
    const r = parseInt(formattedHex.slice(1, 3), 16);
    const g = parseInt(formattedHex.slice(3, 5), 16);
    const b = parseInt(formattedHex.slice(5, 7), 16);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = hexToHsl(formattedHex);

    colorResult.classList.remove('hidden');
    colorPreview.style.backgroundColor = formattedHex;
    
    const textColor = getContrastColor(formattedHex);
    colorInfoDisplay.style.color = textColor;
    if (textColor === '#ffffff') {
      colorInfoDisplay.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
    } else {
      colorInfoDisplay.style.textShadow = 'none';
    }
    
    colorInfoDisplay.textContent = formattedHex.toUpperCase();
    
    hexCode.textContent = formattedHex.toUpperCase();
    rgbCode.textContent = rgb;
    hslCode.textContent = hsl;
  }

  function renderHistory() {
    historyColors.innerHTML = '';
    const recentColors = [...history].reverse().slice(0, 8);
    
    recentColors.forEach(c => {
      const el = document.createElement('div');
      el.className = 'history-color';
      el.style.backgroundColor = c;
      el.title = c.toUpperCase();
      el.onclick = () => showColor(c);
      historyColors.appendChild(el);
    });
  }

  function copyTextToClipboard(text, el) {
    try {
      const input = document.createElement('textarea');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      triggerCopyUI(el);
    } catch (err) {
      navigator.clipboard.writeText(text).then(() => {
        triggerCopyUI(el);
      }).catch(() => {});
    }
  }

  function triggerCopyUI(el) {
    el.classList.add('copied');
    setTimeout(() => {
      el.classList.remove('copied');
    }, 1200);
  }

  pickBtn.onclick = async () => {
    if (window.EyeDropper) {
      try {
        const dropper = new EyeDropper();
        const { sRGBHex } = await dropper.open();
        if (sRGBHex) {
          handleColorPicked(sRGBHex);
          return;
        }
      } catch (e) {
        if (e.name === 'AbortError' || e.message?.includes('canceled')) {
          return;
        }
      }
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || tab.url?.startsWith('chrome://') || tab.url?.startsWith('chromewebstore')) {
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
          if (!window.EyeDropper) return null;
          try {
            const dropper = new EyeDropper();
            const { sRGBHex } = await dropper.open();
            return sRGBHex;
          } catch {
            return null;
          }
        }
      }, (results) => {
        if (!chrome.runtime.lastError && results && results[0]?.result) {
          handleColorPicked(results[0].result);
        }
      });
    } catch {}
  };

  function handleColorPicked(colorHex) {
    const formattedHex = normalizeHex(colorHex);
    showColor(formattedHex);
    copyTextToClipboard(formattedHex, hexCode);

    if (!history.includes(formattedHex)) {
      history.push(formattedHex);
      if (history.length > 16) history.shift();
      chrome.storage.local.set({ colorHistory: history }, () => {
        renderHistory();
      });
    }
  }

  hexCode.onclick = () => copyTextToClipboard(hexCode.textContent.split(' ')[0], hexCode);
  rgbCode.onclick = () => copyTextToClipboard(rgbCode.textContent, rgbCode);
  hslCode.onclick = () => copyTextToClipboard(hslCode.textContent, hslCode);
});