// VideoSpeedControl Support Page Scripts
// Language switching
function switchLanguage(lang, clickedButton) {
    document.body.className = `lang-${lang}`;
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Make the clicked button active
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Toggle QR code display
function toggleQRCode(type) {
    const qrElement = document.getElementById(`${type}-qr`);
    const noteElement = document.getElementById(`${type}-note`);
    const noteEnElement = document.getElementById(`${type}-note-en`);
    
    if (qrElement.style.display === 'none') {
        qrElement.style.display = 'block';
        noteElement.style.display = 'block';
        noteEnElement.style.display = 'block';
        // Update note text to show it can be hidden
        noteElement.innerHTML = '点击可以隐藏二维码';
        noteEnElement.innerHTML = 'Click to hide QR code';
    } else {
        qrElement.style.display = 'none';
        noteElement.style.display = 'block';
        noteEnElement.style.display = 'block';
        // Update note text to show it can be shown
        noteElement.innerHTML = '点击显示二维码';
        noteEnElement.innerHTML = 'Click to show QR code';
    }
}

// Copy address to clipboard
async function copyAddress(elementId, button) {
    const address = document.getElementById(elementId).textContent;
    
    try {
        await navigator.clipboard.writeText(address);
        
        // Show success feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="chinese">已复制!</span><span class="english">Copied!</span>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        button.innerHTML = '<span class="chinese">已复制!</span><span class="english">Copied!</span>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = '<span class="chinese">复制地址</span><span class="english">Copy Address</span>';
            button.classList.remove('copied');
        }, 2000);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set the correct path for WeChat QR code
    const qrImage = document.getElementById('wechat-qr');
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        const qrUrl = chrome.runtime.getURL('assets/images/WXQR.jpg');
        qrImage.src = qrUrl;
        console.log('WeChat QR code URL:', qrUrl);
        
        // Add error handler for image loading
        qrImage.onerror = function() {
            console.error('Failed to load WeChat QR code image');
            // Show fallback message
            qrImage.style.display = 'none';
            const noteElement = document.getElementById('wechat-note');
            const noteEnElement = document.getElementById('wechat-note-en');
            noteElement.innerHTML = '二维码加载失败';
            noteEnElement.innerHTML = 'QR code failed to load';
        };
        
        qrImage.onload = function() {
            console.log('WeChat QR code loaded successfully');
        };
    } else {
        // Fallback for non-extension environment
        console.warn('Chrome extension API not available');
        qrImage.style.display = 'none';
        const noteElement = document.getElementById('wechat-note');
        const noteEnElement = document.getElementById('wechat-note-en');
        noteElement.innerHTML = '请在Chrome扩展环境中查看';
        noteEnElement.innerHTML = 'Please view in Chrome extension environment';
    }
    
    // Add event listeners for buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.textContent === '中文' ? 'cn' : 'en';
            switchLanguage(lang, this);
        });
    });
    
    // Add event listeners for support cards
    document.querySelectorAll('.support-card[data-toggle]').forEach(card => {
        card.addEventListener('click', function() {
            const toggleType = this.getAttribute('data-toggle');
            toggleQRCode(toggleType);
        });
    });
    
    // Add event listeners for copy buttons
    document.querySelectorAll('.copy-btn[data-target]').forEach(btn => {
        btn.addEventListener('click', function() {
            const elementId = this.getAttribute('data-target');
            copyAddress(elementId, this);
        });
    });
    
    console.log('VideoSpeedControl Support Page Loaded');
});