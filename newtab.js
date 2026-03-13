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
    searchEngine: 'google',
    showSuggestions: true,
    suggestionRows: 5
  },
  background: {
    image: '',
    theme: 'light',
    blur: 0,
    source: 'local',
    localImage: ''
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
  const backgroundLayer = document.getElementById('backgroundLayer');

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
    backgroundLayer.style.backgroundImage = `url(${currentSettings.background.image})`;
    body.style.backgroundImage = 'none';
  }
  else
  {
    backgroundLayer.style.backgroundImage = 'none';
    body.style.backgroundImage = 'none';
  }

  body.setAttribute('data-theme', currentSettings.background.theme);

  const blurValue = currentSettings.background.blur || 0;
  
  if (currentSettings.background.image && blurValue > 0)
  {
    backgroundLayer.style.filter = `blur(${blurValue}px)`;
    backgroundLayer.style.webkitFilter = `blur(${blurValue}px)`;
  }
  else
  {
    backgroundLayer.style.filter = 'none';
    backgroundLayer.style.webkitFilter = 'none';
  }

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
  document.getElementById('showSuggestions').checked = currentSettings.searchbox.showSuggestions !== false;
  document.getElementById('suggestionRows').value = currentSettings.searchbox.suggestionRows || 5;
  document.getElementById('suggestionRowsValue').textContent = (currentSettings.searchbox.suggestionRows || 5) + '行';

  document.querySelectorAll('.theme-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.theme === currentSettings.background.theme);
  });
  document.getElementById('bgBlur').value = currentSettings.background.blur || 0;
  document.getElementById('bgBlurValue').textContent = (currentSettings.background.blur || 0) + 'px';
  
  document.querySelectorAll('.source-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.source === (currentSettings.background.source || 'local'));
  });
  
  updateWallpaperSourceUI(currentSettings.background.source || 'local');

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

