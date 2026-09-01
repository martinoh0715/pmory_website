
        // ========== HOMEPAGE V2 UTILITIES & COMPONENTS ==========

        const useTypingEffect = (words, speed = 80, pause = 2000) => {
            const [text, setText] = useState('');
            const [wordIndex, setWordIndex] = useState(0);
            const [charIndex, setCharIndex] = useState(0);
            const [deleting, setDeleting] = useState(false);

            useEffect(() => {
                const current = words[wordIndex % words.length];
                const timeout = setTimeout(() => {
                    if (!deleting) {
                        setText(current.slice(0, charIndex + 1));
                        if (charIndex + 1 === current.length) {
                            setTimeout(() => setDeleting(true), pause);
                        } else {
                            setCharIndex(charIndex + 1);
                        }
                    } else {
                        setText(current.slice(0, charIndex - 1));
                        if (charIndex === 0) {
                            setDeleting(false);
                            setWordIndex((wordIndex + 1) % words.length);
                        } else {
                            setCharIndex(charIndex - 1);
                        }
                    }
                }, deleting ? speed / 2 : speed);
                return () => clearTimeout(timeout);
            }, [charIndex, deleting, wordIndex, words, speed, pause]);

            return text;
        };

        const useCountUp = (target, duration = 1500, start = false) => {
            const [value, setValue] = useState(0);
            useEffect(() => {
                if (!start) return;
                let startTime = null;
                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    setValue(Math.floor(progress * target));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }, [target, duration, start]);
            return value;
        };

        const useInView = (threshold = 0.2) => {
            const ref = React.useRef(null);
            const [visible, setVisible] = useState(false);
            useEffect(() => {
                const el = ref.current;
                if (!el) return;
                const obs = new IntersectionObserver(([e]) => {
                    if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
                }, { threshold });
                obs.observe(el);
                return () => obs.disconnect();
            }, [threshold]);
            return [ref, visible];
        };

        const fireConfetti = () => {
            const canvas = document.getElementById('confetti-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const colors = ['#2563eb', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6'];
            const particles = Array.from({ length: 120 }, () => ({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 1) * 14,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                life: 1
            }));
            let frame = 0;
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.012;
                    ctx.globalAlpha = Math.max(p.life, 0);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
                });
                frame++;
                if (frame < 90) requestAnimationFrame(animate);
                else ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
            animate();
        };

        const MagneticButton = ({ children, className = '', onClick, secondary }) => {
            const btnRef = React.useRef(null);
            const handleMove = (e) => {
                const btn = btnRef.current;
                if (!btn) return;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            };
            const handleLeave = () => {
                if (btnRef.current) btnRef.current.style.transform = '';
            };
            return (
                <button
                    ref={btnRef}
                    className={`magnetic-btn ${secondary ? 'secondary' : ''} ${className}`}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    onClick={onClick}
                >{children}</button>
            );
        };

        const HeroSection = ({ setCurrentPage }) => {
            const typed = useTypingEffect(['Prioritize.', 'Ship.', 'Learn.', 'Lead.', 'Iterate.'], 90, 1800);
            const heroRef = React.useRef(null);
            const [demoReply, setDemoReply] = useState(null);

            const demoResponses = {
                'How do I break into PM?': 'Start with customer empathy, learn to prioritize ruthlessly, and ship small projects that show impact. PMory has frameworks to guide you!',
                'What is RICE scoring?': 'RICE = (Reach × Impact × Confidence) / Effort. It helps you compare features objectively. Try our calculator below!',
                'Prep me for interviews': 'Practice product sense, estimation, and behavioral questions. Head to our AI Assistant for mock interviews tailored to Emory students.'
            };

            useEffect(() => {
                const hero = heroRef.current;
                if (!hero) return;
                const move = (e) => {
                    const rect = hero.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    hero.style.setProperty('--spot-x', x + '%');
                    hero.style.setProperty('--spot-y', y + '%');
                };
                hero.addEventListener('mousemove', move);
                return () => hero.removeEventListener('mousemove', move);
            }, []);

            const handleCTA = () => {
                fireConfetti();
                setCurrentPage('ai-assistant');
            };

            return (
                <section className="hero-v2 container" ref={heroRef}>
                    <div className="hero-v2-left">
                        <span className="hero-eyebrow">Emory Product Management</span>
                        <h1>PMory</h1>
                        <div className="hero-typing">{typed}<span className="hero-typing-cursor" /></div>
                        <p className="hero-v2-desc">Your interactive hub for PM fundamentals, frameworks, and career growth — built by Emory students, for Emory students.</p>
                        <div className="hero-actions">
                            <MagneticButton onClick={handleCTA}>Start Your PM Journey</MagneticButton>
                            <MagneticButton secondary onClick={() => setCurrentPage('what-is-pm')}>Explore PM Basics</MagneticButton>
                        </div>
                    </div>
                    <div className="hero-v2-right">
                        <div className="hero-ai-demo">
                            <div className="hero-ai-header">✨ PMory AI — try a question</div>
                            <div className="hero-ai-body">
                                {demoReply ? (
                                    <div className="hero-ai-bubble">{demoReply}</div>
                                ) : (
                                    <div className="hero-ai-bubble">Hey! I'm your PM career copilot. Tap a question to see how I can help.</div>
                                )}
                                <div className="hero-ai-chips">
                                    {Object.keys(demoResponses).map(q => (
                                        <button key={q} className="hero-ai-chip" onClick={() => setDemoReply(demoResponses[q])}>{q}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        };

        const StatsSection = () => {
            const [ref, visible] = useInView(0.3);
            const students = useCountUp(500, 1500, visible);
            const frameworks = useCountUp(12, 1200, visible);
            const resources = useCountUp(40, 1300, visible);
            const partners = useCountUp(8, 1100, visible);
            return (
                <section className="stats-row container" ref={ref}>
                    <div className="stat-card-v2"><div className="stat-number">{students}+</div><div className="stat-label">Students Reached</div></div>
                    <div className="stat-card-v2"><div className="stat-number">{frameworks}</div><div className="stat-label">PM Frameworks</div></div>
                    <div className="stat-card-v2"><div className="stat-number">{resources}+</div><div className="stat-label">Learning Resources</div></div>
                    <div className="stat-card-v2"><div className="stat-number">{partners}</div><div className="stat-label">Campus Partners</div></div>
                </section>
            );
        };

        const BentoGrid = ({ setCurrentPage }) => (
            <section className="bento-section container">
                <div className="section-eyebrow">Explore PMory</div>
                <h2 className="section-title-v2">Everything you need to become a PM</h2>
                <p className="section-subtitle-v2">Tap any tile to dive in — fundamentals, skills, AI guidance, and job alerts.</p>
                <div className="bento-grid">
                    <div className="bento-card span-2 tall" onClick={() => setCurrentPage('what-is-pm')}>
                        <div className="bento-card-bg" style={{backgroundImage: 'url(./images/pm-fundamentals.jpg)'}} />
                        <span className="bento-icon">📚</span>
                        <h4>What is PM?</h4>
                        <p>Fundamentals, responsibilities & mindmaps</p>
                    </div>
                    <div className="bento-card" onClick={() => setCurrentPage('skillsets')}>
                        <div className="bento-card-bg" style={{backgroundImage: 'url(./images/pm-skills.jpg)'}} />
                        <span className="bento-icon">🎯</span>
                        <h4>Skillsets</h4>
                        <p>Hard & soft skills</p>
                    </div>
                    <div className="bento-card" onClick={() => setCurrentPage('ai-assistant')}>
                        <div className="bento-card-bg" style={{backgroundImage: 'url(./images/ai-assistant.jpg)'}} />
                        <span className="bento-icon">🤖</span>
                        <h4>AI Assistant</h4>
                        <p>Interview prep & guidance</p>
                    </div>
                    <div className="bento-card" onClick={() => setCurrentPage('job-alert')}>
                        <div className="bento-card-bg" style={{backgroundImage: 'url(./images/job-opportunities.jpg)'}} />
                        <span className="bento-icon">💼</span>
                        <h4>Job Alert</h4>
                        <p>Latest PM openings</p>
                    </div>
                    <div className="bento-card span-2" onClick={() => document.getElementById('rice-section')?.scrollIntoView({behavior: 'smooth'})}>
                        <span className="bento-icon">🧮</span>
                        <h4>RICE Calculator</h4>
                        <p>Score and prioritize features like a real PM</p>
                    </div>
                </div>
            </section>
        );

        const PrioritizationBoard = () => {
            const initial = {
                now: ['Fix onboarding drop-off', 'Launch MVP dashboard'],
                next: ['Add push notifications', 'User research sprint'],
                later: ['Dark mode themes', 'Social sharing', 'Gamification']
            };
            const [columns, setColumns] = useState(initial);
            const [dragItem, setDragItem] = useState(null);

            const moveItem = (fromCol, item, toCol) => {
                if (fromCol === toCol) return;
                setColumns(prev => ({
                    ...prev,
                    [fromCol]: prev[fromCol].filter(i => i !== item),
                    [toCol]: [...prev[toCol], item]
                }));
            };

            const Column = ({ id, title, cls }) => (
                <div className={`prio-column ${cls}`}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => { if (dragItem) { moveItem(dragItem.col, dragItem.item, id); setDragItem(null); } }}>
                    <h4>{title}</h4>
                    {columns[id].map(item => (
                        <div key={item} className="prio-item" draggable
                            onDragStart={() => setDragItem({ col: id, item })}
                            onClick={() => {
                                const order = ['now', 'next', 'later'];
                                const next = order[(order.indexOf(id) + 1) % 3];
                                moveItem(id, item, next);
                            }}
                        >{item}</div>
                    ))}
                </div>
            );

            return (
                <section className="playground-section container">
                    <h3>📋 Prioritization Board</h3>
                    <p className="hint">Drag cards between columns — or tap to cycle Now → Next → Later</p>
                    <div className="prio-board">
                        <Column id="now" title="🔴 Now" cls="now" />
                        <Column id="next" title="🟡 Next" cls="next" />
                        <Column id="later" title="🔵 Later" cls="later" />
                    </div>
                </section>
            );
        };

        const RICECalculator = () => {
            const [reach, setReach] = useState(50);
            const [impact, setImpact] = useState(3);
            const [confidence, setConfidence] = useState(80);
            const [effort, setEffort] = useState(5);
            const score = ((reach * impact * (confidence / 100)) / effort).toFixed(1);
            const verdict = score >= 50 ? '🚀 Ship it!' : score >= 20 ? '⚖️ Worth discussing' : '🛑 Needs more data';

            return (
                <section className="playground-section container" id="rice-section">
                    <h3>🧮 RICE Score Calculator</h3>
                    <p className="hint">Adjust the sliders to see if your feature makes the cut</p>
                    <div className="rice-grid">
                        <div className="rice-sliders">
                            <label><span>Reach (users/quarter)</span><span>{reach}</span></label>
                            <input type="range" min="1" max="100" value={reach} onChange={e => setReach(+e.target.value)} />
                            <label><span>Impact (0–3)</span><span>{impact}</span></label>
                            <input type="range" min="0" max="3" step="0.5" value={impact} onChange={e => setImpact(+e.target.value)} />
                            <label><span>Confidence (%)</span><span>{confidence}%</span></label>
                            <input type="range" min="10" max="100" value={confidence} onChange={e => setConfidence(+e.target.value)} />
                            <label><span>Effort (person-months)</span><span>{effort}</span></label>
                            <input type="range" min="1" max="20" value={effort} onChange={e => setEffort(+e.target.value)} />
                        </div>
                        <div className="rice-result">
                            <div style={{fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.5rem'}}>Your RICE Score</div>
                            <div className="rice-score">{score}</div>
                            <div className="rice-verdict">{verdict}</div>
                        </div>
                    </div>
                </section>
            );
        };

        const StickyNoteWall = () => {
            const [notes, setNotes] = useState([
                { text: 'Talk to 5 users this week', color: 'yellow' },
                { text: 'Ship the MVP!', color: 'pink' },
                { text: 'What problem are we solving?', color: 'blue' }
            ]);
            const [input, setInput] = useState('');
            const colors = ['yellow', 'pink', 'blue', 'green'];

            const addNote = () => {
                if (!input.trim()) return;
                setNotes(prev => [...prev, { text: input.trim(), color: colors[prev.length % colors.length] }]);
                setInput('');
            };

            return (
                <section className="playground-section container">
                    <h3>📝 Brainstorm Wall</h3>
                    <p className="hint">Add your product ideas — just like a real PM workshop</p>
                    <div className="sticky-wall">
                        {notes.map((n, i) => (
                            <div key={i} className={`sticky-note ${n.color}`}>{n.text}</div>
                        ))}
                    </div>
                    <div className="sticky-input-row">
                        <input className="sticky-input" placeholder="Add an idea…" value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addNote()} />
                        <MagneticButton onClick={addNote}>Add Note</MagneticButton>
                    </div>
                </section>
            );
        };

        const RoadmapTimeline = () => {
            const [ref, visible] = useInView(0.3);
            const steps = [
                { title: 'Discover', desc: 'Research users & market' },
                { title: 'Define', desc: 'Shape the problem' },
                { title: 'Design', desc: 'Prototype solutions' },
                { title: 'Deliver', desc: 'Ship & measure' },
                { title: 'Iterate', desc: 'Learn & improve' }
            ];
            return (
                <section className="playground-section container" ref={ref}>
                    <h3>🗺️ Product Roadmap</h3>
                    <p className="hint">The journey every great product takes</p>
                    <div className="roadmap">
                        <div className="roadmap-progress" style={{ width: visible ? '90%' : '0%' }} />
                        {steps.map((s, i) => (
                            <div key={s.title} className={`roadmap-item ${visible ? 'visible' : ''}`}
                                style={{ transitionDelay: `${i * 0.15}s` }}>
                                <div className="roadmap-dot" />
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            );
        };

        const ShipOrKill = () => {
            const features = [
                { id: 1, name: 'AI Resume Reviewer', desc: 'Auto-score PM resumes with feedback' },
                { id: 2, name: 'Campus PM Map', desc: 'Find PM clubs & events at Emory' },
                { id: 3, name: 'Daily PM Quiz', desc: '5-minute product sense challenge' },
                { id: 4, name: 'Mentor Matching', desc: 'Connect with alumni PMs' }
            ];
            const [votes, setVotes] = useState({});

            const handleVote = (id, type) => {
                setVotes(prev => ({ ...prev, [id]: type }));
            };

            const shipCount = Object.values(votes).filter(v => v === 'ship').length;
            const killCount = Object.values(votes).filter(v => v === 'kill').length;

            return (
                <section className="playground-section container">
                    <h3>🚢 Ship or Kill?</h3>
                    <p className="hint">Vote on mock feature ideas — would you ship them?</p>
                    <div className="ship-grid">
                        {features.map(f => (
                            <div key={f.id} className={`ship-card ${votes[f.id] ? 'voted-' + votes[f.id] : ''}`}>
                                <h4>{f.name}</h4>
                                <p>{f.desc}</p>
                                {!votes[f.id] && (
                                    <div className="ship-actions">
                                        <button className="ship-btn ship" onClick={() => handleVote(f.id, 'ship')}>🚢 Ship</button>
                                        <button className="ship-btn kill" onClick={() => handleVote(f.id, 'kill')}>💀 Kill</button>
                                    </div>
                                )}
                                {votes[f.id] && <div style={{fontWeight: 600, color: votes[f.id] === 'ship' ? '#166534' : '#991b1b'}}>
                                    You voted: {votes[f.id] === 'ship' ? '🚢 Ship!' : '💀 Killed'}
                                </div>}
                            </div>
                        ))}
                    </div>
                    {Object.keys(votes).length > 0 && (
                        <div className="ship-score">Community pulse: {shipCount} shipped, {killCount} killed</div>
                    )}
                </section>
            );
        };

        const FrameworkCarousel = () => {
            const frameworks = [
                { id: 'rice', icon: '🧮', name: 'RICE', desc: 'Prioritize features by Reach, Impact, Confidence, and Effort.', detail: 'Score = (R × I × C) / E. Use when comparing multiple features with limited engineering bandwidth.' },
                { id: 'jtbd', icon: '🎯', name: 'Jobs to Be Done', desc: 'Understand what job customers hire your product to do.', detail: 'Focus on the progress users want to make, not demographics. "When I ___, I want to ___, so I can ___."' },
                { id: 'okr', icon: '📊', name: 'OKRs', desc: 'Set Objectives and Key Results to align teams.', detail: 'Objective = qualitative goal. Key Results = 3-5 measurable outcomes. Review quarterly.' },
                { id: 'moscow', icon: '🔺', name: 'MoSCoW', desc: 'Categorize features as Must, Should, Could, Won\'t.', detail: 'Great for scope negotiation with stakeholders. Must-haves are non-negotiable for launch.' },
                { id: 'kano', icon: '😊', name: 'Kano Model', desc: 'Classify features by customer satisfaction impact.', detail: 'Basic needs, performance needs, and delighters. Not all features are created equal.' }
            ];
            const [active, setActive] = useState('rice');
            const activeFw = frameworks.find(f => f.id === active);

            return (
                <section className="playground-section container">
                    <h3>🔄 PM Frameworks</h3>
                    <p className="hint">Scroll through essential frameworks every PM should know</p>
                    <div className="framework-carousel">
                        {frameworks.map(f => (
                            <div key={f.id} className={`framework-card ${active === f.id ? 'active' : ''}`}
                                onClick={() => setActive(f.id)}>
                                <div className="fw-icon">{f.icon}</div>
                                <h4>{f.name}</h4>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                    {activeFw && (
                        <div className="framework-detail">
                            <strong>{activeFw.icon} {activeFw.name}:</strong> {activeFw.detail}
                        </div>
                    )}
                </section>
            );
        };

        const HomePage = ({ setCurrentPage }) => (
            <div className="main page-transition">
                <canvas id="confetti-canvas" />
                <HeroSection setCurrentPage={setCurrentPage} />
                <StatsSection />
                <BentoGrid setCurrentPage={setCurrentPage} />
                <PrioritizationBoard />
                <RICECalculator />
                <StickyNoteWall />
                <RoadmapTimeline />
                <ShipOrKill />
                <FrameworkCarousel />
            </div>
        );
