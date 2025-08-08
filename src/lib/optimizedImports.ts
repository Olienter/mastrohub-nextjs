// Optimized imports for better performance
import dynamic from 'next/dynamic';

// Lazy load framer-motion components
export const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), { ssr: false });
export const MotionButton = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.button })), { ssr: false });
export const MotionSpan = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.span })), { ssr: false });
export const MotionH1 = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.h1 })), { ssr: false });
export const MotionH2 = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.h2 })), { ssr: false });
export const MotionH3 = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.h3 })), { ssr: false });
export const MotionP = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.p })), { ssr: false });
export const MotionImg = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.img })), { ssr: false });
export const MotionNav = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.nav })), { ssr: false });
export const MotionUl = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.ul })), { ssr: false });
export const MotionLi = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.li })), { ssr: false });
export const MotionSection = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.section })), { ssr: false });
export const MotionArticle = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.article })), { ssr: false });
export const MotionAside = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.aside })), { ssr: false });
export const MotionHeader = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.header })), { ssr: false });
export const MotionFooter = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.footer })), { ssr: false });
export const MotionMain = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.main })), { ssr: false });
export const MotionForm = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.form })), { ssr: false });
export const MotionInput = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.input })), { ssr: false });
export const MotionTextarea = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.textarea })), { ssr: false });
export const MotionSelect = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.select })), { ssr: false });
export const MotionOption = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.option })), { ssr: false });
export const MotionLabel = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.label })), { ssr: false });
export const MotionFieldset = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.fieldset })), { ssr: false });
export const MotionLegend = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.legend })), { ssr: false });
export const MotionTable = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.table })), { ssr: false });
export const MotionThead = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.thead })), { ssr: false });
export const MotionTbody = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.tbody })), { ssr: false });
export const MotionTr = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.tr })), { ssr: false });
export const MotionTh = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.th })), { ssr: false });
export const MotionTd = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.td })), { ssr: false });
export const MotionCaption = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.caption })), { ssr: false });
export const MotionColgroup = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.colgroup })), { ssr: false });
export const MotionCol = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.col })), { ssr: false });
export const MotionTfoot = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.tfoot })), { ssr: false });
export const MotionAnimatePresence = dynamic(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })), { ssr: false });

// Common animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};
