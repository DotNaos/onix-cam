import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";



export const Navbar = () => {
	return (
		<NextUINavbar maxWidth="full" isBlurred isBordered className="bg-default bg-opacity-5 absolute">
			<NavbarMenuToggle />
			<NavbarMenu className="bg-opacity-5 sm:px-16 py-10">
			</NavbarMenu>
		</NextUINavbar>
	);
};
