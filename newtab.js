const defaultSettings = {
  logo: {
    text: 'Vialike',
    fontSize: 64,
    fontFamily: "'Segoe UI', sans-serif",
    bold: false,
    italic: false
  },
  searchbox: {
    style: 'rect',
    borderRadius: 24,
    opacity: 100,
    borderWidth: 1,
    borderOpacity: 20,
    showPlaceholder: true,
    textColor: '#333333',
    searchEngine: 'google'
  },
  background: {
    image: '',
    theme: 'light',
    opacity: 100
  },
  advanced: {
    effect: 'transparent',
    blurIntensity: 10,
    showSearchArea: true,
    positionX: 50,
    positionY: 25,
    showBookmarks: true
  }
};

const searchEngines = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: 'G'
  },
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: 'B'
  },
  baidu: {
    name: '百度',
    url: 'https://www.baidu.com/s?wd=',
    icon: '度'
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: 'D'
  },
  sogou: {
    name: '搜狗',
    url: 'https://www.sogou.com/web?query=',
    icon: '搜'
  }
};

let currentSettings = { ...defaultSettings };

function loadSettings()
{
  return new Promise((resolve) =>
  {
    if (typeof chrome !== 'undefined' && chrome.storage)
    {
      chrome.storage.local.get(['vialikeSettings'], (result) =>
      {
        if (result.vialikeSettings)
        {
          currentSettings = { ...defaultSettings, ...result.vialikeSettings };
          currentSettings.logo = { ...defaultSettings.logo, ...currentSettings.logo };
          currentSettings.searchbox = { ...defaultSettings.searchbox, ...currentSettings.searchbox };
          currentSettings.background = { ...defaultSettings.background, ...currentSettings.background };
          currentSettings.advanced = { ...defaultSettings.advanced, ...currentSettings.advanced };
        }
        resolve();
      });
    }
    else
    {
      const saved = localStorage.getItem('vialikeSettings');
      if (saved)
      {
        try
        {
          currentSettings = { ...defaultSettings, ...JSON.parse(saved) };
          currentSettings.logo = { ...defaultSettings.logo, ...currentSettings.logo };
          currentSettings.searchbox = { ...defaultSettings.searchbox, ...currentSettings.searchbox };
          currentSettings.background = { ...defaultSettings.background, ...currentSettings.background };
          currentSettings.advanced = { ...defaultSettings.advanced, ...currentSettings.advanced };
        }
        catch (e)
        {
          currentSettings = { ...defaultSettings };
        }
      }
      resolve();
    }
  });
}

function saveSettings()
{
  if (typeof chrome !== 'undefined' && chrome.storage)
  {
    chrome.storage.local.set({ vialikeSettings: currentSettings });
  }
  else
  {
    localStorage.setItem('vialikeSettings', JSON.stringify(currentSettings));
  }
}

