import { Platform } from "react-native";

export const colors = {
  paper: "#131714",
  paperDeep: "#1B211C",
  paperEdge: "#2A322C",
  ink: "#ECE7DC",
  inkSoft: "#B8B1A3",
  mute: "#8D8779",
  moss: "#5CA377",
  mossDeep: "#82C99B",
  mossPale: "#1C3125",
  clay: "#D47A55",
  clayDeep: "#EB9B78",
  clayPale: "#332019",
  line: "rgba(236,231,220,0.16)",
  lineSoft: "rgba(236,231,220,0.10)",
} as const;

export const fonts = {
  display: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
  sans: Platform.select({ ios: "System", android: "sans-serif", default: "System" }),
} as const;

export const radius = 2;

/** Разрядка капителью — фирменная деталь набора. */
export const rubric = {
  fontSize: 11,
  fontWeight: "600" as const,
  letterSpacing: 1.4,
  textTransform: "uppercase" as const,
  color: colors.mute,
};

export const spacing = { screen: 20, section: 24 } as const;