function showToast(message)
{
  let toast = document.getElementById('generalToast');
  if (!toast)
  {
    toast = document.createElement('div');
    toast.id = 'generalToast';
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
  
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() =>
  {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 2000);
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

  document.getElementById('showSuggestions').addEventListener('change', (e) =>
  {
    currentSettings.searchbox.showSuggestions = e.target.checked;
    saveSettings();
  });

  document.getElementById('suggestionRows').addEventListener('input', (e) =>
  {
    currentSettings.searchbox.suggestionRows = parseInt(e.target.value);
    document.getElementById('suggestionRowsValue').textContent = e.target.value + '行';
    saveSettings();
  });

  const uploadBgBtn = document.getElementById('uploadBgBtn');
  const bgImageInput = document.getElementById('bgImage');
  const clearBgBtn = document.getElementById('clearBgBtn');
  const saveLocalBtn = document.getElementById('saveLocalBtn');

  uploadBgBtn.addEventListener('click', () =>
  {
    bgImageInput.click();
  });

  if (saveLocalBtn)
  {
    saveLocalBtn.addEventListener('click', async () =>
    {
      if (currentSettings.background.image)
      {
        try
        {
          const imageUrl = currentSettings.background.image;
          let blob;
          
          if (imageUrl.startsWith('data:'))
          {
            const response = await fetch(imageUrl);
            blob = await response.blob();
          }
          else
          {
            const response = await fetch(imageUrl);
            blob = await response.blob();
          }
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          const timestamp = new Date().toISOString().slice(0, 10);
          a.download = `wallpaper_${timestamp}.jpg`;
          
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast('壁纸已开始下载');
        }
        catch (error)
        {
          console.error('Download failed:', error);
          showToast('下载失败，请重试');
        }
      }
      else
      {
        showToast('当前没有壁纸可保存');
      }
    });
  }

  bgImageInput.addEventListener('change', (e) =>
  {
    const file = e.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = (event) =>
      {
        currentSettings.background.image = event.target.result;
        currentSettings.background.localImage = event.target.result;
        currentSettings.background.source = 'local';
        applySettings();
        saveSettings();
        
        document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.source-btn[data-source="local"]').classList.add('active');
        updateWallpaperSourceUI('local');
      };
      reader.readAsDataURL(file);
    }
  });

  clearBgBtn.addEventListener('click', () =>
  {
    currentSettings.background.image = '';
    currentSettings.background.localImage = '';
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

  document.getElementById('bgBlur').addEventListener('input', (e) =>
  {
    currentSettings.background.blur = parseInt(e.target.value);
    document.getElementById('bgBlurValue').textContent = e.target.value + 'px';
    applySettings();
    saveSettings();
  });

  document.querySelectorAll('.source-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      const source = btn.dataset.source;
      
      if (source === 'bing' || source === 'wallhaven')
      {
        openWallpaperSidebar(source);
      }
      else
      {
        document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSettings.background.source = source;
        
        if (currentSettings.background.localImage)
        {
          currentSettings.background.image = currentSettings.background.localImage;
        }
        
        updateWallpaperSourceUI(source);
        applySettings();
        saveSettings();
      }
    });
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

  document.getElementById('clearCache').addEventListener('click', () =>
  {
    wallpaperCache = {
      bing: { wallpapers: [], lastUpdate: 0, currentPage: 0, hasMore: true },
      wallhaven: { wallpapers: [], lastUpdate: 0, currentPage: 0, hasMore: true }
    };
    faviconCache = {};
    saveWallpaperCache();
    saveFaviconCache();
    showToast('缓存已清除');
  });

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
      hideSuggestions();
      performSearch();
    }
  });

  let suggestionTimeout = null;
  let currentSuggestions = [];
  let selectedSuggestionIndex = -1;

  function hideSuggestions()
  {
    const suggestionsEl = document.getElementById('searchSuggestions');
    suggestionsEl.classList.remove('visible');
    suggestionsEl.innerHTML = '';
    suggestionsEl.style.height = '';
    suggestionsEl.style.overflowY = '';
    currentSuggestions = [];
    selectedSuggestionIndex = -1;
  }

  function showSuggestions(suggestions, query)
  {
    const suggestionsEl = document.getElementById('searchSuggestions');
    const maxRows = currentSettings.searchbox.suggestionRows || 5;
    const displaySuggestions = suggestions.slice(0, maxRows);
    
    if (displaySuggestions.length === 0)
    {
      hideSuggestions();
      return;
    }
    
    currentSuggestions = displaySuggestions;
    selectedSuggestionIndex = -1;
    
    suggestionsEl.innerHTML = displaySuggestions.map((item, index) => `
      <div class="suggestion-item" data-index="${index}">
        <svg class="suggestion-icon" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <span class="suggestion-text">${highlightMatch(item, query)}</span>
      </div>
    `).join('');
    
    suggestionsEl.classList.add('visible');
    
    const itemHeight = 42;
    const totalHeight = displaySuggestions.length * itemHeight;
    const maxHeight = window.innerHeight - 200;
    
    if (totalHeight <= maxHeight)
    {
      suggestionsEl.style.height = 'auto';
      suggestionsEl.style.overflowY = 'hidden';
    }
    else
    {
      suggestionsEl.style.height = maxHeight + 'px';
      suggestionsEl.style.overflowY = 'auto';
    }
    
    suggestionsEl.querySelectorAll('.suggestion-item').forEach(item =>
    {
      item.addEventListener('click', () =>
      {
        const index = parseInt(item.dataset.index);
        searchBox.value = currentSuggestions[index];
        hideSuggestions();
        performSearch();
      });
    });
  }

  function highlightMatch(text, query)
  {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function escapeRegex(string)
  {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async function fetchSuggestions(query)
  {
    if (!query || !currentSettings.searchbox.showSuggestions)
    {
      hideSuggestions();
      return;
    }
    
    const engine = currentSettings.searchbox.searchEngine || 'google';
    
    try
    {
      let suggestions = [];
      
      if (engine === 'baidu')
      {
        const response = await fetch(`https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=callback`, {
          mode: 'no-cors'
        });
        const script = document.createElement('script');
        script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=handleBaiduSuggestion`;
        document.body.appendChild(script);
        setTimeout(() => script.remove(), 1000);
        return;
      }
      else if (engine === 'sogou')
      {
        const response = await fetch(`https://suggestion.sogou.com/sugg/ajaj_json.jsp?type=web&key=${encodeURIComponent(query)}`, {
          mode: 'no-cors'
        });
        const script = document.createElement('script');
        script.src = `https://suggestion.sogou.com/sugg/ajaj_json.jsp?type=web&key=${encodeURIComponent(query)}&callback=handleSogouSuggestion`;
        document.body.appendChild(script);
        setTimeout(() => script.remove(), 1000);
        return;
      }
      else
      {
        const suggestUrl = engine === 'google' 
          ? `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
          : engine === 'bing'
          ? `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`
          : engine === 'duckduckgo'
          ? `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`
          : null;
        
        if (suggestUrl)
        {
          const response = await fetch(suggestUrl);
          const data = await response.json();
          
          if (engine === 'duckduckgo')
          {
            suggestions = data[1] || [];
          }
          else
          {
            suggestions = data[1] || [];
          }
        }
      }
      
      showSuggestions(suggestions, query);
    }
    catch (error)
    {
      console.log('Failed to fetch suggestions:', error);
    }
  }

  window.handleBaiduSuggestion = function(data)
  {
    if (data && data.s)
    {
      showSuggestions(data.s, searchBox.value.trim());
    }
  };

  window.handleSogouSuggestion = function(data)
  {
    if (data && data[1])
    {
      showSuggestions(data[1], searchBox.value.trim());
    }
  };

  searchBox.addEventListener('input', (e) =>
  {
    const query = e.target.value.trim();
    
    if (suggestionTimeout)
    {
      clearTimeout(suggestionTimeout);
    }
    
    if (!query)
    {
      hideSuggestions();
      return;
    }
    
    suggestionTimeout = setTimeout(() =>
    {
      fetchSuggestions(query);
    }, 200);
  });

  searchBox.addEventListener('keydown', (e) =>
  {
    const suggestionsEl = document.getElementById('searchSuggestions');
    
    if (!suggestionsEl.classList.contains('visible'))
    {
      return;
    }
    
    if (e.key === 'ArrowDown')
    {
      e.preventDefault();
      selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, currentSuggestions.length - 1);
      updateSuggestionSelection();
    }
    else if (e.key === 'ArrowUp')
    {
      e.preventDefault();
      selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
      updateSuggestionSelection();
    }
    else if (e.key === 'Escape')
    {
      hideSuggestions();
    }
  });

  function updateSuggestionSelection()
  {
    const items = document.querySelectorAll('.suggestion-item');
    items.forEach((item, index) =>
    {
      item.classList.toggle('selected', index === selectedSuggestionIndex);
    });
    
    if (selectedSuggestionIndex >= 0 && currentSuggestions[selectedSuggestionIndex])
    {
      searchBox.value = currentSuggestions[selectedSuggestionIndex];
    }
  }

  document.addEventListener('click', (e) =>
  {
    if (!e.target.closest('.search-wrapper'))
    {
      hideSuggestions();
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

let wallpaperCache = {
  bing: {
    wallpapers: [],
    lastUpdate: 0,
    currentPage: 0,
    hasMore: true
  },
  wallhaven: {
    wallpapers: [],
    lastUpdate: 0,
    currentPage: 0,
    hasMore: true
  }
};

const CACHE_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;
let isLoadingWallpapers = false;
let sidebarScrollHandler = null;
let currentScrollSource = null;

function loadWallpaperCache()
{
  return new Promise((resolve) =>
  {
    if (typeof chrome !== 'undefined' && chrome.storage)
    {
      chrome.storage.local.get(['wallpaperCache'], (result) =>
      {
        if (result.wallpaperCache)
        {
          wallpaperCache = {
            bing: {
              wallpapers: result.wallpaperCache.bing?.wallpapers || [],
              lastUpdate: result.wallpaperCache.bing?.lastUpdate || 0,
              currentPage: result.wallpaperCache.bing?.currentPage || 0,
              hasMore: result.wallpaperCache.bing?.hasMore !== undefined ? result.wallpaperCache.bing.hasMore : true
            },
            wallhaven: {
              wallpapers: result.wallpaperCache.wallhaven?.wallpapers || [],
              lastUpdate: result.wallpaperCache.wallhaven?.lastUpdate || 0,
              currentPage: result.wallpaperCache.wallhaven?.currentPage || 0,
              hasMore: result.wallpaperCache.wallhaven?.hasMore !== undefined ? result.wallpaperCache.wallhaven.hasMore : true
            }
          };
        }
        resolve();
      });
    }
    else
    {
      const saved = localStorage.getItem('wallpaperCache');
      if (saved)
      {
        try
        {
          const parsed = JSON.parse(saved);
          wallpaperCache = {
            bing: {
              wallpapers: parsed.bing?.wallpapers || [],
              lastUpdate: parsed.bing?.lastUpdate || 0,
              currentPage: parsed.bing?.currentPage || 0,
              hasMore: parsed.bing?.hasMore !== undefined ? parsed.bing.hasMore : true
            },
            wallhaven: {
              wallpapers: parsed.wallhaven?.wallpapers || [],
              lastUpdate: parsed.wallhaven?.lastUpdate || 0,
              currentPage: parsed.wallhaven?.currentPage || 0,
              hasMore: parsed.wallhaven?.hasMore !== undefined ? parsed.wallhaven.hasMore : true
            }
          };
        }
        catch (e)
        {
          wallpaperCache = {
            bing: { wallpapers: [], lastUpdate: 0, currentPage: 0, hasMore: true },
            wallhaven: { wallpapers: [], lastUpdate: 0, currentPage: 0, hasMore: true }
          };
        }
      }
      resolve();
    }
  });
}

function saveWallpaperCache()
{
  if (typeof chrome !== 'undefined' && chrome.storage)
  {
    chrome.storage.local.set({ wallpaperCache: wallpaperCache });
  }
  else
  {
    localStorage.setItem('wallpaperCache', JSON.stringify(wallpaperCache));
  }
}

function isWallpaperCacheExpired(source)
{
  const cache = wallpaperCache[source];
  if (!cache || !cache.lastUpdate || cache.wallpapers.length === 0)
  {
    return true;
  }
  return Date.now() - cache.lastUpdate > CACHE_EXPIRE_TIME;
}

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
  await loadWallpaperCache();
  initUI();
  applySettings();
  loadBookmarks();
  setupEventListeners();
  setupSidebarEvents();

  setTimeout(() =>
  {
    document.getElementById('searchBox').focus();
  }, 100);
}

function updateWallpaperSourceUI(source)
{
  const uploadBtn = document.getElementById('uploadBgBtn');
  const clearBtn = document.getElementById('clearBgBtn');
  
  if (uploadBtn)
  {
    uploadBtn.style.display = source === 'local' ? 'inline-flex' : 'none';
  }
  if (clearBtn)
  {
    clearBtn.style.display = source === 'local' ? 'inline-flex' : 'none';
  }
}

let sidebarOverlay = null;
let currentSidebarSource = 'bing';

function createSidebarOverlay()
{
  if (!sidebarOverlay)
  {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    sidebarOverlay.id = 'sidebarOverlay';
    document.body.appendChild(sidebarOverlay);
    
    sidebarOverlay.addEventListener('click', closeWallpaperSidebar);
  }
}

function openWallpaperSidebar(source)
{
  createSidebarOverlay();
  
  const sidebar = document.getElementById('wallpaperSidebar');
  const sidebarTitle = document.getElementById('sidebarTitle');
  
  currentSidebarSource = source;
  sidebarTitle.textContent = source === 'bing' ? '必应壁纸' : 'Wallhaven';
  
  document.querySelectorAll('.sidebar-source-btn').forEach(btn =>
  {
    btn.classList.toggle('active', btn.dataset.source === source);
  });
  
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  
  loadSidebarWallpapers(source);
}

function closeWallpaperSidebar()
{
  const sidebar = document.getElementById('wallpaperSidebar');
  
  if (sidebar)
  {
    sidebar.classList.remove('active');
  }
  
  if (sidebarOverlay)
  {
    sidebarOverlay.classList.remove('active');
  }
  
  if (sidebarScrollHandler)
  {
    const gallery = document.getElementById('sidebarGallery');
    if (gallery)
    {
      gallery.removeEventListener('scroll', sidebarScrollHandler);
    }
    sidebarScrollHandler = null;
  }
}

function loadSidebarWallpapers(source, forceRefresh = false)
{
  const container = document.getElementById('sidebarWallpapers');
  const refreshBtn = document.getElementById('sidebarRefresh');
  
  if (!container) return;
  
  if (forceRefresh)
  {
    wallpaperCache[source].wallpapers = [];
    wallpaperCache[source].currentPage = 0;
    wallpaperCache[source].hasMore = true;
    wallpaperCache[source].lastUpdate = Date.now();
    saveWallpaperCache();
  }
  
  if (wallpaperCache[source].wallpapers.length > 0)
  {
    renderSidebarWallpaperGrid(container, wallpaperCache[source].wallpapers, source, false);
    if (source === 'wallhaven')
    {
      setupInfiniteScroll(source);
    }
    return;
  }
  
  refreshBtn.classList.add('loading');
  container.innerHTML = '<div class="wallpaper-loading-text">加载中...</div>';
  
  if (source === 'bing')
  {
    loadBingWallpapersForSidebar(container, refreshBtn, 1);
  }
  else
  {
    loadWallhavenWallpapersForSidebar(container, refreshBtn, 1);
  }
}

async function loadBingWallpapersForSidebar(container, refreshBtn, page = 1)
{
  if (isLoadingWallpapers) return;
  isLoadingWallpapers = true;
  
  try
  {
    const wallpapers = [];
    const existingUrls = new Set(wallpaperCache.bing.wallpapers.map(w => w.url));
    
    for (let i = 0; i < 16; i++)
    {
      try
      {
        const response = await fetch(`https://bing.biturl.top/?resolution=1920&format=json&index=${i}&mkt=zh-CN`);
        const data = await response.json();
        if (data && data.url && !existingUrls.has(data.url))
        {
          wallpapers.push({
            url: data.url,
            title: data.copyright || `必应壁纸 ${i + 1}`,
            source: 'bing'
          });
          existingUrls.add(data.url);
        }
      }
      catch (e)
      {
        continue;
      }
    }
    
    if (wallpapers.length > 0)
    {
      wallpaperCache.bing.wallpapers = wallpapers;
      wallpaperCache.bing.currentPage = 1;
      wallpaperCache.bing.hasMore = false;
      wallpaperCache.bing.lastUpdate = Date.now();
      saveWallpaperCache();
      
      container.innerHTML = '';
      renderSidebarWallpaperGrid(container, wallpapers, 'bing', false);
    }
    else if (wallpaperCache.bing.wallpapers.length > 0)
    {
      renderSidebarWallpaperGrid(container, wallpaperCache.bing.wallpapers, 'bing', false);
    }
    else
    {
      container.innerHTML = '<div class="wallpaper-error">加载失败，请检查网络连接</div>';
    }
  }
  catch (error)
  {
    if (wallpaperCache.bing.wallpapers.length > 0)
    {
      renderSidebarWallpaperGrid(container, wallpaperCache.bing.wallpapers, 'bing', false);
    }
    else
    {
      container.innerHTML = '<div class="wallpaper-error">加载失败，请检查网络连接</div>';
    }
  }
  finally
  {
    isLoadingWallpapers = false;
    refreshBtn.classList.remove('loading');
  }
}

