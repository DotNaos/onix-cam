"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { createContext } from "react";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	return (
		<NextUIProvider>
			<NextThemesProvider {...themeProps}>
					{children}
			</NextThemesProvider>
		</NextUIProvider>
	);
}

export const DetectorContext = createContext<HandLandmarkerResult | null>(null);
