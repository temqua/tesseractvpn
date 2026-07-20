'use client';
import { Input } from '@/app/components/input';
import { IVPNUser } from '@/app/lib/api/users/definitions';
import { useState } from 'react';

// username: string;
// password: string | null;
// telegramId: string | null;
// telegramLink: string | null;
// createdAt: string;
// firstName: string | null;
// lastName: string | null;
// languageCode: string | null;
// price: number;
// free: boolean;
// active: boolean;
// bank: string | null;
// currency: string;
// subLink: string | null;
// pasarguardUsername: string | null;
// pasarguardId: number | null;
// rwLink: string | null;
// rwUsername: string | null;
// rwId: number | null;
// rwUUID: string | null;
// payerId: number | null;
// referrerId: number | null;
// muted: boolean | null;

export default function UserClientSide({ user, id }: { user: IVPNUser; id: string }) {
	const [username, setUsername] = useState(user?.username);
	const [telegramId, setTelegramId] = useState(user?.telegramId ?? '');
	const [telegramLink, setTelegramLink] = useState(user?.telegramLink ?? '');
	const [firstName, setFirstName] = useState(user?.firstName ?? '');
	const [lastName, setLastName] = useState(user?.lastName ?? '');
	const [price, setPrice] = useState(user?.price.toString());
	const [free, setFree] = useState<boolean>(user?.free);
	const [active, setActive] = useState<boolean>(user?.active);
	return (
		<form>
			<div className="flex flex-col">
				<label htmlFor="username">Username</label>
				<Input
					value={username}
					onChange={event => setUsername(event.target.value)}
					id="username"
					name="username"
					placeholder="Username"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="telegramId">Telegram ID</label>
				<Input
					value={telegramId}
					onChange={event => setTelegramId(event.target.value)}
					id="telegramId"
					name="telegramId"
					placeholder="Telegram ID"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="telegramLink">Telegram Link</label>
				<Input
					value={telegramLink}
					onChange={event => setTelegramLink(event.target.value)}
					id="telegramLink"
					name="telegramLink"
					placeholder="Telegram Link"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="firstName">First Name</label>
				<Input
					value={firstName}
					onChange={event => setFirstName(event.target.value)}
					id="firstName"
					name="firstName"
					placeholder="First Name"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="lastName">Last Name</label>
				<Input
					value={lastName}
					onChange={event => setLastName(event.target.value)}
					id="lastName"
					name="lastName"
					placeholder="Last Name"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="price">Price</label>
				<Input
					value={price}
					onChange={event => setPrice(event.target.value)}
					id="price"
					name="price"
					placeholder="Price"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="free">Free</label>
				<Input
					checked={free}
					onChange={event => setFree(event.target.checked)}
					type="checkbox"
					id="free"
					name="free"
					placeholder="Free"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="active">Active</label>
				<Input
					checked={active}
					onChange={event => setActive(event.target.checked)}
					type="checkbox"
					id="active"
					name="active"
					placeholder="Active"
				/>
			</div>
		</form>
	);
}
