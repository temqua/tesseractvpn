'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './button';
import styles from './header.module.css';

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
			<Button
				onClick={() => {
					setDarkTheme(!darkTheme);
				}}
			>
				{darkTheme ? <Sun /> : <Moon />}
			</Button>
		</header>
	);
}
