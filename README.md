# 💕 Interactive Proposal Site

A beautiful, cinematic, mobile-first proposal website that reveals a heartfelt message through progressive stages.

## ✨ Features

- **4-Stage Progressive Reveal**: Landing → Memory → Cinematic Transition → Proposal → Celebration
- **Floating Heart Particles**: Canvas-based, optimized for 60fps
- **Confetti Celebration**: Triggers on "Yes" click
- **Typewriter Animation**: Letter-by-letter text reveal
- **Audio Support**: Optional background music with consent
- **Accessibility**: Full keyboard navigation, ARIA labels, reduced motion support
- **Mobile-First**: Optimized tap targets (44px+), responsive design

## 🚀 Quick Deploy

### Option 1: Netlify (Drag & Drop)

1. Build the project:
   ```bash
   npm install
   npm run build
   ```
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to deploy
4. Your site is live! 🎉

### Option 2: Netlify (Git)

1. Push this repo to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy! 🚀

### Option 3: Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Framework preset: Vite
5. Deploy! ✨

## 📝 Customization

### Change the Photo

1. Replace `src/assets/couple-photo.jpg` with your photo
2. Recommended: 2000px wide, 4:3 aspect ratio
3. The image is automatically imported in the code

### Change the Text

Edit `src/components/proposal/` files:
- **LandingStage.tsx**: Title and subtitle
- **MemoryRevealStage.tsx**: Photo caption
- **ProposalRevealStage.tsx**: Main proposal text
- **FinalStage.tsx**: Celebration message

### Add Background Music

1. Add your audio file to `public/assets/song.mp3`
2. In `src/pages/Index.tsx`, uncomment the audioPath:
   ```tsx
   <ProposalApp 
     photoPath={couplePhoto}
     audioPath="/assets/song.mp3"
   />
   ```

## 🎨 Design Tokens

Colors are defined in `src/index.css`:
- `--cream`: Warm background
- `--blush`: Soft pink accent
- `--coral`: Primary romantic color
- `--warm-gray`: Text color

## 📱 Browser Support

- ✅ Chrome, Safari, Firefox, Edge (latest)
- ✅ iOS Safari, Chrome for Android
- ✅ Reduced motion support for accessibility

## 💡 Tips

1. **Test on mobile first** - most viewers will use phones
2. **Use a short audio clip** - 20-40 seconds works best
3. **Compress your photo** - WebP format recommended
4. **Send the link privately** - set meta robots to noindex

---

Made with 💕 for your special moment
