import UsersClientSide from '@/features/users/components/all';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UsersPage() {
	// const { error, data } = useSuspenseQuery({
	// 	queryKey: ['users-all'],
	// 	queryFn: () => usersClient.getAll(),
	// });
	const data = await usersSSRClient.getAll();
	return <UsersClientSide data={data}></UsersClientSide>;
}
