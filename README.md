# Artist Tracker - Browser Extension

**Version:** 2.0.0  
**Manifest:** V3  
**Permissions:** Storage, Tabs

Store artists with links to their works in JSON format, and view them in a beautiful moodboard.

---

## 📁 Project Structure

```
LeadTrackerWebExt/
├── manifest.json     # Extension configuration
├── popup.html        # Main popup UI with tabs
├── styles.css        # Warm, minimal styling
├── script.js         # Core functionality
├── test.json         # Sample data for testing
└── icons/
    ├── icon.jpeg     # Extension icon
    └── README.md     # This file
```

---

## ✨ Features

### Tracker Tab
| Feature | Description |
|---------|-------------|
| Add Artist | Create a new artist entry |
| Add Links | Add image/work links to a selected artist |
| Save Tab URL | Capture current browser tab URL to selected artist |
| Live JSON Display | See your data in JSON format in real-time |
| Copy JSON | One-click copy to clipboard |
| Export JSON | Download as `artists_data.json` file |
| Delete Artist | Remove artist and all their links |
| Remove Links | Delete individual links |

### Moodboard Tab *(New in v2.0)*
| Feature | Description |
|---------|-------------|
| Masonry Grid | Pinterest-style scattered image layout |
| Artist Filter | Filter images by specific artist or view all |
| Dynamic Updates | Auto-refreshes when new links are added |
| Hover Effects | Images tilt and show artist name on hover |
| Click to Open | Click any image to open the original link |
| Shuffled Layout | Images are shuffled for visual variety |

---

## 🎨 Design

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#faf8f5` | Background |
| Warm White | `#fffdfb` | Cards |
| Terracotta | `#c4785c` | Accent / Primary |
| Warm Brown | `#8b6f5c` | Secondary |
| Charcoal | `#2c2825` | Text |

### Typography
- **Font:** Georgia, serif
- **Style:** Clean, minimal, warm aesthetic

---

## 📦 Data Structure

Data is stored in JSON format:
```json
{
  "artist_name": ["img_link1", "img_link2", ...],
  "another_artist": ["link1", "link2", ...]
}
```

---

## 🚀 Installation

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `LeadTrackerWebExt` folder

---

## 🖼️ Extension Icons

Add your extension icon here:
- `icon.jpeg` - Single icon for all sizes (current)

Or use multiple sizes for best quality:
- `icon16.png` - 16×16 (toolbar)
- `icon48.png` - 48×48 (extensions page)
- `icon128.png` - 128×128 (Chrome Web Store)

**Tips:**
1. Use PNG format with transparency
2. Keep the design simple and recognizable
3. Use consistent branding

---

## 📝 Changelog

### v2.0.0
- Added **Moodboard tab** with masonry grid layout
- Tab navigation between Tracker and Moodboard
- Artist filter for moodboard
- Image detection for common hosting sites
- Hover effects and animations
- Shuffled image layout

### v1.0.0
- Initial release
- Artist and link management
- JSON display and export
- Chrome storage integration