function applySettings()
{
  const logo = document.getElementById('logo');
  const searchWrapper = document.getElementById('searchWrapper');
  const searchBox = document.querySelector('.search-box');
  const searchArea = document.querySelector('.search-area');
  const bookmarksBar = document.getElementById('bookmarksBar');
  const body = document.body;

  logo.textContent = currentSettings.logo.text;
  logo.style.fontSize = currentSettings.logo.fontSize + 'px';
  logo.style.fontFamily = currentSettings.logo.fontFamily;
  logo.style.fontWeight = currentSettings.logo.bold ? 'bold' : '300';
  logo.style.fontStyle = currentSettings.logo.italic ? 'italic' : 'normal';

  if (currentSettings.searchbox.style === 'line')
  {
    searchWrapper.classList.add('line-style');
  }
  else
  {
    searchWrapper.classList.remove('line-style');
  }

  if (currentSettings.searchbox.style === 'rect')
  {
    searchWrapper.style.borderRadius = currentSettings.searchbox.borderRadius + 'px';
  }
  else
  {
    searchWrapper.style.borderRadius = '0';
  }

  searchWrapper.style.opacity = currentSettings.searchbox.opacity / 100;

  const borderColor = currentSettings.background.theme === 'dark'
    ? `rgba(255, 255, 255, ${currentSettings.searchbox.borderOpacity / 100})`
    : `rgba(0, 0, 0, ${currentSettings.searchbox.borderOpacity / 100})`;

  if (currentSettings.searchbox.style === 'rect')
  {
    searchWrapper.style.borderWidth = currentSettings.searchbox.borderWidth + 'px';
    searchWrapper.style.borderStyle = 'solid';
    searchWrapper.style.borderColor = borderColor;
  }
  else
  {
    searchWrapper.style.borderWidth = '0';
    searchWrapper.style.borderBottomWidth = currentSettings.searchbox.borderWidth + 'px';
    searchWrapper.style.borderStyle = 'solid';
    searchWrapper.style.borderColor = borderColor;
  }

  if (currentSettings.background.image)
  {
    body.style.backgroundImage = `url(${currentSettings.background.image})`;
  }
  else
  {
    body.style.backgroundImage = 'none';
  }

  body.setAttribute('data-theme', currentSettings.background.theme);
  body.style.setProperty('--bg-opacity', currentSettings.background.opacity / 100);

  const overlay = document.querySelector('.background-overlay');
  overlay.style.opacity = currentSettings.background.opacity / 100;

  if (currentSettings.advanced.effect === 'blur')
  {
    const blurValue = currentSettings.advanced.blurIntensity || 10;
    searchWrapper.style.backdropFilter = `blur(${blurValue}px)`;
    searchWrapper.style.webkitBackdropFilter = `blur(${blurValue}px)`;
    searchWrapper.style.background = currentSettings.background.theme === 'dark'
      ? 'rgba(50, 50, 50, 0.8)'
      : 'rgba(255, 255, 255, 0.8)';
  }
  else
  {
    searchWrapper.style.backdropFilter = 'none';
    searchWrapper.style.webkitBackdropFilter = 'none';
    searchWrapper.style.background = 'transparent';
  }

  searchArea.style.display = currentSettings.advanced.showSearchArea ? 'flex' : 'none';

  searchArea.style.position = 'absolute';
  searchArea.style.left = currentSettings.advanced.positionX + '%';
  searchArea.style.top = currentSettings.advanced.positionY + '%';
  searchArea.style.transform = 'translate(-50%, -50%)';

  if (currentSettings.searchbox.showPlaceholder)
  {
    searchBox.placeholder = '搜索或输入网址';
  }
  else
  {
    searchBox.placeholder = '';
  }

  searchBox.style.color = currentSettings.searchbox.textColor;
  searchBox.style.caretColor = currentSettings.searchbox.textColor;
  searchBox.style.setProperty('--placeholder-color', currentSettings.searchbox.textColor);

  if (bookmarksBar)
  {
    bookmarksBar.classList.toggle('hidden', !currentSettings.advanced.showBookmarks);
  }
}

