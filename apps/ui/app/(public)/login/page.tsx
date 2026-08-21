import LoginForm from '@/app/components/login-form';

export default function LoginPage() {
	return (
		<main>
			<div className="flex flex-col items-center justify-center min-h-screen gap-8">
				<h1 style={{ fontSize: '2.5rem', fontFamily: 'BBH Bartle sans-serif', letterSpacing: '1rem' }}>
					TESSERACT
				</h1>
				<LoginForm />
			</div>
		</main>
	);
}
