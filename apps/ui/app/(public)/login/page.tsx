import LoginForm from '@/app/components/login-form';

export default function LoginPage() {
	return (
		<main>
			<div className="flex flex-col items-center justify-center min-h-screen gap-8">
				<h1 style={{ fontSize: '2.5rem', fontFamily: 'BBH Bartle sans-serif', letterSpacing: '1rem' }}>
					TESSERACT
				</h1>
				<LoginForm />
				{/* <button className="tg-auth-button">Sign In with Telegram</button>
				<script
					async
					src="https://oauth.telegram.org/js/telegram-login.js?3"
					data-client-id="8010360221"
					data-onauth="console.log(data)"
				></script> */}
			</div>
		</main>
	);
}