async function loadWallhavenWallpapersForSidebar(container, refreshBtn, page = 1)
{
  if (isLoadingWallpapers) return;
  isLoadingWallpapers = true;
  
  try
  {
    const response = await fetch(`https://wallhaven.cc/api/v1/search?categories=111&purity=100&topRange=1d&sorting=toplist&page=${page}`);
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0)
    {
      const wallpapers = data.data.map(item => ({
        url: item.path,
        thumb: item.thumbs?.small || item.path,
        title: item.id || 'Wallhaven壁纸',
        source: 'wallhaven'
      }));
      
      if (page === 1)
      {
        wallpaperCache.wallhaven.wallpapers = wallpapers;
        container.innerHTML = '';
      }
      else
      {
        wallpaperCache.wallhaven.wallpapers = [...wallpaperCache.wallhaven.wallpapers, ...wallpapers];
      }
      
      wallpaperCache.wallhaven.currentPage = page;
      
      if (data.meta)
      {
        wallpaperCache.wallhaven.hasMore = data.meta.current_page < data.meta.last_page;
      }
      else
      {
        wallpaperCache.wallhaven.hasMore = data.data.length > 0;
      }
      
      wallpaperCache.wallhaven.lastUpdate = Date.now();
      saveWallpaperCache();
      
      renderSidebarWallpaperGrid(container, wallpapers, 'wallhaven', page > 1);
      
      if (page === 1)
      {
        setupInfiniteScroll('wallhaven');
      }
    }
    else if (page === 1)
    {
      if (wallpaperCache.wallhaven.wallpapers.length > 0)
      {
        renderSidebarWallpaperGrid(container, wallpaperCache.wallhaven.wallpapers, 'wallhaven', false);
        setupInfiniteScroll('wallhaven');
      }
      else
      {
        container.innerHTML = '<div class="wallpaper-error">暂无壁纸数据</div>';
      }
    }
    else
    {
      wallpaperCache.wallhaven.hasMore = false;
      saveWallpaperCache();
    }
  }
  catch (error)
  {
    if (page === 1)
    {
      if (wallpaperCache.wallhaven.wallpapers.length > 0)
      {
        renderSidebarWallpaperGrid(container, wallpaperCache.wallhaven.wallpapers, 'wallhaven', false);
        setupInfiniteScroll('wallhaven');
      }
      else
      {
        container.innerHTML = '<div class="wallpaper-error">加载失败，请检查网络连接</div>';
      }
    }
  }
  finally
  {
    isLoadingWallpapers = false;
    refreshBtn.classList.remove('loading');
  }
}

