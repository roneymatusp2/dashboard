import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Project {
  projectCode: string;
  projectName: string;
  startDate: string;
  targetCompletionDate: string;
  completionPercentage: number;
  currentPhase: string;
}

interface GanttChartProps {
  projects: Project[];
}

export function GanttChart({ projects }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  // St. Paul's Official Colors
  const COLORS = {
    rubyRed: '#820021',
    indigoBlue: '#001D31',
    britishGreen: '#002718',
    gold: '#B8860B',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#DEE2E6',
    darkGray: '#495057',
    textPrimary: '#212529',
    textSecondary: '#6C757D'
  };

  const phaseColors: Record<string, { primary: string; secondary: string }> = {
    'Inception': { primary: COLORS.indigoBlue, secondary: '#003152' },
    'Planning': { primary: '#004A73', secondary: '#005C8F' },
    'Design': { primary: COLORS.rubyRed, secondary: '#A5002A' },
    'Development': { primary: COLORS.britishGreen, secondary: '#004D32' },
    'Testing': { primary: COLORS.gold, secondary: '#9A7409' },
    'Deployment': { primary: '#005C8F', secondary: '#0073B1' },
    'Complete': { primary: COLORS.britishGreen, secondary: '#006B3F' }
  };

  // Project icons and accent colors
  const projectIcons: Record<string, string> = {
    '🤖': '📊', // AI/Tech projects
    '📚': '📚', // Education/Learning
    '🎯': '🎯', // Goals/Planning
    '📝': '📝', // Forms/Documents
    '💬': '💬', // Communication
    '🏫': '🏫', // School/Institution
    '🔧': '🔧', // Tools/Utilities
    '📰': '📰', // News/Media
  };

  const getProjectIcon = (projectName: string): string => {
    if (projectName.toLowerCase().includes('ai') || projectName.toLowerCase().includes('paulean')) return '🤖';
    if (projectName.toLowerCase().includes('grade') || projectName.toLowerCase().includes('assessment')) return '📊';
    if (projectName.toLowerCase().includes('mathematics') || projectName.toLowerCase().includes('ib')) return '📐';
    if (projectName.toLowerCase().includes('form') || projectName.toLowerCase().includes('portal')) return '🎓';
    if (projectName.toLowerCase().includes('feedback') || projectName.toLowerCase().includes('observation')) return '📝';
    if (projectName.toLowerCase().includes('career') || projectName.toLowerCase().includes('guidance')) return '🎯';
    if (projectName.toLowerCase().includes('news') || projectName.toLowerCase().includes('communication')) return '📰';
    if (projectName.toLowerCase().includes('learning') || projectName.toLowerCase().includes('institutional')) return '🏫';
    if (projectName.toLowerCase().includes('tool') || projectName.toLowerCase().includes('education')) return '🔧';
    return '📌';
  };

  const projectAccentColors: string[] = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEAA7', // Warm Yellow
    '#DFE6E9', // Cool Gray
    '#A29BFE', // Lavender
    '#FD79A8', // Pink
    '#FDCB6E', // Golden
    '#6C5CE7', // Purple
  ];

  useEffect(() => {
    if (!canvasRef.current || projects.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const containerWidth = rect.width;
      const minCanvasWidth = Math.max(1600, (dateRange / (30 * 24 * 60 * 60 * 1000)) * 150);
      const canvasWidth = Math.max(containerWidth, minCanvasWidth);
      
      canvas.width = canvasWidth * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${canvasWidth}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const width = canvas.getBoundingClientRect().width;
    const height = canvas.height / dpr;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate timeline
    const allDates = projects.flatMap(p => [
      new Date(p.startDate).getTime(),
      new Date(p.targetCompletionDate).getTime()
    ]);
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const dateRange = maxDate - minDate;

    const leftMargin = 340;
    const rightMargin = 120;
    const topMargin = 160;
    const minCanvasWidth = Math.max(1600, (dateRange / (30 * 24 * 60 * 60 * 1000)) * 150);
    const effectiveWidth = Math.max(width, minCanvasWidth);
    const chartWidth = effectiveWidth - leftMargin - rightMargin;
    const rowHeight = 120;

    const animate = () => {
      timeRef.current += 0.008;

      ctx.clearRect(0, 0, effectiveWidth, height);

      // Animated gradient background
      const bgGradient = ctx.createRadialGradient(effectiveWidth / 2, height / 3, 0, effectiveWidth / 2, height / 3, height);
      bgGradient.addColorStop(0, '#FAFBFC');
      bgGradient.addColorStop(0.5, '#F5F7FA');
      bgGradient.addColorStop(1, '#EEF1F5');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, effectiveWidth, height);

      // Subtle animated grid
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const offsetX = (timeRef.current * 10) % gridSize;
      const offsetY = (timeRef.current * 5) % gridSize;
      
      for (let x = -offsetX; x < effectiveWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(effectiveWidth, y);
        ctx.stroke();
      }
      ctx.restore();

      // Floating particles
      for (let i = 0; i < 12; i++) {
        const x = (effectiveWidth / 12) * i + Math.sin(timeRef.current * 0.8 + i * 0.5) * 40;
        const y = 60 + Math.sin(timeRef.current * 0.6 + i * 0.8) * 25;
        const radius = 2 + Math.sin(timeRef.current * 2 + i) * 0.8;
        
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        particleGradient.addColorStop(0, `${COLORS.gold}50`);
        particleGradient.addColorStop(1, `${COLORS.gold}00`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Premium header
      const headerHeight = topMargin;
      
      ctx.save();
      const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
      headerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      headerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.92)');
      ctx.fillStyle = headerGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 5;
      ctx.fillRect(0, 0, effectiveWidth, headerHeight);
      ctx.restore();

      // St. Paul's signature stripe (animated)
      const stripeHeight = 8;
      const stripeGradient = ctx.createLinearGradient(0, 0, effectiveWidth, 0);
      stripeGradient.addColorStop(0, COLORS.indigoBlue);
      stripeGradient.addColorStop(0.25, COLORS.rubyRed);
      stripeGradient.addColorStop(0.5, COLORS.gold);
      stripeGradient.addColorStop(0.75, COLORS.britishGreen);
      stripeGradient.addColorStop(1, COLORS.indigoBlue);
      ctx.fillStyle = stripeGradient;
      ctx.fillRect(0, 0, effectiveWidth, stripeHeight);

      // Animated shine on stripe
      const shinePos = (timeRef.current * 120) % (effectiveWidth + 200) - 100;
      const shineGradient = ctx.createLinearGradient(shinePos, 0, shinePos + 150, 0);
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shineGradient;
      ctx.fillRect(0, 0, effectiveWidth, stripeHeight);

      // Title
      ctx.fillStyle = COLORS.indigoBlue;
      ctx.font = `700 42px 'Playfair Display', serif`;
      ctx.fillText('Project Timeline Gantt', 50, 65);

      // Subtitle
      ctx.fillStyle = COLORS.textSecondary;
      ctx.font = `400 17px 'Inter', sans-serif`;
      ctx.fillText('Comprehensive Gantt visualisation with milestone tracking', 50, 100);

      // St. Paul's Shield Emblem
      const emblemX = effectiveWidth - 90;
      const emblemY = 25;
      const emblemSize = 70;
      
      ctx.save();
      const emblemGradient = ctx.createLinearGradient(emblemX, emblemY, emblemX + emblemSize, emblemY + emblemSize);
      emblemGradient.addColorStop(0, COLORS.indigoBlue);
      emblemGradient.addColorStop(0.4, COLORS.rubyRed);
      emblemGradient.addColorStop(0.7, COLORS.gold);
      emblemGradient.addColorStop(1, COLORS.britishGreen);
      
      ctx.fillStyle = emblemGradient;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;
      
      ctx.beginPath();
      ctx.moveTo(emblemX + emblemSize / 2, emblemY);
      ctx.lineTo(emblemX + emblemSize, emblemY + emblemSize * 0.25);
      ctx.lineTo(emblemX + emblemSize, emblemY + emblemSize * 0.7);
      ctx.lineTo(emblemX + emblemSize / 2, emblemY + emblemSize);
      ctx.lineTo(emblemX, emblemY + emblemSize * 0.7);
      ctx.lineTo(emblemX, emblemY + emblemSize * 0.25);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLORS.white;
      ctx.font = `700 22px 'Playfair Display', serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SPS', emblemX + emblemSize / 2, emblemY + emblemSize / 2 + 8);
      ctx.textAlign = 'left';
      ctx.restore();

      // Timeline grid - Elegant vertical month display
      const monthsToShow = Math.ceil(dateRange / (30 * 24 * 60 * 60 * 1000)) + 2;
      const today = new Date();
      
      for (let i = 0; i <= monthsToShow; i++) {
        const monthDate = new Date(minDate + (dateRange * i / monthsToShow));
        const x = leftMargin + (chartWidth * i / monthsToShow);
        
        // Format month and year
        const monthName = monthDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
        const year = monthDate.toLocaleDateString('en-GB', { year: 'numeric' });
        
        // Vertical month label with refined design
        ctx.save();
        ctx.translate(x, topMargin - 35);
        
        // Month name (vertical)
        ctx.font = `700 13px 'Inter', sans-serif`;
        ctx.fillStyle = COLORS.indigoBlue;
        ctx.textAlign = 'center';
        
        for (let j = 0; j < monthName.length; j++) {
          ctx.fillText(monthName[j], 0, j * 14);
        }
        
        // Year below month (horizontal)
        ctx.fillStyle = COLORS.textSecondary;
        ctx.font = `500 10px 'Inter', sans-serif`;
        ctx.fillText(year, 0, monthName.length * 14 + 15);
        
        ctx.restore();
        
        // Grid lines - subtle and elegant
        const isEdge = i === 0 || i === monthsToShow;
        ctx.strokeStyle = isEdge ? 'rgba(0, 29, 49, 0.15)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = isEdge ? 2 : 1;
        ctx.setLineDash(isEdge ? [] : [8, 4]);
        ctx.beginPath();
        ctx.moveTo(x, topMargin + 10);
        ctx.lineTo(x, height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Animated TODAY marker
      const todayX = leftMargin + ((today.getTime() - minDate) / dateRange) * chartWidth;
      if (todayX >= leftMargin && todayX <= leftMargin + chartWidth) {
        ctx.save();
        
        const pulseAlpha = 0.4 + Math.sin(timeRef.current * 4) * 0.15;
        ctx.shadowColor = `rgba(130, 0, 33, ${pulseAlpha})`;
        ctx.shadowBlur = 25;
        
        ctx.strokeStyle = COLORS.rubyRed;
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 6]);
        ctx.beginPath();
        ctx.moveTo(todayX, topMargin + 15);
        ctx.lineTo(todayX, height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // TODAY badge
        const badgeWidth = 90;
        const badgeHeight = 36;
        const badgeX = todayX - badgeWidth / 2;
        const badgeY = topMargin - 65;
        
        ctx.fillStyle = COLORS.rubyRed;
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 5;
        
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.white;
        ctx.font = `700 15px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('TODAY', todayX, badgeY + 23);
        ctx.restore();
        ctx.textAlign = 'left';
      }

      // Draw projects
      projects.forEach((project, index) => {
        const y = topMargin + (index * rowHeight) + 40;
        const isHovered = hoveredProject === index;
        const accentColor = projectAccentColors[index % projectAccentColors.length];
        const projectIcon = getProjectIcon(project.projectName);
        
        // Row background with subtle accent
        if (index % 2 === 0 || isHovered) {
          const gradient = ctx.createLinearGradient(0, y - 20, effectiveWidth, y - 20);
          gradient.addColorStop(0, isHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.7)');
          gradient.addColorStop(0.05, isHovered ? `${accentColor}08` : `${accentColor}05`);
          gradient.addColorStop(1, isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, y - 20, effectiveWidth, rowHeight);
        }

        // Accent stripe on the left
        ctx.fillStyle = accentColor;
        ctx.fillRect(0, y - 20, 4, rowHeight);

        // Project info panel
        const panelX = 35;
        const panelY = y - 10;
        const panelWidth = leftMargin - 60;
        const panelHeight = 90;
        
        if (isHovered) {
          ctx.save();
          const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY);
          panelGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          panelGradient.addColorStop(1, `${accentColor}0A`);
          ctx.fillStyle = panelGradient;
          ctx.shadowColor = `${accentColor}40`;
          ctx.shadowBlur = 25;
          ctx.shadowOffsetY = 8;
          ctx.beginPath();
          ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 12);
          ctx.fill();
          ctx.restore();
        }

        // Icon circle
        const iconX = panelX + 20;
        const iconY = y + 15;
        const iconRadius = 28;
        
        ctx.save();
        // Icon background with gradient
        const iconGradient = ctx.createLinearGradient(iconX - iconRadius, iconY - iconRadius, iconX + iconRadius, iconY + iconRadius);
        iconGradient.addColorStop(0, accentColor);
        iconGradient.addColorStop(1, `${accentColor}CC`);
        ctx.fillStyle = iconGradient;
        ctx.shadowColor = `${accentColor}60`;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Icon emoji
        ctx.font = `28px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLORS.white;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 3;
        ctx.fillText(projectIcon, iconX, iconY + 1);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        // Project name
        ctx.fillStyle = COLORS.textPrimary;
        ctx.font = `600 17px 'Inter', sans-serif`;
        const nameY = y + 8;
        
        let projectName = project.projectName;
        const maxWidth = panelWidth - 90;
        while (ctx.measureText(projectName).width > maxWidth && projectName.length > 0) {
          projectName = projectName.slice(0, -1);
        }
        if (projectName !== project.projectName) projectName += '...';
        
        ctx.fillText(projectName, panelX + 65, nameY);
        
        // Project code badge
        const codeY = nameY + 22;
        ctx.font = `500 12px 'JetBrains Mono', monospace`;
        const codeWidth = ctx.measureText(project.projectCode).width + 20;
        
        ctx.save();
        ctx.fillStyle = `${accentColor}15`;
        ctx.strokeStyle = `${accentColor}60`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(panelX + 65, codeY, codeWidth, 24, 6);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = accentColor;
        ctx.fillText(project.projectCode, panelX + 75, codeY + 16);
        ctx.restore();

        // Timeline bar
        const startDate = new Date(project.startDate).getTime();
        const endDate = new Date(project.targetCompletionDate).getTime();
        const barStartX = leftMargin + ((startDate - minDate) / dateRange) * chartWidth;
        const barWidth = Math.max(((endDate - startDate) / dateRange) * chartWidth, 60);
        const barHeight = 52;
        const barY = y;
        
        // Bar container
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = isHovered ? 30 : 18;
        ctx.shadowOffsetY = isHovered ? 10 : 5;
        
        ctx.fillStyle = COLORS.white;
        ctx.strokeStyle = COLORS.mediumGray;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(barStartX, barY, barWidth, barHeight, 14);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Progress bar with mixed accent and phase colors
        const progressWidth = Math.max(barWidth * (project.completionPercentage / 100), 28);
        const phaseColor = phaseColors[project.currentPhase] || phaseColors['Planning'];
        
        if (progressWidth > 0) {
          ctx.save();
          
          // Create gradient mixing accent color with phase color
          const gradient = ctx.createLinearGradient(barStartX, barY, barStartX + progressWidth, barY + barHeight);
          gradient.addColorStop(0, accentColor);
          gradient.addColorStop(0.5, phaseColor.primary);
          gradient.addColorStop(1, phaseColor.secondary);
          
          ctx.fillStyle = gradient;
          ctx.shadowColor = `${accentColor}60`;
          ctx.shadowBlur = isHovered ? 30 : 20;
          ctx.shadowOffsetY = isHovered ? 8 : 4;
          
          ctx.beginPath();
          ctx.roundRect(barStartX, barY, progressWidth, barHeight, 14);
          ctx.fill();
          
          // Shine effect
          const shine = ctx.createLinearGradient(barStartX, barY, barStartX, barY + barHeight / 2.2);
          shine.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = shine;
          ctx.fill();
          
          // Animated shimmer effect
          const shimmerX = barStartX + (progressWidth * ((timeRef.current * 0.3) % 1));
          const shimmer = ctx.createLinearGradient(shimmerX - 30, barY, shimmerX + 30, barY);
          shimmer.addColorStop(0, 'rgba(255, 255, 255, 0)');
          shimmer.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          shimmer.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = shimmer;
          ctx.fill();
          
          ctx.restore();
        }

        // Percentage text
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 5;
        ctx.font = `700 17px 'Inter', sans-serif`;
        
        const percentText = `${project.completionPercentage.toFixed(0)}%`;
        const textMetrics = ctx.measureText(percentText);
        
        if (project.completionPercentage > 25 && progressWidth > 80) {
          ctx.fillStyle = COLORS.white;
          ctx.fillText(percentText, barStartX + progressWidth / 2 - textMetrics.width / 2, barY + barHeight / 2 + 7);
        } else {
          ctx.fillStyle = COLORS.textPrimary;
          ctx.fillText(percentText, barStartX + barWidth / 2 - textMetrics.width / 2, barY + barHeight / 2 + 7);
        }
        ctx.restore();

        // Phase badge with accent color
        const badgeX = barStartX + barWidth + 25;
        const badgeY = barY + 12;
        
        ctx.save();
        ctx.font = `600 13px 'Inter', sans-serif`;
        const badgeText = project.currentPhase;
        const badgeMetrics = ctx.measureText(badgeText);
        const badgeWidth = badgeMetrics.width + 28;
        const badgeHeight = 30;
        
        // Gradient badge background
        const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
        badgeGradient.addColorStop(0, phaseColor.primary);
        badgeGradient.addColorStop(1, phaseColor.secondary);
        
        ctx.fillStyle = badgeGradient;
        ctx.shadowColor = `${accentColor}50`;
        ctx.shadowBlur = 18;
        
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 8);
        ctx.fill();
        
        // Border with accent color
        ctx.strokeStyle = `${accentColor}40`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.white;
        ctx.fillText(badgeText, badgeX + 14, badgeY + 20);
        ctx.restore();
      });

      // Footer
      ctx.fillStyle = COLORS.textSecondary;
      ctx.font = `400 13px 'Inter', sans-serif`;
      ctx.fillText('St. Paul\'s School • Educational Technology Command Center', 50, height - 15);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Mr Nascimento • AI Solutions Developer`, effectiveWidth - 50, height - 15);
      ctx.textAlign = 'left';

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const topMargin = 160 + 40;
      const rowHeight = 120;
      
      const hoveredIndex = Math.floor((mouseY - topMargin) / rowHeight);
      if (hoveredIndex >= 0 && hoveredIndex < projects.length) {
        setHoveredProject(hoveredIndex);
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredProject(null);
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.style.cursor = 'default';

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
    };
  }, [projects, hoveredProject]);

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      <Card className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-gray-300 hover:shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 pointer-events-none" />
        
        {/* Fullscreen Control */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFullscreen}
          className="absolute bottom-8 right-8 z-10 bg-gradient-to-r from-[#001D31] to-[#820021] text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all group"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          </span>
        </motion.button>

        <div 
          className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500" 
          ref={scrollContainerRef}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9CA3AF #F3F4F6'
          }}
        >
          <canvas
            ref={canvasRef}
            className="relative"
            style={{ 
              minHeight: isFullscreen ? '100vh' : '800px',
              height: isFullscreen ? '100vh' : '800px',
              display: 'block'
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