function initUI()
{
  document.getElementById('logoText').value = currentSettings.logo.text;
  document.getElementById('logoFontSize').value = currentSettings.logo.fontSize;
  document.getElementById('logoFontSizeValue').textContent = currentSettings.logo.fontSize + 'px';
  document.getElementById('logoFontFamily').value = currentSettings.logo.fontFamily;
  document.getElementById('logoBold').classList.toggle('active', currentSettings.logo.bold);
  document.getElementById('logoItalic').classList.toggle('active', currentSettings.logo.italic);

  document.querySelectorAll('.style-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.style === currentSettings.searchbox.style);
  });
  document.getElementById('searchBorderRadius').value = currentSettings.searchbox.borderRadius;
  document.getElementById('searchBorderRadiusValue').textContent = currentSettings.searchbox.borderRadius + 'px';
  document.getElementById('searchOpacity').value = currentSettings.searchbox.opacity;
  document.getElementById('searchOpacityValue').textContent = currentSettings.searchbox.opacity + '%';
  document.getElementById('searchBorderWidth').value = currentSettings.searchbox.borderWidth;
  document.getElementById('searchBorderWidthValue').textContent = currentSettings.searchbox.borderWidth + 'px';
  document.getElementById('searchBorderOpacity').value = currentSettings.searchbox.borderOpacity;
  document.getElementById('searchBorderOpacityValue').textContent = currentSettings.searchbox.borderOpacity + '%';
  document.getElementById('showPlaceholder').checked = currentSettings.searchbox.showPlaceholder;
  document.getElementById('textColor').value = currentSettings.searchbox.textColor;
  document.getElementById('textColorValue').textContent = currentSettings.searchbox.textColor;
  document.getElementById('searchEngine').value = currentSettings.searchbox.searchEngine || 'google';

  document.querySelectorAll('.theme-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.theme === currentSettings.background.theme);
  });
  document.getElementById('bgOpacity').value = currentSettings.background.opacity;
  document.getElementById('bgOpacityValue').textContent = currentSettings.background.opacity + '%';

  document.querySelectorAll('.effect-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.effect === currentSettings.advanced.effect);
  });
  
  const blurIntensitySetting = document.getElementById('blurIntensitySetting');
  if (blurIntensitySetting)
  {
    blurIntensitySetting.classList.toggle('visible', currentSettings.advanced.effect === 'blur');
  }
  
  document.getElementById('blurIntensity').value = currentSettings.advanced.blurIntensity || 10;
  document.getElementById('blurIntensityValue').textContent = (currentSettings.advanced.blurIntensity || 10) + 'px';
  
  document.getElementById('showSearchArea').checked = currentSettings.advanced.showSearchArea;
  document.getElementById('showBookmarks').checked = currentSettings.advanced.showBookmarks;
  document.getElementById('positionX').value = currentSettings.advanced.positionX;
  document.getElementById('positionXValue').textContent = currentSettings.advanced.positionX + '%';
  document.getElementById('positionY').value = currentSettings.advanced.positionY;
  document.getElementById('positionYValue').textContent = currentSettings.advanced.positionY + '%';
}

