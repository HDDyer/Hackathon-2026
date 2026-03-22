import React from "react";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function hexToCssColor(hex) {
    if (!hex) return "#3b82f6";

    const value = String(hex).trim();

    if (value.startsWith("0x")) {
        return `#${value.slice(2)}`;
    }

    if (value.startsWith("#")) {
        return value;
    }

    // fallback for invalid or named colors
    return "#3b82f6";
}

export default function HeroAvatar({ hero, size = 120 }) {
    const color = hexToCssColor(hero.favoriteColor);
    const speed = clamp(Number(hero.speed || 0), 0, 100);
    const strength = clamp(Number(hero.strength || 0), 0, 100);
    const intelligence = clamp(Number(hero.intelligence || 0), 0, 100);
    const magic = clamp(Number(hero.magic || 0), 0, 100);
    const defense = clamp(Number(hero.defense || 0), 0, 100);
    // const evilness = clamp(Number(hero.evilness || 0), 0, 100);

    const totalPower = speed + strength + intelligence + magic + defense;
    let rarity = "R";
    if (totalPower > 350) rarity = "SSR";
    else if (totalPower > 250) rarity = "SR";
    else rarity = "R";

    const rarityColor =
        rarity === "SSR" ? "#facc15" :
            rarity === "SR" ? "#a855f7" :
                "#64748b";

    const cx = size / 2;
    const cy = size / 2;

    // const glowOpacity = hero.isVillain ? 0.35 : 0.18;
    const gradientId = `bg-${hero.name.replace(/\s/g, "")}`;
    // Deterministic random generator based on hero name
    const seed = hero.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pick = (arr, i) => arr[Math.abs(seed + i) % arr.length];

    const faceType = pick(["circle", "rounded", "hex"], 1);
    const eyeStyle = pick(["dot", "glow", "sharp"], 2);
    const auraType = pick(["none", "ring", "pulse"], 3);

    return (
        <div
            className={`hero-avatar-card rarity-${rarity} summon-animation`}
            style={{ transition: "transform 0.3s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
            <div
                className="card-frame"
                style={{
                    border: `2px solid ${rarityColor}`,
                    boxShadow:
                        rarity === "SSR"
                            ? `0 0 25px ${rarityColor}`
                            : rarity === "SR"
                                ? `0 0 15px ${rarityColor}`
                                : "none",
                }}
            >
                <div className="rarity-badge">
                    {rarity}
                </div>
                <div className="rarity-stars" style={{ color: rarityColor }}>
                    {Array.from({ length: rarity === "SSR" ? 5 : rarity === "SR" ? 4 : 3 }).map((_, i) => (
                        <span key={i} style={{ textShadow: `0 0 6px ${rarityColor}` }}>★</span>
                    ))}
                </div>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hero-avatar-svg">
                    <defs>
                        <radialGradient
                            id={gradientId}
                            cx={cx}
                            cy={cy}
                            r={size * 0.6}
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor={color} stopOpacity="1" />
                            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                        </radialGradient>
                        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>

                    {/* Background */}
                    <rect
                        x="0"
                        y="0"
                        width={size}
                        height={size}
                        rx="20"
                        fill={`url(#${gradientId})`}
                    />

                    {/* Animated glow */}
                    {rarity === "SSR" && (
                        <circle
                            cx={cx}
                            cy={cy}
                            r={size / 2 - 6}
                            fill="none"
                            stroke="gold"
                            strokeWidth="2"
                            opacity="0.6"
                        >
                            <animate
                                attributeName="opacity"
                                values="0.4;0.8;0.4"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    )}

                    {/* Aura */}
                    {auraType === "ring" && (
                        <circle cx={cx} cy={cy} r={size / 2 - 8} stroke="rgba(255,255,255,0.2)" fill="none" />
                    )}
                    {auraType === "pulse" && (
                        <circle cx={cx} cy={cy} r={size / 2 - 10} fill="rgba(255,255,255,0.08)" />
                    )}

                    {/* Face */}
                    {faceType === "circle" && (
                        <circle cx={cx} cy={cy} r="22" fill="rgba(255,255,255,0.15)" />
                    )}
                    {faceType === "rounded" && (
                        <rect x={cx - 20} y={cy - 20} width="40" height="40" rx="12" fill="rgba(255,255,255,0.15)" />
                    )}
                    {faceType === "hex" && (
                        <polygon
                            points={`${cx},${cy - 24} ${cx + 20},${cy - 12} ${cx + 20},${cy + 12} ${cx},${cy + 24} ${cx - 20},${cy + 12} ${cx - 20},${cy - 12}`}
                            fill="rgba(255,255,255,0.15)"
                        />
                    )}

                    {/* Eyes */}
                    {eyeStyle === "dot" && (
                        <>
                            <circle cx={cx - 8} cy={cy - 6} r="3" fill="#fff" />
                            <circle cx={cx + 8} cy={cy - 6} r="3" fill="#fff" />
                        </>
                    )}
                    {eyeStyle === "glow" && (
                        <>
                            <circle cx={cx - 8} cy={cy - 6} r="4" fill="rgba(255,255,255,0.9)" />
                            <circle cx={cx + 8} cy={cy - 6} r="4" fill="rgba(255,255,255,0.9)" />
                        </>
                    )}
                    {eyeStyle === "sharp" && (
                        <>
                            <rect x={cx - 12} y={cy - 8} width="6" height="2" fill="#fff" />
                            <rect x={cx + 6} y={cy - 8} width="6" height="2" fill="#fff" />
                        </>
                    )}

                    {/* Mouth */}
                    <path
                        d={`M ${cx - 8} ${cy + 6} Q ${cx} ${cy + 10} ${cx + 8} ${cy + 6}`}
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
                <div className="hero-name-overlay">
                    {hero.name}
                </div>

            </div>
        </div>
    );
}