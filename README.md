# SmartKode Projects - Portfolio Showcase Dashboard

Aik modern aur responsive web app jo aapko apne demo projects ko categorize aur showcase karne ki facility deta hai. Ye app Dexie.js ka use karke locally data store karta hai, matlab koi backend ki zaroorat nahi!

## Features

✅ **Category Management** - Apni marzi se unlimited categories bana sakte hain
✅ **Project Management** - Har project ko title, URL, aur category ke saath add karein
✅ **Local Storage** - Dexie (IndexedDB) se sab data browser mein locally save hota hai
✅ **Responsive Design** - Mobile, tablet, aur desktop sab devices par perfect
✅ **Easy Navigation** - Ek click mein apne projects open karein
✅ **Edit & Delete** - Projects aur categories ko edit ya delete kar sakte hain
✅ **Beautiful UI** - Modern gradient design with smooth animations

## Installation

1. **Dependencies Install karein:**
```bash
npm install
```

2. **Development Server Start karein:**
```bash
npm run dev
```

3. **Browser mein open karein:**
```
http://localhost:3000
```

## Usage Guide

### 1. Category Banana
- "Add Category" button par click karein
- Category ka naam enter karein (jaise "Web Development", "Mobile Apps", "E-commerce", etc.)
- "Add Category" button click karein

### 2. Project Add Karna
- "Add Project" button par click karein
- Project ka title enter karein
- Project ka URL daalein (complete URL with https://)
- Category select karein
- "Add Project" button click karein

### 3. Projects Dekhna
- Categories par click karke filter kar sakte hain
- Har project card par "Open Project" button click karein
- Project new tab mein khul jayega

### 4. Edit/Delete Karna
- Project card par hover karein
- Edit icon se project edit kar sakte hain
- Delete icon se project delete kar sakte hain
- Category par hover karke X button se category delete kar sakte hain

## Production Build

Agar aap isko deploy karna chahte hain:

```bash
npm run build
npm start
```

Ya export karke static files:
```bash
npm run build
```

Phir `out` folder ko kisi bhi static hosting service (Vercel, Netlify, GitHub Pages) par deploy kar sakte hain.

## Tech Stack

- **Next.js 14** - React framework
- **Dexie.js** - IndexedDB wrapper for local storage
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Browser Compatibility

Yeh app modern browsers mein kaam karega:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Storage

Sab data aapke browser ke IndexedDB mein store hota hai. Matlab:
- ✅ Internet ki zaroorat nahi
- ✅ Bahut fast performance
- ✅ Privacy - data sirf aapke device par
- ⚠️ Browser clear karne se data delete ho jayega

## Tips

1. Regular backup ke liye projects screenshot le sakte hain
2. Demo dete waqt different categories bana kar organized rakhen
3. URL mein https:// zaroor shamil karein
4. Categories ko descriptive names dein taake easily identify ho sakein

## Support

Koi masla ho to yeh check karein:
- Browser console for errors
- Make sure all dependencies properly installed
- Try clearing browser cache
- Check if URLs are properly formatted

---

**Made with ❤️ for SmartKode Services**
# Projects-Handler
