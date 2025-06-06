
# HealBit Knowledge Base

## Product Requirements Document (PRD)

### Objectives
- **Voice journaling**: Enable users to record their thoughts and feelings through voice
- **Emotion tracking**: Monitor emotional patterns and healing progress
- **Healing visualization**: Visual representation of the user's recovery journey

### Core Features
1. **Daily prompts**: Curated questions to guide reflection and journaling
2. **Voice recording**: Simple, intuitive voice capture for journal entries
3. **Sentiment-based healing tracker**: Progress visualization based on emotional analysis
4. **Evolving avatar**: Abstract representation that changes based on mood and progress

### Technical Stack
- **Frontend**: Vite/React TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Storage**: IndexedDB for local data persistence
- **Recording**: Web Audio API

### Security & Privacy
- 100% client-side storage - no data leaves the device
- Easy data deletion through Settings
- No authentication required for MVP
- Complete user control over personal data

## User Flow
```
Home → Daily Prompt → Voice Recording → Affirmation → Healing Tracker → (Optional Profile/Settings)
```

### Detailed Flow
1. **Home**: Welcome screen with today's mood check-in
2. **Prompt**: Daily reflection question tailored to healing journey
3. **Recording**: Voice capture with visual feedback
4. **Affirmation**: Positive reinforcement after recording
5. **Tracker**: Visual progress and mood patterns
6. **Profile/Settings**: Data management and customization

## Design System

### Colors
- **Primary**: #6D83F2 (Calming blue)
- **Accent**: #FFBB9C (Warm peach)
- **Supporting palette**: Soft pastels for emotional states
- **Neutrals**: Warm grays and whites

### Typography
- **Primary font**: Inter
- **Hierarchy**: Clear, readable, accessible
- **Tone**: Gentle, supportive, non-judgmental

### Mood & Personality
- **Soothing**: Calming visuals and interactions
- **Non-judgmental**: Neutral, accepting language
- **Encouraging**: Gentle motivation without pressure

### Avatar Design
- **Style**: Abstract human form
- **Responsiveness**: Colors change based on detected mood
- **Evolution**: Grows/heals over time with consistent use

## Technical Guidelines

### Architecture
- Mobile-first responsive design
- Session persistence via localStorage
- Component-based architecture with React
- State management with React hooks

### Data Management
- IndexedDB for journal entries and user data
- localStorage for session and preference data
- No external API calls for core functionality
- Data export/import capabilities

### Performance
- Lazy loading for components
- Optimized audio handling
- Efficient local storage usage

## Brand Guidelines

### Tone of Voice
- **Kind**: Warm, caring, compassionate
- **Affirming**: Validating user experiences and emotions
- **Passive encouragement**: Gentle motivation without pressure

### Language Principles
- Use "you" statements that feel personal but not intrusive
- Avoid clinical or medical terminology
- Focus on growth and healing rather than "fixing"
- Acknowledge that healing isn't linear

### Content Strategy
- Daily prompts that encourage self-reflection
- Affirmations that feel genuine and personal
- Progress language that celebrates small wins
- Educational content about emotional processing

## Constraints & Requirements

### MVP Constraints
- Zero server calls - completely offline
- All data must be purgable via Settings
- No user authentication required
- Works in modern web browsers

### Privacy Requirements
- Local-only data storage
- Clear data deletion options
- No tracking or analytics
- Transparent about data handling

### Accessibility
- WCAG 2.1 AA compliance
- Voice-friendly interface
- High contrast options
- Screen reader support
