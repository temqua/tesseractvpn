'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './button';
import styles from './header.module.css';
import Link from 'next/link';

export default function Header() {
	const [darkTheme, setDarkTheme] = useState(true);

	useEffect(() => {
		const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
		setDarkTheme(Boolean(isDark));
	}, []);

	useEffect(() => {
		const htmlArr = document.getElementsByTagName('html');
		const html = htmlArr[0];
		if (darkTheme) {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}, [darkTheme]);
	return (
		<header className={styles.header}>
			<h1 style={{ fontSize: '1.25rem', fontFamily: 'BBH Bartle sans-serif', letterSpacing: '1rem' }}>
				TESSERACT
			</h1>
			<div className="flex gap-8 items-center">
				<Button
					onClick={() => {
						setDarkTheme(!darkTheme);
					}}
				>
					{darkTheme ? <Sun /> : <Moon />}
				</Button>
				<Link href={'/logout'}>➜] LOGOUT</Link>
			</div>
		</header>
	);
}