function setupEventListeners()
{
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('closeBtn');

  settingsBtn.addEventListener('click', () =>
  {
    settingsModal.classList.add('active');
  });

  closeBtn.addEventListener('click', () =>
  {
    settingsModal.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
    });
  });

  document.getElementById('logoText').addEventListener('input', (e) =>
  {
    currentSettings.logo.text = e.target.value || 'via';
    applySettings();
    saveSettings();
  });

  document.getElementById('logoFontSize').addEventListener('input', (e) =>
  {
    currentSettings.logo.fontSize = parseInt(e.target.value);
    document.getElementById('logoFontSizeValue').textContent = e.target.value + 'px';
    applySettings();
    saveSettings();
  });

  document.getElementById('logoFontFamily').addEventListener('change', (e) =>
  {
    currentSettings.logo.fontFamily = e.target.value;
    applySettings();
    saveSettings();
  });

  document.getElementById('logoBold').addEventListener('click', () =>
  {
    currentSettings.logo.bold = !currentSettings.logo.bold;
    document.getElementById('logoBold').classList.toggle('active', currentSettings.logo.bold);
    applySettings();
    saveSettings();
  });

  document.getElementById('logoItalic').addEventListener('click', () =>
  {
    currentSettings.logo.italic = !currentSettings.logo.italic;
    document.getElementById('logoItalic').classList.toggle('active', currentSettings.logo.italic);
    applySettings();
    saveSettings();
  });

  document.querySelectorAll('.style-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSettings.searchbox.style = btn.dataset.style;
      applySettings();
      saveSettings();
    });
  });

  document.getElementById('searchBorderRadius').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.borderRadius = parseInt(e.target.value);
    document.getElementById('searchBorderRadiusValue').textContent = e.target.value + 'px';
    applySettings();
    saveSettings();
  });

  document.getElementById('searchOpacity').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.opacity = parseInt(e.target.value);
    document.getElementById('searchOpacityValue').textContent = e.target.value + '%';
    applySettings();
    saveSettings();
  });

  document.getElementById('searchBorderWidth').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.borderWidth = parseFloat(e.target.value);
    document.getElementById('searchBorderWidthValue').textContent = e.target.value + 'px';
    applySettings();
    saveSettings();
  });

  document.getElementById('searchBorderOpacity').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.borderOpacity = parseInt(e.target.value);
    document.getElementById('searchBorderOpacityValue').textContent = e.target.value + '%';
    applySettings();
    saveSettings();
  });

  document.getElementById('showPlaceholder').addEventListener('change', (e) =>
  {
    currentSettings.searchbox.showPlaceholder = e.target.checked;
    applySettings();
    saveSettings();
  });

  document.getElementById('textColor').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.textColor = e.target.value;
    document.getElementById('textColorValue').textContent = e.target.value;
    applySettings();
    saveSettings();
  });

  document.getElementById('searchEngine').addEventListener('change', (e) =>
  {
    currentSettings.searchbox.searchEngine = e.target.value;
    saveSettings();
  });

  const uploadBgBtn = document.getElementById('uploadBgBtn');
  const bgImageInput = document.getElementById('bgImage');
  const clearBgBtn = document.getElementById('clearBgBtn');

  uploadBgBtn.addEventListener('click', () =>
  {
    bgImageInput.click();
  });

  bgImageInput.addEventListener('change', (e) =>
  {
    const file = e.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = (event) =>
      {
        currentSettings.background.image = event.target.result;
        applySettings();
        saveSettings();
      };
      reader.readAsDataURL(file);
    }
  });

  clearBgBtn.addEventListener('click', () =>
  {
    currentSettings.background.image = '';
    bgImageInput.value = '';
    applySettings();
    saveSettings();
  });

  document.querySelectorAll('.theme-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSettings.background.theme = btn.dataset.theme;
      applySettings();
      saveSettings();
    });
  });

  document.getElementById('bgOpacity').addEventListener('input', (e) =>
  {
    currentSettings.background.opacity = parseInt(e.target.value);
    document.getElementById('bgOpacityValue').textContent = e.target.value + '%';
    applySettings();
    saveSettings();
  });

  document.querySelectorAll('.effect-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      document.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSettings.advanced.effect = btn.dataset.effect;
      
      const blurIntensitySetting = document.getElementById('blurIntensitySetting');
      if (blurIntensitySetting)
      {
        blurIntensitySetting.classList.toggle('visible', btn.dataset.effect === 'blur');
      }
      
      applySettings();
      saveSettings();
    });
  });
  
  document.getElementById('blurIntensity').addEventListener('input', (e) =>
  {
    currentSettings.advanced.blurIntensity = parseInt(e.target.value);
    document.getElementById('blurIntensityValue').textContent = e.target.value + 'px';
    applySettings();
    saveSettings();
  });

  document.getElementById('showSearchArea').addEventListener('change', (e) =>
  {
    currentSettings.advanced.showSearchArea = e.target.checked;
    applySettings();
    saveSettings();
  });

  document.getElementById('showBookmarks').addEventListener('change', (e) =>
  {
    currentSettings.advanced.showBookmarks = e.target.checked;
    applySettings();
    saveSettings();
  });

  document.getElementById('positionX').addEventListener('input', (e) =>
  {
    currentSettings.advanced.positionX = parseInt(e.target.value);
    document.getElementById('positionXValue').textContent = e.target.value + '%';
    applySettings();
    saveSettings();
  });

  document.getElementById('positionY').addEventListener('input', (e) =>
  {
    currentSettings.advanced.positionY = parseInt(e.target.value);
    document.getElementById('positionYValue').textContent = e.target.value + '%';
    applySettings();
    saveSettings();
  });

  document.getElementById('centerX').addEventListener('click', () =>
  {
    currentSettings.advanced.positionX = 50;
    document.getElementById('positionX').value = 50;
    document.getElementById('positionXValue').textContent = '50%';
    applySettings();
    saveSettings();
  });

  document.getElementById('centerY').addEventListener('click', () =>
  {
    currentSettings.advanced.positionY = 25;
    document.getElementById('positionY').value = 25;
    document.getElementById('positionYValue').textContent = '25%';
    applySettings();
    saveSettings();
  });

  const settingsContent = document.querySelector('.settings-content');
  const settingsHeader = document.querySelector('.settings-header');
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  settingsHeader.addEventListener('mousedown', (e) =>
  {
    if (e.target.closest('.close-btn')) return;
    isDragging = true;
    const rect = settingsContent.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left - rect.width / 2;
    dragOffsetY = e.clientY - rect.top - rect.height / 2;
    settingsContent.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) =>
  {
    if (!isDragging) return;
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    settingsContent.style.left = x + 'px';
    settingsContent.style.top = y + 'px';
    settingsContent.style.transform = 'translate(-50%, -50%)';
  });

  document.addEventListener('mouseup', () =>
  {
    if (isDragging)
    {
      isDragging = false;
      settingsContent.style.transition = 'transform 0.3s ease';
    }
  });

  const confirmModal = document.createElement('div');
  confirmModal.className = 'confirm-modal';
  confirmModal.id = 'confirmModal';
  confirmModal.innerHTML = `
    <div class="confirm-content">
      <p>确定要恢复默认设置吗？此操作不可撤销。</p>
      <div class="confirm-buttons">
        <button class="confirm-btn cancel" id="confirmCancel">取消</button>
        <button class="confirm-btn confirm" id="confirmOk">确定</button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmModal);

  document.getElementById('resetSettings').addEventListener('click', () =>
  {
    confirmModal.classList.add('active');
  });

  document.getElementById('confirmCancel').addEventListener('click', () =>
  {
    confirmModal.classList.remove('active');
  });

  document.getElementById('confirmOk').addEventListener('click', () =>
  {
    currentSettings = JSON.parse(JSON.stringify(defaultSettings));
    saveSettings();
    initUI();
    applySettings();
    confirmModal.classList.remove('active');
    settingsContent.style.left = '50%';
    settingsContent.style.top = '50%';
    settingsContent.style.transform = 'translate(-50%, -50%)';
  });

  confirmModal.addEventListener('click', (e) =>
  {
    if (e.target === confirmModal)
    {
      confirmModal.classList.remove('active');
    }
  });

  const searchBox = document.getElementById('searchBox');
  const searchBtn = document.getElementById('searchBtn');

  function performSearch()
  {
    const query = searchBox.value.trim();
    if (query)
    {
      const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(query);
      let url;
      if (isUrl)
      {
        url = query.startsWith('http') ? query : 'https://' + query;
      }
      else
      {
        const engine = searchEngines[currentSettings.searchbox.searchEngine] || searchEngines.google;
        url = engine.url + encodeURIComponent(query);
      }
      window.location.href = url;
    }
  }

  searchBtn.addEventListener('click', performSearch);

  let engineMenu = null;

  searchBtn.addEventListener('contextmenu', (e) =>
  {
    e.preventDefault();
    
    if (engineMenu)
    {
      engineMenu.remove();
      engineMenu = null;
      return;
    }
    
    engineMenu = document.createElement('div');
    engineMenu.className = 'engine-menu';
    engineMenu.style.cssText = `
      position: fixed;
      background: var(--modal-bg);
      border: 1px solid var(--search-border);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 2000;
      min-width: 140px;
      padding: 4px 0;
    `;
    
    const rect = searchBtn.getBoundingClientRect();
    engineMenu.style.right = (window.innerWidth - rect.right) + 'px';
    engineMenu.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    
    Object.keys(searchEngines).forEach(key =>
    {
      const engine = searchEngines[key];
      const item = document.createElement('div');
      item.className = 'engine-menu-item';
      const isSelected = currentSettings.searchbox.searchEngine === key;
      item.style.cssText = `
        padding: 10px 16px;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        transition: background 0.2s ease;
      `;
      
      if (isSelected)
      {
        item.style.background = 'var(--hover-bg)';
      }
      
      item.innerHTML = `
        <span>${engine.name}</span>
        ${isSelected ? '<svg viewBox="0 0 24 24" width="16" height="16" style="color: var(--accent-color);"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
      `;
      
      item.addEventListener('mouseenter', () =>
      {
        if (!isSelected) item.style.background = 'var(--hover-bg)';
      });
      
      item.addEventListener('mouseleave', () =>
      {
        if (!isSelected) item.style.background = 'transparent';
      });
      
      item.addEventListener('click', () =>
      {
        currentSettings.searchbox.searchEngine = key;
        saveSettings();
        document.getElementById('searchEngine').value = key;
        showEngineToast(engine.name);
        engineMenu.remove();
        engineMenu = null;
      });
      
      engineMenu.appendChild(item);
    });
    
    document.body.appendChild(engineMenu);
    
    const closeMenu = (ev) =>
    {
      if (engineMenu && !engineMenu.contains(ev.target) && ev.target !== searchBtn)
      {
        engineMenu.remove();
        engineMenu = null;
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() =>
    {
      document.addEventListener('click', closeMenu);
    }, 0);
  });

  function showEngineToast(engineName)
  {
    let toast = document.getElementById('engineToast');
    if (!toast)
    {
      toast = document.createElement('div');
      toast.id = 'engineToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: var(--modal-bg);
        color: var(--text-color);
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        font-size: 14px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    
    toast.textContent = `搜索引擎已切换为: ${engineName}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() =>
    {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2000);
  }

  searchBox.addEventListener('keypress', (e) =>
  {
    if (e.key === 'Enter')
    {
      performSearch();
    }
  });

  document.addEventListener('keydown', (e) =>
  {
    if (e.key === 'Escape' && settingsModal.classList.contains('active'))
    {
      settingsModal.classList.remove('active');
    }
    if (!settingsModal.classList.contains('active') && document.activeElement !== searchBox)
    {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)
      {
        searchBox.focus();
      }
    }
  });
}

