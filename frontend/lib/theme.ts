export const themes = {
  light: {
    primary: "#1E4171",
    secondary: "#4A6B8A",
    accent: "#6B8CAF",
    muted: "#F1F5F9",
    background: "#FAFAFA",
    foreground: "#2D3748", // Softer dark gray instead of pure black
    card: "#FFFFFF",
    border: "#E2E8F0",
    // Improved contrast for better readability
    mutedText: "#64748B", // For secondary text
    cardText: "#374151", // For card content text
    // Bluish colors for buttons in light mode
    buttonColor: "#4A6B8A",
    buttonText: "#FFFFFF",
    buttonGradient: "linear-gradient(135deg, #1E4171 0%, #4A6B8A 100%)",
    // Feature buttons - Blue background with white text for light mode
    featureButtonColor: "#1E4171",
    featureButtonText: "#FFFFFF",
    featureButtonGradient: "linear-gradient(135deg, #1E4171 0%, #4A6B8A 100%)",
    // Navy blue with pastel pink accents for light theme
    primaryGradient: "linear-gradient(135deg, #1E4171 0%, #4A6B8A 100%)",
    secondaryGradient: "linear-gradient(135deg, #4A6B8A 0%, #F8BBD9 100%)",
    accentGradient: "linear-gradient(135deg, #F1F5F9 0%, #FAFAFA 100%)",
    mutedGradient: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
    heroGradient: "linear-gradient(135deg, #FAFAFA 0%, #F1F5F9 50%, #E2E8F0 100%)",
    cardGradient: "linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 20%, #F1F5F9 100%)",
    featureGradient: "linear-gradient(135deg, #FAFAFA 0%, #F1F5F9 100%)",
    statsGradient: "linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)",
    sidebarGradient: "linear-gradient(135deg, #FAFAFA 0%, #F1F5F9 100%)",
  },
  dark: {
    primary: "#FFE4E6",
    secondary: "#FFD6D9",
    accent: "#FFC8CC",
    muted: "#374151",
    background: "#1F2937",
    foreground: "#F9FAFB", // Softer light gray instead of pure white
    card: "#374151",
    border: "#4B5563",
    // Improved contrast for better readability
    mutedText: "#9CA3AF", // For secondary text
    cardText: "#E5E7EB", // For card content text
    // Pink colors with little gradient for buttons in dark mode
    buttonColor: "#FFE4E6",
    buttonText: "#1F2937", // Dark text on pink background for better contrast
    buttonGradient: "linear-gradient(135deg, #FFE4E6 0%, #FFD6D9 100%)",
    // Feature buttons - Pink background with DARK text for dark mode (better contrast)
    featureButtonColor: "#FFE4E6",
    featureButtonText: "#1F2937", // Dark text for better contrast on pink
    featureButtonGradient: "linear-gradient(135deg, #FFE4E6 0%, #FFD6D9 100%)",
    // Dark text for pinkish elements in dark mode for better contrast
    pinkText: "#1F2937",
    // Even lighter pink shades with subtle gradients for dark theme
    primaryGradient: "linear-gradient(135deg, #FFE4E6 0%, #FFD6D9 100%)",
    secondaryGradient: "linear-gradient(135deg, #FFD6D9 0%, #FFC8CC 100%)",
    accentGradient: "linear-gradient(135deg, #4B5563 0%, #6B7280 100%)",
    mutedGradient: "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
    heroGradient: "linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)",
    cardGradient: "linear-gradient(135deg, #374151 0%, #4B5563 20%, #6B7280 100%)",
    featureGradient: "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
    statsGradient: "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
    sidebarGradient: "linear-gradient(135deg, #4B5563 0%, #374151 100%)",
  },
}

export type Theme = keyof typeof themes