function renderSidebarWallpaperGrid(container, wallpapers, source, append = false)
{
  const html = wallpapers.map((wp, index) => `
    <div class="wallpaper-item" data-url="${wp.url}" data-index="${index}">
      <img src="${wp.thumb || wp.url}" alt="${wp.title}" loading="lazy">
    </div>
  `).join('');
  
  if (append)
  {
    const loadingEl = container.querySelector('.wallpaper-loading-more');
    if (loadingEl)
    {
      loadingEl.remove();
    }
    container.insertAdjacentHTML('beforeend', html);
  }
  else
  {
    container.innerHTML = html;
  }
  
  container.querySelectorAll('.wallpaper-item:not([data-bound])').forEach(item =>
  {
    item.setAttribute('data-bound', 'true');
    item.addEventListener('click', () =>
    {
      const url = item.dataset.url;
      currentSettings.background.image = url;
      currentSettings.background.source = source;
      applySettings();
      saveSettings();
      
      document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));
      const sourceBtn = document.querySelector(`.source-btn[data-source="${source}"]`);
      if (sourceBtn)
      {
        sourceBtn.classList.add('active');
      }
      updateWallpaperSourceUI(source);
      
      container.querySelectorAll('.wallpaper-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    });
  });
}

function setupInfiniteScroll(source)
{
  const gallery = document.getElementById('sidebarGallery');
  
  currentScrollSource = source;
  
  if (sidebarScrollHandler)
  {
    gallery.removeEventListener('scroll', sidebarScrollHandler);
  }
  
  sidebarScrollHandler = () =>
  {
    const cache = wallpaperCache[currentScrollSource];
    if (isLoadingWallpapers || !cache || !cache.hasMore)
    {
      return;
    }
    
    const { scrollHeight, scrollTop, clientHeight } = gallery;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    
    if (scrollBottom < 300)
    {
      preloadNextPage(currentScrollSource);
    }
  };
  
  gallery.addEventListener('scroll', sidebarScrollHandler);
}

function preloadNextPage(source)
{
  if (isLoadingWallpapers || !wallpaperCache[source].hasMore)
  {
    return;
  }
  
  isLoadingWallpapers = true;
  
  const container = document.getElementById('sidebarWallpapers');
  const refreshBtn = document.getElementById('sidebarRefresh');
  const nextPage = wallpaperCache[source].currentPage + 1;
  
  const loadingEl = document.createElement('div');
  loadingEl.className = 'wallpaper-loading-more';
  loadingEl.innerHTML = '<span>加载更多...</span>';
  container.appendChild(loadingEl);
  
  if (source === 'bing')
  {
    loadBingWallpapersForSidebar(container, refreshBtn, nextPage);
  }
  else
  {
    loadWallhavenWallpapersForSidebar(container, refreshBtn, nextPage);
  }
}

function setupSidebarEvents()
{
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarRefresh = document.getElementById('sidebarRefresh');
  
  if (sidebarClose)
  {
    sidebarClose.addEventListener('click', closeWallpaperSidebar);
  }
  
  if (sidebarRefresh)
  {
    sidebarRefresh.addEventListener('click', () =>
    {
      loadSidebarWallpapers(currentSidebarSource, true);
    });
  }
  
  document.querySelectorAll('.sidebar-source-btn').forEach(btn =>
  {
    btn.addEventListener('click', () =>
    {
      const source = btn.dataset.source;
      currentSidebarSource = source;
      
      document.querySelectorAll('.sidebar-source-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const sidebarTitle = document.getElementById('sidebarTitle');
      sidebarTitle.textContent = source === 'bing' ? '必应壁纸' : 'Wallhaven';
      
      loadSidebarWallpapers(source);
    });
  });
  
  document.addEventListener('keydown', (e) =>
  {
    if (e.key === 'Escape')
    {
      const sidebar = document.getElementById('wallpaperSidebar');
      if (sidebar && sidebar.classList.contains('active'))
      {
        closeWallpaperSidebar();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
