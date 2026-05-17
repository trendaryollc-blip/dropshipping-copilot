module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        /* Page background: cool grey — clearly anti-white */
        background: "#EFF2F5",
        /* Body / primary text */
        foreground: "#171D28",
        /* Cards: crisp white slab against #EFF2F5 backdrop */
        card: "#FFFFFF",
        "card-foreground": "#171D28",
        /* Popovers / dropdowns */
        popover: "#F8FAFC",
        "popover-foreground": "#171D28",
        /* DropEase brand emerald-teal */
        primary: {
          DEFAULT: "#0D7C66",
          medium: "#12B891",
          light: "#D4F0EE",
        },
        /* Text sitting on emerald backgrounds */
        "primary-foreground": "#E4EDF4",
        /* Soft slate-blue for subtle backgrounds */
        secondary: "#E4EDF4",
        "secondary-foreground": "#171D28",
        /* Muted: very pale blue-grey for disabled/quiet backgrounds */
        muted: "#DDE6EE",
        "muted-foreground": "#52665E",
        accent: "#E4EDF4",
        "accent-foreground": "#171D28",
        destructive: "#DC4C40",
        border: "#DDE2E6",
        input: "#DDE2E6",
        ring: "#0D7C66",
        /* ─── Sidebar: midnight navy (#0B1A2B) — can never be confused with
         * the page backdrop or card surface ─────────────────────────────────── */
        sidebar: "#0B1A2B",
        "sidebar-foreground": "#CBD5E2",
        "sidebar-primary": "#0D7C66",
        "sidebar-primary-foreground": "#FFFFFF",
        "sidebar-accent": "rgba(255,255,255,0.09)",
        "sidebar-accent-foreground": "#CBD5E2",
        "sidebar-border": "rgba(255,255,255,0.10)",
        "sidebar-ring": "#12B891",
        success: "#0D7C66",
        warning: "#C07D20",
        info: "#2E6AA8",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function ({ addUtilities, theme }) {
      const spacing = theme('spacing') || {}
      const utilities = {}

      Object.entries(spacing).forEach(([key, value]) => {
        const esc = String(key).replace(/\./g, '\\.')
        utilities[`.size-${esc}`] = { width: value, height: value }
      })

      utilities['.size-full'] = { width: '100%', height: '100%' }

      addUtilities(utilities, { variants: ['responsive'] })
    }),
  ],
}
