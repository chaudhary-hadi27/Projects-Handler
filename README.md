# SmartKode Projects - PWA Project Manager 🚀


![SmartKode](https://img.shields.io/badge/SmartKode-Projects-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![PWA](https://img.shields.io/badge/PWA-Enabled-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)


A modern **Progressive Web Application (PWA)** for managing and showcasing your demo projects with an elegant interface and offline capabilities.


🔗 **Repository:**  
https://github.com/chaudhary-hadi27/Projects-Handler


---


## ✨ Features


### 🎯 Core Features
- **Project Management** – Add, edit, delete projects with URLs
- **Category Organization** – Organize projects into custom categories
- **PWA Support** – Install as a native app, works offline
- **Real-time Preview** – View projects in embedded iframes
- **Fullscreen Mode** – Expand projects for detailed viewing


---


### ⭐ Favorites System
- **Star Projects** – Mark individual projects as favorites
- **Favorite Categories** – Star entire categories
- **Smart Filtering** – Quick access to favorites via sidebar
- **Persistent Storage** – Favorites saved across sessions


---


### 🎨 Modern UI/UX
- **Collapsible Sidebar** – Saves space on smaller screens
- **Responsive Design** – Works on mobile, tablet, and desktop
- **Smooth Animations** – Elegant transitions and hover effects
- **Dark/Light Ready** – Clean, accessible color scheme


---


### 🔧 Advanced Features
- **3-dot Context Menu** – Quick actions on categories (Edit, Favorite, Delete)
- **Project Counts** – Shows number of projects per category
- **Install Prompts** – Guides users to install as PWA
- **Local Database** – IndexedDB for data persistence
- **Offline Support** – Service worker caching


---


## 📦 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Dexie.js (IndexedDB wrapper)
- **UI:** Tailwind CSS
- **Icons:** Lucide React
- **PWA:** Next-PWA
- **State:** React Hooks + Dexie React Hooks


---


## 🚀 Getting Started


### Prerequisites
- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn


---


### Installation


Clone and install dependencies:


```bash
git clone https://github.com/chaudhary-hadi27/Projects-Handler
cd Projects-Handler
pnpm install

Run development server:

pnpm dev

Open in browser:

http://localhost:3000
Building for Production
pnpm build
pnpm start
```
## 📁 Project Structure

```text
smartkode-projects/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── database.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icon-192.png
│   └── icon-512.png
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎮 How to Use

### Adding Projects

1. Click **"+ Project"**
2. Enter:

    * Project title
    * Project URL
    * Select or create category
3. Click **Add**

---

### Managing Categories

* Add Category: `+ Category`
* Edit Category: `3 dots → Edit`
* Delete Category: `3 dots → Delete`
* Favorite Category: `3 dots → Favorite`

---

### Using Favorites

* Star Project: Click ❤️ on project card
* Star Category: 3 dots → Favorite
* View Favorites: Sidebar → Favorites
* View Favorite Categories: Sidebar → Fav Categories

---

## 📱 PWA Installation

### Automatic

Click **"Install App"** in sidebar.

### Manual

* **Chrome/Edge:** ⋮ → Install SmartKode
* **Safari:** Share → Add to Home Screen
* **Android:** Accept installation prompt

---

## 🛠️ Development

### Database Schema

```ts
interface Project {
  id?: number;
  title: string;
  url: string;
  category: string;
  createdAt: Date;
}

interface Category {
  id?: number;
  name: string;
  createdAt: Date;
}
```

---

### State Management

* UI State: React `useState`
* Persistent Data: Dexie.js
* Live Queries: `useLiveQuery`
* Favorites: LocalStorage

---

### Service Worker

* Cache-first strategy
* Offline pages supported
* Auto-update on refresh

---

## 🎨 Customization

### Changing Colors

Edit Tailwind classes in `page.tsx`:

* Primary: `indigo-600`
* Gradient: `from-indigo-500 to-purple-500`
* Background: `bg-gray-50`

---

## 🔍 Performance

* Automatic code splitting
* Lazy loaded iframes
* Minimal bundle
* IndexedDB caching
* PWA asset caching

---

## 🤝 Contributing

```bash
git checkout -b feature/AmazingFeature
git commit -m "Add AmazingFeature"
git push origin feature/AmazingFeature
```

Open Pull Request 🚀

---

## 📄 License

MIT License

---

## 🚨 Troubleshooting

### PWA not installing?

* Use HTTPS in production
* Check console errors
* Verify `manifest.json`

### Data not saving?

* Check IndexedDB
* Clear cache
* Reload app

---

## 🌐 Browser Support

* Chrome 89+
* Edge 89+
* Firefox 86+
* Safari 14+
* Android / iOS PWA

---

## 🙏 Acknowledgments

* Next.js
* Dexie.js
* Tailwind CSS
* Lucide Icons
* Next-PWA

---

**Made with ❤️ for developers who want to showcase their projects**

⭐ Star the repo if you find it useful!