let faviconCache = {};
const DEFAULT_ICON_DATA = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#666"><circle cx="12" cy="12" r="10" fill="none" stroke="#666" stroke-width="2"/><path d="M12 6v6l4 2" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round"/></svg>');

function loadFaviconCache()
{
  return new Promise((resolve) =>
  {
    if (typeof chrome !== 'undefined' && chrome.storage)
    {
      chrome.storage.local.get(['faviconCache'], (result) =>
      {
        if (result.faviconCache)
        {
          faviconCache = result.faviconCache;
        }
        resolve();
      });
    }
    else
    {
      const saved = localStorage.getItem('faviconCache');
      if (saved)
      {
        try
        {
          faviconCache = JSON.parse(saved);
        }
        catch (e)
        {
          faviconCache = {};
        }
      }
      resolve();
    }
  });
}

function saveFaviconCache()
{
  if (typeof chrome !== 'undefined' && chrome.storage)
  {
    chrome.storage.local.set({ faviconCache: faviconCache });
  }
  else
  {
    localStorage.setItem('faviconCache', JSON.stringify(faviconCache));
  }
}

function isDefaultIcon(iconData)
{
  return iconData === DEFAULT_ICON_DATA || 
         iconData === createDefaultIcon() ||
         (iconData && iconData.includes('circle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22'));
}

