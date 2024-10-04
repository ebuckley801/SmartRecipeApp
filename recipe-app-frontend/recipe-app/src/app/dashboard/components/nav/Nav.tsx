'use client'
import Link from "next/link";
import { signOut } from "next-auth/react";
// import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
// import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from "next/navigation";
import {ModeToggle} from "@/components/ui/theme-toggle";
import { CommandMenu } from "./command-menu";
// import { Notifications } from "../notifications";
// import { Button } from "@/components/ui/button";
// import { Inbox } from "../inbox";
import {Chat} from "./ChatAgent"
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function Nav({ desktopProfile, mobileNav }: { desktopProfile: React.ReactNode, mobileNav: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    React.useEffect(() => {
        const settings = (e: KeyboardEvent) => {
            if (e.key === "s" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();

                // Navigate to the settings page
                router.push('/dashboard/settings/account');
            }
        }
        document.addEventListener("keydown", settings);
        return () => document.removeEventListener("keydown", settings);
    }, [router]);

    React.useEffect(() => {
        const overview = (e: KeyboardEvent) => {
            if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();

                // Navigate to the overview page
                router.push('/dashboard');
            }
        }
        document.addEventListener("keydown", overview);
        return () => document.removeEventListener("keydown", overview);
    }, [router]);


    React.useEffect(() => {
        const handleSignOutShortcut = (e: KeyboardEvent) => {
            if (e.key === "x" && e.shiftKey && (e.metaKey || e.ctrlKey)) { // Adjusted for Mac (Command + Shift + X)
                e.preventDefault();
                signOut()
            }
        };
        document.addEventListener("keydown", handleSignOutShortcut);
        return () => document.removeEventListener("keydown", handleSignOutShortcut);
    }, []);

    return (

        <Disclosure as="nav" className="bg-white shadow-lg dark:shadow-none dark:bg-background dark:border-b dark:border-zinc-700 md:sticky top-0 z-50">
            {({ open }) => (
                <>
                    <div className="mx-auto px-4 ">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 pr-3">
                                    <img src="/carrot.png" className="h-8 w-auto"/>
                                </div>
                                <div className="hidden lg:ml-3 lg:block">
                                    <div className="flex space-x-2">
                                        <Link href="/dashboard"
                                              className={`rounded-md px-3 py-2 text-sm font-medium ${pathname === '/dashboard' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-black dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white'}`}>
                                            Dashboard
                                        </Link>

                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-1 justify-center px-2 lg:ml-2 lg:justify-end">
                                <div className="w-full max-w-lg md:max-w-xs lg:hidden flex space-x-1">
                                    <CommandMenu />
                                    <Chat/>
                                </div>
                            </div>
                            <div className="flex lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-400 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:ring-zinc-800">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden lg:ml-4 lg:block ">
                                <div className="flex items-center space-x-3">
                                    <CommandMenu />
                                    <Chat />
                                    <ModeToggle />

                                    {/* Profile dropdown */}
                                    <div className="mx-2">
                                        {desktopProfile}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <Disclosure.Button
                                as={Link}
                                href="/dashboard"
                                className={`block rounded-md px-3 py-2 font-medium ${pathname === '/dashboard' ? 'bg-gray-200 dark:bg-zinc-800 ' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 '}`}>

                                Overview
                            </Disclosure.Button>
                            <Disclosure.Button
                                as={Link}
                                href="/dashboard/analytics"
                                className={`block rounded-md px-3 py-2 font-medium ${pathname === '/dashboard/analytics' ? 'bg-gray-200 dark:bg-zinc-800 ' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 '}`}>

                                Analytics
                            </Disclosure.Button>
                            <Disclosure.Button
                                as={Link}
                                href="/dashboard/visualizations"
                                className={`block rounded-md px-3 py-2 font-medium ${pathname === '/dashboard/visualizations' ? 'bg-gray-200 dark:bg-zinc-800 ' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 '}`}>

                                Charts
                            </Disclosure.Button>
                            <Disclosure.Button
                                as={Link}
                                href="/dashboard/trends"
                                className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/dashboard/trends' ? 'bg-gray-200 dark:bg-zinc-800 ' : ' hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>

                                Trends
                            </Disclosure.Button>
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-700 pb-3 pt-4">
                            <div className="flex items-center px-5">

                                {mobileNav}

                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <Disclosure.Button
                                    as={Link}
                                    href="/dashboard/settings/profile"
                                    className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/dashboard/settings/profile' ? 'bg-gray-200 dark:bg-zinc-800 ' : ' hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>

                                    Profile
                                </Disclosure.Button>
                                <Disclosure.Button
                                    as={Link}
                                    href="/dashboard/settings/account"
                                    className={`block rounded-md px-3 py-2 text-base font-medium ${pathname === '/dashboard/settings/account' ? 'bg-gray-200 dark:bg-zinc-800 ' : ' hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>
                                    Settings
                                </Disclosure.Button>
                                <Disclosure.Button onClick={() => { signOut(); }}
                                                   className={`block w-full text-left rounded-md px-3 py-2 text-base font-medium ${pathname === '/dashboard/settings' ? 'bg-gray-200 dark:bg-zinc-800 ' : ' hover:bg-gray-200 dark:hover:bg-zinc-800'}`}>
                                    Sign Out
                                </Disclosure.Button>
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}