function loadBookmarks()
{
  const bookmarksContainer = document.getElementById('bookmarksContainer');
  if (!bookmarksContainer) return;

  if (typeof chrome !== 'undefined' && chrome.bookmarks)
  {
    chrome.bookmarks.getTree((bookmarkTree) =>
    {
      const bookmarks = flattenBookmarks(bookmarkTree);
      renderBookmarks(bookmarks, bookmarksContainer);
    });
  }
  else
  {
    const demoBookmarks = [
      { title: 'Google', url: 'https://www.google.com' },
      { title: 'YouTube', url: 'https://www.youtube.com' },
      { title: 'GitHub', url: 'https://github.com' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com' }
    ];
    renderBookmarks(demoBookmarks, bookmarksContainer);
  }
}

function flattenBookmarks(bookmarkTree, result = [])
{
  for (const node of bookmarkTree)
  {
    if (node.url)
    {
      result.push({
        id: node.id,
        title: node.title || node.url,
        url: node.url
      });
    }
    if (node.children && node.children.length > 0)
    {
      flattenBookmarks(node.children, result);
    }
  }
  return result;
}

function renderBookmarks(bookmarks, container)
{
  container.innerHTML = '';
  const maxBookmarks = 20;
  const displayBookmarks = bookmarks.slice(0, maxBookmarks);

  displayBookmarks.forEach(bookmark =>
  {
    const item = document.createElement('a');
    item.className = 'bookmark-item';
    item.href = bookmark.url;
    item.target = '_blank';
    item.title = bookmark.title;

    const favicon = document.createElement('img');
    favicon.className = 'favicon';
    
    try
    {
      const url = new URL(bookmark.url);
      loadFaviconWithCache(favicon, url.hostname, bookmark.url);
    }
    catch (e)
    {
      favicon.src = createDefaultIcon();
    }

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = bookmark.title;

    item.appendChild(favicon);
    item.appendChild(title);
    container.appendChild(item);
  });
}

function loadFaviconWithCache(img, hostname, fullUrl)
{
  if (faviconCache[hostname] && !isDefaultIcon(faviconCache[hostname]))
  {
    img.src = faviconCache[hostname];
    img.onerror = () =>
    {
      delete faviconCache[hostname];
      saveFaviconCache();
      loadFaviconWithFallback(img, hostname, fullUrl);
    };
    return;
  }
  
  if (faviconCache[hostname] && isDefaultIcon(faviconCache[hostname]))
  {
    delete faviconCache[hostname];
    saveFaviconCache();
  }
  
  img.src = createDefaultIcon();
  
  loadFaviconWithFallback(img, hostname, fullUrl);
}

function loadFaviconWithFallback(img, hostname, fullUrl)
{
  const faviconSources = [
    `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
    `https://icon.horse/icon/${hostname}`,
    `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
    `https://${hostname}/favicon.ico`
  ];
  
  let currentIndex = 0;
  let timeoutId = null;
  let isLoaded = false;
  
  function cleanup()
  {
    if (timeoutId)
    {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  
  function tryNextSource()
  {
    if (isLoaded) return;
    
    if (currentIndex < faviconSources.length)
    {
      const src = faviconSources[currentIndex];
      currentIndex++;
      
      const tempImg = new Image();
      
      timeoutId = setTimeout(() =>
      {
        tempImg.onload = null;
        tempImg.onerror = null;
        tryNextSource();
      }, 3000);
      
      tempImg.onload = () =>
      {
        if (isLoaded) return;
        cleanup();
        isLoaded = true;
        
        img.src = src;
        cacheFaviconFromUrl(hostname, src);
      };
      
      tempImg.onerror = () =>
      {
        if (isLoaded) return;
        cleanup();
        tryNextSource();
      };
      
      tempImg.src = src;
    }
    else
    {
      cleanup();
    }
  }
  
  tryNextSource();
}

function cacheFaviconFromUrl(hostname, url)
{
  if (faviconCache[hostname] && !isDefaultIcon(faviconCache[hostname]))
  {
    return;
  }
  
  const img = new Image();
  let isCached = false;
  
  const timeoutId = setTimeout(() =>
  {
    if (!isCached)
    {
      img.onload = null;
      img.onerror = null;
    }
  }, 5000);
  
  img.onload = () =>
  {
    if (isCached) return;
    isCached = true;
    clearTimeout(timeoutId);
    
    try
    {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 16, 16);
      const dataUrl = canvas.toDataURL('image/png');
      if (!isDefaultIcon(dataUrl))
      {
        faviconCache[hostname] = dataUrl;
        saveFaviconCache();
      }
    }
    catch (e) {}
  };
  img.onerror = () =>
  {
    isCached = true;
    clearTimeout(timeoutId);
  };
  img.src = url;
}

function createDefaultIcon()
{
  return DEFAULT_ICON_DATA;
}

async function init()
{
  await loadSettings();
  await loadFaviconCache();
  initUI();
  applySettings();
  loadBookmarks();
  setupEventListeners();

  setTimeout(() =>
  {
    document.getElementById('searchBox').focus();
  }, 100);
}

document.addEventListener('DOMContentLoaded', init);
